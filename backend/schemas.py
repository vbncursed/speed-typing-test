from pydantic import BaseModel
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    password: str


class ResultCreate(BaseModel):
    user_id: int
    wpm: int
    accuracy: float
    language: str


class Result(BaseModel):
    id: int
    user_id: int
    wpm: int
    accuracy: float
    test_date: datetime
    language: str

    class Config:
        orm_mode: True
