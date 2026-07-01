"""
Pydantic models for FarmDNA users.

A "user" represents a farmer account. Each entry in the "entries" collection
can reference a user via user_id, establishing the relationship:

    User (1) ---- (many) Entry

Full authentication (password hashing, login, JWT sessions) is implemented
in Week 6. This week, the User model exists primarily to support the
schema design and relationship between collections.
"""

from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional


class UserBase(BaseModel):
    """Shared fields for a user account."""
    name: str = Field(..., min_length=2, max_length=80, examples=["Anubhav Purohit"])
    email: EmailStr = Field(..., examples=["farmer@example.com"])
    region: Optional[str] = Field(None, max_length=60, examples=["Punjab"])


class UserCreate(UserBase):
    """Fields required to create a new user. Password hashing arrives in Week 6."""
    password: str = Field(..., min_length=6, description="Plaintext for now — hashing added in Week 6 (Auth)")


class User(UserBase):
    """Full user document as stored and returned by the API."""
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(..., alias="_id", description="MongoDB ObjectId as a string")
    created_at: str
