type Props = {
  onAnalyzeClick: () => void;
  onModelsClick: () => void;
  onHowClick: () => void;
  onLimitationsClick: () => void;
};

export function Navbar({ onAnalyzeClick, onModelsClick, onHowClick, onLimitationsClick }: Props) {
  return (
    <nav className="side-nav" aria-label="Primary navigation">
      <button className="logo-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        EchoGuard AI
      </button>
      <div className="nav-links">
        <button onClick={onModelsClick}>Models</button>
        <button onClick={onHowClick}>How it works</button>
        <button onClick={onLimitationsClick}>Limitations</button>
        <button onClick={onAnalyzeClick}>Run Analysis</button>
      </div>
    </nav>
  );
}
