"""
FFmpeg-based audio extraction service.

Extracts 16kHz mono PCM WAV audio from an uploaded video using subprocess,
writes it into the uploads/ folder, and guarantees temp file cleanup via
try/finally at the call site (see video.py) and internally for any
intermediate artifacts this service itself creates.
"""
from __future__ import annotations

import subprocess
import uuid
import logging
from pathlib import Path

from app.core.config import settings

logger = logging.getLogger(__name__)


class FFmpegError(Exception):
    """Raised when ffmpeg fails or is unavailable."""
    pass


def _run_ffmpeg(cmd: list[str]) -> None:
    try:
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
            timeout=60,
        )
    except FileNotFoundError as exc:
        raise FFmpegError(
            "ffmpeg binary not found. On Windows, install ffmpeg and add "
            "its /bin folder to PATH, or set FFMPEG_BINARY in .env to the full path."
        ) from exc
    except subprocess.TimeoutExpired as exc:
        raise FFmpegError("ffmpeg timed out while processing the video.") from exc

    if result.returncode != 0:
        stderr = result.stderr.decode(errors="ignore")
        logger.error("ffmpeg failed: %s", stderr)
        raise FFmpegError(f"ffmpeg failed (code {result.returncode}): {stderr[-800:]}")


def extract_audio(video_path: str | Path) -> Path:
    """
    Extract 16kHz mono PCM WAV audio from a video file.

    Args:
        video_path: path to the source video already saved on disk.

    Returns:
        Path to the generated .wav file inside settings.UPLOAD_DIR.

    Raises:
        FFmpegError: if extraction fails for any reason.
    """
    video_path = Path(video_path)
    if not video_path.exists():
        raise FFmpegError(f"Source video not found: {video_path}")

    upload_dir = settings.upload_path
    audio_filename = f"audio_{uuid.uuid4().hex}.wav"
    audio_path = upload_dir / audio_filename

    cmd = [
        settings.FFMPEG_BINARY,
        "-y",                       # overwrite without prompting
        "-i", str(video_path),
        "-vn",                      # no video stream
        "-acodec", "pcm_s16le",     # PCM 16-bit little endian
        "-ar", str(settings.AUDIO_SAMPLE_RATE),
        "-ac", str(settings.AUDIO_CHANNELS),
        str(audio_path),
    ]

    logger.info("Extracting audio: %s -> %s", video_path.name, audio_path.name)
    _run_ffmpeg(cmd)

    if not audio_path.exists() or audio_path.stat().st_size == 0:
        raise FFmpegError("ffmpeg reported success but produced no audio output.")

    return audio_path


def get_video_duration(video_path: str | Path) -> float:
    """
    Uses ffprobe (bundled with ffmpeg) to fetch duration in seconds.
    Returns 0.0 if it cannot be determined (non-fatal, best-effort).
    """
    video_path = Path(video_path)
    ffprobe_binary = settings.FFMPEG_BINARY.replace("ffmpeg", "ffprobe")

    cmd = [
        ffprobe_binary,
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(video_path),
    ]
    try:
        result = subprocess.run(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=20
        )
        if result.returncode == 0:
            output = result.stdout.decode(errors="ignore").strip()
            return float(output) if output else 0.0
    except Exception as exc:  # noqa: BLE001 - best-effort, never fatal
        logger.warning("Could not determine video duration: %s", exc)
    return 0.0


def cleanup_file(path: str | Path) -> None:
    """Best-effort deletion of a temp file. Never raises."""
    try:
        p = Path(path)
        if p.exists():
            p.unlink()
            logger.debug("Cleaned up temp file: %s", p)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Failed to clean up %s: %s", path, exc)