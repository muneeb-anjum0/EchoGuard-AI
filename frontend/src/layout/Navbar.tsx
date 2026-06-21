type Props = {
  onHomeClick: () => void;
  onAnalyzeClick: () => void;
  onModelsClick: () => void;
  onHowClick: () => void;
  onLimitationsClick: () => void;
  activeSection: string;
};

const navItems = [
  ["analysis", "Run Analysis"],
  ["how", "How it works"],
  ["models", "Models"],
  ["limitations", "Obvious Q's"],
] as const;

export function Navbar({ onHomeClick, onAnalyzeClick, onModelsClick, onHowClick, onLimitationsClick, activeSection }: Props) {
  const actions = {
    analysis: onAnalyzeClick,
    how: onHowClick,
    models: onModelsClick,
    limitations: onLimitationsClick,
  };

  return (
    <nav className="side-nav" aria-label="Primary navigation">
      <button className="logo-button" onClick={onHomeClick}>
        EchoGuard AI
      </button>
      <div className="nav-links">
        {navItems.map(([key, label]) => (
          <button key={key} className={activeSection === key ? "active" : ""} onClick={actions[key]}>
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
