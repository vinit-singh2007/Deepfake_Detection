"""
Pydantic models for request/response schemas and internal DB representation.
"""
from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from uuid import uuid4

from pydantic import BaseModel, Field, ConfigDict


class VerdictEnum(str, Enum):
    REAL = "Real"
    MANIPULATED = "Manipulated (Deepfake)"
    INCONCLUSIVE = "Inconclusive"


class AnalysisStatus(str, Enum):
    SUCCESS = "success"
    ERROR = "error"
    PROCESSING = "processing"


class FrameSyncPoint(BaseModel):
    """A single frame's sync score, used for charting on the frontend."""
    frame_index: int
    score: float


class SecondAnalysisPoint(BaseModel):
    """Detailed breakdown for each second / frame interval."""
    second: int
    timestamp_label: str
    time_start: float
    time_end: float
    sync_score: float
    audio_integrity: float
    visual_consistency: float
    is_suspicious: bool = False
    suspicion_level: str = "Low"  # "Low", "Moderate", "High"
    doubt_reason: str = "Normal audio-visual synchronization."
    frames_count: int = 0


class VideoAnalysisResult(BaseModel):
    """
    The exact response contract for POST /api/video/analyze
    """
    model_config = ConfigDict(use_enum_values=True)

    status: AnalysisStatus = AnalysisStatus.SUCCESS
    verdict: VerdictEnum
    overall_confidence: float = Field(..., ge=0.0, le=100.0, description="Confidence percentage")
    average_offset: int = Field(..., description="Average estimated audio-visual offset (ms)")
    frame_sync_scores: list[float] = Field(
        default_factory=list,
        description="Per-frame sync scores, capped for frontend charting",
    )
    frames_analyzed: int = 0
    duration_seconds: Optional[float] = None
    filename: Optional[str] = None
    analysis_id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Extended Forensic & Multi-Modal Scores
    lip_sync_score: float = 84.0
    audio_integrity_score: float = 95.0
    visual_consistency_score: float = 95.0
    manipulation_risk_score: float = 90.0
    risk_level: str = "Low Risk"
    deep_analysis: list[SecondAnalysisPoint] = Field(
        default_factory=list,
        description="Second-by-second frame deep analysis and suspicion indicators",
    )


class AnalysisRecord(VideoAnalysisResult):
    """
    Extended model persisted to MongoDB (adds storage-only fields).
    Kept separate from the API response model so DB concerns never leak
    into the API contract.
    """
    raw_video_path: Optional[str] = None
    raw_audio_path: Optional[str] = None


class ErrorResponse(BaseModel):
    status: AnalysisStatus = AnalysisStatus.ERROR
    detail: str