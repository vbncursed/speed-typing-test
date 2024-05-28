from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
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
async def get_test_results():
    # Логика получения результатов тестов
    file_path = "path_to_results_file.txt"
    return FileResponse(
        file_path, media_type="application/octet-stream", filename="results.txt"
    )
