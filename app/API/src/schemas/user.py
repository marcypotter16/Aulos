from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    user_name: str
    email: EmailStr
    instrument: str
    genre: str
    avatar_url: str | None = None

class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True
