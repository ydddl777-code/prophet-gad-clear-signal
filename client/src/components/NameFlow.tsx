import { useState } from "react";
import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";
import { speakHuldah, speakElevenLabs, speakBrowser } from "@/lib/tts";
import { ChevronLeft } from "lucide-react";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

export function NameFlow() {
  const { phase, setPhase, setUserName, voiceEnabled } = useAppState();
  const [nameInput, setNameInput] = useState("");

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
        speakHuldah("Welcome. Submit a song and the Prophet will render a verdict.");
      }
    }
    setPhase("main");
  };

  const handleSkip = () => {
    if (voiceEnabled) {
      speakHuldah("Welcome. Submit a song and the Prophet will render a verdict.");
    }
    setPhase("main");
  };

  if (phase !== "name") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "hsl(355, 22%, 6%)",
        backgroundImage: `
          radial-gradient(ellipse at 30% 30%, rgba(180,10,10,0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 75% 70%, rgba(120,5,5,0.09) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 100%, rgba(184,134,11,0.06) 0%, transparent 50%)
        `,
        fontFamily: ARIAL,
      }}
    >
      {/* Back — top left */}
      <button
        onClick={() => setPhase("greeting")}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "hsl(43, 45%, 38%)",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 13,
          fontFamily: ARIAL,
          padding: "6px 8px",
        }}
        data-testid="button-back-to-greeting"
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Back
      </button>

      {/* Forward — far right, vertically centered */}
      <button
        onClick={() => setPhase("main")}
        title="Skip to main"
        style={{
          position: "fixed",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 60,
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
          fontSize: 18,
        }}
        data-testid="button-forward-to-main"
      >
        ›
      </button>

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
          background: "linear-gradient(90deg, transparent, hsl(43,72%,44%), transparent)",
        }} />

        {/* Huldah label */}
        <p style={{
          fontSize: 10,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "hsl(43, 45%, 42%)",
          fontFamily: ARIAL,
          margin: 0,
          textAlign: "center",
        }}>
          Prophetess Huldah — Your Guide
        </p>

        {/* Question */}
        <h2 style={{
          fontSize: "clamp(1.15rem, 4vw, 1.5rem)",
          color: "hsl(43, 78%, 62%)",
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
          fontSize: 13,
          lineHeight: 1.55,
          textAlign: "center",
          color: "hsl(40, 10%, 56%)",
          fontFamily: ARIAL,
          margin: 0,
          maxWidth: 260,
        }}>
          Share your name so Prophet Gad can address you directly in his verdict.
        </p>

        <p style={{
          fontSize: 11,
          color: "hsl(40, 8%, 38%)",
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
          background: "linear-gradient(90deg, transparent, rgba(184,134,11,0.18), transparent)",
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
            background: "hsl(355, 12%, 10%)",
            border: "1px solid hsl(43, 30%, 20%)",
            borderRadius: 6,
            padding: "10px 16px",
            textAlign: "center",
            fontSize: 14,
            color: "hsl(40, 12%, 82%)",
            fontFamily: ARIAL,
            outline: "none",
          }}
          autoFocus
          data-testid="input-name"
        />

        {/* Continue button — GREEN to match Enter */}
        <button
          onClick={handleContinue}
          style={{
            background: "hsl(142, 52%, 34%)",
            color: "#ffffff",
            fontFamily: ARIAL,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            border: "1px solid hsl(142, 45%, 44%)",
            borderRadius: 20,
            padding: "0.5rem 2.4rem",
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(0,150,60,0.18)",
          }}
          data-testid="button-continue"
        >
          {nameInput.trim() ? "Let the Prophet know" : "Continue"}
        </button>

        {/* Skip */}
        <button
          onClick={handleSkip}
          style={{
            color: "hsl(40, 6%, 40%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            textDecorationColor: "hsl(40,6%,26%)",
            fontFamily: ARIAL,
            fontSize: 12,
          }}
          data-testid="button-skip-name"
        >
          Skip — enter without a name
        </button>
      </motion.div>
    </div>
  );
}
