from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import session, models
from .api import lessons, auth, users, attempts, reviews
from .core.settings import settings


if settings.auto_create_tables:
    models.Base.metadata.create_all(bind=session.engine)

app = FastAPI(title="Biblo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Acoplamos os módulos de rotas
app.include_router(lessons.router, prefix="/lessons", tags=["Lessons"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(attempts.router, prefix="/attempts", tags=["Attempts"])
app.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])

@app.get("/")
def health_check():
    return {"status": "online", "engine": "Biblo Core"}
    