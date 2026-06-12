from pathlib import Path


APP_NAME = "EchoGuard AI"
SAMPLE_RATE = 16_000
SPEECH_THRESHOLD = 0.30

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parent
MODEL_ROOT = BACKEND_DIR / "models"
TEMP_UPLOAD_DIR = BACKEND_DIR / "temp_uploads"

ENVIRONMENTAL_MODEL = {
    "key": "environmental",
    "name": "EnvSDD AST",
    "selected_model": "environmental_ast",
    "artifact": "echoguard_ast_shard001.zip",
    "target_dir": MODEL_ROOT / "environmental_ast",
    "task": "real vs AI-generated environmental/background audio",
    "description": "AST fine-tuned on EnvSDD for environmental/background audio fake detection.",
}

SPEECH_MODEL = {
    "key": "speech",
    "name": "FoR WavLM Speech",
    "selected_model": "speech_wavlm",
    "artifact": "echoguard_wavlm_speech_shard001.zip",
    "target_dir": MODEL_ROOT / "speech_wavlm",
    "task": "real human speech vs fake/generated speech",
    "description": "WavLM fine-tuned on FoR for real vs fake human speech detection.",
}

SUPPORTED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".flac", ".ogg", ".m4a"}
DISCLAIMER = "This is an AI screening result, not forensic proof."

