import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, CheckCircle2, CircleHelp, Clock3, Gauge, GitBranch, RadioTower, Route } from "lucide-react";
import type { PredictionResult } from "../api";
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
  const confidencePercent = confidenceValue * 100;
  const label = result.display_label ?? getDisplayLabel(result, confidenceValue);
  const level = getConfidenceLevel(confidenceValue);
  const tone = label === "Likely Real" ? "real" : label === "Likely AI-Generated" ? "fake" : "uncertain";
  const selectedBranch = result.selected_branch ?? result.audio_type ?? "Unknown";
  const selectedModel = result.model_name ?? formatSelectedModel(result.selected_model);
  const routerDecision = result.router_decision ?? selectedBranch;
  const duration = typeof result.duration_sec === "number" ? `${result.duration_sec.toFixed(2)}s` : "Unknown";
  const speechRatio = typeof result.speech_ratio === "number" ? `${(result.speech_ratio * 100).toFixed(1)}%` : "Unknown";
  const realProbability = result.real_probability ?? result.real_prob ?? 0;
  const fakeProbability = result.fake_probability ?? result.fake_prob ?? 0;

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
          <strong>{confidencePercent.toFixed(1)}%</strong>
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
        <Detail icon={<GitBranch size={17} />} label="Selected branch" value={String(selectedBranch)} />
        <Detail icon={<RadioTower size={17} />} label="Model used" value={selectedModel} />
        <Detail icon={<Route size={17} />} label="Router decision" value={String(routerDecision)} />
        <Detail icon={<Gauge size={17} />} label="Speech ratio" value={speechRatio} />
        <Detail icon={<Clock3 size={17} />} label="Duration" value={duration} />
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
    <div>
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

function clamp01(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}
