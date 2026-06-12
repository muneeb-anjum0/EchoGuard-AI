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
    selected_model: str
    prediction: str
    confidence: float
    real_prob: float
    fake_prob: float
    threshold_used: float
    explanation: str
    note: str
    spectrogram_png: str | None = None

