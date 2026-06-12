import { ShieldAlert } from "lucide-react";

export function Limitations() {
  return (
    <section className="card limitation-card" id="limitations">
      <div className="faq-icon">
        <ShieldAlert size={22} />
      </div>
      <div>
        <span className="eyebrow">Limitations</span>
        <h2>Designed for careful interpretation.</h2>
        <p>
          EchoGuard AI is an AI screening tool, not forensic proof. Results are model-based
          probability estimates and should be interpreted carefully. The current v1 system is
          designed for speech and general environmental/background audio.
        </p>
      </div>
    </section>
  );
}
