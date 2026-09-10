"""
FastAPI application entrypoint.
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import auth, health, video
from app.core.config import settings

logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
# Mute noisy pymongo heartbeat/topology logs
logging.getLogger("pymongo").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    settings.upload_path.mkdir(parents=True, exist_ok=True)
    logger.info("%s v%s starting up.", settings.APP_NAME, settings.APP_VERSION)
    logger.info("Upload directory: %s", settings.upload_path.resolve())

    if settings.MONGO_ENABLED:
        try:
            from app.db.mongodb import connect_to_mongo
            await connect_to_mongo()
        except Exception as exc:  # noqa: BLE001 - Mongo is optional for the demo
            logger.warning("MongoDB connection failed (continuing without it): %s", exc)

    yield

    # --- Shutdown ---
    if settings.MONGO_ENABLED:
        try:
            from app.db.mongodb import close_mongo_connection
            await close_mongo_connection()
        except Exception as exc:  # noqa: BLE001
            logger.warning("Error closing MongoDB connection: %s", exc)

    logger.info("%s shutting down.", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"status": "error", "detail": str(exc)},
    )


app.include_router(health.router)
app.include_router(video.router)
app.include_router(auth.router)
app.include_router(auth.legacy_router)


@app.get("/")
async def root() -> dict:
    return {
        "message": settings.APP_NAME,
        "docs": "/docs",
        "health": "/api/health",
        "analyze_endpoint": "/api/video/analyze",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)