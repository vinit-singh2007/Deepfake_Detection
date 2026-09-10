from typing import Dict
from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserLogin, TokenResponse, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.db.mongodb import get_user_collection
from app.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])
legacy_router = APIRouter(tags=["auth"])

# In-memory fallback user storage if Mongo is disabled
_in_memory_users: Dict[str, dict] = {}

async def _register_user(user: UserCreate) -> dict:
    user_name = user.name or user.email.split("@")[0].capitalize()
    if settings.MONGO_ENABLED:
        try:
            users = get_user_collection()
            existing = await users.find_one({"email": user.email})
            if existing:
                raise HTTPException(status_code=400, detail="User already exists")
            
            hashed = get_password_hash(user.password)
            new_user = {"email": user.email, "name": user_name, "hashed_password": hashed}
            res = await users.insert_one(new_user)
            user_id = str(res.inserted_id)
        except HTTPException:
            raise
        except Exception:
            # Fallback to in-memory if DB fails
            if user.email in _in_memory_users:
                raise HTTPException(status_code=400, detail="User already exists")
            hashed = get_password_hash(user.password)
            user_id = user.email
            _in_memory_users[user.email] = {"email": user.email, "name": user_name, "hashed_password": hashed}
    else:
        if user.email in _in_memory_users:
            raise HTTPException(status_code=400, detail="User already exists")
        hashed = get_password_hash(user.password)
        user_id = user.email
        _in_memory_users[user.email] = {"email": user.email, "name": user_name, "hashed_password": hashed}

    token = create_access_token(data={"sub": user_id, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse(id=user_id, email=user.email, name=user_name)
    }

async def _login_user(user: UserLogin) -> dict:
    db_user = None
    user_id = None
    if settings.MONGO_ENABLED:
        try:
            users = get_user_collection()
            db_user = await users.find_one({"email": user.email})
            if db_user:
                user_id = str(db_user["_id"])
        except Exception:
            pass

    if not db_user and user.email in _in_memory_users:
        db_user = _in_memory_users[user.email]
        user_id = user.email

    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_name = db_user.get("name") or user.email.split("@")[0].capitalize()
    token = create_access_token(data={"sub": user_id, "email": db_user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse(id=user_id, email=db_user["email"], name=user_name)
    }

@router.post("/register", response_model=TokenResponse)
async def register(user: UserCreate):
    return await _register_user(user)

@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    return await _login_user(user)

@legacy_router.post("/register", response_model=TokenResponse, include_in_schema=False)
async def legacy_register(user: UserCreate):
    return await _register_user(user)

@legacy_router.post("/login", response_model=TokenResponse, include_in_schema=False)
async def legacy_login(user: UserLogin):
    return await _login_user(user)

