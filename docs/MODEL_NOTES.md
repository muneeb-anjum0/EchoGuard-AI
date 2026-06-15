# EchoGuard AI Model Notes

EchoGuard AI uses two local audio classification branches behind a speech-ratio router. The app returns probabilistic screening output, not proof that a clip is real or fake.

## Two-Branch Architecture

```text
Uploaded audio
-> audio loading and preprocessing
-> VAD/speech-ratio router
-> Speech v2 WavLM branch or AST EnvSDD environmental branch
-> real/fake probabilities
-> Likely Real / Likely AI-Generated / Uncertain
-> spectrogram/frequency-time view
```

## Router Rule

```text
speech_ratio >= 0.30 -> speech branch
speech_ratio < 0.30  -> environmental branch
```

Borderline or mixed clips may be marked as `uncertain/mixed`, while still using the best matching branch. Mixed speech/background audio can route imperfectly, so the selected branch and router explanation should remain visible in the UI.

## Input Preprocessing

- Uploaded audio is loaded and converted to 16 kHz mono.
- The selected model receives padded or trimmed audio based on its expected input length.
- Speech v2 expects 4-second, 16 kHz, mono audio.
- Supported upload formats: WAV, MP3, FLAC, OGG, and M4A.

## Speech Model Details

- Purpose: likely real human speech vs likely AI-generated speech
- Model: EchoGuard WavLM Speech v2 NaturalSpeech
- Base model: `microsoft/wavlm-base`
- Artifact: `echoguard_wavlm_speech_v2_naturalspeech.zip`
- Expected extracted folder: `backend/models/speech_wavlm_v2_naturalspeech`
- Labels: `0` real, `1` fake
- Training focus: native English speaker audio and modern AI-generated voice styles, including ElevenLabs, ChatGPT/OpenAI-style voices, Claude-style generated speech, and similar new-generation synthetic speech sources.

The older `echoguard_wavlm_speech_shard001.zip` artifact is not the active speech model. The active speech model is Speech v2 NaturalSpeech.

## Environmental Model Details

- Purpose: likely real environmental/background audio vs likely AI-generated environmental/background audio
- Model: EchoGuard AST EnvSDD Environmental Audio Model
- Base model: `MIT/ast-finetuned-audioset-10-10-0.4593`
- Dataset: EnvSDD Environmental Sound Deepfake Detection
- Artifact: `echoguard_ast_shard001.zip`
- Expected extracted folder: `backend/models/environmental_ast_envsdd`
- Labels: `0` real, `1` fake

The environmental branch is intended for general environmental/background audio. It is not positioned for evidence review, emergency response, or safety-critical interpretation.

## Local Artifact Loading

The active ZIP files should be placed in the project root:

```text
echoguard_wavlm_speech_v2_naturalspeech.zip
echoguard_ast_shard001.zip
```

On backend startup, the loader resolves the expected target folder. If the extracted model files are not already present, it extracts the root ZIP into `backend/models/`. After extraction, the backend recursively searches for the Hugging Face files needed for local loading:

- `config.json`
- `preprocessor_config.json`
- `model.safetensors` or `pytorch_model.bin`

## Output Labels

The underlying model prediction is based on the larger of the real/fake probabilities. The UI display label uses a confidence threshold:

```text
confidence < 0.75 -> Uncertain
prediction real   -> Likely Real
prediction fake   -> Likely AI-Generated
```

The response keeps raw probabilities visible even when the display label is Uncertain.

## Safe Positioning

EchoGuard AI provides probabilistic screening results only. It does not verify, prove, or certify whether audio is real or fake. Results should not be used as the sole basis for legal, disciplinary, emergency, or safety-critical decisions.

Use honest language such as:

- Likely Real
- Likely AI-Generated
- Uncertain
- probabilistic screening
- model estimate

Avoid claims around legal evidence, CCTV proof, crisis footage, emergency response, military/security claims, accident verification, gunshots, explosions, or forensic conclusions.

## Limitations

- Speech branch is strongest for native English speaker audio and sources similar to the curated NaturalSpeech-v2 data.
- One hard unseen synthetic voice source closely resembled real speech and reduced full unseen performance.
- Environmental branch is for general environmental/background audio only.
- Music, overlapping speakers, heavy noise, heavy compression, very long clips, mixed speech/background audio, non-English speech, and unusual microphones can reduce reliability.
- Results are model estimates, not proof.

See [Metrics](METRICS.md) for detailed evaluation tables.

Back to [README](../README.md).
