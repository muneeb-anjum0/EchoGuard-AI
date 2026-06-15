import { Activity } from "lucide-react";

type Props = {
  image?: string | null;
};

export function FrequencyTimeView({ image }: Props) {
  if (!image) {
    return null;
  }

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

      <div className="spectrogram-image-wrap">
        <img src={`data:image/png;base64,${image}`} alt="Frequency-time spectrogram view" />
      </div>
    </section>
  );
}
