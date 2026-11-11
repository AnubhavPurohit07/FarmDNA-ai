import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "farmdna")

if not MONGO_URI:
    raise RuntimeError(
        "MONGO_URI is not set. Copy .env.example to .env and fill in your "
        "MongoDB Atlas connection string."
    )

client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where())
db = client[DB_NAME]

entries_collection = db["entries"]
users_collection = db["users"]
agriculture_collection = db["agriculture_predictions"]


async def ping_database():
    await client.admin.command("ping")
