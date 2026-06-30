import { CircleHelp, GitBranch, Home, Layers3, UploadCloud } from "lucide-react";
import { Dock, type DockItemData } from "./Dock";

type Props = {
  onHomeClick: () => void;
  onAnalyzeClick: () => void;
  onModelsClick: () => void;
  onHowClick: () => void;
  onLimitationsClick: () => void;
  activeSection: string;
};

export function Navbar({ onHomeClick, onAnalyzeClick, onModelsClick, onHowClick, onLimitationsClick, activeSection }: Props) {
  const items: DockItemData[] = [
    { icon: <Home size={19} />, label: "Home", onClick: onHomeClick, className: activeSection === "" ? "active" : "" },
    { icon: <UploadCloud size={19} />, label: "Run Analysis", onClick: onAnalyzeClick, className: activeSection === "analysis" ? "active" : "" },
    { icon: <GitBranch size={19} />, label: "How it works", onClick: onHowClick, className: activeSection === "how" ? "active" : "" },
    { icon: <Layers3 size={19} />, label: "Models", onClick: onModelsClick, className: activeSection === "models" ? "active" : "" },
    { icon: <CircleHelp size={19} />, label: "Obvious Q's", onClick: onLimitationsClick, className: activeSection === "limitations" ? "active" : "" },
  ];

  return (
    <nav className="dock-nav" aria-label="Primary navigation">
      <Dock items={items} panelHeight={72} baseItemSize={44} magnification={56} distance={140} dockHeight={96} />
    </nav>
  );
}
