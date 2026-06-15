import { AudioLines, FileAudio2, GitBranch, Gauge, SlidersHorizontal } from "lucide-react";
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
    key: "speech",
    title: "Speech v2",
    text: "WavLM speech model",
    icon: AudioLines,
  },
  {
    key: "env",
    title: "EnvSDD",
    text: "AST environmental model",
    icon: AudioLines,
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
  const inputNode = flowNodes[0];
  const sanitizeNode = flowNodes[1];
  const routerNode = flowNodes[2];
  const speechNode = flowNodes[3];
  const envNode = flowNodes[4];
  const processNode = flowNodes[5];
  const outputNode = flowNodes[6];

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
        <FlowNode node={inputNode} />
        <StraightArrow className="flow-arrow-one" />
        <FlowNode node={sanitizeNode} />
        <StraightArrow className="flow-arrow-two" />
        <FlowNode node={routerNode} active={routerActive} />

        <svg className="flow-branch" viewBox="0 0 64 228" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <marker
              id="flowBranchArrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M2.2 1.6 L6 4 L2.2 6.4" fill="none" stroke="context-stroke" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          <path className="flow-curve flow-curve-top flow-branch-speech" d="M2 114 C20 114 24 53 62 53" markerEnd="url(#flowBranchArrow)" />
          <path className="flow-curve flow-curve-bottom flow-branch-env" d="M2 114 C20 114 24 175 62 175" markerEnd="url(#flowBranchArrow)" />
        </svg>

        <div className="flow-branch-stack">
          <FlowNode node={speechNode} active={result?.selected_branch === "speech"} />
          <FlowNode node={envNode} active={result?.selected_branch === "environmental"} />
        </div>

        <svg className="flow-merge" viewBox="0 0 64 228" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <marker
              id="flowMergeArrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M2.2 1.6 L6 4 L2.2 6.4" fill="none" stroke="context-stroke" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          <path className="flow-curve flow-merge-curve-top flow-merge-speech" d="M2 53 C32 53 36 114 62 114" markerEnd="url(#flowMergeArrow)" />
          <path className="flow-curve flow-merge-curve-bottom flow-merge-env" d="M2 175 C32 175 36 114 62 114" markerEnd="url(#flowMergeArrow)" />
        </svg>

        <FlowNode node={processNode} active={Boolean(result)} />
        <StraightArrow className="flow-arrow-output" />
        <FlowNode node={outputNode} active={Boolean(result)} />
      </div>
    </section>
  );
}

function StraightArrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`flow-arrow ${className}`} viewBox="0 0 30 16" aria-hidden="true">
      <path d="M1.5 8 H28 M22 2 L28 8 L22 14" />
    </svg>
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
