from fastapi import APIRouter
from db import database
from models import results
from schemas import ResultCreate, Result
from datetime import datetime
from typing import List

router = APIRouter()


@router.post("/save-result", response_model=Result)
async def save_result(result: ResultCreate):
    query = results.insert().values(
        user_id=result.user_id,
        wpm=result.wpm,
        accuracy=result.accuracy,
        language=result.language,
    )
    result_id = await database.execute(query)
    return {**result.dict(), "id": result_id, "test_date": datetime.now()}


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
