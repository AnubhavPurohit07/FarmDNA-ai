"""
Pydantic models for FarmDNA Decision Journal entries.

An "entry" represents a single farming decision recorded by a farmer:
what they decided, why, and what happened as a result.

Stored as documents in the "entries" collection in MongoDB. Each document's
_id is a MongoDB ObjectId, represented here as a plain string.
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from enum import Enum


class OutcomeStatus(str, Enum):
    """Possible outcome states for a logged decision."""
    success = "success"
    partial = "partial"
    failure = "failure"
    pending = "pending"  # harvest hasn't happened yet


class EntryBase(BaseModel):
    """Shared fields used for both creating and updating an entry."""
    title: str = Field(..., min_length=3, max_length=120, examples=["Switched to drip irrigation mid-season"])
    crop: str = Field(..., min_length=2, max_length=60, examples=["Wheat"])
    region: str = Field(..., min_length=2, max_length=60, examples=["Punjab"])
    season: str = Field(..., min_length=2, max_length=40, examples=["Rabi 2025"])
    decision: str = Field(..., min_length=5, examples=["Switched from flood irrigation to drip irrigation"])
    reason: str = Field(..., min_length=5, examples=["Forecast showed a dry spell for the next 3 weeks"])
    outcome: Optional[str] = Field(None, examples=["Yield held steady, water use dropped by 30%"])
    status: OutcomeStatus = Field(default=OutcomeStatus.pending)


class EntryCreate(EntryBase):
    """
    Fields required to create a new entry.

    user_id is optional for now (Week 5) since authentication isn't wired up
    yet — it becomes required once login is implemented in Week 6, linking
    each entry to the farmer who recorded it.
    """
    user_id: Optional[str] = Field(None, description="ObjectId of the user who created this entry")


class EntryUpdate(BaseModel):
    """
    Fields allowed when updating an entry.
    All fields optional — only provided fields are changed (partial update).
    """
    title: Optional[str] = Field(None, min_length=3, max_length=120)
    crop: Optional[str] = Field(None, min_length=2, max_length=60)
    region: Optional[str] = Field(None, min_length=2, max_length=60)
    season: Optional[str] = Field(None, min_length=2, max_length=40)
    decision: Optional[str] = Field(None, min_length=5)
    reason: Optional[str] = Field(None, min_length=5)
    outcome: Optional[str] = None
    status: Optional[OutcomeStatus] = None


class Entry(EntryBase):
    """Full entry as stored and returned by the API, including server-set fields."""
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(..., alias="_id", description="MongoDB ObjectId as a string")
    user_id: Optional[str] = None
    created_at: str
