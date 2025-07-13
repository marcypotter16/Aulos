from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth_utils import get_current_user
from db.database import SessionLocal
from models.user import User
from schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# @router.post("/", response_model=UserResponse)
# def create_user(user: UserCreate, db: Session = Depends(get_db)):
#     # db_user = User(**user.dict()) # This line is replaced with the next line to use model_dump
#     # because apparently user.dict() is deprecated.
#     print(user.model_dump())
#     db_user = User(**user.model_dump())
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# Get AUTHENTICATED user profile! (requires token)
# This function needs to be defined before @router.get("/{user_id}"),
@router.get("/profile")
def get_user_profile(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_name == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "user_name": user.user_name,
        "name": user.name,
        "email": user.email,
        "instrument": user.instrument,
        "genre": user.genre,
        "avatar_url": user.avatar_url,
        # "bio": user.bio,  # if you have one
        # any other profile fields you want to expose
    }

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

