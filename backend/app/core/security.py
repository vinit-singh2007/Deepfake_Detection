"""
Security utilities: password hashing and JWT access tokens.

Uses passlib[bcrypt] for hashing and python-jose for JWT encode/decode.

NOTE on a known problematic-wheel issue (relevant to your "avoid
problematic wheels" constraint): passlib 1.7.4's bcrypt backend probes
`bcrypt.__about__.__version__`, which was removed in bcrypt>=4.1,
causing a noisy (sometimes fatal) warning/error on import. requirements.txt
pins `bcrypt==4.0.1` specifically to avoid this on Python 3.13/Windows.
"""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Header, HTTPException, status

from app.core.config import settings

logger = logging.getLogger(__name__)

# --- Password hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hash a plaintext password for storage."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a plaintext password against a stored bcrypt hash."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as exc:  # noqa: BLE001 - malformed hash, corrupted data, etc.
        logger.warning("Password verification error: %s", exc)
        return False


# --- JWT access tokens ---
# Hackathon-friendly defaults; override via .env (values below are read
# with getattr so this file works even if you haven't added these fields
# to Settings yet -- see the config.py addition note below).
SECRET_KEY: str = getattr(settings, "SECRET_KEY", "hackathon-insecure-secret-change-me")
ALGORITHM: str = getattr(settings, "ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 60)


def create_access_token(data: dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: claims to encode (e.g. {"sub": user_id}).
        expires_delta: optional custom expiry; defaults to
            ACCESS_TOKEN_EXPIRE_MINUTES from settings.

    Returns:
        Encoded JWT string.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta if expires_delta is not None else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    """
    Decode and validate a JWT access token.

    Raises:
        HTTPException(401) if the token is invalid, malformed, or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


# --- Simple API-key gate (optional, honors settings.REQUIRE_API_KEY) ---
async def verify_api_key(x_api_key: str = Header(default="")) -> None:
    """
    FastAPI dependency for routes that should require a static API key.
    No-op when settings.REQUIRE_API_KEY is False (default) -- keeps the
    hackathon demo frictionless unless you explicitly lock it down.

    Usage:
        @router.post("/analyze", dependencies=[Depends(verify_api_key)])
    """
    if not settings.REQUIRE_API_KEY:
        return
    if x_api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key.",
        )