import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, CheckCircle2, CircleHelp, Clock3, Gauge, GitBranch, RadioTower } from "lucide-react";
import type { PredictionResult } from "../../services";
import { ProbabilityBars } from "./ProbabilityBars";

type Props = {
  result: PredictionResult | null;
};

export function ResultCard({ result }: Props) {
  if (!result) {
    return (
      <section className="card result-card empty-result">
        <div className="empty-result-icon">
          <CircleHelp size={28} />
        </div>
        <h2>Your analysis result will appear here.</h2>
        <p>
          Upload an audio clip to see the AI screening result, confidence level, selected model,
          probability estimates, and explanation.
        </p>
      </section>
    );
  }

  const confidenceValue = getConfidence(result);
  const confidencePercent = toPercent(confidenceValue);
  const label = result.display_label ?? getDisplayLabel(result, confidenceValue);
  const level = getConfidenceLevel(confidenceValue);
  const tone = label === "Likely Real" ? "real" : label === "Likely AI-Generated" ? "fake" : "uncertain";
  const selectedBranch = formatSelectedBranch(result.selected_branch ?? result.audio_type);
  const selectedModel = result.model_name ?? formatSelectedModel(result.selected_model);
  const realProbability = result.real_probability ?? result.real_prob ?? 0;
  const fakeProbability = result.fake_probability ?? result.fake_prob ?? 0;
  const details = [
    { icon: <GitBranch size={17} />, label: "Selected branch", value: String(selectedBranch) },
    { icon: <RadioTower size={17} />, label: "Model used", value: selectedModel },
    { icon: <Gauge size={17} />, label: "Speech ratio", value: formatMaybePercent(result.speech_ratio) },
    { icon: <Clock3 size={17} />, label: "Duration", value: formatMaybeSeconds(result.duration_sec) },
  ];

  return (
    <section className={`card result-card result-${tone} result-enter`}>
      <div className="result-topline">
        <div>
          <span className="eyebrow">AI screening result</span>
          <h2>{label}</h2>
        </div>
        <ResultIcon tone={tone} />
      </div>

      <div className="confidence-block">
        <div>
          <span>Confidence</span>
          <strong>{confidencePercent}%</strong>
          <small>{level}</small>
        </div>
        <div className="confidence-track">
          <span style={{ "--bar-width": `${confidencePercent}%` } as CSSProperties} />
        </div>
      </div>

      {confidenceValue < 0.75 && (
        <p className="care-note">Low confidence results should be interpreted carefully.</p>
      )}

      <ProbabilityBars real={realProbability} fake={fakeProbability} />

      <div className="detail-grid">
        {details.map((detail) => (
          <Detail key={detail.label} {...detail} />
        ))}
      </div>

      <div className="explanation-card">
        <span>Short explanation</span>
        <p>{result.router_explanation ?? result.explanation ?? "The backend returned a model-based probability estimate for this clip."}</p>
      </div>

      {result.key_limitation && (
        <div className="explanation-card">
          <span>Key limitation</span>
          <p>{result.key_limitation}</p>
        </div>
      )}

      <p className="disclaimer">
        {result.note ??
          "EchoGuard AI provides probabilistic screening results only. It does not make a final determination about whether audio is real or fake."}
      </p>
    </section>
  );
}

function ResultIcon({ tone }: { tone: "real" | "fake" | "uncertain" }) {
  if (tone === "real") {
    return <CheckCircle2 className="result-icon real" size={30} />;
  }

  if (tone === "fake") {
    return <AlertTriangle className="result-icon fake" size={30} />;
  }

  return <CircleHelp className="result-icon uncertain" size={30} />;
}

function Detail({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="detail-pill">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getConfidence(result: PredictionResult) {
  const fallback = Math.max(result.real_probability ?? result.real_prob ?? 0, result.fake_probability ?? result.fake_prob ?? 0);
  return clamp01(result.confidence ?? fallback);
}

function toPercent(value: number) {
  return (value * 100).toFixed(1);
}

function formatMaybePercent(value?: number) {
  return typeof value === "number" ? `${toPercent(value)}%` : "Unknown";
}

function formatMaybeSeconds(value?: number) {
  return typeof value === "number" ? `${value.toFixed(2)}s` : "Unknown";
}

function getDisplayLabel(result: PredictionResult, confidence: number) {
  if (confidence < 0.75) {
    return "Uncertain";
  }

  if (result.prediction === "real") {
    return "Likely Real";
  }

  if (result.prediction === "fake") {
    return "Likely AI-Generated";
  }

  return "Uncertain";
}

function getConfidenceLevel(confidence: number) {
  if (confidence >= 0.9) {
    return "High confidence";
  }

  if (confidence >= 0.75) {
    return "Medium confidence";
  }

  return "Low confidence";
}

function formatSelectedModel(model: string | undefined) {
  if (model === "echoguard_wavlm_speech_v2_naturalspeech") {
    return "EchoGuard WavLM Speech v2 NaturalSpeech";
  }

  if (model === "echoguard_ast_shard001") {
    return "EchoGuard AST EnvSDD Environmental Audio Model";
  }

  return "Unknown";
}

function formatSelectedBranch(branch: string | undefined) {
  if (branch === "speech") {
    return "Speech → WavLM";
  }

  if (branch === "environmental") {
    return "Environmental → AST";
  }

  return branch ?? "Unknown";
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}
