import { ArrowDown, AudioLines, BrainCircuit, FileAudio2, ShieldCheck } from "lucide-react";

type Props = {
  onAnalyzeClick: () => void;
  onStackClick: () => void;
};

const HERO_STATS = [
  ["Router", "Speech + environmental"],
  ["Runtime", "Local inference"],
  ["Output", "Probabilistic review"],
] as const;

export function Hero({ onAnalyzeClick, onStackClick }: Props) {
  return (
    <section className="hero-section">
      <div className="hero-copy-block">
        <span className="eyebrow">Audio authenticity workspace</span>
        <h1 className="hero-title">AudioAware AI</h1>
        <p className="hero-subtitle">
          Screen speech and environmental audio in one calm, local-first interface.
        </p>
        <p className="hero-body">
          AudioAware routes every upload to the right specialist model, shows the confidence behind
          the decision, and keeps the limits visible beside the result.
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

      <div className="hero-preview-card" aria-label="Audio analysis preview">
        <div className="preview-header">
          <div>
            <span className="card-label">Live workspace preview</span>
            <strong>Audio routed for authenticity review</strong>
          </div>
          <AudioLines size={22} />
        </div>

        <div className="signal-console" aria-hidden="true">
          <svg className="signal-worm-minimal" viewBox="0 0 520 180" role="img">
            <path
              className="minimal-worm-line"
              d="M28 92 C78 58 120 58 170 92 S262 126 312 92 S404 58 492 88"
            />
          </svg>
        </div>

        <div className="hero-stats">
          {HERO_STATS.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <div className="hero-checks">
          <span><FileAudio2 size={16} /> Upload</span>
          <span><BrainCircuit size={16} /> Route</span>
          <span><ShieldCheck size={16} /> Review</span>
        </div>
      </div>
    </section>
  );
}
