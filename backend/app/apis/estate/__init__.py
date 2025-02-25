from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import databutton as db
from app.auth import AuthorizedUser
import re

def sanitize_storage_key(key: str) -> str:
    """Sanitize storage key to only allow alphanumeric and ._- symbols"""
    return re.sub(r'[^a-zA-Z0-9._-]', '', key)

router = APIRouter()

class Address(BaseModel):
    street: str
    postalCode: str
    city: str
    country: str = "Norge"

class Person(BaseModel):
    name: str
    address: Address

class Asset(BaseModel):
    id: str
    type: str
    description: str
    estimatedValue: float

class Debt(BaseModel):
    id: str
    type: str
    creditor: str
    amount: float
    dueDate: Optional[str] = None

class Task(BaseModel):
    id: str
    title: str
    completed: bool
    dueDate: Optional[str] = None

class Estate(BaseModel):
    id: str
    userId: str
    deceased: Optional[Person] = None
    heirs: List[Person] = []
    assets: List[Asset] = []
    debts: List[Debt] = []
    status: str = "draft"
    currentStep: int = 0
    createdAt: datetime
    updatedAt: datetime
    estateName: Optional[str] = None
    deceasedName: Optional[str] = None
    progress: Optional[int] = 0
    tasks: List[Task] = []
    collaborators: Dict[str, str] = {}  # user_id -> role mapping

class UpdateEstateRequest(BaseModel):
    deceased: Optional[Person] = None
    heirs: Optional[List[Person]] = None
    assets: Optional[List[Asset]] = None
    debts: Optional[List[Debt]] = None
    status: Optional[str] = None
    currentStep: Optional[int] = None
    estateName: Optional[str] = None
    deceasedName: Optional[str] = None
    progress: Optional[int] = None
    tasks: Optional[List[Task]] = None

class CreateEstateResponse(BaseModel):
    id: str
    userId: str
    status: str
    currentStep: int
    createdAt: datetime
    updatedAt: datetime
    estateName: Optional[str] = None
    deceasedName: Optional[str] = None
    progress: Optional[int] = 0
    tasks: List[Task] = []

@router.post("/estate")
async def create_estate(user: AuthorizedUser) -> CreateEstateResponse:
    # Create test tasks
    test_tasks = [
        Task(id="1", title="Last opp skifteattest", completed=False),
        Task(id="2", title="Registrer eiendeler", completed=False),
        Task(id="3", title="Registrer gjeld", completed=False),
        Task(id="4", title="Legg til arvinger", completed=False),
        Task(id="5", title="Gjennomgå transaksjoner", completed=False),
    ]
    # Create a new estate with sanitized ID
    now = datetime.now().isoformat()
    estate_id = sanitize_storage_key(f"estate_{datetime.now().strftime('%Y%m%d%H%M%S')}_{user.sub}")
    estate = {
        "id": estate_id,
        "userId": user.sub,
        "status": "draft",
        "currentStep": 0,
        "createdAt": now,
        "updatedAt": now,
        "deceased": None,
        "heirs": [],
        "assets": [],
        "debts": [],
        "estateName": "Nytt arveoppgjør",
        "deceasedName": None,
        "progress": 0,
        "tasks": [task.dict() for task in test_tasks],
    }

    # Save to storage with sanitized key
    storage_key = sanitize_storage_key(f"estates_{estate['id']}")
    db.storage.json.put(storage_key, estate)

    return CreateEstateResponse(
        id=estate["id"],
        userId=estate["userId"],
        status=estate["status"],
        currentStep=estate["currentStep"],
        createdAt=estate["createdAt"],
        updatedAt=estate["updatedAt"],
    )

@router.get("/estate/{estate_id}")
async def get_estate(estate_id: str, user: AuthorizedUser) -> Estate:
    try:
        storage_key = sanitize_storage_key(f"estates_{estate_id}")
        estate = db.storage.json.get(storage_key)
        if not estate:
            raise HTTPException(status_code=404, detail="Estate not found")

        # Check if user has access to this estate
        if estate["userId"] != user.sub:
            # Check if user is a collaborator
            roles_key = sanitize_storage_key(f"roles_{estate_id}")
            roles = db.storage.json.get(roles_key, default=[])
            user_role = next((r for r in roles if r["user_id"] == user.sub and r["status"] == "accepted"), None)
            if not user_role:
                raise HTTPException(status_code=403, detail="Unauthorized access to estate")

        return Estate(**estate)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
    try:
        storage_key = sanitize_storage_key(f"estates_{estate_id}")
        estate = db.storage.json.get(storage_key)
        if not estate:
            raise HTTPException(status_code=404, detail="Estate not found")

        # Check if user has access to this estate
        if estate["userId"] != user.sub:
            raise HTTPException(status_code=403, detail="Unauthorized access to estate")

        return Estate(**estate)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.put("/estate/{estate_id}")
