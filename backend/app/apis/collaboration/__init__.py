from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import databutton as db
from app.auth import AuthorizedUser
from app.apis.estate import Estate, sanitize_storage_key

class Role(BaseModel):
    estate_id: str
    user_id: str
    role: str  # admin, editor, viewer
    email: EmailStr
    status: str  # pending, accepted
    invited_by: str
    invited_at: datetime
    accepted_at: Optional[datetime] = None

class Comment(BaseModel):
    id: str
    estate_id: str
    task_id: Optional[str] = None  # If comment is on a task
    user_id: str
    content: str
    created_at: datetime
    updated_at: Optional[datetime] = None

class InviteRequest(BaseModel):
    estate_id: str
    email: EmailStr
    role: str

class InviteResponse(BaseModel):
    message: str
    invitation: Role

class AcceptInviteResponse(BaseModel):
    message: str
    role: Role

router = APIRouter()

@router.post("/accept-invite/{estate_id}")
async def accept_invite(estate_id: str, user: AuthorizedUser, email: str = Query(...)) -> AcceptInviteResponse:
    try:
        # Get roles for estate
        roles_key = sanitize_storage_key(f"roles_{estate_id}")
        roles = db.storage.json.get(roles_key, default=[])
        
        # Find pending invitation for this email
        invitation = next((r for r in roles if r["email"] == email and r["status"] == "pending"), None)
        if not invitation:
            raise HTTPException(status_code=404, detail="Invitation not found")
        
        # Update invitation
        invitation["status"] = "accepted"
        invitation["user_id"] = user.sub
        invitation["accepted_at"] = datetime.now().isoformat()
        
        # Save updated roles
        db.storage.json.put(roles_key, roles)
        
        return AcceptInviteResponse(
            message="Invitation accepted successfully",
            role=Role(**invitation)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.post("/invite")
async def invite_collaborator(request: InviteRequest, user: AuthorizedUser) -> InviteResponse:
    try:
        # Check if user has admin access to estate
        storage_key = sanitize_storage_key(f"estates_{request.estate_id}")
        estate = db.storage.json.get(storage_key)
        if not estate:
            raise HTTPException(status_code=404, detail="Estate not found")
        
        if estate["userId"] != user.sub:
            # Check if user is an admin collaborator
            roles_key = sanitize_storage_key(f"roles_{request.estate_id}")
            roles = db.storage.json.get(roles_key, default=[])
            user_role = next((r for r in roles if r["user_id"] == user.sub and r["role"] == "admin"), None)
            if not user_role:
                raise HTTPException(status_code=403, detail="Unauthorized to invite collaborators")
        
        # Create new role
        now = datetime.now()
        new_role = Role(
            estate_id=request.estate_id,
            user_id="",  # Will be set when invitation is accepted
            role=request.role,
            email=request.email,
            status="pending",
            invited_by=user.sub,
            invited_at=now
        )
        
        # Save role
        roles_key = sanitize_storage_key(f"roles_{request.estate_id}")
        roles = db.storage.json.get(roles_key, default=[])
        roles.append(new_role.dict())
        db.storage.json.put(roles_key, roles)
        
        # TODO: Send invitation email
        
        return InviteResponse(
            message="Invitation sent successfully",
            invitation=new_role
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/roles/{estate_id}")
async def get_roles(estate_id: str, user: AuthorizedUser) -> List[Role]:
    try:
        # Check if user has access to estate
        storage_key = sanitize_storage_key(f"estates_{estate_id}")
        estate = db.storage.json.get(storage_key)
        if not estate:
            raise HTTPException(status_code=404, detail="Estate not found")
        
        if estate["userId"] != user.sub:
            # Check if user is a collaborator
            roles_key = sanitize_storage_key(f"roles_{estate_id}")
            roles = db.storage.json.get(roles_key, default=[])
            user_role = next((r for r in roles if r["user_id"] == user.sub), None)
            if not user_role:
                raise HTTPException(status_code=403, detail="Unauthorized access to roles")
        
        # Get roles
        roles_key = sanitize_storage_key(f"roles_{estate_id}")
        roles = db.storage.json.get(roles_key, default=[])
        return [Role(**role) for role in roles]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.post("/comments/{estate_id}")
async def add_comment(estate_id: str, comment: Comment, user: AuthorizedUser) -> Comment:
    try:
        # Check if user has access to estate
        storage_key = sanitize_storage_key(f"estates_{estate_id}")
        estate = db.storage.json.get(storage_key)
        if not estate:
            raise HTTPException(status_code=404, detail="Estate not found")
        
        if estate["userId"] != user.sub:
            # Check if user is a collaborator
            roles_key = sanitize_storage_key(f"roles_{estate_id}")
            roles = db.storage.json.get(roles_key, default=[])
            user_role = next((r for r in roles if r["user_id"] == user.sub), None)
            if not user_role:
                raise HTTPException(status_code=403, detail="Unauthorized to add comments")
        
        # Create new comment
        now = datetime.now()
        new_comment = Comment(
            id=f"comment_{now.strftime('%Y%m%d%H%M%S')}_{user.sub}",
            estate_id=estate_id,
            task_id=comment.task_id,
            user_id=user.sub,
            content=comment.content,
            created_at=now
        )
        
        # Save comment
        comments_key = sanitize_storage_key(f"comments_{estate_id}")
        comments = db.storage.json.get(comments_key, default=[])
        comments.append(new_comment.dict())
        db.storage.json.put(comments_key, comments)
        
        return new_comment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/comments/{estate_id}")
async def get_comments(estate_id: str, user: AuthorizedUser, task_id: Optional[str] = None) -> List[Comment]:
    try:
        # Check if user has access to estate
        storage_key = sanitize_storage_key(f"estates_{estate_id}")
        estate = db.storage.json.get(storage_key)
        if not estate:
            raise HTTPException(status_code=404, detail="Estate not found")
        
        if estate["userId"] != user.sub:
            # Check if user is a collaborator
            roles_key = sanitize_storage_key(f"roles_{estate_id}")
            roles = db.storage.json.get(roles_key, default=[])
            user_role = next((r for r in roles if r["user_id"] == user.sub), None)
            if not user_role:
                raise HTTPException(status_code=403, detail="Unauthorized access to comments")
        
        # Get comments
        comments_key = sanitize_storage_key(f"comments_{estate_id}")
        comments = db.storage.json.get(comments_key, default=[])
        comments = [Comment(**comment) for comment in comments]
        
        # Filter by task if provided
        if task_id:
            comments = [c for c in comments if c.task_id == task_id]
        
        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
