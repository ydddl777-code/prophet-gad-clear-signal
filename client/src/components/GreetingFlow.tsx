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
        {/* Lion icon — replaces emoji */}
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-label="Lion">
          <circle cx="16" cy="16" r="13" fill="hsl(43,55%,22%)" />
          <circle cx="10" cy="8"  r="3.5" fill="hsl(43,55%,22%)" />
          <circle cx="22" cy="8"  r="3.5" fill="hsl(43,55%,22%)" />
          <circle cx="5"  cy="13" r="3"   fill="hsl(43,55%,22%)" />
          <circle cx="27" cy="13" r="3"   fill="hsl(43,55%,22%)" />
          <circle cx="6"  cy="20" r="2.8" fill="hsl(43,55%,22%)" />
          <circle cx="26" cy="20" r="2.8" fill="hsl(43,55%,22%)" />
          <circle cx="16" cy="16" r="8.5" fill="hsl(43,62%,50%)" />
          <circle cx="13" cy="15" r="1.5" fill="hsl(20,8%,8%)" />
          <circle cx="19" cy="15" r="1.5" fill="hsl(20,8%,8%)" />
          <circle cx="13.3" cy="14.6" r="0.5" fill="rgba(255,255,255,0.45)" />
          <circle cx="19.3" cy="14.6" r="0.5" fill="rgba(255,255,255,0.45)" />
          <ellipse cx="16" cy="17.8" rx="1.6" ry="1.1" fill="hsl(25,50%,30%)" />
          <path d="M14.2 20 Q16 21.8 17.8 20" stroke="hsl(20,25%,20%)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </svg>

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

        {/* Breastplate icon — 12 tribal stones */}
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-label="Breastplate of the High Priest">
          <path d="M16 2.5L29 8V20Q16 31 3 20V8Z" fill="hsl(43,38%,18%)" stroke="hsl(43,62%,46%)" strokeWidth="1.4" />
          {/* Row 1 */}
          <rect x="7.5"  y="8.5" width="4" height="3" rx="0.6" fill="hsl(0,68%,52%)"   opacity="0.9" />
          <rect x="14"   y="8.5" width="4" height="3" rx="0.6" fill="hsl(120,52%,44%)" opacity="0.9" />
          <rect x="20.5" y="8.5" width="4" height="3" rx="0.6" fill="hsl(200,70%,54%)" opacity="0.9" />
          {/* Row 2 */}
          <rect x="7.5"  y="12.5" width="4" height="3" rx="0.6" fill="hsl(43,80%,52%)"  opacity="0.9" />
          <rect x="14"   y="12.5" width="4" height="3" rx="0.6" fill="hsl(270,55%,56%)" opacity="0.9" />
          <rect x="20.5" y="12.5" width="4" height="3" rx="0.6" fill="hsl(30,78%,54%)"  opacity="0.9" />
          {/* Row 3 */}
          <rect x="7.5"  y="16.5" width="4" height="3" rx="0.6" fill="hsl(180,52%,44%)" opacity="0.9" />
          <rect x="14"   y="16.5" width="4" height="3" rx="0.6" fill="hsl(60,68%,50%)"  opacity="0.9" />
          <rect x="20.5" y="16.5" width="4" height="3" rx="0.6" fill="hsl(340,60%,54%)" opacity="0.9" />
          {/* Row 4 */}
          <rect x="7.5"  y="20.5" width="4" height="3" rx="0.6" fill="hsl(240,58%,58%)" opacity="0.9" />
          <rect x="14"   y="20.5" width="4" height="3" rx="0.6" fill="hsl(100,52%,46%)" opacity="0.9" />
          <rect x="20.5" y="20.5" width="4" height="3" rx="0.6" fill="hsl(15,70%,54%)"  opacity="0.9" />
        </svg>
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
            width: "min(220px, 60vw)",
            height: "min(340px, 55vh)",
            borderRadius: 8,
            objectFit: "cover",
            objectPosition: "top center",
            border: "1px solid rgba(184,134,11,0.15)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            display: "block",
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
          ceremonial title but a divi