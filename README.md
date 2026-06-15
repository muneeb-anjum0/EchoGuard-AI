# EchoGuard AI

![Local inference](https://img.shields.io/badge/inference-local-60A5FA)
![Backend](https://img.shields.io/badge/backend-FastAPI-60A5FA)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-60A5FA)

EchoGuard AI is a two-branch audio authenticity screening app for speech and environmental/background audio. It uses local ML models, not external AI APIs, to estimate whether an uploaded clip is likely real or likely AI-generated. The app returns probability-based output with router details, model information, limitations, metrics, and a frequency-time spectrogram view.

<span style="color:#60A5FA"><strong>EchoGuard AI provides probabilistic screening results only.</strong></span> It does not verify, prove, or certify whether audio is real or fake. Results should not be used as the sole basis for legal, disciplinary, emergency, or safety-critical decisions.

## Core Features

- Upload WAV, MP3, FLAC, OGG, and M4A audio.
- Automatic speech/environmental routing using a speech-ratio router.
- Speech branch using WavLM Speech v2 NaturalSpeech.
- Environmental branch using AST EnvSDD.
- Real/fake probability output with raw probabilities kept visible.
- Display labels: Likely Real, Likely AI-Generated, or Uncertain.
- Router decision, explanation, active model details, and model metrics in the UI.
- Frequency-time spectrogram view after analysis.
- Fully local model inference after setup.

## Active Local Models

Place both ZIP files in the project root:

| Branch | Active artifact |
| --- | --- |
| Speech | `echoguard_wavlm_speech_v2_naturalspeech.zip` |
| Environmental | `echoguard_ast_shard001.zip` |

The backend extracts and loads these artifacts automatically into `backend/models/`. ZIP files, extracted model folders, `.safetensors` files, temporary uploads, virtual environments, and frontend builds are ignored by Git.

Large model artifacts can be hosted externally, for example on Kaggle. Do not commit model ZIPs or `.safetensors` files to GitHub.

## Quick Start

### Prerequisites

- Python 3.11 recommended
- Node.js for the frontend
- Active model ZIP files placed in the project root

### Run Backend

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Run Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

### Run Both

```powershell
.\scripts\run_all.ps1
```

Backend: `http://localhost:8000`

Frontend: `http://localhost:5173`

## Project Structure

```text
EchoGuardAi-App/
|-- backend/
|   |-- app/
|   |-- models/
|   |-- temp_uploads/
|   |-- requirements.txt
|   `-- run_backend.ps1
|-- frontend/
|   |-- public/
|   |-- src/
|   |-- package.json
|   `-- vite.config.ts
|-- docs/
|   |-- API.md
|   |-- METRICS.md
|   `-- MODEL_NOTES.md
|-- scripts/
|   `-- run_all.ps1
|-- README.md
|-- .gitignore
`-- sample.env.example
```

## How It Works

```text
Input -> Sanitize -> Router -> Speech/Environmental branch -> Processing -> Output
```

Audio is loaded, converted to 16 kHz mono, and normalized for model input. The router estimates speech ratio with a threshold of `0.30`: speech-heavy clips route to WavLM Speech v2, while mostly environmental/background clips route to AST EnvSDD. The output includes real/fake probabilities, the selected branch, a final display label, limitations, and a spectrogram image.

Display rule:

```text
confidence < 0.75 -> Uncertain
prediction real   -> Likely Real
prediction fake   -> Likely AI-Generated
```

## Model Coverage & Evaluation

README keeps this section short on purpose. See [docs/METRICS.md](docs/METRICS.md) for full split tables, metric tables, confusion matrices, and interpretation notes.

### Speech Branch Summary

- Model: EchoGuard WavLM Speech v2 NaturalSpeech
- Artifact: `echoguard_wavlm_speech_v2_naturalspeech.zip`
- Base: `microsoft/wavlm-base`
- Format: 4 seconds, 16 kHz, mono, 16-bit WAV
- Training focus: native English speaker audio and modern AI-generated voice styles, including ElevenLabs, ChatGPT/OpenAI-style voices, Claude-style generated speech, and similar new-generation synthetic speech sources.

Headline metrics:

| Evaluation | Clips | Accuracy | F1 | Precision | Recall |
| --- | ---: | ---: | ---: | ---: | ---: |
| Full unseen test | 344 | 81.69% | 78.64% | 94.31% | 67.44% |
| Filtered unseen test | 287 | 97.56% | 97.05% | 94.26% | 100% |

The full unseen result is the honest main speech result. The filtered unseen result is diagnostic and shows that one hard synthetic source caused most of the missed fake clips.

### Environmental Branch Summary

- Model: EchoGuard AST EnvSDD Environmental Audio Model
- Artifact: `echoguard_ast_shard001.zip`
- Base: `MIT/ast-finetuned-audioset-10-10-0.4593`
- Dataset: EnvSDD Environmental Sound Deepfake Detection
- Training shard: 10,000 clips total, 5,000 real and 5,000 fake.

Headline metrics:

| Evaluation | Samples | Accuracy | F1 | Precision | Recall |
| --- | ---: | ---: | ---: | ---: | ---: |
| Shard 001 best validation | 2,000 | 99.80% | 99.80% | - | - |
| Shard 002 validation | 2,000 | 99.80% | 99.80% | 99.60% | 100% |
| Shard 007 validation | 2,000 | 99.85% | 99.85% | 99.90% | 99.80% |
| Shard 003 full test | 10,000 | 99.78% | 99.78% | 99.70% | 99.86% |
| Shard 006 full test | 10,000 | 99.71% | 99.71% | 99.62% | 99.80% |

## Limitations

- Speech branch is strongest for native English speaker audio and sources similar to the curated NaturalSpeech-v2 data.
- One hard unseen synthetic voice source closely resembled real speech and reduced full unseen performance.
- Environmental branch is for general environmental/background audio only.
- Not for legal evidence, emergency response, military/security claims, accident verification, war/crisis footage, CCTV proof, gunshots, explosions, or safety-critical decisions.
- Music, overlapping speakers, heavy noise, heavily compressed audio, very long clips, mixed speech/background audio, non-English speech, and unusual microphones can reduce reliability.
- Results are model estimates, not proof.

## Documentation

- [API Reference](docs/API.md)
- [Model Notes](docs/MODEL_NOTES.md)
- [Metrics](docs/METRICS.md)

## Dataset / Model Artifacts

NaturalSpeech-v2 was used for Speech v2. EnvSDD was used for the environmental branch. The final app uses the two active local model artifacts listed above.

## Development Background

EchoGuard AI started with a speech v1 model trained on FoR-style speech data. Testing against modern AI voice samples showed the need for Speech v2, so NaturalSpeech-v2 was built around native English real speech and modern synthetic sources. Speech v2 improved modern-source coverage while keeping the hard unseen synthetic-source limitation visible. The environmental branch uses EnvSDD with AST and showed strong cross-shard results.

## Development Notes

- Portfolio/educational/research-style project.
- Local inference after setup.
- Python 3.11 recommended.
- GPU helps, but CPU inference can work for short clips.
- Backend stack: FastAPI, PyTorch, Transformers, librosa.
- Frontend stack: React, TypeScript, Vite, Tailwind.
