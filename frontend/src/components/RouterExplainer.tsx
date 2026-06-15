import { ArrowRight, AudioLines, FileAudio2, GitBranch, Gauge, SlidersHorizontal } from "lucide-react";
import type { PredictionResult } from "../api";

type Props = {
  result: PredictionResult | null;
};

const flowNodes = [
  {
    key: "input",
    title: "Input",
    text: "Upload audio",
    icon: FileAudio2,
  },
  {
    key: "sanitize",
    title: "Sanitize",
    text: "Mono, 16 kHz, normalized",
    icon: SlidersHorizontal,
  },
  {
    key: "router",
    title: "Router",
    text: "Speech/background decision",
    icon: GitBranch,
  },
  {
    key: "processing",
    title: "Process",
    text: "Real/fake probability scoring",
    icon: Gauge,
  },
  {
    key: "output",
    title: "Output",
    text: "Likely Real, AI-Generated, or Uncertain",
    icon: AudioLines,
  },
];

export function RouterExplainer({ result }: Props) {
  const routerActive = result?.router_decision === "uncertain/mixed" || Boolean(result?.selected_branch);

  return (
    <section className="router-section" id="how-it-works">
      <div className="section-title">
        <span className="eyebrow">Processing flow</span>
        <h2>How EchoGuard Processes Audio</h2>
        <p>
          Each upload passes through cleaning, routing, specialist model inference, and
          probability-based output.
        </p>
      </div>

      <div className="flow-diagram" aria-label="EchoGuard audio processing flow">
        {flowNodes.map((node, index) => (
          <div className="flow-step-wrap" key={node.key}>
            <FlowNode
              node={node}
              active={
                (node.key === "router" && routerActive) ||
                (node.key === "processing" && Boolean(result)) ||
                (node.key === "output" && Boolean(result))
              }
            />
            {index < flowNodes.length - 1 ? (
              <ArrowRight className="flow-arrow" size={18} strokeWidth={1.8} aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function FlowNode({
  node,
  active = false,
}: {
  node: { key: string; title: string; text: string; icon: typeof FileAudio2 };
  active?: boolean;
}) {
  const Icon = node.icon;
  return (
    <article className={`flow-node flow-node-${node.key} ${active ? "active" : ""}`}>
      <div className="flow-node-top">
        <Icon size={18} />
        <h3>{node.title}</h3>
      </div>
      <p>{node.text}</p>
    </article>
  );
}