async def update_estate(estate_id: str, request: UpdateEstateRequest, user: AuthorizedUser) -> Estate:
    try:
        storage_key = sanitize_storage_key(f"estates_{estate_id}")
        estate = db.storage.json.get(storage_key)
        if not estate:
            raise HTTPException(status_code=404, detail="Estate not found")

        # Check if user has access to this estate
        if estate["userId"] != user.sub:
            # Check if user is a collaborator with edit rights
            roles_key = sanitize_storage_key(f"roles_{estate_id}")
            roles = db.storage.json.get(roles_key, default=[])
            user_role = next((r for r in roles if r["user_id"] == user.sub and r["status"] == "accepted"), None)
            if not user_role or user_role["role"] == "viewer":
                raise HTTPException(status_code=403, detail="Unauthorized to update estate")

        # Update fields if provided
        if request.deceased:
            estate["deceased"] = request.deceased.dict()
        if request.heirs is not None:
            estate["heirs"] = [heir.dict() for heir in request.heirs]
        if request.assets is not None:
            estate["assets"] = [asset.dict() for asset in request.assets]
        if request.debts is not None:
            estate["debts"] = [debt.dict() for debt in request.debts]
        if request.status:
            estate["status"] = request.status
        if request.currentStep is not None:
            estate["currentStep"] = request.currentStep

        estate["updatedAt"] = datetime.now().isoformat()

        # Save updated estate
        db.storage.json.put(storage_key, estate)

        return Estate(**estate)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
    try:
        storage_key = sanitize_storage_key(f"estates_{estate_id}")
        estate = db.storage.json.get(storage_key)
        if not estate:
            raise HTTPException(status_code=404, detail="Estate not found")

        # Check if user has access to this estate
        if estate["userId"] != user.sub:
            raise HTTPException(status_code=403, detail="Unauthorized access to estate")

        # Update fields if provided
        if request.deceased:
            estate["deceased"] = request.deceased.dict()
        if request.heirs is not None:
            estate["heirs"] = [heir.dict() for heir in request.heirs]
        if request.assets is not None:
            estate["assets"] = [asset.dict() for asset in request.assets]
        if request.debts is not None:
            estate["debts"] = [debt.dict() for debt in request.debts]
        if request.status:
            estate["status"] = request.status
        if request.currentStep is not None:
            estate["currentStep"] = request.currentStep

        estate["updatedAt"] = datetime.now().isoformat()

        # Save updated estate
        storage_key = sanitize_storage_key(f"estates_{estate_id}")
        db.storage.json.put(storage_key, estate)

        return Estate(**estate)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.delete("/estate/{estate_id}")
async def delete_estate(estate_id: str, user: AuthorizedUser):
    try:
        storage_key = sanitize_storage_key(f"estates_{estate_id}")
        estate = db.storage.json.get(storage_key)
        if not estate:
            raise HTTPException(status_code=404, detail="Estate not found")
        
        # Check if user has access to this estate
        if estate["userId"] != user.sub:
            # Check if user is an admin collaborator
            roles_key = sanitize_storage_key(f"roles_{estate_id}")
            roles = db.storage.json.get(roles_key, default=[])
            user_role = next((r for r in roles if r["user_id"] == user.sub and r["status"] == "accepted" and r["role"] == "admin"), None)
            if not user_role:
                raise HTTPException(status_code=403, detail="Unauthorized to delete estate")
        
        # Delete estate and related data
        db.storage.json.delete(storage_key)
        
        # Delete roles
        roles_key = sanitize_storage_key(f"roles_{estate_id}")
        try:
            db.storage.json.delete(roles_key)
        except FileNotFoundError:
            pass
        
        # Delete comments
        comments_key = sanitize_storage_key(f"comments_{estate_id}")
        try:
            db.storage.json.delete(comments_key)
        except FileNotFoundError:
            pass
        
        return {"message": "Estate deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/estates")
