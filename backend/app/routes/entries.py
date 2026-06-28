"""
Routes for FarmDNA Decision Journal entries.

Implements 6 REST endpoints:
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
from app.models.entry import Entry, EntryCreate, EntryUpdate
from app.data.store import entries_db, get_next_id, now_iso

router = APIRouter(prefix="/api/entries", tags=["entries"])


@router.get("", response_model=list[Entry], status_code=status.HTTP_200_OK)
def list_entries():
    """Return every recorded decision journal entry."""
    return entries_db


@router.get("/search", response_model=list[Entry], status_code=status.HTTP_200_OK)
def search_entries(
    q: str = Query(..., min_length=1, description="Keyword to search for in title, crop, region, season, decision, or reason")
):
    """
    Search entries by keyword. Matches against title, crop, region,
    season, decision, and reason fields (case-insensitive).
    """
    keyword = q.lower().strip()
    results = [
        entry for entry in entries_db
        if keyword in entry["title"].lower()
        or keyword in entry["crop"].lower()
        or keyword in entry["region"].lower()
        or keyword in entry["season"].lower()
        or keyword in entry["decision"].lower()
        or keyword in entry["reason"].lower()
    ]
    return results


@router.get("/{entry_id}", response_model=Entry, status_code=status.HTTP_200_OK)
def get_entry(entry_id: int):
    """Return a single entry by its ID, or 404 if it doesn't exist."""
    for entry in entries_db:
        if entry["id"] == entry_id:
            return entry
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Entry with id {entry_id} not found")


@router.post("", response_model=Entry, status_code=status.HTTP_201_CREATED)
def create_entry(payload: EntryCreate):
    """Create a new decision journal entry."""
    new_entry = {
        "id": get_next_id(),
        "created_at": now_iso(),
        **payload.model_dump(),
    }
    entries_db.append(new_entry)
    return new_entry


@router.put("/{entry_id}", response_model=Entry, status_code=status.HTTP_200_OK)
def update_entry(entry_id: int, payload: EntryUpdate):
    """Update an existing entry. Only fields provided in the request body are changed."""
    for entry in entries_db:
        if entry["id"] == entry_id:
            updates = payload.model_dump(exclude_unset=True)
            if not updates:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No fields provided to update",
                )
            entry.update(updates)
            return entry
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Entry with id {entry_id} not found")


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(entry_id: int):
    """Delete an entry by its ID."""
    for index, entry in enumerate(entries_db):
        if entry["id"] == entry_id:
            entries_db.pop(index)
            return
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Entry with id {entry_id} not found")
