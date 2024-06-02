from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import database
from routes import auth, test, results

app = FastAPI()

# Разрешение CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.get("/test-db")
async def test_db():
    query = "SELECT 1"
    result = await database.fetch_one(query)
    return {"result": result}


app.include_router(results.router, prefix="/results")
app.include_router(auth.router, prefix="/auth")
app.include_router(test.router, prefix="/test")
