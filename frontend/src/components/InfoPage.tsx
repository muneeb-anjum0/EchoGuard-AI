import { ArrowLeft, FileText, Mail, Scale, ShieldCheck } from "lucide-react";
import type { InfoPageKey } from "./Footer";

type PageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  icon: typeof ShieldCheck;
  sections: Array<{
    title: string;
    body: string;
  }>;
};

const pages: Record<InfoPageKey, PageContent> = {
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
      {
        title: "Email",
        body: "muneeb.anjum0@gmail.com",
      },
      {
        title: "GitHub",
        body: "github.com/muneeb-anjum0",
      },
      {
        title: "LinkedIn",
        body: "www.linkedin.com/in/muneebanjum335/",
      },
    ],
  },
};

type Props = {
  page: InfoPageKey;
  onBack: () => void;
};

export function InfoPage({ page, onBack }: Props) {
  const content = pages[page];
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
