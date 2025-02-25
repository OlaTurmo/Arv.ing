from fastapi import APIRouter, HTTPException, UploadFile, Body, File
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json
import databutton as db
from app.auth import AuthorizedUser
from google.cloud import vision
from openai import OpenAI
import io
import re

router = APIRouter()

class Transaction(BaseModel):
    id: str
    date: str
    recipient: str
    amount: float
    category: str
    is_subscription: bool = False
    subscription_frequency: Optional[str] = None
    contact_info: Optional[dict] = None

class TransactionList(BaseModel):
    transactions: List[Transaction]
    estate_id: str

class SubscriptionCancellation(BaseModel):
    transaction_id: str
    estate_id: str
    cancellation_method: str
    contact_info: dict
    cancellation_letter: Optional[str] = None
    cancellation_email: Optional[str] = None

class CancellationResponse(BaseModel):
    transaction_id: str
    cancellation_letter: Optional[str] = None
    cancellation_email: Optional[str] = None
    contact_info: dict

class CancellationStatus(BaseModel):
    status: str
    history: List[dict]

class CancellationStatusUpdate(BaseModel):
    status: str
    comment: str

def initialize_vision_client():
    """Initialize Google Cloud Vision client with credentials."""
    try:
        credentials_json = db.secrets.get("GOOGLE_VISION_CREDENTIALS")
        print("Got credentials from secrets")
        credentials_dict = json.loads(credentials_json)
        print("Parsed credentials JSON")
        client = vision.ImageAnnotatorClient.from_service_account_info(credentials_dict)
        print("Created Vision client")
        return client
    except Exception as e:
        print(f"Error initializing Vision client: {str(e)}")
        raise

def extract_text_from_image(image_content: bytes) -> str:
    """Extract text from image using Google Cloud Vision API."""
    try:
        print("Initializing Vision client...")
        client = initialize_vision_client()
        print("Creating Image object...")
        image = vision.Image(content=image_content)
        print("Calling document_text_detection...")
        response = client.document_text_detection(image=image)
        print("Got response from Vision API")
        if not response.full_text_annotation:
            raise ValueError("No text found in image")
        return response.full_text_annotation.text
    except Exception as e:
        print(f"Error in extract_text_from_image: {str(e)}")
        raise

def parse_transaction_text(text: str) -> List[dict]:
    """Parse transaction text into structured data."""
    # Split text into lines
    lines = text.strip().split('\n')
    transactions = []
    
    # Regular expression for date, recipient, and amount
    pattern = r'(\d{2}\.\d{2}\.\d{4})\s+([^\d-]+)\s+(-?\d+[,.]\d{2})\s*(?:NOK)?'
    
    for line in lines:
        match = re.match(pattern, line)
        if match:
            date_str, recipient, amount_str = match.groups()
            
            # Convert date to ISO format
            date = datetime.strptime(date_str, '%d.%m.%Y').strftime('%Y-%m-%d')
            
            # Clean up amount
            amount = float(amount_str.replace(',', '.'))
            
            # Clean up recipient
            recipient = recipient.strip()
            
            transactions.append({
                'date': date,
                'recipient': recipient,
                'amount': amount,
            })
    
    return transactions

def get_openai_client():
    """Initialize OpenAI client with API key."""
    return OpenAI(api_key=db.secrets.get("OPENAI_API_KEY"))

