import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/lib/appState";
import { GreetingFlow } from "@/components/GreetingFlow";
import { NameFlow } from "@/components/NameFlow";
import { GadCharacter } from "@/components/GadCharacter";
import { UploadZone } from "@/components/UploadZone";
import { ListeningState } from "@/components/ListeningState";
import { VerdictDisplay } from "@/components/VerdictDisplay";
import { ScriptureDialog } from "@/components/ScriptureDialog";
import { ControlToggles } from "@/components/ControlToggles";
import { NavArrows } from "@/components/NavArrows";
import { motion, AnimatePresence } from "framer-motion";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

export default function Home() {
  const { phase, setPhase, songFileName } = useAppState();
  const [, navigate] = useLocation();
  const [gateMessage, setGateMessage] = useState("");
  const showMainContent = phase === "main" || phase === "listening" || phase === "result";

  useEffect(() => {
    if (!gateMessage) return;
    const timer = setTimeout(() => setGateMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [gateMessage]);

  const goBack = () => {
    if (phase === "main")           setPhase("name");
    else if (phase === "listening") setPhase("main");
    else if (phase === "result")    setPhase("main");
  };

  const goForward = () => {
    if (phase === "main") {
      // HARD GATE: no verdict without an actually submitted song.
      setGateMessage(
        "Please upload a song, paste a link, or search first — then the analysis can begin."
      );
    } else if (phase === "listening") {
      // Analysis already running on a real submission — allow skipping the wait.
      if (songFileName) setPhase("result");
    } else if (phase === "result") {
      navigate("/about");
    }
  };

  return (
    <div className="relative min-h-screen chamber-bg" style={{ fontFamily: ARIAL }}>
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

            <NavArrows
              onBack={goBack}
              onForward={goForward}
              backLabel="Go back"
              forwardLabel={phase === "result" ? "About the analysis" : "Continue"}
            />

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
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "hsl(350, 72%, 36%)",
                  fontFamily: ARIAL,
                }}
                data-testid="text-subheader"
              >
                Music Discernment · For All Nations
              </p>
            </motion.div>

            {/* Friendly gate message — shown when forward is pressed with no song */}
            <AnimatePresence>
              {gateMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "fixed",
                    top: 64,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 90,
                    background: "#ffffff",
                    border: "2px solid #059669",
                    borderRadius: 10,
                    padding: "12px 20px",
                    maxWidth: 420,
                    width: "calc(100% - 40px)",
                    boxShadow: "0 8px 28px rgba(5,150,105,0.20)",
                  }}
                  data-testid="text-gate-message"
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: "hsl(161, 84%, 16%)",
                      fontFamily: ARIAL,
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    {gateMessage}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full max-w-lg">
              <GadCharacter />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                  fontSize: 14,
                  fontStyle: "italic",
                  textAlign: "center",
                  color: "hsl(222, 10%, 34%)",
                  fontFamily: ARIAL,
                  margin: 0,
                }}
              >
                Clear Signal reviews rhythm, repetition, lyric signal, and trance-inducement risk.
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
    </div>
  );
}
