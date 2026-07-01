"""
Seed script — populates the MongoDB "entries" collection with sample data.

Run once after setting up your database:
    python -m app.seed

Safe to re-run: it clears the entries collection first, so you won't get
duplicate seed data if you run it more than once.
"""

import asyncio
from datetime import datetime, timezone
from app.db.connection import entries_collection, ping_database

SEED_ENTRIES = [
    {
        "title": "Switched to drip irrigation mid-season",
        "crop": "Wheat",
        "region": "Punjab",
        "season": "Rabi 2025",
        "decision": "Switched from flood irrigation to drip irrigation",
        "reason": "Forecast showed a dry spell for the next 3 weeks",
        "outcome": "Reduced water use by 30%. Yield held steady, soil stayed workable through harvest.",
        "status": "success",
        "user_id": None,
        "created_at": "2025-03-12T09:30:00Z",
    },
    {
        "title": "Delayed sowing by two weeks",
        "crop": "Cotton",
        "region": "Maharashtra",
        "season": "Kharif 2025",
        "decision": "Waited two weeks after the first monsoon signal before sowing",
        "reason": "Early monsoon onset looked unstable, risk of a false start",
        "outcome": "Avoided the seedling loss neighboring farms saw that year.",
        "status": "success",
        "user_id": None,
        "created_at": "2025-06-18T11:00:00Z",
    },
    {
        "title": "Tried a new fertilizer mix",
        "crop": "Tomato",
        "region": "Karnataka",
        "season": "2025",
        "decision": "Used a new compound fertilizer instead of the usual urea mix",
        "reason": "Wanted to test if it improved fruit size based on a neighbor's recommendation",
        "outcome": "Higher yield, but pest pressure increased noticeably partway through the season.",
        "status": "partial",
        "user_id": None,
        "created_at": "2025-04-02T08:15:00Z",
    },
    {
        "title": "Skipped second round of pesticide spray",
        "crop": "Rice",
        "region": "West Bengal",
        "season": "Kharif 2024",
        "decision": "Skipped the second scheduled pesticide application",
        "reason": "Wanted to cut costs and pest levels looked low at the time",
        "outcome": "Pest infestation increased later in the season, lowering yield by an estimated 15%.",
        "status": "failure",
        "user_id": None,
        "created_at": "2024-09-05T14:20:00Z",
    },
    {
        "title": "Planted a new pest-resistant wheat variety",
        "crop": "Wheat",
        "region": "Haryana",
        "season": "Rabi 2026",
        "decision": "Trying HD-3226 variety this season instead of the usual seed stock",
        "reason": "Heard from a nearby farmer it resists the rust disease better",
        "outcome": None,
        "status": "pending",
        "user_id": None,
        "created_at": "2026-01-10T07:45:00Z",
    },
]


async def seed():
    await ping_database()
    print("Connected. Clearing existing entries...")
    await entries_collection.delete_many({})

    print(f"Inserting {len(SEED_ENTRIES)} sample entries...")
    await entries_collection.insert_many(SEED_ENTRIES)

    count = await entries_collection.count_documents({})
    print(f"Done. entries collection now has {count} documents.")


if __name__ == "__main__":
    asyncio.run(seed())
