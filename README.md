# EchoGuard AI

![Local inference](https://img.shields.io/badge/inference-local-60A5FA)
![Backend](https://img.shields.io/badge/backend-FastAPI-60A5FA)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-60A5FA)

EchoGuard AI is a local audio authenticity screening web app. It accepts speech or environmental audio, routes the clip to the matching model branch, and returns a probabilistic result with routing details, model metadata, limitations, and a spectrogram view.

EchoGuard AI provides probabilistic screening results only. It does not prove whether audio is real or fake, and it should not be used as the sole basis for legal, disciplinary, emergency, or safety-critical decisions.

## What the app does

- Upload WAV, MP3, FLAC, OGG, or M4A audio
- Route speech-heavy clips to WavLM and environmental clips to AST
- Return real/fake probabilities and a human-friendly display label
- Show the selected branch, model version, router explanation, and model limits
- Render a spectrogram/frequency-time view for the uploaded clip
- Run fully locally once the model artifacts are available

## Tech stack

### Frontend

- React 19
- TypeScript
- Vite
- Lucide React
- Tailwind/PostCSS available in the toolchain, with the current UI organized through split CSS files in `frontend/src/styles/`

### Backend

- FastAPI
- Uvicorn
- PyTorch
- Hugging Face Transformers
- librosa
- matplotlib
- WebRTC VAD

## Project structure

```text
EchoGuardAi-App/
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |-- core/
|   |   |-- services/
|   |   |-- utils/
|   |   `-- router_probe.py
|   |-- models/
|   |   `-- artifacts/
|   |-- temp_uploads/
|   |-- requirements.txt
|   `-- start-backend.ps1
|-- docs/
|   |-- api-reference.md
|   |-- model-architecture.md
|   `-- model-metrics.md
|-- frontend/
|   |-- public/
|   |   `-- echoguard-favicon.svg
|   |-- src/
|   |   |-- app/
|   |   |-- content/
|   |   |-- features/
|   |   |   |-- analysis/
|   |   |   `-- home/
|   |   |-- layout/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- styles/
|   |-- package.json
|   `-- vite.config.ts
|-- scripts/
|   `-- start-dev.ps1
|-- README.md
|-- .gitignore
`-- sample.env.example
```

## Active model artifacts

Place the active ZIP files in `backend/models/artifacts/`.

| Branch | Artifact |
| --- | --- |
| Speech | `echoguard_wavlm_speech_v2_naturalspeech.zip` |
| Environmental | `echoguard_ast_shard001.zip` |

On backend startup, the loader extracts each artifact into `backend/models/` only when the expected Hugging Face model files are not already present.

## Quick start

### Prerequisites

- Python 3.11
- Node.js
- The active model ZIP files in `backend/models/artifacts/`

### Start the backend

```powershell
cd backend
.\start-backend.ps1
```

Manual equivalent:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn app.api.main:app --reload --host 0.0.0.0 --port 8000
```

### Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

### Start both

```powershell
.\scripts\start-dev.ps1
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

## How it works

```text
upload -> normalize -> speech-ratio router -> speech or environmental model -> probabilities -> display label + spectrogram
```

The router measures speech content with WebRTC VAD. Clips at or above the speech threshold route to the WavLM speech branch. Clips below the threshold route to the AST environmental branch.

Display label rule:

```text
confidence < 0.75 -> Uncertain
prediction real   -> Likely Real
prediction fake   -> Likely AI-Generated
```

## Main app areas

### Frontend

- `frontend/src/app/` - app composition and page state
- `frontend/src/features/analysis/` - upload, result, probabilities, spectrogram section
- `frontend/src/features/home/` - hero, router explainer, model stack, FAQ/limitations
- `frontend/src/layout/` - navbar, footer, background
- `frontend/src/content/` - shared static content
- `frontend/src/services/` - API client
- `frontend/src/styles/` - split global styling

### Backend

- `backend/app/api/` - FastAPI entrypoint and HTTP routes
- `backend/app/core/` - settings and model metadata
- `backend/app/services/` - routing, inference, model loading
- `backend/app/utils/` - audio loading, normalization, spectrogram helpers

## Metrics snapshot

### Speech branch

| Evaluation | Clips | Accuracy | F1 | Precision | Recall |
| --- | ---: | ---: | ---: | ---: | ---: |
| Full unseen test | 344 | 81.69% | 78.64% | 94.31% | 67.44% |
| Filtered unseen test | 287 | 97.56% | 97.05% | 94.26% | 100% |

### Environmental branch

| Evaluation | Samples | Accuracy | F1 | Precision | Recall |
| --- | ---: | ---: | ---: | ---: | ---: |
| Shard 002 validation | 2,000 | 99.80% | 99.80% | 99.60% | 100% |
| Shard 007 validation | 2,000 | 99.85% | 99.85% | 99.90% | 99.80% |
| Shard 003 full test | 10,000 | 99.78% | 99.78% | 99.70% | 99.86% |
| Shard 006 full test | 10,000 | 99.71% | 99.71% | 99.62% | 99.80% |

For the full details, see the docs below.

## Documentation

- [API reference](docs/api-reference.md)
- [Model architecture](docs/model-architecture.md)
- [Model metrics](docs/model-metrics.md)

## Notes

- GPU helps, but short clips can still run on CPU
- Speech performance is strongest for native English and sources similar to the curated NaturalSpeech-v2 set
- Environmental results should be interpreted only within environmental/background audio use cases
