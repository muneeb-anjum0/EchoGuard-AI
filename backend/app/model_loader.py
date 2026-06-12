from __future__ import annotations

import logging
import zipfile
from dataclasses import dataclass
from pathlib import Path

from .config import ENVIRONMENTAL_MODEL, MODEL_ROOT, PROJECT_ROOT, SPEECH_MODEL

logger = logging.getLogger(__name__)


@dataclass
class LoadedAudioModel:
    key: str
    model_dir: Path
    feature_extractor: object
    model: object


class ModelRegistry:
    def __init__(self) -> None:
        self.device = None
        self.environmental: LoadedAudioModel | None = None
        self.speech: LoadedAudioModel | None = None

    def load(self) -> None:
        import torch

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        MODEL_ROOT.mkdir(parents=True, exist_ok=True)
        self.environmental = self._load_one(ENVIRONMENTAL_MODEL)
        self.speech = self._load_one(SPEECH_MODEL)

    def _load_one(self, spec: dict) -> LoadedAudioModel:
        from transformers import AutoFeatureExtractor, AutoModelForAudioClassification

        if self.device is None:
            raise RuntimeError("Model device is not initialized")
        model_dir = resolve_or_extract_model(spec["artifact"], spec["target_dir"])
        logger.info("Resolved %s model at %s", spec["key"], model_dir)
        extractor = AutoFeatureExtractor.from_pretrained(str(model_dir), local_files_only=True)
        model = AutoModelForAudioClassification.from_pretrained(str(model_dir), local_files_only=True)
        model.to(self.device)
        model.eval()
        return LoadedAudioModel(spec["key"], model_dir, extractor, model)


def resolve_or_extract_model(artifact_name: str, target_dir: Path) -> Path:
    existing = find_hf_model_dir(target_dir)
    if existing:
        return existing

    artifact_path = PROJECT_ROOT / artifact_name
    if not artifact_path.exists():
        raise FileNotFoundError(f"Missing model artifact: {artifact_path}")

    target_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(artifact_path) as archive:
        archive.extractall(target_dir)

    extracted = find_hf_model_dir(target_dir)
    if not extracted:
        raise FileNotFoundError(
            f"Could not find config.json, model.safetensors, and preprocessor_config.json inside {artifact_name}"
        )
    return extracted


def find_hf_model_dir(root: Path) -> Path | None:
    if not root.exists():
        return None
    required = {"config.json", "model.safetensors", "preprocessor_config.json"}
    for path in [root, *root.rglob("*")]:
        if path.is_dir() and required.issubset({child.name for child in path.iterdir()}):
            return path
    return None
