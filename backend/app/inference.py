from __future__ import annotations

from pathlib import Path

import numpy as np

from .audio_router import AudioRouter
from .audio_utils import load_audio_16k_mono, pad_or_trim, spectrogram_base64
from .config import DISCLAIMER, SAMPLE_RATE, SPEECH_THRESHOLD
from .model_loader import ModelRegistry


class InferenceService:
    def __init__(self, registry: ModelRegistry, router: AudioRouter):
        self.registry = registry
        self.router = router

    def predict_with_router(self, file_path: str | Path, filename: str) -> dict:
        audio, sample_rate, duration = load_audio_16k_mono(file_path)
        route = self.router.analyze(file_path)

        if route["selected_model"] == "speech_wavlm":
            result = self.predict_speech(audio, sample_rate)
            explanation = "Speech was detected in the audio, so the WavLM speech deepfake detector was used."
        else:
            result = self.predict_environmental(audio, sample_rate)
            explanation = (
                "The audio was classified as environmental/background audio, "
                "so the AST environmental audio detector was used."
            )

        return {
            "filename": filename,
            "duration_sec": round(duration, 3),
            "audio_type": route["audio_type"],
            "speech_ratio": route["speech_ratio"],
            "selected_model": route["selected_model"],
            "prediction": result["prediction"],
            "confidence": result["confidence"],
            "real_prob": result["real_prob"],
            "fake_prob": result["fake_prob"],
            "threshold_used": SPEECH_THRESHOLD,
            "explanation": explanation,
            "note": DISCLAIMER,
            "spectrogram_png": spectrogram_base64(audio, sample_rate),
        }

    def predict_environmental(self, audio: np.ndarray, sample_rate: int) -> dict:
        if self.registry.environmental is None:
            raise RuntimeError("Environmental model is not loaded")
        prepared = pad_or_trim(audio, seconds=5, sample_rate=sample_rate)
        return self._predict(self.registry.environmental, prepared, sample_rate)

    def predict_speech(self, audio: np.ndarray, sample_rate: int) -> dict:
        if self.registry.speech is None:
            raise RuntimeError("Speech model is not loaded")
        prepared = pad_or_trim(audio, seconds=4, sample_rate=sample_rate)
        return self._predict(self.registry.speech, prepared, sample_rate)

    def _predict(self, loaded_model, audio: np.ndarray, sample_rate: int) -> dict:
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

        real_prob, fake_prob = self._real_fake_probs(probabilities, loaded_model.model.config)
        prediction = "fake" if fake_prob >= real_prob else "real"
        confidence = max(real_prob, fake_prob)
        return {
            "prediction": prediction,
            "confidence": round(float(confidence), 6),
            "real_prob": round(float(real_prob), 6),
            "fake_prob": round(float(fake_prob), 6),
        }

    @staticmethod
    def _real_fake_probs(probabilities: np.ndarray, config) -> tuple[float, float]:
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
