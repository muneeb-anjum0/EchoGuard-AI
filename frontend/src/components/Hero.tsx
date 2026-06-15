import { ArrowDown, AudioLines } from "lucide-react";
import { useMemo } from "react";

type Props = {
  onAnalyzeClick: () => void;
  onStackClick: () => void;
};

export function Hero({ onAnalyzeClick, onStackClick }: Props) {
  const trace = useMemo(() => generateTrace(), []);

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
            <path className="trace-shadow" d={trace.path} />
            <path className="trace-line" d={trace.path} />
          </svg>
          <div className="trace-metrics">
            <span>Speech ratio</span>
            <strong>{trace.speechRatio}%</strong>
          </div>
        </div>

        <div className="hero-pills">
            <span>Speech: WavLM</span>
          <span>Environmental: AST EnvSDD</span>
          <span>Router: VAD</span>
        </div>
      </div>
    </section>
  );
}

function generateTrace() {
  const phase = Math.random() * Math.PI * 2;
  const amplitudeA = 17 + Math.random() * 8;
  const amplitudeB = 6 + Math.random() * 6;
  const slope = (Math.random() - 0.5) * 10;

  const points = Array.from({ length: 9 }, (_, index) => {
    const progress = index / 8;
    const x = 18 + progress * 384;
    const y =
      82 +
      Math.sin(progress * Math.PI * 2.05 + phase) * amplitudeA +
      Math.sin(progress * Math.PI * 4.1 + phase * 0.55) * amplitudeB +
      (progress - 0.5) * slope;

    return { x, y: Math.max(48, Math.min(112, y)) };
  });

  const [first, ...rest] = points;
  let path = `M${first.x} ${first.y}`;
  let movement = 0;

  for (let index = 0; index < rest.length; index += 1) {
    const previous = points[index];
    const current = rest[index];
    const controlOffset = (current.x - previous.x) * 0.5;
    movement += Math.abs(current.y - previous.y);
    path += ` C${previous.x + controlOffset} ${previous.y}, ${current.x - controlOffset} ${current.y}, ${current.x} ${current.y}`;
  }

  const speechRatio = Math.round(Math.max(58, Math.min(94, 58 + movement * 0.26)));
  return { path, speechRatio };
}
