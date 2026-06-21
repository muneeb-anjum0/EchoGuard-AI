from pathlib import Path

APP_NAME = "EchoGuard AI"
SAMPLE_RATE = 16_000
SPEECH_THRESHOLD = 0.30
UNCERTAIN_MARGIN = 0.12
DISPLAY_CONFIDENCE_THRESHOLD = 0.75

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parent
MODEL_ROOT = BACKEND_DIR / "models"
MODEL_ARTIFACT_DIR = MODEL_ROOT / "artifacts"
TEMP_UPLOAD_DIR = BACKEND_DIR / "temp_uploads"

DISCLAIMER = (
    "EchoGuard AI provides probabilistic screening results only. It does not verify, prove, "
    "or certify whether audio is real or fake. Results should not be used as the sole basis "
    "for legal, disciplinary, emergency, or safety-critical decisions."
)

SUPPORTED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".flac", ".ogg", ".m4a"}
