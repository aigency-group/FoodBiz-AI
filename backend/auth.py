from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os
from jose import jwt

ALGORITHM = "HS256"
SECRET_KEY = os.environ.get("SECRET_KEY")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"token": token}

async def get_current_user_ws(token: str | None = None) -> dict:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return {"token": token}


async def get_current_profile(token: str = Depends(oauth2_scheme)) -> dict:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    if not SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server misconfiguration: SECRET_KEY not set",
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
