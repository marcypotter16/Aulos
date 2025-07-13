from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base

# app/API/models/post.py
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    
    content = Column(String, index=True)
    author_id = Column(Integer, ForeignKey("users.id"))

    author = relationship("User", back_populates="posts")