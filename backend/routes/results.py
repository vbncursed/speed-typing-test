from fastapi import APIRouter, Depends, HTTPException
from schemas import ResultCreate, Result
from .auth import get_current_user
from models import results, users
from datetime import datetime
from db import database
from typing import List

router = APIRouter()


@router.post("/save-result", response_model=Result)
async def save_result(
    result: ResultCreate, current_user: dict = Depends(get_current_user)
):
    query = results.insert().values(
        user_id=result.user_id,
        wpm=result.wpm,
        accuracy=result.accuracy,
        language=result.language,
    )
    result_id = await database.execute(query)

    # Получение username
    user_query = users.select().where(users.c.id == result.user_id)
    user = await database.fetch_one(user_query)

    return {
        **result.dict(),
        "id": result_id,
        "test_date": datetime.now(),
        "username": user["username"] if user else "Unknown",
    }


@router.get("/top-results", response_model=List[Result])
async def top_results(limit: int = 10):
    query = """
    SELECT results.id, results.user_id, results.wpm, results.accuracy, results.test_date, results.language, users.username
    FROM results
    JOIN users ON results.user_id = users.id
    ORDER BY results.wpm DESC
    LIMIT :limit
    """
    top_results = await database.fetch_all(query, values={"limit": limit})
    return top_results


@router.get("/user-results", response_model=List[Result])
async def user_results(username: str):
    user_query = users.select().where(users.c.username == username)
    user = await database.fetch_one(user_query)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    query = """
    SELECT results.id, results.user_id, results.wpm, results.accuracy, results.test_date, results.language, users.username
    FROM results
    JOIN users ON results.user_id = users.id
    WHERE users.username = :username
    ORDER BY results.test_date DESC
    """
    user_results = await database.fetch_all(query, values={"username": username})
    return user_results
