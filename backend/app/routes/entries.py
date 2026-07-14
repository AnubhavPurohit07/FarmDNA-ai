"""
Routes for FarmDNA Decision Journal entries.

Public endpoints return ALL entries (community knowledge).
Protected endpoints filter by the logged-in user's ID.
"""

from fastapi import APIRouter, HTTPException, status, Query, Depends, Request
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timezone
from typing import Optional

from app.models.entry import Entry, EntryCreate, EntryUpdate
from app.db.connection import entries_collection
from app.middleware.auth_middleware import require_auth

router = APIRouter(prefix="/api/entries", tags=["entries"])


def serialize_entry(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


def to_object_id(entry_id: str) -> ObjectId:
    try:
        return ObjectId(entry_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{entry_id}' is not a valid entry id",
        )


# ── Public routes (community knowledge — all entries) ─────────────────────────

@router.get("/public", response_model=list[Entry], status_code=status.HTTP_200_OK)
async def list_public_entries():
    """Return ALL entries for community browsing. No auth required."""
    cursor = entries_collection.find().sort("created_at", -1)
    docs = await cursor.to_list(length=None)
    return [serialize_entry(doc) for doc in docs]


@router.get("/public/search", response_model=list[Entry], status_code=status.HTTP_200_OK)
async def search_public_entries(
    q: str = Query(..., min_length=1)
):
    """Search ALL entries. No auth required."""
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


# ── Protected routes (user-specific entries) ──────────────────────────────────

@router.get("", response_model=list[Entry], status_code=status.HTTP_200_OK)
async def list_my_entries(current_user: dict = Depends(require_auth)):
    """Return only the logged-in user's entries."""
    cursor = entries_collection.find(
        {"user_id": current_user["user_id"]}
    ).sort("created_at", -1)
    docs = await cursor.to_list(length=None)
    return [serialize_entry(doc) for doc in docs]


@router.get("/search", response_model=list[Entry], status_code=status.HTTP_200_OK)
async def search_my_entries(
    q: str = Query(..., min_length=1),
    current_user: dict = Depends(require_auth),
):
    """Search only the logged-in user's entries."""
    regex = {"$regex": q, "$options": "i"}
    query = {
        "user_id": current_user["user_id"],
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
async def get_entry(entry_id: str, current_user: dict = Depends(require_auth)):
    """Return a single entry belonging to the logged-in user."""
    oid = to_object_id(entry_id)
    doc = await entries_collection.find_one({
        "_id": oid,
        "user_id": current_user["user_id"]
    })
    if not doc:
        raise HTTPException(status_code=404, detail=f"Entry {entry_id} not found")
    return serialize_entry(doc)


@router.post("", response_model=Entry, status_code=status.HTTP_201_CREATED)
async def create_entry(
    payload: EntryCreate,
    current_user: dict = Depends(require_auth),
):
    """Create a new entry tied to the logged-in user."""
    doc = payload.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    doc["user_id"] = current_user["user_id"]
    result = await entries_collection.insert_one(doc)
    new_doc = await entries_collection.find_one({"_id": result.inserted_id})
    return serialize_entry(new_doc)


@router.put("/{entry_id}", response_model=Entry, status_code=status.HTTP_200_OK)
async def update_entry(
    entry_id: str,
    payload: EntryUpdate,
    current_user: dict = Depends(require_auth),
):
    """Update an entry belonging to the logged-in user."""
    oid = to_object_id(entry_id)
    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields provided to update")
    result = await entries_collection.update_one(
        {"_id": oid, "user_id": current_user["user_id"]},
        {"$set": updates}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail=f"Entry {entry_id} not found")
    updated = await entries_collection.find_one({"_id": oid})
    return serialize_entry(updated)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: str,
    current_user: dict = Depends(require_auth),
):
    """Delete an entry belonging to the logged-in user."""
    oid = to_object_id(entry_id)
    result = await entries_collection.delete_one({
        "_id": oid,
        "user_id": current_user["user_id"]
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Entry {entry_id} not found")
    return
