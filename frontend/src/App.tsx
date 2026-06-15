import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { predictAudio, type PredictionResult } from "./api";
import { FrequencyTimeView } from "./components/FrequencyTimeView";
import { Hero } from "./components/Hero";
import { Limitations } from "./components/Limitations";
import { ModelStack } from "./components/ModelStack";
import { Navbar } from "./components/Navbar";
import { ResultCard } from "./components/ResultCard";
import { RouterExplainer } from "./components/RouterExplainer";
import { SoftBackground } from "./components/SoftBackground";
import { UploadCard } from "./components/UploadCard";

export default function App() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("analysis");
  const analyzeRef = useRef<HTMLElement | null>(null);
  const modelsRef = useRef<HTMLElement | null>(null);
  const howRef = useRef<HTMLElement | null>(null);
  const limitationsRef = useRef<HTMLDivElement | null>(null);

  const spectrogramImage = useMemo(
    () => result?.spectrogram_base64 ?? result?.spectrogram_png ?? null,
    [result],
  );

  useEffect(() => {
    const sections = [
      ["analysis", analyzeRef],
      ["how", howRef],
      ["models", modelsRef],
      ["limitations", limitationsRef],
    ] as const;

    function updateActiveSection() {
      const viewportAnchor = window.innerHeight * 0.38;
      const current = sections.reduce(
        (closest, [key, ref]) => {
          const element = ref.current;
          if (!element) {
            return closest;
          }

          const distance = Math.abs(element.getBoundingClientRect().top - viewportAnchor);
          return distance < closest.distance ? { key, distance } : closest;
        },
        { key: "analysis", distance: Number.POSITIVE_INFINITY },
      );

      setActiveSection(current.key);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  async function handleAnalyze(file: File) {
    setIsLoading(true);
    setError(null);
    try {
      const analysis = await predictAudio(file);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Try another audio file or check the backend logs.");
    } finally {
      setIsLoading(false);
    }
  }

  function scrollTo(element: HTMLElement | null) {
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="app-shell">
      <SoftBackground />
      <Navbar
        onAnalyzeClick={() => scrollTo(analyzeRef.current)}
        onModelsClick={() => scrollTo(modelsRef.current)}
        onHowClick={() => scrollTo(howRef.current)}
        onLimitationsClick={() => scrollTo(limitationsRef.current)}
        activeSection={activeSection}
      />

      <main>
        <Hero
          onAnalyzeClick={() => scrollTo(analyzeRef.current)}
          onStackClick={() => scrollTo(modelsRef.current)}
        />

        <section ref={analyzeRef} className="analysis-section" id="analysis">
          <div className="section-title centered">
            <span className="eyebrow">Analysis workspace</span>
            <h2>Upload, screen, and inspect the signal.</h2>
            <p>
              A clean workspace for audio authenticity analysis, branch selection, probability
              estimates, and the frequency-time view.
            </p>
          </div>

          {error && (
            <div className="soft-error global-error" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="analysis-grid">
            <UploadCard onAnalyze={handleAnalyze} isLoading={isLoading} />
            <ResultCard result={result} />
          </div>

          {spectrogramImage && <FrequencyTimeView image={spectrogramImage} />}
        </section>

        <div ref={howRef}>
          <RouterExplainer result={result} />
        </div>

        <div ref={modelsRef}>
          <ModelStack />
        </div>

        <section className="limitations-section" ref={limitationsRef} id="limitations">
          <div className="section-title">
            <span className="eyebrow">FAQ guide</span>
            <h2>Most Obvious Questions</h2>
            <p>
              Quick answers about what EchoGuard AI can and cannot tell you.
            </p>
          </div>
          <Limitations />
        </section>
      </main>
    </div>
  );
}
