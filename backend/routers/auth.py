from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from core.database import get_db
from core.security import create_access_token, create_refresh_token, decode_token
from core.config import settings
from core.redis_client import get_redis
from models.user import User
from schemas.user import UserCreate, UserLogin, UserResponse, Token
from services.auth_service import create_user, authenticate_user, get_user_by_id
from middleware.auth import get_current_user

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        db_user = create_user(db, user)
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login and receive access/refresh tokens"""
    try:
        user = authenticate_user(db, user_credentials.email, user_credentials.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        access_token = create_access_token(data={"sub": user.id})
        refresh_token = create_refresh_token(data={"sub": user.id})
        
        # Store refresh token in Redis
        try:
            redis_client = await get_redis()
            await redis_client.set(
                f"refresh_token:{user.id}",
                refresh_token,
                ex=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
            )
        except Exception as e:
            # Log error but don't fail login if Redis is down
            print(f"Redis error: {e}")
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout and invalidate refresh token"""
    try:
        redis_client = await get_redis()
        await redis_client.delete(f"refresh_token:{current_user.id}")
    except Exception as e:
        print(f"Redis error during logout: {e}")
    return {"message": "Successfully logged out"}


@router.post("/refresh", response_model=Token)
async def refresh_token_endpoint(token_data: dict, db: Session = Depends(get_db)):
    """Refresh access token using refresh token"""
    refresh_token = token_data.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="refresh_token is required"
        )
    payload = decode_token(refresh_token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Verify refresh token in Redis
    try:
        redis_client = await get_redis()
        stored_token = await redis_client.get(f"refresh_token:{user_id}")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Redis error: {str(e)}"
        )
    
    if stored_token != refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Create new tokens
    new_access_token = create_access_token(data={"sub": user.id})
    new_refresh_token = create_refresh_token(data={"sub": user.id})
    
    # Update refresh token in Redis (token rotation)
    try:
        await redis_client.set(
            f"refresh_token:{user.id}",
            new_refresh_token,
            ex=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        )
    except Exception as e:
        print(f"Redis error during token rotation: {e}")
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user
