import { LIMITATION_CARDS, LIMITATION_NOTE } from "../../content";

export function Limitations() {
  return (
    <div className="limitation-grid">
      {LIMITATION_CARDS.map((item) => {
        const Icon = item.icon;
        return (
          <article className="card limitation-mini-card" key={item.title}>
            <div className="limitation-mini-head">
              <Icon size={18} />
              <h3>{item.title}</h3>
            </div>
            <p>{item.text}</p>
            {item.chips && (
              <div className="plain-chip-row">
                {item.chips.map((chip) => (
                  <span key={chip}>{chip}</span>
                ))}
              </div>
            )}
          </article>
        );
      })}
      <article className="card limitation-mini-card limitation-note-card">
        <div className="limitation-mini-head">
          <LIMITATION_NOTE.icon size={18} />
          <h3>{LIMITATION_NOTE.title}</h3>
        </div>
        <p>{LIMITATION_NOTE.text}</p>
      </article>
    </div>
  );
}
