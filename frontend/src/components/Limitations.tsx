import { AlertTriangle, AudioLines, GitBranch, Mic2, Scale, ShieldAlert, SlidersHorizontal, Waves } from "lucide-react";

const limitationCards = [
  {
    title: "Is EchoGuard AI proof?",
    text: "EchoGuard AI gives probability-based screening results. It does not verify, prove, or certify whether an audio clip is real or AI-generated. Results should not be used alone for legal, disciplinary, emergency, safety-critical, or public-accusation decisions.",
    icon: ShieldAlert,
  },
  {
    title: "What speech audio is covered?",
    text: "The speech branch is tuned for native English speaker audio and modern AI-style voices similar to ElevenLabs, ChatGPT/OpenAI-style voice generation, Claude-style generated speech, and related synthetic speech sources. It is not a universal detector for every language, accent, recording setup, or generation system.",
    icon: Mic2,
  },
  {
    title: "Why can some fake speech pass?",
    text: "Full unseen speech testing reached 81.69% accuracy and 78.64% F1. One hard synthetic voice source closely resembled real speech and caused most missed fake cases. Excluding that source, filtered unseen testing reached 97.56% accuracy and 97.05% F1.",
    icon: AlertTriangle,
    chips: ["Full unseen: 81.69% acc", "Filtered unseen: 97.56% acc"],
  },
  {
    title: "Can Likely Real still be wrong?",
    text: "In the full unseen speech test, the model correctly caught 116 fake clips but missed 56 fake clips, mostly from one difficult source. This means a Likely Real result should not be treated as proof that the clip is genuinely human.",
    icon: Scale,
    chips: ["Fake recall: 67.44%", "Missed fake: 56"],
  },
  {
    title: "What environmental audio is covered?",
    text: "The environmental branch is trained for general background and non-speech audio such as ambience, urban sounds, crowds, traffic, and general environmental events. It is not designed for legal evidence, emergency incidents, military/security claims, or crisis footage verification.",
    icon: Waves,
    chips: ["EnvSDD AST", "Background audio"],
  },
  {
    title: "Where should I avoid using it?",
    text: "Do not use EchoGuard AI as proof for gunshots, explosions, accidents, war scenes, protest violence, CCTV evidence, emergency calls, or legal disputes. These contexts require expert review, chain-of-custody handling, and dedicated forensic methods.",
    icon: ShieldAlert,
  },
  {
    title: "Does audio quality matter?",
    text: "Music, heavy background noise, overlapping speakers, very long clips, poor microphones, compression artifacts, and heavily edited audio can reduce reliability. The system works best when the clip mainly contains clear speech or clear environmental/background sound.",
    icon: AudioLines,
  },
  {
    title: "Can routing be uncertain?",
    text: "EchoGuard AI routes uploads to a speech model or environmental model. Mixed clips, music, speech over loud background sound, or ambiguous audio may be routed imperfectly. The selected branch and router decision should always be shown with the result.",
    icon: GitBranch,
  },
];

export function Limitations() {
  return (
    <div className="limitation-grid">
      {limitationCards.map((item) => {
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
          <SlidersHorizontal size={18} />
          <h3>How should I read the output?</h3>
        </div>
        <p>
          Results are model estimates, not forensic conclusions. Confidence below 75% is displayed
          as Uncertain, and the raw real/fake probabilities remain visible for borderline cases.
        </p>
      </article>
    </div>
  );
}
