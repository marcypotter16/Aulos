from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.user import User
from schemas.user import UserResponse

router = APIRouter(prefix="/search", tags=["Search"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Search users by name
# If no query is provided, it will give error (min length = 1).
# If a query is provided, it will return users whose names contain the query string.
@router.get("/users", response_model=list[UserResponse])
def search_users(q: str = Query(..., min_length=1, max_length=40), db: Session = Depends(get_db)):
    results = db.query(User).filter(User.name.ilike(f"%{q}%")).all()
    return results
