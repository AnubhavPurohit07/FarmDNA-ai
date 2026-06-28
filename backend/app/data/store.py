"""
In-memory data store for FarmDNA Decision Journal entries.

This is a temporary stand-in for a real database. Data resets every time
the server restarts. A real database is introduced in Week 5.
"""

from datetime import datetime, timezone

# In-memory "table" — a simple list of dicts.
entries_db: list[dict] = [
    {
        "id": 1,
        "title": "Switched to drip irrigation mid-season",
        "crop": "Wheat",
        "region": "Punjab",
        "season": "Rabi 2025",
        "decision": "Switched from flood irrigation to drip irrigation",
        "reason": "Forecast showed a dry spell for the next 3 weeks",
        "outcome": "Reduced water use by 30%. Yield held steady, soil stayed workable through harvest.",
        "status": "success",
        "created_at": "2025-03-12T09:30:00Z",
    },
    {
        "id": 2,
        "title": "Delayed sowing by two weeks",
        "crop": "Cotton",
        "region": "Maharashtra",
        "season": "Kharif 2025",
        "decision": "Waited two weeks after the first monsoon signal before sowing",
        "reason": "Early monsoon onset looked unstable, risk of a false start",
        "outcome": "Avoided the seedling loss neighboring farms saw that year.",
        "status": "success",
        "created_at": "2025-06-18T11:00:00Z",
    },
    {
        "id": 3,
        "title": "Tried a new fertilizer mix",
        "crop": "Tomato",
        "region": "Karnataka",
        "season": "2025",
        "decision": "Used a new compound fertilizer instead of the usual urea mix",
        "reason": "Wanted to test if it improved fruit size based on a neighbor's recommendation",
        "outcome": "Higher yield, but pest pressure increased noticeably partway through the season.",
        "status": "partial",
        "created_at": "2025-04-02T08:15:00Z",
    },
    {
        "id": 4,
        "title": "Skipped second round of pesticide spray",
        "crop": "Rice",
        "region": "West Bengal",
        "season": "Kharif 2024",
        "decision": "Skipped the second scheduled pesticide application",
        "reason": "Wanted to cut costs and pest levels looked low at the time",
        "outcome": "Pest infestation increased later in the season, lowering yield by an estimated 15%.",
        "status": "failure",
        "created_at": "2024-09-05T14:20:00Z",
    },
    {
        "id": 5,
        "title": "Planted a new pest-resistant wheat variety",
        "crop": "Wheat",
        "region": "Haryana",
        "season": "Rabi 2026",
        "decision": "Trying HD-3226 variety this season instead of the usual seed stock",
        "reason": "Heard from a nearby farmer it resists the rust disease better",
        "outcome": None,
        "status": "pending",
        "created_at": "2026-01-10T07:45:00Z",
    },
]

# Tracks the next ID to assign for new entries.
_next_id = 6


def get_next_id() -> int:
    """Return the next available ID and increment the counter."""
    global _next_id
    new_id = _next_id
    _next_id += 1
    return new_id


def now_iso() -> str:
    """Current UTC timestamp in ISO 8601 format, matching seed data style."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
