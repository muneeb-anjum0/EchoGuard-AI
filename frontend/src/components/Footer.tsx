import { Database, Github, Linkedin, Mail, ShieldCheck } from "lucide-react";

export type InfoPageKey = "privacy" | "terms" | "responsible-use" | "contact";

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
          <button onClick={onHomeClick}>Home</button>
          <button onClick={() => onPageClick("privacy")}>Privacy</button>
          <button onClick={() => onPageClick("terms")}>Terms</button>
          <button onClick={() => onPageClick("responsible-use")}>Responsible Use</button>
        </div>

        <div>
          <h3>Useful links</h3>
          <a href="https://github.com/muneeb-anjum0" target="_blank" rel="noreferrer">
            <Github size={16} />
            github.com/muneeb-anjum0
          </a>
          <a href="https://www.linkedin.com/in/muneebanjum335/" target="_blank" rel="noreferrer">
            <Linkedin size={16} />
            linkedin.com/in/muneebanjum335
          </a>
          <a href="mailto:muneeb.anjum0@gmail.com">
            <Mail size={16} />
            muneeb.anjum0@gmail.com
          </a>
          <a href="https://www.kaggle.com/datasets/muneebanjumm/echoguard-naturalspeech-v2/" target="_blank" rel="noreferrer">
            <Database size={16} />
            Kaggle dataset
          </a>
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
