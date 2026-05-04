import { useAppState } from "@/lib/appState";
import { GreetingFlow } from "@/components/GreetingFlow";
import { NameFlow } from "@/components/NameFlow";
import { GadCharacter } from "@/components/GadCharacter";
import { UploadZone } from "@/components/UploadZone";
import { ListeningState } from "@/components/ListeningState";
import { VerdictDisplay } from "@/components/VerdictDisplay";
import { ScriptureDialog } from "@/components/ScriptureDialog";
import { ControlToggles } from "@/components/ControlToggles";
import { BackgroundPlayer } from "@/components/BackgroundPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AnalysisData } from "@/lib/appState";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

const DEMO_ANALYSIS: AnalysisData = {
  signalClarityScore: 78,
  bpmProfile:          { score: 82, label: "Measured tempo — spiritually consistent" },
  lyricalDoctrine:     { score: 88, label: "Clean spiritual alignment detected" },
  tranceInducement:    { score: 75, label: "Low trance-inducement risk" },
  loopRepetition:      { score: 72, label: "Natural variation — low repetition saturation" },
  culturalDegradation: { score: 85, label: "No cultural degradation markers" },
  rhythmicArchetype:   { score: 79, label: "Sacred rhythmic alignment — constructive archetype" },
};

const NAV_BTN: import("react").CSSProperties = {
  background: "rgba(14,8,6,0.7)",
  border: "1px solid hsl(43,35%,20%)",
  borderRadius: "50%",
  width: 34,
  height: 34,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "hsl(43,45%,38%)",
  position: "fixed" as const,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 50,
};

export default function Home() {
  const { phase, setPhase, setAnalysisData, setVerdict, setSongFileName } = useAppState();
  const showMainContent = phase === "main" || phase === "listening" || phase === "result";

  const goBack = () => {
    if (phase === "main")           setPhase("name");
    else if (phase === "listening") setPhase("main");
    else if (phase === "result")    setPhase("main");
  };

  const goForward = () => {
    if (phase === "main") {
      setSongFileName("Demo — Thunder Road Gospel");
      setAnalysisData(DEMO_ANALYSIS);
      setVerdict("ark");
      setPhase("result");
    } else if (phase === "listening") {
      setPhase("result");
    }
  };

  const showForward = phase === "main" || phase === "listening";

  return (
    <div className="relative min-h-screen chamber-bg" style={{ fontFamily: ARIAL }}>
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/8 via-transparent to-yellow-900/6 pointer-events-none" />

      <GreetingFlow />
      <NameFlow />

      <AnimatePresence>
        {showMainContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center min-h-screen py-6 px-4"
          >
            <div className="w-full crimson-bar h-0.5 absolute top-0 left-0 right-0 opacity-80" />

            {/* Left nav — back */}
            <button onClick={goBack} style={{ ...NAV_BTN, left: 10 }} data-testid="button-back-main">
              <ChevronLeft style={{ width: 15, height: 15 }} />
            </button>

            {/* Right nav — forward */}
            {showForward && (
              <button onClick={goForward} style={{ ...NAV_BTN, right: 10 }} data-testid="button-forward-main">
                <ChevronRight style={{ width: 15, height: 15 }} />
              </button>
            )}

            <ControlToggles />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center mt-10 mb-1"
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "hsl(0, 60%, 52%)",
                  fontFamily: ARIAL,
                }}
                data-testid="text-subheader"
              >
                Music Discernment · For All Nations
              </p>
            </motion.div>

            <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full max-w-lg">
              <GadCharacter />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                  textAlign: "center",
                  color: "hsl(40, 10%, 44%)",
                  fontFamily: ARIAL,
                  margin: 0,
                }}
              >
                Music shapes the soul — Clear Signal tells you which sounds heal and which harm.
              </motion.p>

              <AnimatePresence mode="wait">
                {phase === "main" && (
                  <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                    <UploadZone />
                  </motion.div>
                )}
                {phase === "listening" && (
                  <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                    <ListeningState />
                  </motion.div>
                )}
                {phase === "result" && (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                    <VerdictDisplay />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ScriptureDialog />
          </motion.div>
        )}
      </AnimatePresence>

      <BackgroundPlayer />
    </div>
  );
}
