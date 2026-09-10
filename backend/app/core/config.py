"""
Application configuration using pydantic-settings.
Reads from .env but silently ignores unknown keys so a messy hackathon
.env file never crashes startup.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class Settings(BaseSettings):
    # --- App metadata ---
    APP_NAME: str = "Deepfake Lip-Sync Detection API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # --- Server ---
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # --- CORS ---
    CORS_ORIGINS: list[str] = ["*"]

    # --- Storage ---
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 50

    # --- ML / Video processing ---
    MAX_FRAMES_TO_PROCESS: int = 250          # hard cap (~10s @ 25fps)
    TARGET_FPS_SAMPLE: int = 25
    FRAME_SCORE_CHART_CAP: int = 100          # cap array size returned to frontend
    MANIPULATION_THRESHOLD: float = 55.0      # confidence % above which -> deepfake

    # --- FFmpeg ---
    FFMPEG_BINARY: str = "ffmpeg"             # assumes ffmpeg is on PATH (Windows: add to PATH)
    AUDIO_SAMPLE_RATE: int = 16000
    AUDIO_CHANNELS: int = 1

    # --- Mongo (optional, hackathon-friendly: app must not crash if unset/unreachable) ---
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "deepshield"
    MONGO_ENABLED: bool = False

    # --- Security ---
    API_KEY: str = "changeme-hackathon-key"
    REQUIRE_API_KEY: bool = False
    SECRET_KEY: str = "hackathon-insecure-secret-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # --- Deep learning model paths ---
    MODEL_DIR: str = "models"
    SYNCNET_TORCH_PATH: str = "models/syncnet_color.pth"
    SYNCNET_VISUAL_ONNX: str = "models/syncnet_visual.onnx"
    SYNCNET_AUDIO_ONNX: str = "models/syncnet_audio.onnx"
    INFERENCE_BACKEND: str = "auto"   # "auto" | "onnx" | "torch" | "mock"

    # --- Audio/video sync analysis params ---
    SYNC_IMG_SIZE: int = 96
    SYNC_MEL_STEP_SIZE: int = 16
    SYNC_N_MELS: int = 80
    SYNC_MAX_OFFSET_FRAMES: int = 15   # search window: +/- 15 frames (~0.6s @ 25fps)
    SYNC_THRESHOLD: float = 40.0       # correlation-% pivot: >= Real, < Manipulated

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",  # crucial: unknown .env keys never crash the app
    )

    @property
    def upload_path(self) -> Path:
        p = Path(self.UPLOAD_DIR)
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    @property
    def model_dir_path(self) -> Path:
        p = Path(self.MODEL_DIR)
        p.mkdir(parents=True, exist_ok=True)
        return p


# Singleton settings instance, import this everywhere
settings = Settings()
