from __future__ import annotations

import logging
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.core.config import settings
from app.models.analysis import VideoAnalysisResult
from app.services import ffmpeg_service, ml_service

from app.db.mongodb import save_analysis_record, get_database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/video", tags=["video"])

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm"}

# In-memory history list fallback if MongoDB is not active
_in_memory_history: list[dict] = []


def _validate_extension(filename: str) -> None:
    suffix = Path(filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{suffix}'. Allowed: {sorted(ALLOWED_EXTENSIONS)}",
        )


async def _save_upload_capped(file: UploadFile, dest_path: Path) -> None:
    max_bytes = settings.max_upload_bytes
    bytes_written = 0
    chunk_size = 1024 * 1024

    with open(dest_path, "wb") as out_file:
        while True:
            chunk = await file.read(chunk_size)
            if not chunk:
                break
            bytes_written += len(chunk)
            if bytes_written > max_bytes:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File exceeds max upload size of {settings.MAX_UPLOAD_SIZE_MB}MB.",
                )
            out_file.write(chunk)

    if bytes_written == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")


@router.post("/analyze", response_model=VideoAnalysisResult)
async def analyze_video(file: UploadFile = File(...)) -> VideoAnalysisResult:
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No filename provided.")

    _validate_extension(file.filename)

    upload_dir = settings.upload_path
    suffix = Path(file.filename).suffix.lower()
    temp_video_path = upload_dir / f"upload_{uuid.uuid4().hex}{suffix}"
    temp_audio_path: Path | None = None

    try:
        # --- 1. Save upload to disk ---
        await _save_upload_capped(file, temp_video_path)

        # --- 2. Extract audio via ffmpeg ---
        try:
            temp_audio_path = ffmpeg_service.extract_audio(temp_video_path)
        except ffmpeg_service.FFmpegError as exc:
            logger.error("Audio extraction failed: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Audio extraction failed: {exc}",
            ) from exc

        # --- 3. Run heuristic lip-sync analysis ---
        try:
            result = ml_service.analyze_lip_sync(temp_video_path, temp_audio_path)
        except ml_service.MLServiceError as exc:
            logger.error("ML analysis failed: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Video analysis failed: {exc}",
            ) from exc

        result.filename = file.filename
        
        # Save record to DB or in-memory history
        doc = result.model_dump(mode="json")
        _in_memory_history.insert(0, doc)
        if settings.MONGO_ENABLED:
            await save_analysis_record(doc)

        return result

    finally:
        # --- 4. Always clean up temp files ---
        ffmpeg_service.cleanup_file(temp_video_path)
        if temp_audio_path is not None:
            ffmpeg_service.cleanup_file(temp_audio_path)
        await file.close()


@router.get("/history", response_model=list[dict])
async def get_analysis_history() -> list[dict]:
    """
    Retrieve previous video analysis records.
    """
    if settings.MONGO_ENABLED:
        try:
            db = get_database()
            if db is not None:
                cursor = db["analyses"].find({}, {"_id": 0}).sort("created_at", -1).limit(50)
                records = await cursor.to_list(length=50)
                if records:
                    return records
        except Exception as exc:
            logger.warning("Failed to fetch history from MongoDB: %s", exc)

    return _in_memory_history[:50]

