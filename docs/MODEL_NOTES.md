# EchoGuard AI Model Notes

EchoGuard AI uses a two-branch architecture:

```text
Uploaded audio
-> VAD-based audio router
-> Speech v2 WavLM NaturalSpeech or AST EnvSDD
-> Probabilistic screening result
```

## Safe Positioning

EchoGuard AI provides probabilistic screening results only. It does not verify, prove, or certify whether audio is real or fake. Results should not be used as the sole basis for legal, disciplinary, emergency, or safety-critical decisions.

Avoid claims around legal evidence verification, CCTV verification, crisis verification, emergency response, military/audio incident verification, or forensic conclusions.

## Router

Implemented routing rule:

```text
speech_ratio >= 0.30 -> speech branch
speech_ratio < 0.30  -> environmental branch
```

The router estimates speech content after converting uploaded audio to 16 kHz mono. Borderline clips are marked as `uncertain/mixed`, while still using the best matching branch.

## Speech Branch

- Purpose: detect likely real human speech vs likely AI-generated speech
- Model: EchoGuard WavLM Speech v2 NaturalSpeech
- Base model: `microsoft/wavlm-base`
- Artifact: `echoguard_wavlm_speech_v2_naturalspeech.zip`
- Target folder: `backend/models/speech_wavlm_v2_naturalspeech`
- Audio format: 4 seconds, 16 kHz, mono, 16-bit WAV

The speech branch is tuned for native English speaker audio and modern AI-generated voice samples, including voice styles similar to ElevenLabs, ChatGPT/OpenAI-style voice generation, Claude-style generated speech, and other new-generation synthetic speech sources.

### Speech v2 Data

| Split | Clips | Real | Fake |
| --- | ---: | ---: | ---: |
| Train | 2,114 | 1,057 | 1,057 |
| Validation | 372 | 186 | 186 |
| Full unseen test | 344 | 172 | 172 |
| Filtered unseen test | 287 | 172 | 115 |

### Full Unseen Test

| Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: |
| 81.69% | 78.64% | 94.31% | 67.44% |

```text
[[165, 7],
 [56, 116]]
```

Interpretation: the model performed well on real unseen audio but missed one difficult unseen fake source that closely resembled real human speech.

### Filtered Unseen Test

This excludes one hard fake source.

| Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: |
| 97.56% | 97.05% | 94.26% | 100% |

```text
[[165, 7],
 [0, 115]]
```

Interpretation: the model performed strongly on unseen real speech and two unseen synthetic voice sources, while one difficult synthetic source remained a known limitation.

## Environmental Branch

- Purpose: detect likely real environmental/background audio vs likely AI-generated environmental/background audio
- Model: EchoGuard AST EnvSDD Environmental Audio Model
- Base model: `MIT/ast-finetuned-audioset-10-10-0.4593`
- Dataset: EnvSDD Environmental Sound Deepfake Detection
- Artifact: `echoguard_ast_shard001.zip`
- Target folder: `backend/models/environmental_ast_envsdd`

The environmental branch is trained for general environmental/background audio such as ambience, urban sounds, crowds, traffic, and general non-speech sound events.

### AST Training on EnvSDD Shard 001

| Epoch | Accuracy | F1 |
| ---: | ---: | ---: |
| 1 | 98.70% | 98.69% |
| 2 | 99.45% | 99.45% |
| 3 | 99.60% | 99.60% |
| 4 | 99.80% | 99.80% |
| 5 | 99.70% | 99.70% |

### Environmental Generalization

| Evaluation | Samples | Accuracy | F1 | Precision | Recall | Wrong |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Shard 002 validation | 2,000 | 99.80% | 99.80% | 99.60% | 100% | 4 |
| Shard 007 validation | 2,000 | 99.85% | 99.85% | 99.90% | 99.80% | 3 |
| Shard 003 full test | 10,000 | 99.78% | 99.78% | 99.70% | 99.86% | 22 |
| Shard 006 full test | 10,000 | 99.71% | 99.71% | 99.62% | 99.80% | 29 |

Confusion matrices:

```text
Shard 002 validation:
[[996, 4],
 [0, 1000]]

Shard 007 validation:
[[999, 1],
 [2, 998]]

Shard 003 full test:
[[4985, 15],
 [7, 4993]]

Shard 006 full test:
[[4981, 19],
 [10, 4990]]
```

## Limitations

One hard unseen synthetic voice source was found to closely resemble real speech and reduced full unseen-test speech performance. This should be reported transparently.

The environmental branch should not be used as proof for legal, emergency, military, accident, or crisis-related audio verification.
