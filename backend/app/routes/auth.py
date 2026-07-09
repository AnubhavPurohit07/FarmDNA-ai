"""
Authentication routes for FarmDNA.

Endpoints:
  POST /api/auth/register      - Register a new user
  POST /api/auth/login         - Login and get JWT token
  GET  /api/auth/google        - Initiate Google OAuth flow
  GET  /api/auth/google/callback - Handle Google OAuth callback
  GET  /api/auth/me            - Get current user (protected)
  POST /api/auth/logout        - Logout (client-side token removal)
"""

import os
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.responses import RedirectResponse
from passlib.context import CryptContext
from authlib.integrations.httpx_client import AsyncOAuth2Client

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.user import UserRegister, UserLogin, UserResponse, TokenResponse
from app.db.connection import users_collection
from app.auth.jwt import create_access_token
from app.middleware.auth_middleware import require_auth

router = APIRouter(prefix="/api/auth", tags=["auth"])
limiter = Limiter(key_func=get_remote_address)

# Password hashing context using bcrypt with 12 salt rounds
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)

# Google OAuth config
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI",
    "http://localhost:8000/api/auth/google/callback"
)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def serialize_user(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


# ── Register ──────────────────────────────────────────────────────────────────
@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/15minutes")
async def register(payload: UserRegister, request: Request):
    """Register a new user. Hashes password before storing. Returns JWT."""

    # Check for duplicate email
    existing = await users_collection.find_one({"email": payload.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    hashed = hash_password(payload.password)
    doc = {
        "name": payload.name,
        "email": payload.email,
        "password": hashed,
        "region": payload.region,
        "auth_provider": "local",
        "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }

    result = await users_collection.insert_one(doc)
    new_user = await users_collection.find_one({"_id": result.inserted_id})
    new_user = serialize_user(new_user)

    token = create_access_token(new_user["_id"], new_user["email"])

    return TokenResponse(
        access_token=token,
        user=UserResponse(**new_user),
    )


# ── Login ─────────────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/15minutes")
async def login(payload: UserLogin, request: Request):
    """Login with email and password. Returns JWT on success."""

    user = await users_collection.find_one({"email": payload.email})

    if not user or not verify_password(payload.password, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    user = serialize_user(user)
    token = create_access_token(user["_id"], user["email"])

    return TokenResponse(
        access_token=token,
        user=UserResponse(**user),
    )


# ── Google OAuth — Initiate ───────────────────────────────────────────────────
@router.get("/google")
async def google_login():
    """Redirect user to Google's OAuth consent screen."""
    client = AsyncOAuth2Client(
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )
    uri, state = client.create_authorization_url(
        "https://accounts.google.com/o/oauth2/v2/auth",
        scope="openid email profile",
    )
    return RedirectResponse(uri)


# ── Google OAuth — Callback ───────────────────────────────────────────────────
@router.get("/google/callback")
async def google_callback(code: str, request: Request):
    """Handle Google OAuth callback, create/find user, return JWT via redirect."""
    try:
        client = AsyncOAuth2Client(
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET,
            redirect_uri=GOOGLE_REDIRECT_URI,
        )

        # Exchange code for token
        token = await client.fetch_token(
            "https://oauth2.googleapis.com/token",
            code=code,
        )

        # Get user info from Google
        resp = await client.get("https://www.googleapis.com/oauth2/v2/userinfo")
        google_user = resp.json()

        email = google_user.get("email")
        name = google_user.get("name", email)

        # Find or create user
        user = await users_collection.find_one({"email": email})
        if not user:
            doc = {
                "name": name,
                "email": email,
                "password": None,
                "region": None,
                "auth_provider": "google",
                "google_id": google_user.get("id"),
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            }
            result = await users_collection.insert_one(doc)
            user = await users_collection.find_one({"_id": result.inserted_id})

        user = serialize_user(user)
        jwt_token = create_access_token(user["_id"], user["email"])

        # Redirect to frontend with token
        return RedirectResponse(
            f"{FRONTEND_URL}/auth/callback?token={jwt_token}"
        )

    except Exception as e:
        return RedirectResponse(f"{FRONTEND_URL}/login?error=oauth_failed")


# ── Get current user (protected) ─────────────────────────────────────────────
@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(require_auth)):
    """Return the currently logged-in user's profile."""
    from bson import ObjectId
    user = await users_collection.find_one({"_id": ObjectId(current_user["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**serialize_user(user))


# ── Logout ────────────────────────────────────────────────────────────────────
@router.post("/logout")
async def logout():
    """
    Logout endpoint. JWT auth is stateless so logout is handled
    client-side by removing the token from localStorage.
    This endpoint exists for API completeness and Postman collection.
    """
    return {"message": "Logged out successfully. Remove the token from client storage."}
