import { MODEL_CARDS } from "../../content";

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
        {MODEL_CARDS.map((item) => {
          const Icon = item.icon;
          return (
            <article className="model-flip-card" key={item.title} tabIndex={0}>
              <div className="model-flip-inner">
                <section className="card model-card editorial-model-card model-flip-face model-flip-front">
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
                </section>

                <section className="card model-card editorial-model-card model-flip-face model-flip-back">
                  <header className="editorial-model-header">
                    <div>
                      <span>{item.eyebrow}</span>
                      <h3>Evaluation</h3>
                    </div>
                    <Icon size={22} />
                  </header>

                  <div className="model-metrics-table">
                    {item.metrics.map(([label, value]) => (
                      <div className="model-metric-row" key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
