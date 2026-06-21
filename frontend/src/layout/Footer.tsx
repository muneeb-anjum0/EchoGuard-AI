import { ShieldCheck } from "lucide-react";
import { FOOTER_LINKS, FOOTER_PAGES, type InfoPageKey } from "../content";

type Props = {
  onHomeClick: () => void;
  onPageClick: (page: InfoPageKey) => void;
};

export function Footer({ onHomeClick, onPageClick }: Props) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="eyebrow">EchoGuard AI</span>
        <h2>Audio authenticity screening, clearly bounded.</h2>
        <p>
          A local-first interface for routing audio through specialist models, reviewing
          probability scores, and understanding where the system should and should not be used.
        </p>
      </div>

      <div className="footer-columns">
        <div>
          <h3>Explore</h3>
          {FOOTER_PAGES.map(({ label, page, action }) => (
            <button key={label} onClick={() => (action === "home" ? onHomeClick() : page && onPageClick(page))}>
              {label}
            </button>
          ))}
        </div>

        <div>
          <h3>Useful links</h3>
          {FOOTER_LINKS.map(({ href, label, icon: Icon }) => (
            <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel={href.startsWith("mailto:") ? undefined : "noreferrer"}>
              <Icon size={16} />
              {label}
            </a>
          ))}
        </div>

        <div>
          <h3>Status</h3>
          <p className="footer-note">
            <ShieldCheck size={16} />
            Probabilistic screening only. Review results with context before important decisions.
          </p>
        </div>
      </div>

      <p className="footer-credits">
        Built by Muneeb Anjum. EchoGuard AI is for research-style audio screening and careful review.
      </p>
    </footer>
  );
}
