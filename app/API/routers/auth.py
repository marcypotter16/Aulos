from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from schemas.user import UserCreate, UserResponse
from db.database import get_db
from models.user import User
from auth_utils import create_access_token, hash_password, verify_password
from pydantic import BaseModel

router = APIRouter()

class LoginData(BaseModel):
    user_name: str
    password: str

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_name == form_data.username).first()
    if not user or not verify_password(form_data.password, str(user.password_hash)):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.user_name})
    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    hashed_pw = hash_password(user_data.password)

    db_user = User(
        user_name=user_data.user_name,
        name=user_data.name,
        email=user_data.email,
        instrument=user_data.instrument,
        genre=user_data.genre,
        password_hash=hashed_pw  # 👈 This matches the column in your DB model
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user  # Pydantic + orm_mode handles conversion

