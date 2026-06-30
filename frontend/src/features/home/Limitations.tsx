import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LIMITATION_CARDS, LIMITATION_NOTE } from "../../content";

export function Limitations() {
  const items = [
    ...LIMITATION_CARDS,
    {
      title: LIMITATION_NOTE.title,
      text: LIMITATION_NOTE.text,
      icon: LIMITATION_NOTE.icon,
    },
  ];
  const [openItem, setOpenItem] = useState(items[0]?.title ?? "");

  function toggleItem(title: string) {
    setOpenItem((current) => (current === title ? "" : title));
  }

  return (
    <div className="limitation-list">
      {items.map((item) => {
        const Icon = item.icon;
        const isOpen = openItem === item.title;
        const panelId = `faq-panel-${slugify(item.title)}`;
        return (
          <article className={`limitation-row ${isOpen ? "open" : ""}`} key={item.title}>
            <button
              className="limitation-trigger"
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleItem(item.title)}
            >
              <span className="limitation-question">
                <Icon size={18} />
                <span>{item.title}</span>
              </span>
              <ChevronDown className="limitation-chevron" size={18} />
            </button>

            <div className="limitation-panel" id={panelId} hidden={!isOpen}>
              <div className="limitation-panel-inner">
                <p>{item.text}</p>
                {"chips" in item && item.chips && (
                  <div className="plain-chip-row">
                    {item.chips.map((chip) => (
                      <span key={chip}>{chip}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
