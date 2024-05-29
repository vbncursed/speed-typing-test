from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import FileResponse
from .auth import get_current_user
from sqlalchemy import select
from models import results
from db import database
import random

router = APIRouter()


def read_words_from_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        words = file.read().splitlines()
    return words


def get_random_words(words, count):
    return random.sample(words, count)


@router.get("/start-test")
async def start_test(language: str):
    if language == "ru":
        file_path = "words_ru.txt"
    elif language == "en":
        file_path = "words_en.txt"
    else:
        raise HTTPException(status_code=400, detail="Unsupported language")

    try:
        words = read_words_from_file(file_path)
        test_words = get_random_words(words, 60)
        return {"words": test_words}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/results")
async def get_test_results(
    request: Request, current_user: dict = Depends(get_current_user)
):
    try:
        token = request.headers.get("Authorization")
        print(f"Полученный токен: {token}")  # Отладочное сообщение

        query = select([results.c.result_data]).where(
            results.c.user_id == current_user["id"]
        )
        result = await database.fetch_one(query)
        print(f"Результат запроса: {result}")  # Отладочное сообщение

        if not result:
            raise HTTPException(status_code=404, detail="Results not found")

        file_path = f"results_{current_user['id']}.txt"
        print(f"Путь к файлу: {file_path}")  # Отладочное сообщение
        return FileResponse(file_path)
    except Exception as e:
        print(f"Ошибка: {e}")  # Отладочное сообщение
        raise HTTPException(status_code=500, detail="Internal Server Error")
