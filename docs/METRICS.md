# EchoGuard AI Metrics

This document is the detailed metrics reference for EchoGuard AI. The root README summarizes these results; this file keeps the fuller tables and interpretation notes.

## Summary Table

| Branch | Evaluation | Samples | Accuracy | F1 | Precision | Recall |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Speech v2 | Full unseen | 344 | 81.69% | 78.64% | 94.31% | 67.44% |
| Speech v2 | Filtered unseen | 287 | 97.56% | 97.05% | 94.26% | 100% |
| EnvSDD | Shard 002 validation | 2,000 | 99.80% | 99.80% | 99.60% | 100% |
| EnvSDD | Shard 007 validation | 2,000 | 99.85% | 99.85% | 99.90% | 99.80% |
| EnvSDD | Shard 003 full test | 10,000 | 99.78% | 99.78% | 99.70% | 99.86% |
| EnvSDD | Shard 006 full test | 10,000 | 99.71% | 99.71% | 99.62% | 99.80% |

## Speech Branch: WavLM Speech v2 NaturalSpeech

- Model: EchoGuard WavLM Speech v2 NaturalSpeech
- Artifact: `echoguard_wavlm_speech_v2_naturalspeech.zip`
- Base: `microsoft/wavlm-base`
- Format: 4 seconds, 16 kHz, mono, 16-bit WAV
- Task: likely real human speech vs likely AI-generated speech

### Dataset Split

| Split | Clips | Real | Fake |
| --- | ---: | ---: | ---: |
| Train | 2,114 | 1,057 | 1,057 |
| Validation | 372 | 186 | 186 |
| Full unseen test | 344 | 172 | 172 |
| Filtered unseen test | 287 | 172 | 115 |

### Full Unseen Metrics

| Clips | Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: | ---: |
| 344 | 81.69% | 78.64% | 94.31% | 67.44% |

### Full Unseen Confusion Matrix

Rows are true labels and columns are predicted labels.

```text
[[165, 7],
 [56, 116]]
```

Readable form:

| True label | Predicted real | Predicted fake |
| --- | ---: | ---: |
| Real | 165 | 7 |
| Fake | 56 | 116 |

### Filtered Unseen Metrics

The filtered unseen test excludes one hard synthetic source. This result is diagnostic only and should not replace the full unseen result.

| Clips | Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: | ---: |
| 287 | 97.56% | 97.05% | 94.26% | 100% |

### Filtered Unseen Confusion Matrix

Rows are true labels and columns are predicted labels.

```text
[[165, 7],
 [0, 115]]
```

Readable form:

| True label | Predicted real | Predicted fake |
| --- | ---: | ---: |
| Real | 165 | 7 |
| Fake | 0 | 115 |

### Speech Interpretation

The full unseen result is the honest main speech metric. It shows strong precision on fake predictions but lower recall because one hard unseen synthetic voice source closely resembled real human speech and caused most of the missed fake clips. The filtered unseen result shows performance after removing that source, but it is diagnostic rather than the primary result.

## Environmental Branch: AST EnvSDD

- Model: EchoGuard AST EnvSDD Environmental Audio Model
- Artifact: `echoguard_ast_shard001.zip`
- Base: `MIT/ast-finetuned-audioset-10-10-0.4593`
- Dataset: EnvSDD Environmental Sound Deepfake Detection
- Task: likely real environmental/background audio vs likely AI-generated environmental/background audio

### Training Shard

| Shard | Clips | Real | Fake |
| --- | ---: | ---: | ---: |
| EnvSDD shard 001 | 10,000 | 5,000 | 5,000 |

### Shard 001 Epoch Table

| Epoch | Accuracy | F1 |
| ---: | ---: | ---: |
| 1 | 98.70% | 98.69% |
| 2 | 99.45% | 99.45% |
| 3 | 99.60% | 99.60% |
| 4 | 99.80% | 99.80% |
| 5 | 99.70% | 99.70% |

Best validation result for shard 001: 99.80% accuracy and 99.80% F1.

### Cross-Shard Results

| Evaluation | Samples | Accuracy | F1 | Precision | Recall |
| --- | ---: | ---: | ---: | ---: | ---: |
| Shard 002 validation | 2,000 | 99.80% | 99.80% | 99.60% | 100% |
| Shard 007 validation | 2,000 | 99.85% | 99.85% | 99.90% | 99.80% |
| Shard 003 full test | 10,000 | 99.78% | 99.78% | 99.70% | 99.86% |
| Shard 006 full test | 10,000 | 99.71% | 99.71% | 99.62% | 99.80% |

### Environmental Confusion Matrices

Rows are true labels and columns are predicted labels.

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

### Environmental Interpretation

The AST EnvSDD branch showed strong validation and cross-shard results on EnvSDD-style environmental/background audio. These metrics should be interpreted within that dataset scope. The branch is not positioned for legal, emergency, military/security, accident, war/crisis, CCTV, gunshot, explosion, or safety-critical claims.

## Notes on Reading Metrics

- Full unseen is the honest main speech metric.
- Filtered unseen is diagnostic only.
- Precision describes how often fake predictions were correct.
- Recall describes how many fake clips were caught.
- Accuracy alone should not be overinterpreted, especially when failure modes are concentrated in a hard source.
- EchoGuard AI output is probabilistic and should be read as a model estimate.

Back to [README](../README.md).
