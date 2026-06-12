import { BadgeCheck, BrainCircuit, Mic2, Waves } from "lucide-react";

const models = [
  {
    title: "Speech Branch",
    model: "WavLM",
    dataset: "FoR for-norm",
    task: "Real human speech vs fake/generated speech",
    metric: "F1 0.971 on unseen FoR shard 002 validation",
    status: "Stable v1",
    icon: Mic2,
  },
  {
    title: "Environmental Branch",
    model: "AST",
    dataset: "EnvSDD",
    task: "Real vs AI-generated environmental/background audio",
    metric: "F1 around 0.997 to 0.998 on unseen EnvSDD shards",
    status: "Strong v1",
    icon: Waves,
  },
];

export function ModelStack() {
  return (
    <section className="model-section" id="models">
      <div className="section-title">
        <span className="eyebrow">Model stack</span>
        <h2>Two focused branches behind one upload.</h2>
        <p>Each branch is tuned for a different type of audio, keeping the experience simple.</p>
      </div>

      <div className="model-grid">
        {models.map((item) => {
          const Icon = item.icon;
          return (
            <article className="card model-card lift-card" key={item.title}>
              <div className="model-head">
                <div className="model-icon">
                  <Icon size={22} />
                </div>
                <span className="status-pill">
                  <BadgeCheck size={14} />
                  {item.status}
                </span>
              </div>
              <h3>{item.title}</h3>
              <dl>
                <div>
                  <dt>Model</dt>
                  <dd>{item.model}</dd>
                </div>
                <div>
                  <dt>Dataset</dt>
                  <dd>{item.dataset}</dd>
                </div>
                <div>
                  <dt>Task</dt>
                  <dd>{item.task}</dd>
                </div>
              </dl>
              <div className="metric-pill">
                <BrainCircuit size={15} />
                {item.metric}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
