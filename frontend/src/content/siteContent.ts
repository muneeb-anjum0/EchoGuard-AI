import {
  AlertTriangle,
  AudioLines,
  Database,
  FileText,
  Github,
  GitBranch,
  Linkedin,
  Mail,
  Mic2,
  Scale,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Waves,
  type LucideIcon,
} from "lucide-react";

export type InfoPageKey = "privacy" | "terms" | "responsible-use" | "contact";

type LabelValue = [label: string, value: string];

export type InfoPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  icon: LucideIcon;
  sections: Array<{ title: string; body: string }>;
};

export type ModelCardContent = {
  title: string;
  eyebrow: string;
  icon: LucideIcon;
  fields: LabelValue[];
  metrics: LabelValue[];
};

export type LimitationCardContent = {
  title: string;
  text: string;
  icon: LucideIcon;
  chips?: string[];
};

export const INFO_PAGE_KEYS: InfoPageKey[] = ["privacy", "terms", "responsible-use", "contact"];

export const INFO_PAGES: Record<InfoPageKey, InfoPageContent> = {
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Notice",
    intro: "How EchoGuard AI handles audio, analysis outputs, and basic project information.",
    icon: ShieldCheck,
    sections: [
      {
        title: "Audio handling",
        body: "Uploaded audio is used for the analysis workflow shown in the app. Avoid uploading private, sensitive, or legally restricted recordings unless you are authorized to process them.",
      },
      {
        title: "Analysis data",
        body: "The interface displays routing decisions, model probabilities, and generated signal views. These outputs are meant to help review authenticity, not to serve as a final factual determination.",
      },
      {
        title: "External links",
        body: "GitHub and LinkedIn links open outside EchoGuard AI. Those services are governed by their own privacy practices.",
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms of Use",
    intro: "Clear expectations for using EchoGuard AI responsibly and interpreting its results.",
    icon: Scale,
    sections: [
      {
        title: "Screening tool",
        body: "EchoGuard AI provides probabilistic screening for audio authenticity. It does not provide legal, emergency, forensic, or guaranteed verification services.",
      },
      {
        title: "User responsibility",
        body: "You are responsible for the audio you upload, the permissions attached to it, and the decisions you make after reviewing the output.",
      },
      {
        title: "No warranty",
        body: "Model performance can vary across speakers, sources, recording quality, compression, background noise, and synthetic generation methods.",
      },
    ],
  },
  "responsible-use": {
    eyebrow: "Responsible use",
    title: "Use EchoGuard AI With Context",
    intro: "The model output is most useful when treated as one signal among several, not the whole answer.",
    icon: FileText,
    sections: [
      {
        title: "Review uncertainty",
        body: "Pay attention to confidence, branch routing, and limitations. A low-confidence result should be interpreted cautiously.",
      },
      {
        title: "Avoid high-stakes decisions",
        body: "Do not use EchoGuard AI alone for legal disputes, safety incidents, employment decisions, surveillance review, or crisis response.",
      },
      {
        title: "Keep records",
        body: "For serious review work, keep the original file, metadata, chain of custody, and notes about how the analysis was performed.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Project Links",
    intro: "Find the developer profile and project presence for EchoGuard AI.",
    icon: Mail,
    sections: [
      { title: "Email", body: "muneeb.anjum0@gmail.com" },
      { title: "GitHub", body: "github.com/muneeb-anjum0" },
      { title: "LinkedIn", body: "www.linkedin.com/in/muneebanjum335/" },
    ],
  },
};

export const MODEL_CARDS: ModelCardContent[] = [
  {
    title: "Speech Branch",
    eyebrow: "Speech v2",
    icon: Mic2,
    fields: [
      ["Active model", "EchoGuard WavLM Speech v2 NaturalSpeech"],
      ["Base", "microsoft/wavlm-base"],
      [
        "Dataset notes",
        "Native English real speech and modern AI-generated voices, including ElevenLabs, ChatGPT/OpenAI-style voices, Claude-style generated speech, and similar sources.",
      ],
      ["Task", "Likely real human speech vs likely AI-generated speech"],
    ],
    metrics: [
      ["Train", "2,114 clips, balanced 1,057 real / 1,057 fake"],
      ["Val", "372 clips, balanced 186 real / 186 fake"],
      ["Full unseen", "344 clips, 81.69% accuracy, 78.64% F1"],
      ["Precision", "94.31% full unseen"],
      ["Recall", "67.44% full unseen"],
      ["Filtered unseen", "287 clips, 97.56% accuracy, 97.05% F1"],
      ["Known limitation", "One hard synthetic source reduced full unseen performance"],
    ],
  },
  {
    title: "Environmental Branch",
    eyebrow: "EnvSDD AST",
    icon: Waves,
    fields: [
      ["Active model", "EchoGuard AST EnvSDD Environmental Audio Model"],
      ["Base", "MIT/ast-finetuned-audioset-10-10-0.4593"],
      ["Dataset", "EnvSDD Environmental Sound Deepfake Detection"],
      ["Task", "Likely real environmental/background audio vs likely AI-generated environmental audio"],
    ],
    metrics: [
      ["Training shard", "10,000 clips, balanced 5,000 real / 5,000 fake"],
      ["Shard 1 validation", "99.80% accuracy, 99.80% F1"],
      ["Shard 2 validation", "99.80% accuracy, 99.80% F1"],
      ["Shard 7 validation", "99.85% accuracy, 99.85% F1"],
      ["Shard 3-6 full test", "10,000 samples, 99.78% accuracy, 99.78% F1"],
    ],
  },
];

export const LIMITATION_CARDS: LimitationCardContent[] = [
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

export const LIMITATION_NOTE = {
  title: "How should I read the output?",
  text: "Results are model estimates, not forensic conclusions. Confidence below 75% is displayed as Uncertain, and the raw real/fake probabilities remain visible for borderline cases.",
  icon: SlidersHorizontal,
};

export const FOOTER_PAGES: Array<{ label: string; page?: InfoPageKey; action: "home" | "page" }> = [
  { label: "Home", action: "home" },
  { label: "Privacy", page: "privacy", action: "page" },
  { label: "Terms", page: "terms", action: "page" },
  { label: "Responsible Use", page: "responsible-use", action: "page" },
];

export const FOOTER_LINKS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "https://github.com/muneeb-anjum0", label: "github.com/muneeb-anjum0", icon: Github },
  { href: "https://www.linkedin.com/in/muneebanjum335/", label: "linkedin.com/in/muneebanjum335", icon: Linkedin },
  { href: "mailto:muneeb.anjum0@gmail.com", label: "muneeb.anjum0@gmail.com", icon: Mail },
  {
    href: "https://www.kaggle.com/datasets/muneebanjumm/echoguard-naturalspeech-v2/",
    label: "Kaggle dataset",
    icon: Database,
  },
];
