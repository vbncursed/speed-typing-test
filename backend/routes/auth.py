from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from db import database
from models import users
from schemas import UserCreate
from jose import JWTError, jwt


router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


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
        # Генерация JWT токена
        token = jwt.encode({"sub": str(db_user["id"])}, "SECRET_KEY", algorithm="HS256")
        return {"token": token}
    raise HTTPException(status_code=400, detail="Invalid username or password")


def get_current_user(token: str = Depends(oauth2_scheme)):
    print(f"Полученный токен: {token}")  # Отладочное сообщение
    try:
        payload = jwt.decode(token, "SECRET_KEY", algorithms=["HS256"])
        user_id: str = payload.get("sub")
        print(f"Извлеченный user_id: {user_id}")  # Отладочное сообщение
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": user_id}
    except JWTError as e:
        print(f"Ошибка декодирования токена: {e}")  # Отладочное сообщение
        raise HTTPException(status_code=401, detail="Invalid token")
