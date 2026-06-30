import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { INFO_PAGE_KEYS, type InfoPageKey } from "../content";
import { FrequencyTimeView, ResultCard, UploadCard } from "../features/analysis";
import { Hero, Limitations, ModelStack, RouterExplainer } from "../features/home";
import { Footer, Navbar } from "../layout";
import { InfoPage } from "../pages";
import { predictAudio, type PredictionResult } from "../services";
const HOME_PAGE = "home";
const sectionOffset = { reset: 180, active: 160 };

export default function App() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("");
  const [page, setPage] = useState<typeof HOME_PAGE | InfoPageKey>(HOME_PAGE);
  const analyzeRef = useRef<HTMLElement | null>(null);
  const modelsRef = useRef<HTMLElement | null>(null);
  const howRef = useRef<HTMLElement | null>(null);
  const limitationsRef = useRef<HTMLDivElement | null>(null);

  const spectrogramImage = useMemo(
    () => result?.spectrogram_base64 ?? result?.spectrogram_png ?? null,
    [result],
  );

  useEffect(() => {
    function syncPageWithHash() {
      const hashPage = window.location.hash.replace("#", "") as InfoPageKey;
      setPage(INFO_PAGE_KEYS.includes(hashPage) ? hashPage : HOME_PAGE);
    }

    syncPageWithHash();
    window.addEventListener("hashchange", syncPageWithHash);

    return () => window.removeEventListener("hashchange", syncPageWithHash);
  }, []);

  useEffect(() => {
    if (page !== HOME_PAGE) {
      setActiveSection("");
      return;
    }

    const sections = [
      ["analysis", analyzeRef],
      ["how", howRef],
      ["models", modelsRef],
      ["limitations", limitationsRef],
    ] as const;

    function updateActiveSection() {
      const sectionTops = sections
        .map(([key, ref]) => {
          const element = ref.current;
          return element ? { key, top: element.offsetTop } : null;
        })
        .filter((item): item is { key: string; top: number } => Boolean(item))
        .sort((a, b) => a.top - b.top);

      const firstSection = sectionTops[0];
      if (!firstSection || window.scrollY < firstSection.top - sectionOffset.reset) {
        setActiveSection("");
        return;
      }

      const active = sectionTops.reduce((current, section) => {
        return window.scrollY + sectionOffset.active >= section.top ? section : current;
      }, firstSection);

      setActiveSection(active.key);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [page]);

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

  function resetHash() {
    if (window.location.hash) {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }

  function openHome() {
    setPage(HOME_PAGE);
    resetHash();
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function openPage(nextPage: InfoPageKey) {
    setPage(nextPage);
    window.location.hash = nextPage;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function openSection(getElement: () => HTMLElement | null) {
    setPage(HOME_PAGE);
    resetHash();
    window.setTimeout(() => scrollTo(getElement()), 0);
  }

  return (
    <div className="app-shell">
      <Navbar
        onHomeClick={openHome}
        onAnalyzeClick={() => openSection(() => analyzeRef.current)}
        onModelsClick={() => openSection(() => modelsRef.current)}
        onHowClick={() => openSection(() => howRef.current)}
        onLimitationsClick={() => openSection(() => limitationsRef.current)}
        activeSection={activeSection}
      />

      <main>
        {page === HOME_PAGE ? (
          <>
            <Hero
              onAnalyzeClick={() => openSection(() => analyzeRef.current)}
              onStackClick={() => openSection(() => modelsRef.current)}
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
                  Quick answers about what AudioAware AI can and cannot tell you.
                </p>
              </div>
              <Limitations />
            </section>
          </>
        ) : (
          <InfoPage page={page} onBack={openHome} />
        )}
      </main>

      <Footer onHomeClick={openHome} onPageClick={openPage} />
    </div>
  );
}
