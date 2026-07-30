import { useEffect, useRef, useState } from "react";
import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";
import { speakHuldah, speakElevenLabs, speakBrowser, playClip, VOICE_CLIPS } from "@/lib/tts";
import { NavArrows } from "@/components/NavArrows";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

export function NameFlow() {
  const { phase, setPhase, setUserName, voiceEnabled } = useAppState();
  const [nameInput, setNameInput] = useState("");
  const hasGuided = useRef(false);

  // Huldah's fixed guide greeting (HeyGen render) when her page opens.
  useEffect(() => {
    if (phase === "name" && voiceEnabled && !hasGuided.current) {
      hasGuided.current = true;
      playClip(VOICE_CLIPS.huldahGuide);
    }
    if (phase !== "name") hasGuided.current = false;
  }, [phase, voiceEnabled]);

  const handleContinue = async () => {
    const name = nameInput.trim();
    if (name) {
      setUserName(name);
      if (voiceEnabled) {
        const greeting = `Welcome, ${name}. The signal is ready.`;
        const audio = await speakElevenLabs(greeting, "gad");
        if (!audio) speakBrowser(greeting, { rate: 0.78, pitch: 0.55 });
      }
    } else {
      if (voiceEnabled) {
        playClip(VOICE_CLIPS.huldahUpload).then((ok) => {
          if (!ok) speakHuldah("Welcome. Submit a song and the Prophet will render a verdict.");
        });
      }
    }
    setPhase("main");
  };

  const handleSkip = () => {
    if (voiceEnabled) {
      playClip(VOICE_CLIPS.huldahUpload).then((ok) => {
        if (!ok) speakHuldah("Welcome. Submit a song and the Prophet will render a verdict.");
      });
    }
    setPhase("main");
  };

  if (phase !== "name") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "hsl(210, 20%, 98.5%)",
        backgroundImage: `
          radial-gradient(ellipse at 30% 30%, rgba(212,160,23,0.07) 0%, transparent 60%),
          radial-gradient(ellipse at 75% 70%, rgba(5,150,105,0.05) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 100%, rgba(212,160,23,0.06) 0%, transparent 50%)
        `,
        fontFamily: ARIAL,
      }}
    >
      <NavArrows
        onBack={() => setPhase("greeting")}
        onForward={() => setPhase("main")}
        backLabel="Back to welcome"
        forwardLabel="Skip to the analysis"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-5 max-w-sm w-full px-6"
      >
        {/* Gold accent line */}
        <div style={{
          width: 48,
          height: 2,
          borderRadius: 1,
          background: "linear-gradient(90deg, transparent, hsl(42,95%,45%), transparent)",
        }} />

        {/* Huldah label */}
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "hsl(42, 95%, 34%)",
          fontFamily: ARIAL,
          margin: 0,
          textAlign: "center",
        }}>
          Prophetess Huldah — Your Guide
        </p>

        {/* Question */}
        <h2 style={{
          fontSize: "clamp(1.15rem, 4vw, 1.5rem)",
          color: "hsl(42, 95%, 34%)",
          fontFamily: ARIAL,
          fontWeight: 700,
          letterSpacing: "0.04em",
          margin: 0,
          textAlign: "center",
          lineHeight: 1.3,
        }}>
          What would you like us to call you?
        </h2>

        <p style={{
          fontSize: 14,
          lineHeight: 1.55,
          textAlign: "center",
          color: "hsl(222, 12%, 28%)",
          fontFamily: ARIAL,
          margin: 0,
          maxWidth: 280,
        }}>
          Share your name so Prophet Gad can address you directly in his verdict.
        </p>

        <p style={{
          fontSize: 12,
          color: "hsl(222, 10%, 36%)",
          fontFamily: ARIAL,
          margin: 0,
          textAlign: "center",
        }}>
          Optional — you may skip at any time.
        </p>

        {/* Divider */}
        <div style={{
          width: "100%",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.5), transparent)",
        }} />

        {/* Input */}
        <input
          type="text"
          placeholder="Your name..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          style={{
            width: "100%",
            background: "#ffffff",
            border: "1px solid hsl(220, 15%, 84%)",
            borderRadius: 6,
            padding: "10px 16px",
            textAlign: "center",
            fontSize: 15,
            color: "hsl(222, 20%, 12%)",
            fontFamily: ARIAL,
            outline: "none",
            boxShadow: "0 2px 10px rgba(184,134,11,0.10)",
          }}
          autoFocus
          data-testid="input-name"
        />

        {/* Continue button — GREEN to match Enter */}
        <button
          onClick={handleContinue}
          style={{
            background: "#059669",
            color: "#ffffff",
            fontFamily: ARIAL,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            border: "1px solid #047857",
            borderRadius: 20,
            padding: "0.55rem 2.4rem",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(5,150,105,0.32)",
          }}
          data-testid="button-continue"
        >
          {nameInput.trim() ? "Let the Prophet know" : "Continue"}
        </button>

        {/* Skip */}
        <button
          onClick={handleSkip}
          style={{
            color: "hsl(222, 10%, 36%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            textDecorationColor: "hsl(222, 10%, 60%)",
            fontFamily: ARIAL,
            fontSize: 13,
          }}
          data-testid="button-skip-name"
        >
          Skip — enter without a name
        </button>
      </motion.div>
    </div>
  );
}