def analyze_transaction_with_ai(transaction: dict) -> dict:
    """Use OpenAI to analyze transaction and identify subscriptions."""
    client = get_openai_client()
    
    prompt = f"""Analyze this transaction and determine:
1. Is it likely a subscription? (true/false)
2. What category does it belong to?
3. What is the likely subscription frequency if it's a subscription?
4. What is the contact information for cancellation?

Transaction:
Recipient: {transaction['recipient']}
Amount: {transaction['amount']} NOK
Date: {transaction['date']}

Respond in this JSON format:
{{
    "is_subscription": boolean,
    "category": string,
    "subscription_frequency": string or null,
    "contact_info": {{
        "email": string or null,
        "phone": string or null,
        "website": string or null
    }}
}}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an AI trained to analyze bank transactions and identify subscriptions. You have extensive knowledge of Norwegian companies and their subscription services."},
            {"role": "user", "content": prompt}
        ]
    )
    
    try:
        analysis = json.loads(response.choices[0].message.content)
        
        # Update transaction with AI analysis
        transaction['is_subscription'] = analysis['is_subscription']
        transaction['category'] = analysis['category']
        transaction['subscription_frequency'] = analysis['subscription_frequency']
        transaction['contact_info'] = analysis['contact_info']
        
        return transaction
    except Exception as e:
        print(f"Error parsing AI response: {e}")
        return categorize_transaction_fallback(transaction)

def categorize_transaction_fallback(transaction: dict) -> dict:
    """Fallback categorization if AI fails."""
    # Basic categorization rules
    categories = {
        'streaming': ['spotify', 'netflix', 'hbo', 'disney', 'viaplay'],
        'telecom': ['telia', 'telenor', 'ice', 'one call'],
        'utilities': ['fortum', 'hafslund', 'fjordkraft'],
        'groceries': ['kiwi', 'rema', 'meny', 'coop', 'spar', 'bunnpris'],
        'transport': ['ruter', 'vy', 'flytoget'],
    }
    
    recipient_lower = transaction['recipient'].lower()
    
    # Check categories
    for category, keywords in categories.items():
        if any(keyword in recipient_lower for keyword in keywords):
            transaction['category'] = category
            break
    else:
        transaction['category'] = 'other'
    
    # Check if it's likely a subscription
    subscription_keywords = ['spotify', 'netflix', 'hbo', 'telia', 'telenor', 'fortum']
    transaction['is_subscription'] = any(keyword in recipient_lower for keyword in subscription_keywords)
    
    if transaction['is_subscription']:
        transaction['subscription_frequency'] = 'monthly'  # Default to monthly
        transaction['contact_info'] = {
            'email': None,
            'phone': None,
            'website': None
        }
    
    return transaction

class UploadTransactionsRequest(BaseModel):
    file: str

@router.post("/upload/{estate_id}", summary="Upload Transactions")
async def upload_transactions(
    estate_id: str,
    body: UploadTransactionsRequest,
    user: AuthorizedUser = None
) -> TransactionList:
    try:
        # Decode base64 content
        import base64
        content = base64.b64decode(body.file)
        
        # Extract text from image
        try:
            print("Content length:", len(content))
            text = extract_text_from_image(content)
            print("Extracted text:", text)
        except Exception as e:
            print(f"Error extracting text: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to extract text from image: {str(e)}"
            ) from e
        
        # Parse transactions
        try:
            transactions = parse_transaction_text(text)
        except Exception as e:
            print(f"Error parsing transactions: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to parse transactions: {str(e)}"
            ) from e
        
        # Analyze transactions with AI
        transactions = [analyze_transaction_with_ai(t) for t in transactions]
        
        # Add IDs to transactions
        for i, t in enumerate(transactions):
            t['id'] = f"tx_{datetime.now().strftime('%Y%m%d%H%M%S')}_{i}"
        
        # Convert to Transaction objects
        transaction_objects = [Transaction(**t) for t in transactions]
        
        # Save to storage
        storage_key = f"transactions/{estate_id}/{datetime.now().strftime('%Y%m%d%H%M%S')}"
        db.storage.json.put(storage_key, {
            'estate_id': estate_id,
            'transactions': [t.dict() for t in transaction_objects]
        })
        
        return TransactionList(
            transactions=transaction_objects,
            estate_id=estate_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/transaction/{estate_id}")
async def get_transactions(estate_id: str, user: AuthorizedUser = None) -> TransactionList:
    # Test data
    test_transactions = [
        {
            "id": "tx_1",
            "date": "2024-02-24",
            "recipient": "Spotify AB",
            "amount": -129.00,
            "category": "streaming",
            "is_subscription": True,
            "subscription_frequency": "monthly",
            "contact_info": {
                "email": "support@spotify.com",
                "phone": None,
                "website": "https://spotify.com"
            }
        },
        {
            "id": "tx_2",
            "date": "2024-02-25",
            "recipient": "Telia Mobil",
            "amount": -349.00,
            "category": "telecom",
            "is_subscription": True,
            "subscription_frequency": "monthly",
            "contact_info": {
                "email": "support@telia.no",
                "phone": "915 09000",
                "website": "https://telia.no"
            }
        },
        {
            "id": "tx_3",
            "date": "2024-02-26",
            "recipient": "Kiwi butikk",
            "amount": -199.50,
            "category": "groceries",
            "is_subscription": False,
            "subscription_frequency": None,
            "contact_info": None
        }
    ]
    try:
        # Return test data
        transaction_objects = [Transaction(**t) for t in test_transactions]
        
        return TransactionList(
            transactions=transaction_objects,
            estate_id=estate_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

def generate_cancellation_content(transaction: Transaction, estate: dict, method: str) -> str:
    """Generate cancellation content using OpenAI."""
    client = get_openai_client()
    
    prompt = f"""Generate a {method} in Norwegian to cancel a subscription.

