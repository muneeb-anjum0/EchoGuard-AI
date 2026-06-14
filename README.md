# EchoGuard AI

EchoGuard AI is a two-branch audio authenticity screening app. It routes uploaded audio to a speech or environmental/background branch, then returns a probabilistic result with confidence, raw probabilities, router details, model information, and a frequency-time spectrogram view.

EchoGuard AI provides probabilistic screening results only. It does not verify, prove, or certify whether audio is real or fake. Results should not be used as the sole basis for legal, disciplinary, emergency, or safety-critical decisions.

## Active Local Models

Place both ZIP files in the project root:

```text
echoguard_wavlm_speech_v2_naturalspeech.zip
echoguard_ast_shard001.zip
```

The backend extracts and loads them automatically into `backend/models/`. Extracted model folders, ZIP files, `.safetensors`, virtual environments, frontend builds, and temp uploads are ignored by Git.

Model collection: [EchoGuard AI artifacts on Kaggle](https://www.kaggle.com/work/collections/18566631)

## What It Does

- Accepts WAV, MP3, FLAC, OGG, and M4A audio.
- Converts uploaded audio to 16 kHz mono and normalizes it safely.
- Uses a VAD-based router to estimate speech content.
- Routes speech-heavy clips to Speech v2 WavLM NaturalSpeech.
- Routes mostly environmental/background clips to AST EnvSDD.
- Shows Likely Real, Likely AI-Generated, or Uncertain using a 75% confidence display threshold.
- Keeps raw real/fake probabilities visible.

## Architecture

```text
Uploaded audio
-> VAD-based router
-> Speech v2 WavLM NaturalSpeech or AST EnvSDD
-> Probabilistic screening result
```

Current routing rule:

```text
speech_ratio >= 0.30 -> speech branch
speech_ratio < 0.30  -> environmental branch
```

Borderline clips are marked as `uncertain/mixed`, while still using the best matching branch.

## Model Coverage & Evaluation

### Speech Branch

- Model: `EchoGuard WavLM Speech v2 NaturalSpeech`
- Artifact: `echoguard_wavlm_speech_v2_naturalspeech.zip`
- Base: `microsoft/wavlm-base`
- Format: 4 seconds, 16 kHz, mono, 16-bit WAV
- Training data: native English real speech plus modern AI-generated voices, including ElevenLabs, ChatGPT/OpenAI-style voices, Claude-style generated speech, and similar new-generation synthetic speech sources.

Training split:

| Split | Clips | Real | Fake |
| --- | ---: | ---: | ---: |
| Train | 2,114 | 1,057 | 1,057 |
| Validation | 372 | 186 | 186 |

Full unseen test:

| Clips | Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: | ---: |
| 344 | 81.69% | 78.64% | 94.31% | 67.44% |

```text
[[165, 7],
 [56, 116]]
```

The model performed well on real unseen audio but missed one difficult unseen fake source that closely resembled real human speech.

Filtered unseen test, excluding one hard fake source:

| Clips | Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: | ---: |
| 287 | 97.56% | 97.05% | 94.26% | 100% |

```text
[[165, 7],
 [0, 115]]
```

This stronger filtered result is shown for context, but the full unseen result should not be hidden.

### Environmental Branch

- Model: `EchoGuard AST EnvSDD Environmental Audio Model`
- Artifact: `echoguard_ast_shard001.zip`
- Base: `MIT/ast-finetuned-audioset-10-10-0.4593`
- Dataset: EnvSDD Environmental Sound Deepfake Detection
- Training: balanced EnvSDD shard 001, 10,000 clips total, 5,000 real and 5,000 fake

Shard 001 validation:

| Epoch | Accuracy | F1 |
| ---: | ---: | ---: |
| 1 | 98.70% | 98.69% |
| 2 | 99.45% | 99.45% |
| 3 | 99.60% | 99.60% |
| 4 | 99.80% | 99.80% |
| 5 | 99.70% | 99.70% |

Cross-shard generalization:

| Evaluation | Samples | Accuracy | F1 | Precision | Recall |
| --- | ---: | ---: | ---: | ---: | ---: |
| Shard 002 validation | 2,000 | 99.80% | 99.80% | 99.60% | 100% |
| Shard 007 validation | 2,000 | 99.85% | 99.85% | 99.90% | 99.80% |
| Shard 003 full test | 10,000 | 99.78% | 99.78% | 99.70% | 99.86% |
| Shard 006 full test | 10,000 | 99.71% | 99.71% | 99.62% | 99.80% |

## Important Limitations

The speech branch is tuned for native English speaker audio and modern AI-generated voice samples, including voice styles similar to ElevenLabs, ChatGPT/OpenAI-style voice generation, Claude-style generated speech, and other new-generation synthetic speech sources.

One hard unseen synthetic voice source was found to closely resemble real speech and reduced full unseen-test performance. This is reported transparently as a known limitation.

The environmental branch is trained for general environmental/background audio such as ambience, urban sounds, crowds, traffic, and general non-speech sound events.

The environmental branch should not be used as proof for legal, emergency, military, accident, or crisis-related audio verification.

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
|   `-- MODEL_NOTES.md
|-- scripts/
|   `-- run_all.ps1
|-- .gitignore
|-- README.md
`-- sample.env.example
```

## Run Backend

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or:

```powershell
.\backend\run_backend.ps1
```

## Run Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Run Both

```powershell
.\scripts\run_all.ps1
```

Backend: `http://localhost:8000`

Frontend: `http://localhost:5173`

## API

See [docs/API.md](docs/API.md).

## Detailed Model Notes

See [docs/MODEL_NOTES.md](docs/MODEL_NOTES.md).
