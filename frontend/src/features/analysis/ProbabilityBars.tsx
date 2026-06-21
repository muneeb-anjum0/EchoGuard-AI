import type { CSSProperties } from "react";

type Props = {
  real: number;
  fake: number;
};
const probabilityRows = [
  ["Real probability", "real"],
  ["Fake probability", "fake"],
] as const;

export function ProbabilityBars({ real, fake }: Props) {
  const values = { real, fake };

  return (
    <div className="probability-stack">
      {probabilityRows.map(([label, tone]) => (
        <Probability key={tone} label={label} value={values[tone]} tone={tone} />
      ))}
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
