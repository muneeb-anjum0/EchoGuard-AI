import { Activity } from "lucide-react";

type Props = {
  image?: string | null;
};

export function FrequencyTimeView({ image }: Props) {
  return (
    <section className="card frequency-card fade-in">
      <div className="frequency-header">
        <div>
          <span className="eyebrow">Frequency-time view</span>
          <h2>Frequency-time view</h2>
          <p>A spectrogram-style view of how energy changes across frequency and time.</p>
        </div>
        <Activity size={22} />
      </div>

      <div className="tool-pills">
        <span>Spectrogram</span>
        <span>16 kHz mono</span>
        <span>Model input view</span>
      </div>

      {image ? (
        <div className="spectrogram-image-wrap">
          <img src={`data:image/png;base64,${image}`} alt="Frequency-time spectrogram view" />
        </div>
      ) : (
        <div className="frequency-placeholder">
          <div className="placeholder-trace" aria-hidden="true">
            <svg viewBox="0 0 520 150">
              <defs>
                <linearGradient id="placeholderTraceGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#CBD5E1" />
                  <stop offset="48%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#93C5FD" />
                </linearGradient>
              </defs>
              <path className="trace-shadow" d="M20 82 C72 58, 118 58, 158 82 S230 118, 282 72 S372 28, 430 66 S486 104, 500 78" />
              <path className="placeholder-trace-line" d="M20 82 C72 58, 118 58, 158 82 S230 118, 282 72 S372 28, 430 66 S486 104, 500 78" />
            </svg>
          </div>
          <p>Upload an audio clip to generate the frequency-time view.</p>
        </div>
      )}
    </section>
  );
}
