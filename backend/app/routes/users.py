# backend/app/routes/users.py

from fastapi import APIRouter, Depends
from .. import schemas
from ..dependencies import get_current_user

# Create a new router
router = APIRouter()

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: schemas.UserResponse = Depends(get_current_user)):
    """
    Get the current user.
    """
    return current_user
