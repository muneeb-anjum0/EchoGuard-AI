import { AudioLines, FileAudio2, GitBranch, Gauge, Mic2, SlidersHorizontal, Waves } from "lucide-react";
import type { PredictionResult } from "../api";

type Props = {
  result: PredictionResult | null;
};

const flowNodes = {
  upload: {
    title: "Upload",
    text: "User uploads WAV, MP3, FLAC, OGG, or M4A audio.",
    icon: FileAudio2,
  },
  normalize: {
    title: "Normalize",
    text: "Audio is converted to mono, resampled to 16 kHz, and prepared for model input.",
    icon: SlidersHorizontal,
  },
  route: {
    title: "Route",
    text: "A speech/background router estimates whether the clip is speech-heavy or environmental.",
    icon: GitBranch,
  },
  speech: {
    title: "Speech Branch",
    text: "Speech-heavy clips use WavLM Speech v2 NaturalSpeech.",
    icon: Mic2,
  },
  environmental: {
    title: "Environmental Branch",
    text: "Background or non-speech clips use AST EnvSDD.",
    icon: Waves,
  },
  probabilities: {
    title: "Probabilities",
    text: "The selected model returns real and fake probabilities.",
    icon: Gauge,
  },
  result: {
    title: "Result",
    text: "The UI displays Likely Real, Likely AI-Generated, or Uncertain with confidence and model details.",
    icon: AudioLines,
  },
};

export function RouterExplainer({ result }: Props) {
  const selectedBranch = result?.selected_branch;

  return (
    <section className="router-section" id="how-it-works">
      <div className="section-title">
        <span className="eyebrow">Processing flow</span>
        <h2>How EchoGuard Processes Audio</h2>
        <p>
          Each upload moves through routing, branch-specific preprocessing, model inference, and
          probability-based reporting.
        </p>
      </div>

      <div className="flow-diagram" aria-label="EchoGuard audio processing flow">
        <FlowNode node={flowNodes.upload} />
        <FlowConnector />
        <FlowNode node={flowNodes.normalize} />
        <FlowConnector />
        <FlowNode node={flowNodes.route} active={result?.router_decision === "uncertain/mixed"} />

        <div className="flow-split" aria-hidden="true">
          <span />
          <span />
        </div>

        <div className="flow-branches">
          <FlowNode node={flowNodes.speech} active={selectedBranch === "speech"} branch />
          <FlowNode node={flowNodes.environmental} active={selectedBranch === "environmental"} branch />
        </div>

        <div className="flow-merge" aria-hidden="true">
          <span />
          <span />
        </div>

        <div className="flow-tail">
          <FlowNode node={flowNodes.probabilities} />
          <FlowConnector />
          <FlowNode node={flowNodes.result} />
        </div>
      </div>

      <aside className="flow-note">
        Confidence below 75% is displayed as Uncertain. Raw real/fake probabilities remain visible
        so users can inspect borderline cases.
      </aside>
    </section>
  );
}

function FlowNode({
  node,
  active = false,
  branch = false,
}: {
  node: { title: string; text: string; icon: typeof FileAudio2 };
  active?: boolean;
  branch?: boolean;
}) {
  const Icon = node.icon;
  return (
    <article className={`flow-node ${active ? "active" : ""} ${branch ? "branch-node" : ""}`}>
      <div className="flow-node-top">
        <Icon size={18} />
        <h3>{node.title}</h3>
      </div>
      <p>{node.text}</p>
    </article>
  );
}

function FlowConnector() {
  return <div className="flow-connector" aria-hidden="true" />;
}
