# Speech Branch: WavLM Speech v2 NaturalSpeech
Training set:
2,114 clips total
1,057 real
1,057 fake

Validation set:
372 clips total
186 real
186 fake

Full unseen test:
344 clips total
172 real
172 fake
Accuracy: 81.69%
F1: 78.64%
Precision: 94.31%
Recall: 67.44%

Full unseen confusion matrix:
Real: 165 correct, 7 false fake
Fake: 116 correct, 56 missed fake

Filtered unseen test, excluding one hard synthetic source:
287 clips total
172 real
115 fake
Accuracy: 97.56%
F1: 97.05%
Precision: 94.26%
Recall: 100%

Filtered unseen confusion matrix:
Real: 165 correct, 7 false fake
Fake: 115 correct, 0 missed fake

# Environmental Branch: AST EnvSDD
Training shard:
10,000 clips total
5,000 real
5,000 fake

Shard 001 validation:
Best accuracy: 99.80%
Best F1: 99.80%

Shard 002 validation:
Accuracy: 99.80%
F1: 99.80%
Precision: 99.60%
Recall: 100%

Shard 007 validation:
Accuracy: 99.85%
F1: 99.85%
Precision: 99.90%
Recall: 99.80%

Shard 003 full test:
10,000 samples
Accuracy: 99.78%
F1: 99.78%
Precision: 99.70%
Recall: 99.86%

Shard 006 full test:
10,000 samples
Accuracy: 99.71%
F1: 99.71%
Precision: 99.62%
Recall: 99.80%