Details:
- Company: {transaction.recipient}
- Service: {transaction.category}
- Deceased: {estate['deceased']['name']}
- Date of Death: {estate['deceased'].get('dateOfDeath', '[DATO]')}
- Heir: {estate['heirs'][0]['name'] if estate['heirs'] else '[NAVN]'}

The {method} should:
1. Be formal and professional
2. Explain that the person has passed away
3. Request immediate cancellation of the subscription
4. Mention that you have authority to cancel on behalf of the estate
5. Request confirmation of cancellation
6. Include relevant account or customer numbers if available
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an AI trained to write formal Norwegian cancellation letters and emails. You write in a clear, professional tone suitable for business communication."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.choices[0].message.content.strip()

@router.get("/cancellations/{estate_id}/{transaction_id}")
async def get_cancellation_status(
    estate_id: str,
    transaction_id: str,
    user: AuthorizedUser = None
) -> CancellationStatus:
    try:
        storage_key = f"cancellations/{estate_id}/{transaction_id}"
        cancellation = db.storage.json.get(storage_key)
        
        if not cancellation:
            raise HTTPException(status_code=404, detail="Cancellation not found")
        
        return CancellationStatus(
            status=cancellation['status'],
            history=cancellation['status_history']
        )
    except Exception as e:
        print(f"Error getting cancellation status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get cancellation status") from e

@router.post("/cancellations/{estate_id}/{transaction_id}/status")
async def update_cancellation_status(
    estate_id: str,
    transaction_id: str,
    update: CancellationStatusUpdate,
    user: AuthorizedUser = None
) -> CancellationStatus:
    try:
        storage_key = f"cancellations/{estate_id}/{transaction_id}"
        cancellation = db.storage.json.get(storage_key)
        
        if not cancellation:
            raise HTTPException(status_code=404, detail="Cancellation not found")
        
        # Update status
        cancellation['status'] = update.status
        cancellation['last_updated'] = datetime.now().isoformat()
        
        # Add to history
        cancellation['status_history'].append({
            'status': update.status,
            'timestamp': datetime.now().isoformat(),
            'comment': update.comment
        })
        
        # Save updated cancellation
        db.storage.json.put(storage_key, cancellation)
        
        return CancellationStatus(
            status=cancellation['status'],
            history=cancellation['status_history']
        )
    except Exception as e:
        print(f"Error updating cancellation status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update cancellation status") from e

@router.post("/transaction/cancel")
async def cancel_subscription(
    request: SubscriptionCancellation,
    user: AuthorizedUser = None
) -> CancellationResponse:
    try:
        # Get transaction details
        transactions = await get_transactions(request.estate_id)
        transaction = next(
            (t for t in transactions.transactions if t.id == request.transaction_id),
            None
        )
        
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        # Get estate details for the cancellation letter
        estate = db.storage.json.get(f"estates/{request.estate_id}")
        if not estate:
            raise HTTPException(status_code=404, detail="Estate not found")
        
        # Generate cancellation content using AI
        cancellation_content = generate_cancellation_content(
            transaction,
            estate,
            'letter' if request.cancellation_method == 'letter' else 'email'
        )
        
        # Save cancellation details
        storage_key = f"cancellations/{request.estate_id}/{transaction.id}"
        db.storage.json.put(storage_key, {
            'estate_id': request.estate_id,
            'transaction_id': transaction.id,
            'cancellation_method': request.cancellation_method,
            'cancellation_content': cancellation_content,
            'contact_info': request.contact_info,
            'status': 'pending',
            'created_at': datetime.now().isoformat(),
            'last_updated': datetime.now().isoformat(),
            'status_history': [
                {
                    'status': 'pending',
                    'timestamp': datetime.now().isoformat(),
                    'comment': 'Cancellation request created'
                }
            ]
        })
        
        return CancellationResponse(
            transaction_id=transaction.id,
            cancellation_letter=cancellation_content if request.cancellation_method == 'letter' else None,
            cancellation_email=cancellation_content if request.cancellation_method == 'email' else None,
            contact_info=request.contact_info
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
