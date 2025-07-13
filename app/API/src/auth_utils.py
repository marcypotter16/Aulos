import bcrypt
from dotenv import load_dotenv
from datetime import datetime, timedelta
from jose import jwt, JWTError
import os
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def hash_password(plain_password: str) -> str:
    return bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY is not set in the environment variables.")
    to_encode = data.copy()
    if expires_delta is None:
        expires_delta = timedelta(minutes=15)  # Default expiration time
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY is not set in the environment variables.")
    if not token:
        raise ValueError("Token is required for decoding.")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise ValueError("Invalid or expired token.")
    

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Function to get the current user from the token
def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get the current user based on the provided token.
    Raises HTTPException if the token is invalid or expired.
    """
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY is not set in the environment variables.")
    if not token:
        raise HTTPException(status_code=401, detail="Token is required")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return username  # or query user from DB and return user object
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
