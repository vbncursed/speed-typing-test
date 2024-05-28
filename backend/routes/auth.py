from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from db import database
from models import users
from schemas import UserCreate

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
async def register(user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    query = users.insert().values(
        username=user.username, hashed_password=hashed_password
    )
    await database.execute(query)
    return {"message": "User registered successfully"}


@router.post("/login")
async def login(user: UserCreate):
    query = users.select().where(users.c.username == user.username)
    db_user = await database.fetch_one(query)
    if db_user and pwd_context.verify(user.password, db_user["hashed_password"]):
        return {"message": "Login successful"}
    raise HTTPException(status_code=400, detail="Invalid username or password")
