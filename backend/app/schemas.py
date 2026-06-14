from typing import Any

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    environmental_model_loaded: bool
    speech_model_loaded: bool


class PredictionResponse(BaseModel):
    filename: str
    duration_sec: float
    audio_type: str
    speech_ratio: float
    selected_branch: str
    selected_model: str
    model_name: str
    model_version: str
    model_artifact: str
    model_path: str
    prediction: str
    display_label: str
    confidence: float
    real_probability: float
    fake_probability: float
    real_prob: float
    fake_prob: float
    threshold_used: float
    router_decision: str
    router_explanation: str
    explanation: str
    metrics: dict[str, Any]
    limitations: list[str]
    key_limitation: str
    note: str
    spectrogram_png: str | None = None
