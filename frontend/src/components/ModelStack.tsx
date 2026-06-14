import { Mic2, Waves } from "lucide-react";

const models = [
  {
    title: "Speech Branch",
    eyebrow: "Speech v2",
    icon: Mic2,
    fields: [
      ["Active model", "EchoGuard WavLM Speech v2 NaturalSpeech"],
      ["Base", "microsoft/wavlm-base"],
      [
        "Dataset notes",
        "Native English real speech and modern AI-generated voices, including ElevenLabs, ChatGPT/OpenAI-style voices, Claude-style generated speech, and similar sources.",
      ],
      ["Task", "Likely real human speech vs likely AI-generated speech"],
    ],
    metrics: [
      ["Train", "2,114 clips, balanced 1,057 real / 1,057 fake"],
      ["Val", "372 clips, balanced 186 real / 186 fake"],
      ["Full unseen", "344 clips, 81.69% accuracy, 78.64% F1"],
      ["Precision", "94.31% full unseen"],
      ["Recall", "67.44% full unseen"],
      ["Filtered unseen", "287 clips, 97.56% accuracy, 97.05% F1"],
      ["Known limitation", "One hard synthetic source reduced full unseen performance"],
    ],
  },
  {
    title: "Environmental Branch",
    eyebrow: "EnvSDD AST",
    icon: Waves,
    fields: [
      ["Active model", "EchoGuard AST EnvSDD Environmental Audio Model"],
      ["Base", "MIT/ast-finetuned-audioset-10-10-0.4593"],
      ["Dataset", "EnvSDD Environmental Sound Deepfake Detection"],
      ["Task", "Likely real environmental/background audio vs likely AI-generated environmental audio"],
    ],
    metrics: [
      ["Training shard", "10,000 clips, balanced 5,000 real / 5,000 fake"],
      ["Shard 001 best validation", "99.80% accuracy, 99.80% F1"],
      ["Shard 002 validation", "99.80% accuracy, 99.80% F1"],
      ["Shard 007 validation", "99.85% accuracy, 99.85% F1"],
      ["Shard 003 full test", "10,000 samples, 99.78% accuracy, 99.78% F1"],
      ["Shard 006 full test", "10,000 samples, 99.71% accuracy, 99.71% F1"],
    ],
    note:
      "For general environmental/background audio only, not legal, emergency, military, accident, crisis, or CCTV evidence verification.",
  },
];

export function ModelStack() {
  return (
    <section className="model-section" id="models">
      <div className="section-title">
        <span className="eyebrow">Model stack</span>
        <h2>Model Coverage & Evaluation</h2>
        <p>
          Two local branches handle different audio types, with the router choosing the best fit for
          each upload.
        </p>
      </div>

      <div className="model-grid editorial-model-grid">
        {models.map((item) => {
          const Icon = item.icon;
          return (
            <article className="card model-card editorial-model-card" key={item.title}>
              <header className="editorial-model-header">
                <div>
                  <span>{item.eyebrow}</span>
                  <h3>{item.title}</h3>
                </div>
                <Icon size={22} />
              </header>

              <dl className="model-facts">
                {item.fields.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="model-metrics-table">
                {item.metrics.map(([label, value]) => (
                  <div className="model-metric-row" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              {item.note && <p className="model-note">{item.note}</p>}
            </article>
          );
        })}
      </div>
    </section>
  );
}
