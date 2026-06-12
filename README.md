# EchoGuard AI

EchoGuard AI is a local two-branch audio authenticity screening app. It routes uploaded audio to a specialist model based on speech content, then returns a model-based probability estimate with confidence, probabilities, route details, and a frequency-time spectrogram view.

EchoGuard AI is an AI screening tool, not forensic proof.

## What It Does

- Accepts common audio files: WAV, MP3, FLAC, OGG, and M4A.
- Estimates speech ratio with a VAD-based router.
- Routes speech-heavy clips to a WavLM speech branch.
- Routes environmental/background clips to an AST environmental branch.
- Returns likely real, likely AI-generated, or uncertain frontend wording based on confidence.
- Shows confidence, real/fake probabilities, selected model, audio type, speech ratio, duration, explanation, and spectrogram.

## Architecture

```text
Uploaded audio
-> Audio router
-> Speech WavLM branch or Environmental AST branch
-> AI screening result
```

The v1 router uses this rule:

```text
speech_ratio >= 0.30 -> speech_wavlm
speech_ratio < 0.30  -> environmental_ast
```

## Model Metrics

### Environmental Branch

- Model: AST, based on `MIT/ast-finetuned-audioset-10-10-0.4593`
- Dataset: EnvSDD
- Task: real vs AI-generated environmental/background audio
- Training set: 70,000 balanced EnvSDD clips, 35,000 real and 35,000 fake
- Total training audio represented: 77.8 hours
- Unseen-shard performance: F1 around 0.997 to 0.9985
- Status: Strong v1

Selected EnvSDD results:

| Evaluation | Accuracy | F1 | Notes |
| --- | ---: | ---: | --- |
| Shard 002 validation | 0.9980 | 0.9980 | 4 real clips predicted fake, 0 fake clips missed |
| Shard 007 validation | 0.9985 | 0.9985 | Stable on unseen shard |
| Shard 003 full shard | 0.9978 | 0.9978 | 10,000 samples |
| Shard 006 full shard | 0.9971 | 0.9971 | 10,000 samples |

### Speech Branch

- Model: WavLM Base, based on `microsoft/wavlm-base`
- Dataset: FoR for-norm
- Task: real human speech vs fake/generated speech
- Training shard: 10,000 balanced clips from FoR for-norm
- Unseen-shard performance: F1 0.971 on FoR shard 002 validation
- Status: Stable v1

Selected FoR shard 002 validation results:

| Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: |
| 0.972 | 0.971 | 0.994 | 0.950 |

Confusion matrix:

```text
[[994, 6],
 [50, 950]]
```

The speech branch is precise when predicting fake/generated speech, but it can miss some fake samples.

## Model Artifacts

Model artifacts are not committed to GitHub. Place these ZIP files locally in the project root:

```text
echoguard_ast_shard001.zip
echoguard_wavlm_speech_shard001.zip
```

On startup, the backend extracts them into `backend/models/` if the model folders are missing. The extracted model folders and ZIP files are ignored by Git.

Model collection: [EchoGuard AI artifacts on Kaggle](https://www.kaggle.com/work/collections/18566631)

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

## Requirements

- Python 3.11 recommended
- Node.js 18+
- Local model ZIP artifacts in the project root

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

## Safe Use

EchoGuard AI should be described as an audio authenticity screening system for speech and general environmental/background audio. Results are model-based probability estimates and should be interpreted carefully.
