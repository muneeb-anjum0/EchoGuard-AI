import { FileAudio2 } from "lucide-react";

export function SupportedAudio() {
  return (
    <section className="card faq-card">
      <div className="faq-icon">
        <FileAudio2 size={22} />
      </div>
      <div>
        <span className="eyebrow">Can I upload any audio?</span>
        <h2>Common audio formats are supported.</h2>
        <p>
          EchoGuard AI can accept common audio formats such as WAV, MP3, FLAC, OGG, and M4A. The
          active branches are designed for human speech and general environmental/background audio.
          Music, heavily mixed audio, very noisy recordings, or very long clips may produce less
          reliable results.
        </p>
      </div>
    </section>
  );
}
