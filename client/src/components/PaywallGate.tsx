import { useState } from "react";
import { motion } from "framer-motion";
import { resetTrial, TRIAL_LIMIT } from "@/lib/appState";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
const GOLD = "hsl(43, 72%, 54%)";
const CRIMSON = "hsl(0, 60%, 52%)";

const EMAIL_KEY = "cs_email_submitted";

function isEmailSaved(): boolean {
  try { return !!localStorage.getItem(EMAIL_KEY); } catch { return false; }
}

function saveEmail(email: string): void {
  try { localStorage.setItem(EMAIL_KEY, email); } catch {}
}

interface Props {
  onClose: () => void;
}

export function PaywallGate({ onClose }: Props) {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(isEmailSaved());
  const [error, setError]         = useState("");

  const handleSubmit = () => {
    const val = email.trim();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setError("Please enter a valid email address.");
      return;
    }
    saveEmail(val);
    // Unlock 5 more analyses as reward for signing up
    resetTrial();
    setSubmitted(true);
    setError("");
  };

  const handleUnlock = () => {
    resetTrial();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(8,4,2,0.92)",
        backdropFilter: "blur(6px)",
        fontFamily: ARIAL,
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "hsl(355, 22%, 6%)",
          border: `1px solid hsl(43, 35%, 18%)`,
          borderRadius: 12,
          padding: "36px 32px",
          maxWidth: 400,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          textAlign: "center",
        }}
      >
        {/* Gold accent */}
        <div style={{
          width: 52,
          height: 2,
          borderRadius: 1,
          background: "linear-gradient(90deg, transparent, hsl(43,72%,44%), transparent)",
        }} />

        {/* Icon */}
        <div style={{ fontSize: 36 }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="21" stroke="hsl(43,50%,28%)" strokeWidth="1.5" fill="hsl(43,30%,10%)" />
            <path d="M22 10 L32 16 V26 Q22 36 12 26 V16 Z" fill="hsl(43,38%,18%)" stroke="hsl(43,62%,46%)" strokeWidth="1.2" />
            <rect x="16" y="16.5" width="4" height="3" rx="0.5" fill="hsl(0,68%,52%)" opacity="0.9" />
            <rect x="20.5" y="16.5" width="3" height="3" rx="0.5" fill="hsl(120,52%,44%)" opacity="0.9" />
            <rect x="24" y="16.5" width="4" height="3" rx="0.5" fill="hsl(200,70%,54%)" opacity="0.9" />
            <rect x="16" y="20.5" width="4" height="3" rx="0.5" fill="hsl(43,80%,52%)" opacity="0.9" />
            <rect x="20.5" y="20.5" width="3" height="3" rx="0.5" fill="hsl(270,55%,56%)" opacity="0.9" />
            <rect x="24" y="20.5" width="4" height="3" rx="0.5" fill="hsl(30,78%,54%)" opacity="0.9" />
          </svg>
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: ARIAL,
          fontWeight: 800,
          fontSize: 20,
          color: GOLD,
          letterSpacing: "0.04em",
          margin: 0,
          lineHeight: 1.25,
        }}>
          Your {TRIAL_LIMIT} Free Analyses<br />Are Complete
        </h2>

        <p style={{
          fontSize: 13,
          lineHeight: 1.75,
          color: "hsl(40, 10%, 60%)",
          margin: 0,
          maxWidth: 320,
        }}>
          You have used your {TRIAL_LIMIT} free readings. Join the remnant — enter your
          email to unlock {TRIAL_LIMIT} more analyses and stay informed when new
          discernment tools are released.
        </p>

        {/* Divider */}
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(184,134,11,0.15), transparent)" }} />

        {submitted ? (
          /* Unlocked state */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
          >
            <p style={{ fontSize: 15, fontWeight: 700, color: GOLD, margin: 0, letterSpacing: "0.04em" }}>
              Welcome to the Remnant.
            </p>
            <p style={{ fontSize: 12, color: "hsl(40,8%,52%)", margin: 0, lineHeight: 1.6 }}>
              Your next {TRIAL_LIMIT} analyses are unlocked. The Prophet is ready.
            </p>
            <button
              onClick={handleUnlock}
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
                padding: "0.6rem 2.4rem",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,150,60,0.2)",
              }}
            >
              Continue
            </button>
          </motion.div>
        ) : (
          /* Email form */
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <input
              type="email"
              placeholder="Your email address..."
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
              style={{
                width: "100%",
                background: "hsl(355, 12%, 10%)",
                border: `1px solid ${error ? CRIMSON : "hsl(43, 30%, 20%)"}`,
                borderRadius: 6,
                padding: "10px 16px",
                textAlign: "center",
                fontSize: 14,
                color: "hsl(40, 12%, 82%)",
                fontFamily: ARIAL,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {error && (
              <p style={{ fontSize: 11, color: CRIMSON, margin: 0, textAlign: "center" }}>{error}</p>
            )}
            <button
              onClick={handleSubmit}
              style={{
                background: "hsl(43, 72%, 44%)",
                color: "hsl(43, 10%, 8%)",
                fontFamily: ARIAL,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: 20,
                padding: "0.6rem 2.4rem",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(184,134,11,0.2)",
              }}
            >
              Unlock More Analyses
            </button>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "hsl(40, 6%, 38%)",
                fontSize: 11,
                fontFamily: ARIAL,
                textDecoration: "underline",
                textDecorationColor: "hsl(40,6%,24%)",
                padding: "4px 0",
              }}
            >
              Not now — return without submitting
            </button>
          </div>
        )}

        <p style={{ fontSize: 10, color: "hsl(40,6%,32%)", margin: 0, lineHeight: 1.5 }}>
          No spam. No third-party sharing. For the remnant only.
        </p>
      </motion.div>
    </motion.div>
  );
}
