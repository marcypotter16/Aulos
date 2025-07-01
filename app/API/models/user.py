from sqlalchemy import Column, Integer, String
from db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, unique=True, index=True)
    password_hash = Column(String)
    name = Column(String, index=True)
    instrument = Column(String, index=True)
    genre = Column(String, index=True)
