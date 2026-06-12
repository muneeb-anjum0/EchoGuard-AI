from __future__ import annotations

import json
import sys

from .audio_router import AudioRouter


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python -m app.test_router path/to/audio.wav", file=sys.stderr)
        return 2
    result = AudioRouter().analyze(sys.argv[1])
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

