from __future__ import annotations

from pathlib import Path
from typing import Any

import numpy as np

from .audio_router import AudioRouter
from .audio_utils import load_audio_16k_mono, pad_or_trim, spectrogram_base64
from .config import DISCLAIMER, DISPLAY_CONFIDENCE_THRESHOLD, ENVIRONMENTAL_MODEL, PROJECT_ROOT, SPEECH_MODEL
from .model_loader import LoadedAudioModel, ModelRegistry


class InferenceService:
    def __init__(self, registry: ModelRegistry, router: AudioRouter):
        self.registry = registry
        self.router = router

    def predict_with_router(self, file_path: str | Path, filename: str) -> dict:
        audio, sample_rate, duration = load_audio_16k_mono(file_path)
        route = self.router.analyze(file_path)

        if route["selected_branch"] == "speech":
            loaded_model = self._require_speech()
        else:
            loaded_model = self._require_environmental()

        prepared = pad_or_trim(
            audio,
            seconds=float(loaded_model.spec["seconds"]),
            sample_rate=sample_rate,
        )
        result = self._predict(loaded_model, prepared, sample_rate)
        display_label = display_label_for(result["prediction"], result["confidence"])

        return {
            "filename": filename,
            "duration_sec": round(duration, 3),
            "audio_type": route["audio_type"],
            "speech_ratio": route["speech_ratio"],
            "threshold_used": route["threshold"],
            "selected_branch": loaded_model.spec["branch"],
            "selected_model": loaded_model.spec["selected_model"],
            "model_name": loaded_model.spec["name"],
            "model_version": loaded_model.spec["version"],
            "model_artifact": loaded_model.spec["artifact"],
            "model_path": str(loaded_model.model_dir.relative_to(PROJECT_ROOT)),
            "prediction": result["prediction"],
            "display_label": display_label,
            "confidence": result["confidence"],
            "real_probability": result["real_probability"],
            "fake_probability": result["fake_probability"],
            "real_prob": result["real_probability"],
            "fake_prob": result["fake_probability"],
            "router_decision": route["router_decision"],
            "router_explanation": route["router_explanation"],
            "explanation": route["router_explanation"],
            "metrics": loaded_model.spec["metrics"],
            "limitations": loaded_model.spec["limitations"],
            "key_limitation": loaded_model.spec["limitations"][0],
            "note": DISCLAIMER,
            "spectrogram_png": spectrogram_base64(audio, sample_rate),
        }

    def _require_environmental(self) -> LoadedAudioModel:
        if self.registry.environmental is None:
            raise RuntimeError("Environmental model is not loaded")
        return self.registry.environmental

    def _require_speech(self) -> LoadedAudioModel:
        if self.registry.speech is None:
            raise RuntimeError("Speech model is not loaded")
        return self.registry.speech

    def _predict(self, loaded_model: LoadedAudioModel, audio: np.ndarray, sample_rate: int) -> dict:
        import torch

        if self.registry.device is None:
            raise RuntimeError("Model registry is not loaded")
        inputs = loaded_model.feature_extractor(
            audio,
            sampling_rate=sample_rate,
            return_tensors="pt",
            padding=True,
        )
        inputs = {key: value.to(self.registry.device) for key, value in inputs.items()}
        with torch.no_grad():
            logits = loaded_model.model(**inputs).logits
            probabilities = torch.softmax(logits, dim=-1).detach().cpu().numpy()[0]

        real_prob, fake_prob = real_fake_probs(probabilities, loaded_model.model.config)
        prediction = "fake" if fake_prob >= real_prob else "real"
        confidence = max(real_prob, fake_prob)
        return {
            "prediction": prediction,
            "confidence": round(float(confidence), 6),
            "real_probability": round(float(real_prob), 6),
            "fake_probability": round(float(fake_prob), 6),
        }


def display_label_for(prediction: str, confidence: float) -> str:
    if confidence < DISPLAY_CONFIDENCE_THRESHOLD:
        return "Uncertain"
    if prediction == "real":
        return "Likely Real"
    if prediction == "fake":
        return "Likely AI-Generated"
    return "Uncertain"


def real_fake_probs(probabilities: np.ndarray, config: Any) -> tuple[float, float]:
    id2label = getattr(config, "id2label", {}) or {}
    real_index = 0
    fake_index = 1 if len(probabilities) > 1 else 0
    for raw_index, label in id2label.items():
        normalized = str(label).lower()
        index = int(raw_index)
        if "real" in normalized:
            real_index = index
        if "fake" in normalized or "spoof" in normalized or "generated" in normalized:
            fake_index = index
    return float(probabilities[real_index]), float(probabilities[fake_index])


ACTIVE_MODEL_SPECS = {
    "speech": SPEECH_MODEL,
    "environmental": ENVIRONMENTAL_MODEL,
}
