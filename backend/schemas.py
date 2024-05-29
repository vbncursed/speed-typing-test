from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str


class TestResult(BaseModel):
    time_taken: float
    accuracy: float
    wpm: float
