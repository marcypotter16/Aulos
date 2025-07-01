from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    user_name: str
    instrument: str
    genre: str

class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True
