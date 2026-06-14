from pathlib import Path


APP_NAME = "EchoGuard AI"
SAMPLE_RATE = 16_000
SPEECH_THRESHOLD = 0.30
UNCERTAIN_MARGIN = 0.12
DISPLAY_CONFIDENCE_THRESHOLD = 0.75

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parent
MODEL_ROOT = BACKEND_DIR / "models"
TEMP_UPLOAD_DIR = BACKEND_DIR / "temp_uploads"

DISCLAIMER = (
    "EchoGuard AI provides probabilistic screening results only. It does not verify, prove, "
    "or certify whether audio is real or fake. Results should not be used as the sole basis "
    "for legal, disciplinary, emergency, or safety-critical decisions."
)

SPEECH_MODEL = {
    "key": "speech",
    "branch": "speech",
    "name": "EchoGuard WavLM Speech v2 NaturalSpeech",
    "version": "speech_v2_naturalspeech",
    "base": "microsoft/wavlm-base",
    "selected_model": "echoguard_wavlm_speech_v2_naturalspeech",
    "artifact": "echoguard_wavlm_speech_v2_naturalspeech.zip",
    "target_dir": MODEL_ROOT / "speech_wavlm_v2_naturalspeech",
    "seconds": 4,
    "task": "real human speech vs fake/generated speech",
    "description": (
        "WavLM speech branch tuned for native English speech and modern synthetic voice samples."
    ),
    "metrics": {
        "training": {
            "train_clips": 2114,
            "train_real": 1057,
            "train_fake": 1057,
            "validation_clips": 372,
            "validation_real": 186,
            "validation_fake": 186,
            "audio_format": "4 seconds, 16 kHz, mono, 16-bit WAV",
        },
        "full_unseen_test": {
            "clips": 344,
            "real": 172,
            "fake": 172,
            "accuracy": 0.8169,
            "f1": 0.7864,
            "precision": 0.9431,
            "recall": 0.6744,
            "confusion_matrix": [[165, 7], [56, 116]],
            "interpretation": (
                "The model performed well on real unseen audio but missed one difficult unseen "
                "fake source that closely resembled real human speech."
            ),
        },
        "filtered_unseen_test": {
            "clips": 287,
            "real": 172,
            "fake": 115,
            "accuracy": 0.9756,
            "f1": 0.9705,
            "precision": 0.9426,
            "recall": 1.0,
            "confusion_matrix": [[165, 7], [0, 115]],
            "interpretation": (
                "The model performed strongly on unseen real speech and two unseen synthetic "
                "voice sources, while one difficult synthetic source remains a known limitation."
            ),
        },
    },
    "limitations": [
        "Tuned for native English speaker audio and modern AI-generated voice samples.",
        (
            "One hard unseen synthetic voice source closely resembled real speech and reduced "
            "full unseen-test performance."
        ),
        "Not forensic proof.",
    ],
}

ENVIRONMENTAL_MODEL = {
    "key": "environmental",
    "branch": "environmental",
    "name": "EchoGuard AST EnvSDD Environmental Audio Model",
    "version": "environmental_ast_envsdd",
    "base": "MIT/ast-finetuned-audioset-10-10-0.4593",
    "dataset": "EnvSDD Environmental Sound Deepfake Detection",
    "selected_model": "echoguard_ast_shard001",
    "artifact": "echoguard_ast_shard001.zip",
    "target_dir": MODEL_ROOT / "environmental_ast_envsdd",
    "seconds": 5,
    "task": "real vs AI-generated environmental/background audio",
    "description": "AST branch trained for general environmental/background audio authenticity screening.",
    "metrics": {
        "training": {
            "dataset": "Balanced EnvSDD shard 001",
            "clips": 10000,
            "real": 5000,
            "fake": 5000,
            "audio_format": "4 second environmental/background clips",
        },
        "shard_001_validation": [
            {"epoch": 1, "accuracy": 0.987, "f1": 0.9869},
            {"epoch": 2, "accuracy": 0.9945, "f1": 0.9945},
            {"epoch": 3, "accuracy": 0.996, "f1": 0.996},
            {"epoch": 4, "accuracy": 0.998, "f1": 0.998},
            {"epoch": 5, "accuracy": 0.997, "f1": 0.997},
        ],
        "cross_shard": {
            "shard_002_validation": {
                "accuracy": 0.998,
                "f1": 0.998,
                "precision": 0.996,
                "recall": 1.0,
                "confusion_matrix": [[996, 4], [0, 1000]],
            },
            "shard_007_validation": {
                "accuracy": 0.9985,
                "f1": 0.9985,
                "precision": 0.999,
                "recall": 0.998,
                "confusion_matrix": [[999, 1], [2, 998]],
            },
            "shard_003_full_test": {
                "samples": 10000,
                "accuracy": 0.9978,
                "f1": 0.9978,
                "precision": 0.997,
                "recall": 0.9986,
                "wrong_predictions": 22,
                "confusion_matrix": [[4985, 15], [7, 4993]],
            },
            "shard_006_full_test": {
                "samples": 10000,
                "accuracy": 0.9971,
                "f1": 0.9971,
                "precision": 0.9962,
                "recall": 0.998,
                "wrong_predictions": 29,
                "confusion_matrix": [[4981, 19], [10, 4990]],
            },
        },
    },
    "limitations": [
        "For general environmental/background audio such as ambience, urban sounds, crowds, and traffic.",
        (
            "Should not be used as proof for legal, emergency, military, accident, crisis, "
            "CCTV, or safety-critical audio verification."
        ),
        "Not forensic proof.",
    ],
}

SUPPORTED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".flac", ".ogg", ".m4a"}