async def list_estates(user: AuthorizedUser) -> List[Estate]:
    try:
        # Get all estates where user is owner
        all_estates = []

        # List all estate files
        estate_files = db.storage.json.list()
        for file in estate_files:
            if file.name.startswith("estates_"):
                estate = db.storage.json.get(file.name)
                if estate["userId"] == user.sub:
                    all_estates.append(estate)
                else:
                    # Check if user is a collaborator
                    roles_key = sanitize_storage_key(f"roles_{estate['id']}")
                    roles = db.storage.json.get(roles_key, default=[])
                    user_role = next((r for r in roles if r["user_id"] == user.sub and r["status"] == "accepted"), None)
                    if user_role:
                        all_estates.append(estate)

        return [Estate(**estate) for estate in all_estates]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
    # Test data
    test_estates = [
        {
            "id": "estate_1",
            "userId": user.sub,
            "status": "in_progress",
            "currentStep": 2,
            "createdAt": "2024-02-01T10:00:00",
            "updatedAt": "2024-02-15T15:30:00",
            "deceased": {
                "name": "Ole Hansen",
                "address": {
                    "street": "Storgata 1",
                    "postalCode": "0182",
                    "city": "Oslo",
                    "country": "Norge"
                }
            },
            "heirs": [
                {
                    "name": "Kari Hansen",
                    "address": {
                        "street": "Lillegata 2",
                        "postalCode": "0183",
                        "city": "Oslo",
                        "country": "Norge"
                    }
                }
            ],
            "assets": [
                {
                    "id": "asset_1",
                    "type": "real_estate",
                    "description": "Enebolig i Oslo",
                    "estimatedValue": 5000000
                }
            ],
            "debts": [
                {
                    "id": "debt_1",
                    "type": "mortgage",
                    "creditor": "DNB",
                    "amount": 2000000
                }
            ],
            "estateName": "Dødsbo etter Ole Hansen",
            "deceasedName": "Ole Hansen",
            "progress": 60,
            "tasks": [
                {
                    "id": "1",
                    "title": "Last opp skifteattest",
                    "completed": True
                },
                {
                    "id": "2",
                    "title": "Registrer eiendeler",
                    "completed": True
                },
                {
                    "id": "3",
                    "title": "Registrer gjeld",
                    "completed": False
                },
                {
                    "id": "4",
                    "title": "Legg til arvinger",
                    "completed": False
                },
                {
                    "id": "5",
                    "title": "Gjennomgå transaksjoner",
                    "completed": False
                }
            ]
        },
        {
            "id": "estate_2",
            "userId": user.sub,
            "status": "draft",
            "currentStep": 0,
            "createdAt": "2024-02-16T09:00:00",
            "updatedAt": "2024-02-16T09:00:00",
            "deceased": None,
            "heirs": [],
            "assets": [],
            "debts": [],
            "estateName": "Nytt arveoppgjør",
            "deceasedName": None,
            "progress": 0,
            "tasks": [
                {
                    "id": "1",
                    "title": "Last opp skifteattest",
                    "completed": False
                },
                {
                    "id": "2",
                    "title": "Registrer eiendeler",
                    "completed": False
                },
                {
                    "id": "3",
                    "title": "Registrer gjeld",
                    "completed": False
                },
                {
                    "id": "4",
                    "title": "Legg til arvinger",
                    "completed": False
                },
                {
                    "id": "5",
                    "title": "Gjennomgå transaksjoner",
                    "completed": False
                }
            ]
        }
    ]
    try:
        # Return test data
        return [Estate(**estate) for estate in test_estates]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

async def update_estate_status(estate_id: str, status: str) -> Estate:
    """Update the status of an estate. This is an internal function used by the payment webhook."""
    try:
        storage_key = sanitize_storage_key(f"estates_{estate_id}")
        estate = db.storage.json.get(storage_key)
        if not estate:
            raise ValueError("Estate not found")

        estate["status"] = status
        estate["updatedAt"] = datetime.now()

        # Save updated estate
        storage_key = sanitize_storage_key(f"estates_{estate_id}")
        db.storage.json.put(storage_key, estate)

        return Estate(**estate)
    except Exception as e:
        raise ValueError(f"Failed to update estate status: {str(e)}") from e
