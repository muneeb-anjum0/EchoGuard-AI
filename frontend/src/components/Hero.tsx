import { ArrowDown, AudioLines } from "lucide-react";

type Props = {
  onAnalyzeClick: () => void;
  onStackClick: () => void;
};

export function Hero({ onAnalyzeClick, onStackClick }: Props) {
  return (
    <section className="hero-section">
      <div className="hero-copy-block">
        <span className="eyebrow">Audio authenticity screening</span>
        <h1>EchoGuard AI</h1>
        <p className="hero-subtitle">
          Clean audio authenticity screening for speech and environmental sound.
        </p>
        <p className="hero-body">
          Upload an audio clip. EchoGuard AI routes it to the right specialist model: WavLM for
          speech or AST for environmental/background audio.
        </p>
        <div className="hero-actions">
          <button className="button-primary" onClick={onAnalyzeClick}>
            Analyze Audio
            <ArrowDown size={17} />
          </button>
          <button className="button-secondary" onClick={onStackClick}>
            View Model Stack
          </button>
        </div>
      </div>

      <div className="hero-preview-card calm-preview" aria-label="Audio analysis preview">
        <div className="preview-header">
          <div>
            <span className="card-label">Analysis preview</span>
            <strong>Speech routed to WavLM</strong>
          </div>
          <AudioLines size={22} />
        </div>

        <div className="signal-trace-card" aria-hidden="true">
          <svg viewBox="0 0 420 160" role="img">
            <defs>
              <linearGradient id="traceGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#CBD5E1" />
                <stop offset="45%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>
            </defs>
            <path className="trace-shadow" d="M18 90 C62 72, 82 68, 118 82 S178 112, 220 78 S288 38, 330 66 S374 104, 402 82" />
            <path className="trace-line" d="M18 90 C62 72, 82 68, 118 82 S178 112, 220 78 S288 38, 330 66 S374 104, 402 82" />
          </svg>
          <div className="trace-metrics">
            <span>Speech ratio</span>
            <strong>82%</strong>
          </div>
        </div>

        <div className="hero-pills">
          <span>Speech: WavLM</span>
          <span>Environmental: AST</span>
          <span>Router: VAD</span>
        </div>
      </div>
    </section>
  );
}
