from fastapi import FastAPI
from app.api.routes import router as match_router

app = FastAPI()
app.include_router(match_router, prefix="/match")