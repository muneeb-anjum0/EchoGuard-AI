import { ArrowDown, AudioLines } from "lucide-react";

type Props = {
  onAnalyzeClick: () => void;
  onStackClick: () => void;
};

const STATIC_TRACE = {
  path: "M18 88 C48 82, 74 66, 104 62 C134 58, 162 72, 192 80 C222 88, 250 92, 278 84 C306 76, 334 58, 362 56 C388 54, 404 60, 402 64",
  speechRatio: 84,
};
const HERO_PILLS = ["Speech: WavLM", "Environmental: AST EnvSDD", "Router: VAD"];

export function Hero({ onAnalyzeClick, onStackClick }: Props) {
  return (
    <section className="hero-section">
      <div className="hero-copy-block">
        <span className="eyebrow">Audio authenticity screening</span>
        <h1>Echo<span className="brand-accent">Guard</span> AI</h1>
        <p className="hero-subtitle">
          Clean audio authenticity screening for speech and environmental sound.
        </p>
        <p className="hero-body">
          Upload an audio clip. EchoGuard AI routes it to the right specialist model: Speech v2
          WavLM NaturalSpeech for speech or AST EnvSDD for environmental/background audio.
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
                <stop offset="45%" stopColor="#93C5FD" />
                <stop offset="100%" stopColor="#BFDBFE" />
              </linearGradient>
            </defs>
            <path className="trace-shadow" d={STATIC_TRACE.path} />
            <path className="trace-line" d={STATIC_TRACE.path} />
          </svg>
          <div className="trace-metrics">
            <span>Speech ratio</span>
            <strong>{STATIC_TRACE.speechRatio}%</strong>
          </div>
        </div>

        <div className="hero-pills">{HERO_PILLS.map((pill) => <span key={pill}>{pill}</span>)}</div>
      </div>
    </section>
  );
}
