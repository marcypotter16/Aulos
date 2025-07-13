from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./musician.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}  # Needed for SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# This function provides a database session for dependency injection in FastAPI routes.
# It ensures that the session is properly closed after use.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
