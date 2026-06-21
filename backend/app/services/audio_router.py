from __future__ import annotations

from pathlib import Path

from ..core.model_specs import ENVIRONMENTAL_MODEL, SPEECH_MODEL
from ..core.settings import SAMPLE_RATE, SPEECH_THRESHOLD, UNCERTAIN_MARGIN
from ..utils.audio import float_to_pcm16, load_audio_16k_mono, make_vad_frames

FALLBACK_ROUTE = {
    "audio_type": "environmental",
    "selected_branch": "environmental",
    "selected_model": ENVIRONMENTAL_MODEL["selected_model"],
    "router_decision": "uncertain/mixed",
    "router_explanation": (
        "Router could not confidently measure speech content, so the safer default "
        "environmental branch was used."
    ),
    "speech_ratio": 0.0,
    "voiced_frames": 0,
    "total_frames": 0,
    "reason": "VAD failed or audio too short; defaulted to environmental model.",
}


class AudioRouter:
    def __init__(self, speech_threshold: float = SPEECH_THRESHOLD, vad_aggressiveness: int = 2):
        self.speech_threshold = speech_threshold
        self.vad_aggressiveness = vad_aggressiveness
        try:
            import webrtcvad

            self.vad = webrtcvad.Vad(vad_aggressiveness)
            self.available = True
        except Exception:
            self.vad = None
            self.available = False

    def analyze(self, file_path: str | Path) -> dict:
        try:
            if not self.available or self.vad is None:
                raise RuntimeError("WebRTC VAD is unavailable")
            audio, sample_rate, _ = load_audio_16k_mono(file_path)
            frames = make_vad_frames(float_to_pcm16(audio), sample_rate=SAMPLE_RATE, frame_ms=30)
            if not frames:
                raise ValueError("Audio is too short for VAD frames")

            voiced_frames = sum(1 for frame in frames if self.vad.is_speech(frame, sample_rate))
            total_frames = len(frames)
            speech_ratio = voiced_frames / total_frames

            branch = "speech" if speech_ratio >= self.speech_threshold else "environmental"
            spec = SPEECH_MODEL if branch == "speech" else ENVIRONMENTAL_MODEL
            decision = self._decision_label(speech_ratio)
            explanation = self._explain(decision, branch)
            return {
                "audio_type": branch,
                "selected_branch": branch,
                "selected_model": spec["selected_model"],
                "router_decision": decision,
                "router_explanation": explanation,
                "speech_ratio": round(speech_ratio, 4),
                "threshold": self.speech_threshold,
                "voiced_frames": voiced_frames,
                "total_frames": total_frames,
                "reason": explanation,
            }
        except Exception:
            return {**FALLBACK_ROUTE, "threshold": self.speech_threshold}

    def _decision_label(self, speech_ratio: float) -> str:
        if abs(speech_ratio - self.speech_threshold) <= UNCERTAIN_MARGIN:
            return "uncertain/mixed"
        if speech_ratio >= self.speech_threshold:
            return "speech"
        return "environmental"

    @staticmethod
    def _explain(decision: str, branch: str) -> str:
        if decision == "speech":
            return "Speech-like audio detected, routed to WavLM speech authenticity model."
        if decision == "environmental":
            return "Mostly environmental/background audio detected, routed to AST EnvSDD model."
        if branch == "speech":
            return "Mixed or borderline speech content detected; WavLM speech branch was selected."
        return "Mixed or borderline speech content detected; AST environmental branch was selected."
