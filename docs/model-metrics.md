# EchoGuard AI model metrics

This file is the detailed evaluation reference for EchoGuard AI. The README keeps the summary short; this document keeps the full tables and interpretation notes.

## Summary

| Branch | Evaluation | Samples | Accuracy | F1 | Precision | Recall |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Speech v2 | Full unseen | 344 | 81.69% | 78.64% | 94.31% | 67.44% |
| Speech v2 | Filtered unseen | 287 | 97.56% | 97.05% | 94.26% | 100% |
| EnvSDD | Shard 002 validation | 2,000 | 99.80% | 99.80% | 99.60% | 100% |
| EnvSDD | Shard 007 validation | 2,000 | 99.85% | 99.85% | 99.90% | 99.80% |
| EnvSDD | Shard 003 full test | 10,000 | 99.78% | 99.78% | 99.70% | 99.86% |
| EnvSDD | Shard 006 full test | 10,000 | 99.71% | 99.71% | 99.62% | 99.80% |

## Speech branch: WavLM Speech v2 NaturalSpeech

- Model: EchoGuard WavLM Speech v2 NaturalSpeech
- Artifact: `echoguard_wavlm_speech_v2_naturalspeech.zip`
- Base: `microsoft/wavlm-base`
- Input format: 4 seconds, 16 kHz, mono, 16-bit WAV
- Task: likely real human speech vs likely AI-generated speech

### Dataset split

| Split | Clips | Real | Fake |
| --- | ---: | ---: | ---: |
| Train | 2,114 | 1,057 | 1,057 |
| Validation | 372 | 186 | 186 |
| Full unseen test | 344 | 172 | 172 |
| Filtered unseen test | 287 | 172 | 115 |

### Full unseen result

| Clips | Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: | ---: |
| 344 | 81.69% | 78.64% | 94.31% | 67.44% |

Confusion matrix:

```text
[[165, 7],
 [56, 116]]
```

| True label | Predicted real | Predicted fake |
| --- | ---: | ---: |
| Real | 165 | 7 |
| Fake | 56 | 116 |

### Filtered unseen result

The filtered unseen set removes one hard synthetic source. It is useful for diagnosis, but it should not replace the full unseen result as the main headline metric.

| Clips | Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: | ---: |
| 287 | 97.56% | 97.05% | 94.26% | 100% |

Confusion matrix:

```text
[[165, 7],
 [0, 115]]
```

| True label | Predicted real | Predicted fake |
| --- | ---: | ---: |
| Real | 165 | 7 |
| Fake | 0 | 115 |

### Interpretation

The full unseen result is the honest speech benchmark. The model is strong when it predicts fake, but recall drops because one unseen synthetic source resembles real speech closely enough to create most of the misses.

## Environmental branch: AST EnvSDD

- Model: EchoGuard AST EnvSDD Environmental Audio Model
- Artifact: `echoguard_ast_shard001.zip`
- Base: `MIT/ast-finetuned-audioset-10-10-0.4593`
- Dataset: EnvSDD Environmental Sound Deepfake Detection
- Task: likely real environmental/background audio vs likely AI-generated environmental/background audio

### Training shard

| Shard | Clips | Real | Fake |
| --- | ---: | ---: | ---: |
| EnvSDD shard 001 | 10,000 | 5,000 | 5,000 |

### Shard 001 validation by epoch

| Epoch | Accuracy | F1 |
| ---: | ---: | ---: |
| 1 | 98.70% | 98.69% |
| 2 | 99.45% | 99.45% |
| 3 | 99.60% | 99.60% |
| 4 | 99.80% | 99.80% |
| 5 | 99.70% | 99.70% |

Best shard 001 validation result: 99.80% accuracy and 99.80% F1.

### Cross-shard results

| Evaluation | Samples | Accuracy | F1 | Precision | Recall |
| --- | ---: | ---: | ---: | ---: | ---: |
| Shard 002 validation | 2,000 | 99.80% | 99.80% | 99.60% | 100% |
| Shard 007 validation | 2,000 | 99.85% | 99.85% | 99.90% | 99.80% |
| Shard 003 full test | 10,000 | 99.78% | 99.78% | 99.70% | 99.86% |
| Shard 006 full test | 10,000 | 99.71% | 99.71% | 99.62% | 99.80% |

### Confusion matrices

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

### Interpretation

The environmental branch performs strongly on EnvSDD-style data and general background/environmental audio. Those results should still be kept inside that scope rather than stretched into forensic or safety-critical claims.

## How to read these numbers

- Full unseen is the main speech metric
- Filtered unseen is diagnostic only
- Precision tells you how often fake predictions were correct
- Recall tells you how many fake clips were actually caught
- Accuracy alone can hide concentrated failure cases
- EchoGuard output should still be treated as a model estimate, not proof

Back to [README](../README.md).
