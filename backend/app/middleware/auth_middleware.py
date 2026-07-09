"""
Authentication middleware for FarmDNA.

Provides a FastAPI dependency (require_auth) that validates the JWT token
from the Authorization: Bearer <token> header. Apply to any route that
should only be accessible to logged-in users.

Usage:
    @router.get("/protected")
    async def protected_route(current_user = Depends(require_auth)):
        return {"user": current_user}
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt import verify_access_token

security = HTTPBearer()


async def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    FastAPI dependency that validates the JWT token.
    Returns the decoded user payload if valid.
    Raises 401 if token is missing, invalid, or expired.
    """
    token = credentials.credentials
    return verify_access_token(token)
