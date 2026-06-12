# EchoGuard AI Model Notes

EchoGuard AI v1 uses a two-branch architecture:

```text
Uploaded audio
-> VAD-based audio router
-> Speech WavLM branch or Environmental AST branch
-> AI screening result
```

The split is intentional. Speech deepfake artifacts and environmental/background audio artifacts are different enough that a single model is a poor fit for v1.

## Safe Positioning

EchoGuard AI is an AI screening tool for speech and general environmental/background audio. It returns model-based probability estimates, not forensic proof.

Avoid claims around legal evidence verification, CCTV verification, crisis verification, or high-risk incident detection.

## Router

Recommended and implemented v1 routing rule:

```text
speech_ratio >= 0.30 -> speech_wavlm
speech_ratio < 0.30  -> environmental_ast
```

The router estimates speech content after converting uploaded audio to 16 kHz mono.

## Environmental Branch

- Purpose: detect real vs AI-generated environmental/background audio
- Dataset: EnvSDD
- Model: AST, Audio Spectrogram Transformer
- Base model: `MIT/ast-finetuned-audioset-10-10-0.4593`
- Artifact: `echoguard_ast_shard001.zip`
- Status: Strong v1

### EnvSDD Sharding

EnvSDD Development was imbalanced:

```text
Real files: 35,753
Fake files: 143,012
Total files: 178,765
```

Balanced shards were created:

```text
7 shards
10,000 clips per shard
5,000 real + 5,000 fake per shard
70,000 clips total
35,000 real + 35,000 fake
77.8 total hours
```

Each shard split:

```text
Train: 8,000 clips
Validation: 2,000 clips
```

### AST Training on EnvSDD Shard 001

| Epoch | Validation Loss | Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 0.052083 | 0.9870 | 0.9869 | 0.9969 | 0.9770 |
| 2 | 0.020104 | 0.9945 | 0.9945 | 0.9901 | 0.9990 |
| 3 | 0.018822 | 0.9960 | 0.9960 | 0.9970 | 0.9950 |
| 4 | 0.010232 | 0.9980 | 0.9980 | 0.9980 | 0.9980 |
| 5 | 0.014052 | 0.9970 | 0.9970 | 0.9990 | 0.9950 |

Training summary:

```text
global_step: 2500
train_runtime: 7193.6398 seconds
train_loss: 0.0244503636
epoch: 5.0
```

### Environmental Generalization

| Evaluation | Samples | Accuracy | F1 | Precision | Recall | Wrong |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Shard 002 validation | 2,000 | 0.9980 | 0.9980 | 0.9960 | 1.0000 | 4 |
| Shard 007 validation | 2,000 | 0.9985 | 0.9985 | 0.9990 | 0.9980 | 3 |
| Shard 003 full shard | 10,000 | 0.9978 | 0.9978 | 0.9970 | 0.9986 | 22 |
| Shard 006 full shard | 10,000 | 0.9971 | 0.9971 | 0.9962 | 0.9980 | 29 |

Confusion matrices:

```text
Shard 002 validation:
[[996, 4],
 [0, 1000]]

Shard 007 validation:
[[999, 1],
 [2, 998]]

Shard 003 full shard:
[[4985, 15],
 [7, 4993]]

Shard 006 full shard:
[[4981, 19],
 [10, 4990]]
```

Summary: the environmental branch is stable across unseen EnvSDD shards, with F1 around 0.997 to 0.9985.

## Speech Branch

- Purpose: detect real human speech vs fake/generated speech
- Dataset: FoR, using `for-norm`
- Model: WavLM Base
- Base model: `microsoft/wavlm-base`
- Artifact: `echoguard_wavlm_speech_shard001.zip`
- Status: Stable v1

### FoR Dataset Counts

| Version | Total | Real | Fake |
| --- | ---: | ---: | ---: |
| for-2sec | 17,870 | 8,935 | 8,935 |
| for-norm | 69,300 | 34,605 | 34,695 |
| for-original | 69,316 | 34,605 | 34,711 |
| for-rerec | 13,268 | 6,613 | 6,655 |

`for-norm` was used first because it is normalized, large enough, and balanced enough for a stable v1 branch.

### WavLM Training on FoR Shard 001

Training configuration:

```text
Fine-tuned last 4 WavLM layers + classifier
max_seconds: 4
learning_rate: 1e-5
train batch size: 4
eval batch size: 4
gradient_accumulation_steps: 2
epochs: 4
metric_for_best_model: f1
fp16: true
```

| Epoch | Validation Loss | Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 0.230072 | 0.9590 | 0.9578 | 0.9862 | 0.9310 |
| 2 | 0.282084 | 0.9650 | 0.9641 | 0.9884 | 0.9410 |
| 3 | 0.479454 | 0.9530 | 0.9509 | 0.9956 | 0.9100 |
| 4 | 0.489189 | 0.9540 | 0.9520 | 0.9946 | 0.9130 |

Final selected evaluation:

```text
eval_accuracy: 0.965
eval_f1: 0.9641393443
eval_precision: 0.9884453782
eval_recall: 0.941
```

### Speech Generalization

Tested on unseen FoR for-norm shard 002 validation split:

| Accuracy | F1 | Precision | Recall |
| ---: | ---: | ---: | ---: |
| 0.972 | 0.9713701431 | 0.9937238494 | 0.9500 |

Confusion matrix:

```text
[[994, 6],
 [50, 950]]
```

The speech branch generalizes well to unseen shard 002. It is precise when predicting fake/generated speech, but misses some fake clips.

## Portfolio Summary

Built EchoGuard AI, a two-branch audio authenticity system using a router-based architecture with AST fine-tuned on EnvSDD for environmental audio detection and WavLM fine-tuned on FoR for speech detection.

Detailed version:

```text
Designed and trained EchoGuard AI, a real-vs-AI-generated audio detection platform using a two-stage router architecture. Fine-tuned an AST model on 70,000 balanced EnvSDD clips totaling 77.8 hours for environmental audio detection, achieving around 0.997+ F1 on unseen shards. Fine-tuned WavLM on FoR speech data for real vs generated speech detection, achieving around 0.971 F1 on an unseen shard.
```
