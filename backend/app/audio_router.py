from __future__ import annotations

from pathlib import Path

from .audio_utils import float_to_pcm16, load_audio_16k_mono, make_vad_frames
from .config import SAMPLE_RATE, SPEECH_THRESHOLD


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

            if speech_ratio >= self.speech_threshold:
                return {
                    "audio_type": "speech",
                    "selected_model": "speech_wavlm",
                    "speech_ratio": round(speech_ratio, 4),
                    "threshold": self.speech_threshold,
                    "voiced_frames": voiced_frames,
                    "total_frames": total_frames,
                    "reason": "Speech ratio exceeded threshold.",
                }

            return {
                "audio_type": "environmental",
                "selected_model": "environmental_ast",
                "speech_ratio": round(speech_ratio, 4),
                "threshold": self.speech_threshold,
                "voiced_frames": voiced_frames,
                "total_frames": total_frames,
                "reason": "Speech ratio stayed below threshold.",
            }
        except Exception:
            return {
                "audio_type": "environmental",
                "selected_model": "environmental_ast",
                "speech_ratio": 0.0,
                "threshold": self.speech_threshold,
                "voiced_frames": 0,
                "total_frames": 0,
                "reason": "VAD failed or audio too short; defaulted to environmental model.",
            }
