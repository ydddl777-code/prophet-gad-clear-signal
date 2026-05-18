import { useEffect, useState } from "react";
import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";
import { speakHuldah } from "@/lib/tts";
import { audioManager } from "@/lib/audioManager";
import { WaveBanner } from "@/components/WaveBanner";
import { useLocation } from "wouter";

const gadMainImg = "/images/gad-prophet-kid.jpg";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
const BG_COLOR = "hsl(355, 22%, 6%)";

const HULDAH_GREETING =
  "Friend... stranger... welcome. " +
  "You have arrived at Clear Signal — a place of discernment, not judgment. " +
  "I am Prophetess Huldah, and I am here to guide you. " +
  "Before we begin — how would you like to be addressed? " +
  "You are not required to share your name. " +
  "But if you do, the Prophet will speak to you directly, " +
  "and your results will be prepared in your honor. " +
  "When you are ready, press Enter.";

export function GreetingFlow() {
  const { phase, setPhase, voiceEnabled } = useAppState();
  const [hasGreeted, setHasGreeted] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (phase === "greeting" && !hasGreeted) {
      setHasGreeted(true);
      if (voiceEnabled) setTimeout(() => speakHuldah(HULDAH_GREETING), 2000);
    }
  }, [phase, voiceEnabled, hasGreeted]);

  if (phase !== "greeting") return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        background: BG_COLOR,
        backgroundImage: `
          radial-gradient(ellipse at 20% 20%, rgba(180,10,10,0.10) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 80%, rgba(120,5,5,0.08) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 100%, rgba(184,134,11,0.06) 0%, transparent 50%)
        `,
        fontFamily: ARIAL,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          borderBottom: "1px solid rgba(184,134,11,0.08)",
          background: "rgba(14,6,4,0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span style={{ fontSize: 28 }} aria-label="Lion">🦁</span>

        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <h1 style={{
              fontFamily: ARIAL,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: "0.08em",
              color: "hsl(43,72%,54%)",
              margin: 0,
              lineHeight: 1.1,
            }}>
              Clear Signal
            </h1>
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "hsl(270,50%,75%)",
              background: "hsl(270,30%,18%)",
              border: "1px solid hsl(270,30%,30%)",
              borderRadius: 4,
              padding: "2px 6px",
              alignSelf: "flex-start",
              marginTop: 4,
            }}>
              BETA
            </span>
          </div>
          <p style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "hsl(0,45%,40%)",
            fontFamily: ARIAL,
            margin: "2px 0 0",
          }}>
            PGAI  ·  Remnant Seed LLC
          </p>
        </div>

        <span style={{ fontSize: 28 }} aria-label="Breastplate">🛡️</span>
      </div>

      {/* Nav arrow */}
      <button
        onClick={() => setPhase("name")}
        title="Skip to name page"
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
        data-testid="button-nav-forward-greeting"
      >
        ›
      </button>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          padding: "24px 20px 40px",
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <motion.img
          src={gadMainImg}
          alt="Prophet Gad"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1 }}
          style={{
            width: "min(260px, 70vw)",
            height: "auto",
            borderRadius: 8,
            objectFit: "cover",
            border: "1px solid rgba(184,134,11,0.15)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          }}
        />

        <WaveBanner />

        <p style={{
          fontSize: 14,
          lineHeight: 1.8,
          textAlign: "justify",
          color: "hsl(40, 12%, 72%)",
          fontFamily: ARIAL,
          margin: 0,
          maxWidth: 560,
        }}>
          In the spirit of the ancient Prophet Gad — commissioned by King David to oversee the
          musicians of the temple — that same discerning spirit is here with us today. Gad
          directed what the Levites sang, when they sang it, how they sang it, the instruments
          they played, and the order in which they ministered before the Lord. His was not a
          ceremonial title but a divine commission over sacred sound. Submit any song for
          Prophet Gad's evaluation — he will render his verdict as he did in the days of the
          temple.
        </p>

        <div style={{ borderLeft: "3px solid hsl(0, 55%, 38%)", paddingLeft: 14, maxWidth: 540, width: "100%" }}>
          <p style={{ fontSize: 13, fontStyle: "italic", color: "hsl(0, 40%, 60%)", fontFamily: ARIAL, margin: 0, lineHeight: 1.7 }}>
            "He stationed the Levites in the temple of the Lord with cymbals,
            harps and lyres in the way prescribed by David and Gad the king's
            seer and Nathan the prophet; this was commanded by the Lord
            through his prophets." — 2 Chronicles 29:25
          </p>
        </div>

        <p style={{ fontSize: 13, fontStyle: "italic", color: "hsl(43, 72%, 54%)", fontFamily: ARIAL, margin: 0, textAlign: "center", letterSpacing: "0.04em" }}>
          True worship always has a clear signal.
        </p>

        <div className="w-full max-w-xl h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(180,10,10,0.22), transparent)" }} />

        <p style={{ fontSize: 13, fontStyle: "italic", textAlign: "center", color: "hsl(40,12%,58%)", fontFamily: ARIAL, margin: 0 }}>
          Prophetess Huldah, your guide, will walk you through the process.
        </p>

        <button
          onClick={() => { audioManager.startBackground(); setPhase("name"); }}
          className="rounded-full font-bold tracking-[0.12em]"
          style={{
            background: "hsl(142, 52%, 34%)",
            color: "#ffffff",
            fontFamily: ARIAL,
            fontSize: 14,
            border: "1px solid hsl(142, 45%, 44%)",
            cursor: "pointer",
            padding: "0.55rem 3rem",
            boxShadow: "0 2px 14px rgba(0,150,60,0.22)",
          }}
          data-testid="button-enter"
        >
          Enter
        </button>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 4, width: "100%", maxWidth: 480 }}>
          <button onClick={() => { audioManager.startBackground(); setPhase("main"); }} style={{ background: "none", border: "1px solid hsl(43,30%,18%)", borderRadius: 4, padding: "5px 14px", cursor: "pointer", color: "hsl(43,40%,42%)", fontSize: 11, fontFamily: ARIAL, letterSpacing: "0.06em" }}>
            Submit a Song
          </button>
          <button onClick={() => navigate("/about")} style={{ background: "none", border: "1px solid hsl(43,30%,18%)", borderRadius: 4, padding: "5px 14px", cursor: "pointer", color: "hsl(43,40%,42%)", fontSize: 11, fontFamily: ARIAL, letterSpacing: "0.06em" }}>
            About the Analysis
          </button>
        </div>

      </motion.div>
    </div>
  );
}
