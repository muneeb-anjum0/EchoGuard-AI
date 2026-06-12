import type { ReactNode } from "react";
import { FileAudio2, GitBranch, ListChecks, Mic2, Waves } from "lucide-react";
import type { PredictionResult } from "../api";

type Props = {
  result: PredictionResult | null;
};

const steps = [
  {
    title: "Audio upload",
    text: "The clip is loaded and normalized for analysis.",
    icon: FileAudio2,
  },
  {
    title: "Speech ratio check",
    text: "A VAD-based router estimates how speech-heavy the clip is.",
    icon: ListChecks,
  },
  {
    title: "Specialist model selection",
    text: "The system chooses WavLM for speech or AST for environmental/background audio.",
    icon: GitBranch,
  },
];

export function RouterExplainer({ result }: Props) {
  const selected = result?.selected_model;

  return (
    <section className="router-section" id="how-it-works">
      <div className="section-title">
        <span className="eyebrow">How it works</span>
        <h2>How EchoGuard routes audio</h2>
        <p>A simple routing layer sends each upload to the model branch that best matches the audio type.</p>
      </div>

      <div className="step-grid">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article className="card step-card" key={step.title}>
              <div className="step-index">{index + 1}</div>
              <Icon size={20} />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          );
        })}
      </div>

      <div className="branch-grid">
        <BranchCard
          active={selected === "speech_wavlm"}
          icon={<Mic2 size={20} />}
          title="Speech-heavy audio"
          model="WavLM Speech Branch"
        />
        <BranchCard
          active={selected === "environmental_ast"}
          icon={<Waves size={20} />}
          title="Environmental/background audio"
          model="AST Environmental Branch"
        />
      </div>
    </section>
  );
}

function BranchCard({
  active,
  icon,
  title,
  model,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  model: string;
}) {
  return (
    <article className={`card branch-card ${active ? "selected" : ""}`}>
      <div className="branch-dot" />
      <div className="branch-icon">{icon}</div>
      <div>
        <span>{title}</span>
        <strong>{model}</strong>
      </div>
    </article>
  );
}
