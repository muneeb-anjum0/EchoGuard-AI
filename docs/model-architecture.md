# AudioAware AI model architecture

AudioAware AI uses a two-branch local inference pipeline. The app does not try to prove authenticity; it estimates it.

## High-level flow

```text
uploaded audio
-> load and normalize
-> speech-ratio router
-> speech model or environmental model
-> real/fake probabilities
-> display label + routing explanation + spectrogram
```

## Router logic

```text
speech_ratio >= 0.30 -> speech branch
speech_ratio < 0.30  -> environmental branch
```

If a clip is close to the threshold, the router can label the decision as `uncertain/mixed` while still picking the best available branch.

## Input preprocessing

- Audio is loaded as 16 kHz mono
- Samples are normalized before inference
- Each branch receives padded or trimmed audio to match its expected duration
- Supported uploads: WAV, MP3, FLAC, OGG, M4A

## Speech branch

- Model: AudioAware WavLM Speech v2 NaturalSpeech
- Base model: `microsoft/wavlm-base`
- Artifact: `audioaware_wavlm_speech_v2_naturalspeech.zip`
- Extracted target: `backend/models/speech_wavlm_v2_naturalspeech`
- Labels: `0 = real`, `1 = fake`
- Focus: native English speech and modern AI-generated voice styles

The older `audioaware_wavlm_speech_shard001.zip` file is not the active speech artifact for this app path.

## Environmental branch

- Model: AudioAware AST EnvSDD Environmental Audio Model
- Base model: `MIT/ast-finetuned-audioset-10-10-0.4593`
- Dataset: EnvSDD Environmental Sound Deepfake Detection
- Artifact: `audioaware_ast_shard001.zip`
- Extracted target: `backend/models/environmental_ast_envsdd`
- Labels: `0 = real`, `1 = fake`

This branch is meant for general environmental or background audio, not forensic evidence review.

## Local model loading

The backend expects the active artifacts in:

```text
backend/models/artifacts/
```

On startup, the model loader:

1. checks whether the extracted model directory already contains the required Hugging Face files
2. extracts the ZIP only when needed
3. loads the feature extractor and classifier locally

Required model files:

- `config.json`
- `preprocessor_config.json`
- `model.safetensors` or `pytorch_model.bin`

## Output labels

The model prediction comes from the higher real/fake probability. The UI label is then mapped by confidence:

```text
confidence < 0.75 -> Uncertain
prediction real   -> Likely Real
prediction fake   -> Likely AI-Generated
```

Raw probabilities stay visible even when the final display label is `Uncertain`.

## Positioning and limitations

AudioAware AI should be described as:

- probabilistic screening
- model estimate
- likely real
- likely AI-generated
- uncertain

It should not be positioned as proof, certification, or forensic verification.

Known limitations:

- speech performance is strongest for data similar to the NaturalSpeech-v2 curation
- one hard unseen synthetic source remains a visible speech failure mode
- mixed audio, heavy noise, compression artifacts, overlapping speakers, long clips, and unusual microphones can reduce reliability
- environmental metrics should stay within environmental/background-audio scope

See [model-metrics.md](model-metrics.md) for the detailed evaluation tables.
