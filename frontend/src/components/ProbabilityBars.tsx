import type { CSSProperties } from "react";

type Props = {
  real: number;
  fake: number;
};

export function ProbabilityBars({ real, fake }: Props) {
  return (
    <div className="probability-stack">
      <Probability label="Real probability" value={real} tone="real" />
      <Probability label="Fake probability" value={fake} tone="fake" />
    </div>
  );
}

function Probability({ label, value, tone }: { label: string; value: number; tone: "real" | "fake" }) {
  const percent = Math.min(100, Math.max(0, value * 100));

  return (
    <div className="probability-row">
      <div className="probability-label">
        <span>{label}</span>
        <strong>{percent.toFixed(1)}%</strong>
      </div>
      <div className="probability-track">
        <span className={tone} style={{ "--bar-width": `${percent}%` } as CSSProperties} />
      </div>
    </div>
  );
}
