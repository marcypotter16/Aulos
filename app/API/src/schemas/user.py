from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    user_name: str
    email: EmailStr
    instrument: str | None = None
    genre: str | None = None
    avatar_url: str | None = None

class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True
