from __future__ import annotations

import logging
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from ..core.model_specs import MODEL_SPECS, public_model_spec
from ..core.settings import APP_NAME, SUPPORTED_AUDIO_EXTENSIONS, TEMP_UPLOAD_DIR
from ..schemas import HealthResponse, PredictionResponse
from ..services.audio_router import AudioRouter
from ..services.inference import InferenceService
from ..services.model_loader import ModelRegistry
from ..utils.audio import load_audio_16k_mono, save_upload_bytes, spectrogram_base64

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=APP_NAME)

# Vite may choose a nearby port if 5173 is busy.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

registry = ModelRegistry()
router = AudioRouter()
inference_service = InferenceService(registry, router)


@app.on_event("startup")
def startup() -> None:
    TEMP_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    registry.load()


@app.get("/")
def root() -> dict:
    return {"app": APP_NAME, "status": "running"}


@app.get("/health", response_model=HealthResponse)
def health() -> dict:
    return {
        "status": "ok",
        "environmental_model_loaded": registry.environmental is not None,
        "speech_model_loaded": registry.speech is not None,
    }


@app.get("/models")
def models() -> dict:
    return {name: public_model_spec(spec) for name, spec in MODEL_SPECS.items()}


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)) -> dict:
    file_path = await _store_upload(file)
    try:
        return inference_service.predict_with_router(
            file_path,
            file.filename or file_path.name,
        )
    finally:
        _remove_temp_file(file_path)


@app.post("/spectrogram")
async def spectrogram(file: UploadFile = File(...)) -> dict:
    file_path = await _store_upload(file)
    try:
        audio, sample_rate, duration = load_audio_16k_mono(file_path)
        return {
            "filename": file.filename,
            "duration_sec": round(duration, 3),
            "spectrogram_png": spectrogram_base64(audio, sample_rate),
        }
    finally:
        _remove_temp_file(file_path)


async def _store_upload(file: UploadFile) -> Path:
    suffix = Path(file.filename or "").suffix.lower()

    if suffix not in SUPPORTED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. Supported types: "
                f"{', '.join(sorted(SUPPORTED_AUDIO_EXTENSIONS))}"
            ),
        )

    data = await file.read()

    if not data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    return save_upload_bytes(TEMP_UPLOAD_DIR / f"{uuid4().hex}{suffix}", data)


def _remove_temp_file(path: Path) -> None:
    try:
        path.unlink(missing_ok=True)
    except Exception:
        logger.warning("Could not remove temp upload %s", path)
