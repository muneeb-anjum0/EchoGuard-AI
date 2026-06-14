# EchoGuard AI API

Base URL:

```text
http://localhost:8000
```

## GET /

Basic service status.

```json
{
  "app": "EchoGuard AI",
  "status": "running"
}
```

## GET /health

Returns backend and model load status.

```json
{
  "status": "ok",
  "environmental_model_loaded": true,
  "speech_model_loaded": true
}
```

## GET /models

Returns metadata, metrics, and limitations for both active model branches.

Active artifacts:

```text
echoguard_wavlm_speech_v2_naturalspeech.zip
echoguard_ast_shard001.zip
```

## POST /predict

Runs router-based prediction for an uploaded audio file.

Request:

- Content type: `multipart/form-data`
- Field name: `file`
- Supported formats: `.wav`, `.mp3`, `.flac`, `.ogg`, `.m4a`

Example:

```powershell
curl.exe -X POST -F "file=@sample.wav" http://localhost:8000/predict
```

Response shape:

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
  "model_path": "backend/models/speech_wavlm_v2_naturalspeech/...",
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
  "note": "EchoGuard AI provides probabilistic screening results only...",
  "spectrogram_png": "..."
}
```

Display labels use this rule:

```text
confidence < 0.75 -> Uncertain
prediction real   -> Likely Real
prediction fake   -> Likely AI-Generated
```

## POST /spectrogram

Generates a base64 PNG spectrogram for an uploaded audio file.

Request:

- Content type: `multipart/form-data`
- Field name: `file`

Example:

```powershell
curl.exe -X POST -F "file=@sample.wav" http://localhost:8000/spectrogram
```

Response shape:

```json
{
  "filename": "sample.wav",
  "duration_sec": 4.0,
  "spectrogram_png": "..."
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
