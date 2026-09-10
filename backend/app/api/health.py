"""
Liveness/readiness health check endpoint.
"""
from __future__ import annotations

import cv2
import shutil
from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(prefix="/api/health", tags=["health"])


@router.get("")
async def health_check() -> dict:
    ffmpeg_available = shutil.which(settings.FFMPEG_BINARY) is not None

    return {
        "status": "ok",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "opencv_version": cv2.__version__,
        "ffmpeg_available": ffmpeg_available,
        "upload_dir": str(settings.upload_path.resolve()),
        "max_upload_mb": settings.MAX_UPLOAD_SIZE_MB,
        "max_frames_processed": settings.MAX_FRAMES_TO_PROCESS,
    }