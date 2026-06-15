# EchoGuard AI API Reference

Base URL:

```text
http://localhost:8000
```

The API is served by FastAPI. Uploaded audio is processed locally after the active model artifacts are available.

## Supported Upload Formats

- WAV
- MP3
- FLAC
- OGG
- M4A

## GET `/`

Basic service status.

Example:

```powershell
curl.exe http://localhost:8000/
```

Response:

```json
{
  "app": "EchoGuard AI",
  "status": "running"
}
```

## GET `/health`

Returns backend and model load status.

Example:

```powershell
curl.exe http://localhost:8000/health
```

Response:

```json
{
  "status": "ok",
  "environmental_model_loaded": true,
  "speech_model_loaded": true
}
```

## GET `/models`

Returns metadata, metrics, and limitations for both active model branches.

Example:

```powershell
curl.exe http://localhost:8000/models
```

Response excerpt:

```json
{
  "environmental": {
    "name": "EchoGuard AST EnvSDD Environmental Audio Model",
    "version": "ast_envsdd_shard001",
    "artifact": "echoguard_ast_shard001.zip",
    "task": "Likely real environmental audio vs likely AI-generated environmental audio",
    "metrics": {},
    "limitations": []
  },
  "speech": {
    "name": "EchoGuard WavLM Speech v2 NaturalSpeech",
    "version": "speech_v2_naturalspeech",
    "artifact": "echoguard_wavlm_speech_v2_naturalspeech.zip",
    "task": "Likely real human speech vs likely AI-generated speech",
    "metrics": {},
    "limitations": []
  }
}
```

## POST `/predict`

Runs router-based prediction for an uploaded audio file.

Request:

- Content type: `multipart/form-data`
- Field name: `file`
- Supported formats: `.wav`, `.mp3`, `.flac`, `.ogg`, `.m4a`

Example:

```powershell
curl.exe -X POST -F "file=@sample.wav" http://localhost:8000/predict
```

Response fields:

- `filename`
- `duration_sec`
- `audio_type`
- `speech_ratio`
- `threshold_used`
- `selected_branch`
- `selected_model`
- `model_name`
- `model_version`
- `model_artifact`
- `prediction`
- `display_label`
- `confidence`
- `real_probability`
- `fake_probability`
- `router_decision`
- `router_explanation`
- `explanation`
- `metrics`
- `limitations`
- `key_limitation`
- `note`
- `spectrogram_png`

The backend also includes compatibility aliases such as `real_prob`, `fake_prob`, and `model_path`.

Response example:

```json
{
  "filename": "sample.wav",
  "duration_sec": 4.0,
  "audio_type": "speech",
  "speech_ratio": 0.82,
  "threshold_used": 0.3,
  "selected_branch": "speech",
  "selected_model": "echoguard_wavlm_speech_v2_naturalspeech",
  "model_name": "EchoGuard WavLM Speech v2 NaturalSpeech",
  "model_version": "speech_v2_naturalspeech",
  "model_artifact": "echoguard_wavlm_speech_v2_naturalspeech.zip",
  "model_path": "backend/models/speech_wavlm_v2_naturalspeech",
  "prediction": "fake",
  "display_label": "Likely AI-Generated",
  "confidence": 0.94,
  "real_probability": 0.06,
  "fake_probability": 0.94,
  "real_prob": 0.06,
  "fake_prob": 0.94,
  "router_decision": "speech",
  "router_explanation": "Speech-like audio detected, routed to WavLM speech authenticity model.",
  "explanation": "Speech-like audio detected, routed to WavLM speech authenticity model.",
  "metrics": {},
  "limitations": [],
  "key_limitation": "Tuned for native English speaker audio and modern AI-generated voice samples.",
  "note": "EchoGuard AI provides probabilistic screening results only.",
  "spectrogram_png": "base64-png-data"
}
```

Display label rule:

```text
confidence < 0.75 -> Uncertain
prediction real   -> Likely Real
prediction fake   -> Likely AI-Generated
```

## POST `/spectrogram`

Generates a base64 PNG spectrogram for an uploaded audio file.

Request:

- Content type: `multipart/form-data`
- Field name: `file`

Example:

```powershell
curl.exe -X POST -F "file=@sample.wav" http://localhost:8000/spectrogram
```

Response:

```json
{
  "filename": "sample.wav",
  "duration_sec": 4.0,
  "spectrogram_png": "base64-png-data"
}
```

## Error Responses

Unsupported file type:

```json
{
  "detail": "Unsupported file type. Supported types: .flac, .m4a, .mp3, .ogg, .wav"
}
```

Empty upload:

```json
{
  "detail": "Uploaded file is empty"
}
```

Missing model artifact at backend startup:

```text
FileNotFoundError: Missing model artifact: .../echoguard_wavlm_speech_v2_naturalspeech.zip
```

## Related Docs

- [Model Notes](MODEL_NOTES.md)
- [Metrics](METRICS.md)

Back to [README](../README.md).
