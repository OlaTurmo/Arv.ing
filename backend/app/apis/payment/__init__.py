from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
import stripe
import databutton as db
from app.auth import AuthorizedUser
from app.apis.estate import update_estate_status

router = APIRouter()

# Initialize Stripe with the secret key
stripe.api_key = db.secrets.get("STRIPE_SECRET_KEY")

FIXED_PRICE_NOK = 3000

class CreatePaymentIntentRequest(BaseModel):
    estate_id: str

class CreatePaymentIntentResponse(BaseModel):
    client_secret: str
    amount: int

class PaymentStatusResponse(BaseModel):
    status: str
    amount: int
    receipt_url: str | None = None

@router.post("/payment/create-intent")
async def create_payment_intent(request: CreatePaymentIntentRequest, user: AuthorizedUser) -> CreatePaymentIntentResponse:
    try:
        # Create a PaymentIntent with the fixed amount
        intent = stripe.PaymentIntent.create(
            amount=FIXED_PRICE_NOK * 100,  # Amount in øre (3000 NOK = 300000 øre)
            currency="nok",
            metadata={
                "estate_id": request.estate_id,
                "user_id": user.sub,
            },
            automatic_payment_methods={
                "enabled": True,
            },
        )

        return CreatePaymentIntentResponse(
            client_secret=intent.client_secret,
            amount=FIXED_PRICE_NOK,
        )

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/payment/{payment_intent_id}/status")
async def get_payment_status(payment_intent_id: str, user: AuthorizedUser) -> PaymentStatusResponse:
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)

        # Only allow access to payments for the authenticated user
        if intent.metadata.get("user_id") != user.sub:
            raise HTTPException(status_code=403, detail="Unauthorized access to payment")

        # Get the payment receipt URL if payment is successful
        receipt_url = None
        if intent.status == "succeeded" and intent.latest_charge:
            charge = stripe.Charge.retrieve(intent.latest_charge)
            receipt_url = charge.receipt_url

        return PaymentStatusResponse(
            status=intent.status,
            amount=intent.amount // 100,  # Convert from øre to NOK
            receipt_url=receipt_url,
        )

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/payment/webhook")
async def stripe_webhook(request: Request):
    # Get the webhook secret from environment variables
    webhook_secret = db.secrets.get("STRIPE_WEBHOOK_SECRET")
    
    # Get the webhook data
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        # Verify the webhook signature
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )

        # Handle specific webhook events
        if event.type == "payment_intent.succeeded":
            payment_intent = event.data.object
            # Here you would update your database to mark the estate as paid
            # and possibly trigger any post-payment processes
            estate_id = payment_intent.metadata.get('estate_id')
            await update_estate_status(estate_id, 'paid')
            print(f"Payment succeeded for estate {estate_id}")

        elif event.type == "payment_intent.payment_failed":
            payment_intent = event.data.object
            estate_id = payment_intent.metadata.get('estate_id')
            await update_estate_status(estate_id, 'payment_failed')
            print(f"Payment failed for estate {estate_id}")

        return {"status": "success"}

    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
