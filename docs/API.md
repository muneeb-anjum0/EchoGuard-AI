# EchoGuard AI API

Base URL:

```text
http://localhost:8000
```

## GET /

Basic service status.

Response:

```json
{
  "app": "EchoGuard AI",
  "status": "running"
}
```

## GET /health

Returns backend and model load status.

Response:

```json
{
  "status": "ok",
  "environmental_model_loaded": true,
  "speech_model_loaded": true
}
```

## GET /models

Returns metadata for both model branches.

Response shape:

```json
{
  "environmental": {
    "name": "AST",
    "artifact": "echoguard_ast_shard001.zip",
    "task": "real vs AI-generated environmental/background audio"
  },
  "speech": {
    "name": "WavLM",
    "artifact": "echoguard_wavlm_speech_shard001.zip",
    "task": "real human speech vs fake/generated speech"
  }
}
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
  "selected_model": "speech_wavlm",
  "prediction": "fake",
  "confidence": 0.94,
  "real_prob": 0.06,
  "fake_prob": 0.94,
  "threshold_used": 0.3,
  "explanation": "Speech was detected in the audio, so the WavLM speech deepfake detector was used.",
  "note": "This is an AI screening result, not forensic proof.",
  "spectrogram_png": "..."
}
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
