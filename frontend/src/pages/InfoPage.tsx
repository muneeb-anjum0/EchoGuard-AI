import { ArrowLeft } from "lucide-react";
import { INFO_PAGES, type InfoPageKey } from "../content";

type Props = {
  page: InfoPageKey;
  onBack: () => void;
};

export function InfoPage({ page, onBack }: Props) {
  const content = INFO_PAGES[page];
  const Icon = content.icon;

  return (
    <section className="info-page">
      <button className="info-back-button" onClick={onBack}>
        <ArrowLeft size={16} />
        Back to EchoGuard AI
      </button>

      <div className="section-title">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </div>

      <div className="info-page-grid">
        {content.sections.map((section) => (
          <article className="info-card" key={section.title}>
            <Icon size={20} />
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
