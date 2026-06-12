from __future__ import annotations

import base64
import io
from pathlib import Path

import librosa
import librosa.display
import matplotlib
import numpy as np
import soundfile as sf

from .config import SAMPLE_RATE

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402


def load_audio_16k_mono(file_path: str | Path) -> tuple[np.ndarray, int, float]:
    audio, sample_rate = librosa.load(str(file_path), sr=SAMPLE_RATE, mono=True)
    audio = np.asarray(audio, dtype=np.float32)
    audio = normalize_audio(audio)
    duration = float(len(audio) / SAMPLE_RATE) if len(audio) else 0.0
    return audio, SAMPLE_RATE, duration


def normalize_audio(audio: np.ndarray) -> np.ndarray:
    if audio.size == 0:
        return audio.astype(np.float32)
    audio = np.nan_to_num(audio.astype(np.float32), nan=0.0, posinf=0.0, neginf=0.0)
    peak = float(np.max(np.abs(audio)))
    if peak > 1.0:
        audio = audio / peak
    return np.clip(audio, -1.0, 1.0).astype(np.float32)


def pad_or_trim(audio: np.ndarray, seconds: float, sample_rate: int = SAMPLE_RATE) -> np.ndarray:
    target_samples = max(1, int(seconds * sample_rate))
    if len(audio) >= target_samples:
        return audio[:target_samples].astype(np.float32)
    return np.pad(audio, (0, target_samples - len(audio)), mode="constant").astype(np.float32)


def float_to_pcm16(audio: np.ndarray) -> bytes:
    clipped = np.clip(np.nan_to_num(audio), -1.0, 1.0)
    pcm = (clipped * 32767.0).astype(np.int16)
    return pcm.tobytes()


def make_vad_frames(pcm_bytes: bytes, sample_rate: int = SAMPLE_RATE, frame_ms: int = 30) -> list[bytes]:
    if frame_ms not in {10, 20, 30}:
        raise ValueError("frame_ms must be 10, 20, or 30 for WebRTC VAD")
    bytes_per_sample = 2
    frame_size = int(sample_rate * frame_ms / 1000) * bytes_per_sample
    return [
        pcm_bytes[index : index + frame_size]
        for index in range(0, len(pcm_bytes) - frame_size + 1, frame_size)
    ]


def save_upload_bytes(destination: Path, data: bytes) -> Path:
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(data)
    return destination


def write_wav_copy(file_path: Path, audio: np.ndarray, sample_rate: int = SAMPLE_RATE) -> Path:
    wav_path = file_path.with_suffix(".wav")
    sf.write(wav_path, audio, sample_rate)
    return wav_path


def spectrogram_base64(audio: np.ndarray, sample_rate: int = SAMPLE_RATE) -> str:
    if audio.size == 0:
        audio = np.zeros(sample_rate, dtype=np.float32)

    fig, ax = plt.subplots(figsize=(8, 3), dpi=160)
    spectrogram = librosa.amplitude_to_db(
        np.abs(librosa.stft(audio, n_fft=1024, hop_length=256)),
        ref=np.max,
    )
    img = librosa.display.specshow(
        spectrogram,
        sr=sample_rate,
        hop_length=256,
        x_axis="time",
        y_axis="log",
        cmap="magma",
        ax=ax,
    )
    ax.set_xlabel("")
    ax.set_ylabel("")
    ax.set_title("")
    ax.tick_params(colors="#9ca3af", labelsize=7)
    for spine in ax.spines.values():
        spine.set_visible(False)
    fig.colorbar(img, ax=ax, format="%+2.0f dB")
    fig.patch.set_facecolor("#0b1020")
    ax.set_facecolor("#0b1020")
    fig.tight_layout(pad=0.35)

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    return base64.b64encode(buffer.getvalue()).decode("ascii")
