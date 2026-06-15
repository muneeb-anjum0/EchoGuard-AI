type Props = {
  onHomeClick: () => void;
  onAnalyzeClick: () => void;
  onModelsClick: () => void;
  onHowClick: () => void;
  onLimitationsClick: () => void;
  activeSection: string;
};

export function Navbar({ onHomeClick, onAnalyzeClick, onModelsClick, onHowClick, onLimitationsClick, activeSection }: Props) {
  return (
    <nav className="side-nav" aria-label="Primary navigation">
      <button className="logo-button" onClick={onHomeClick}>
        EchoGuard AI
      </button>
      <div className="nav-links">
        <button className={activeSection === "analysis" ? "active" : ""} onClick={onAnalyzeClick}>Run Analysis</button>
        <button className={activeSection === "how" ? "active" : ""} onClick={onHowClick}>How it works</button>
        <button className={activeSection === "models" ? "active" : ""} onClick={onModelsClick}>Models</button>
        <button className={activeSection === "limitations" ? "active" : ""} onClick={onLimitationsClick}>Obvious Q's</button>
      </div>
    </nav>
  );
}
