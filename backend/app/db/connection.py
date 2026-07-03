import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "farmdna")

if not MONGO_URI:
    raise RuntimeError(
        "MONGO_URI is not set. Copy .env.example to .env and fill in your "
        "MongoDB Atlas connection string."
    )

import certifi
client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where())
db = client[DB_NAME]

# Collections
entries_collection = db["entries"]
users_collection = db["users"]


async def ping_database():
    """Quick connectivity check — used at startup to fail fast if the
    connection string is wrong or the cluster is unreachable."""
    await client.admin.command("ping")
