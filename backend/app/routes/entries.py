"""
Routes for FarmDNA Decision Journal entries — now backed by MongoDB.

Implements 6+ REST endpoints:
  GET    /api/entries           - list all entries
  GET    /api/entries/search    - search entries by keyword
  GET    /api/entries/{id}      - get a single entry
  POST   /api/entries           - create a new entry
  PUT    /api/entries/{id}      - update an entry
  DELETE /api/entries/{id}      - delete an entry

NOTE: The search route is declared BEFORE the /{entry_id} route.
FastAPI matches routes in order, and "/search" would otherwise be
swallowed by the "/{entry_id}" path parameter.
"""

from fastapi import APIRouter, HTTPException, status, Query
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timezone

from app.models.entry import Entry, EntryCreate, EntryUpdate
from app.db.connection import entries_collection

router = APIRouter(prefix="/api/entries", tags=["entries"])


def serialize_entry(doc: dict) -> dict:
    """Convert a MongoDB document into the shape the Entry model expects."""
    doc["_id"] = str(doc["_id"])
    return doc


def to_object_id(entry_id: str) -> ObjectId:
    """Convert a string ID to a MongoDB ObjectId, raising 400 if it's not valid."""
    try:
        return ObjectId(entry_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{entry_id}' is not a valid entry id",
        )


@router.get("", response_model=list[Entry], status_code=status.HTTP_200_OK)
async def list_entries():
    """Return every recorded decision journal entry."""
    cursor = entries_collection.find().sort("created_at", -1)
    docs = await cursor.to_list(length=None)
    return [serialize_entry(doc) for doc in docs]


@router.get("/search", response_model=list[Entry], status_code=status.HTTP_200_OK)
async def search_entries(
    q: str = Query(..., min_length=1, description="Keyword to search for in title, crop, region, season, decision, or reason")
):
    """
    Search entries by keyword. Matches against title, crop, region,
    season, decision, and reason fields (case-insensitive).
    """
    regex = {"$regex": q, "$options": "i"}
    query = {
        "$or": [
            {"title": regex},
            {"crop": regex},
            {"region": regex},
            {"season": regex},
            {"decision": regex},
            {"reason": regex},
        ]
    }
    cursor = entries_collection.find(query).sort("created_at", -1)
    docs = await cursor.to_list(length=None)
    return [serialize_entry(doc) for doc in docs]


@router.get("/{entry_id}", response_model=Entry, status_code=status.HTTP_200_OK)
async def get_entry(entry_id: str):
    """Return a single entry by its ID, or 404 if it doesn't exist."""
    oid = to_object_id(entry_id)
    doc = await entries_collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Entry with id {entry_id} not found")
    return serialize_entry(doc)


@router.post("", response_model=Entry, status_code=status.HTTP_201_CREATED)
async def create_entry(payload: EntryCreate):
    """Create a new decision journal entry."""
    doc = payload.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    result = await entries_collection.insert_one(doc)
    new_doc = await entries_collection.find_one({"_id": result.inserted_id})
    return serialize_entry(new_doc)


@router.put("/{entry_id}", response_model=Entry, status_code=status.HTTP_200_OK)
async def update_entry(entry_id: str, payload: EntryUpdate):
    """Update an existing entry. Only fields provided in the request body are changed."""
    oid = to_object_id(entry_id)
    updates = payload.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided to update",
        )

    result = await entries_collection.update_one({"_id": oid}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Entry with id {entry_id} not found")

    updated_doc = await entries_collection.find_one({"_id": oid})
    return serialize_entry(updated_doc)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(entry_id: str):
    """Delete an entry by its ID."""
    oid = to_object_id(entry_id)
    result = await entries_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Entry with id {entry_id} not found")
    return
