"""
Pydantic models for FarmDNA users.
Now includes password hashing via passlib/bcrypt.
"""

from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional


class UserRegister(BaseModel):
    """Fields required to register a new user."""
    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=8, description="Min 8 chars")
    region: Optional[str] = Field(None, max_length=60)


class UserLogin(BaseModel):
    """Fields required to log in."""
    email: EmailStr
    password: str = Field(..., min_length=1)


class UserResponse(BaseModel):
    """Safe user object returned by the API — no password field."""
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(..., alias="_id")
    name: str
    email: str
    region: Optional[str] = None
    created_at: str


class TokenResponse(BaseModel):
    """Returned after successful login or registration."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
