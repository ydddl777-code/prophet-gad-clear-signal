import { useState } from "react";
import { motion } from "framer-motion";
import { resetTrial, TRIAL_LIMIT } from "@/lib/appState";
import { BookOffer } from "@/components/BookOffer";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
const GOLD = "hsl(42, 95%, 34%)";
const CRIMSON = "hsl(350, 72%, 38%)";

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
        background: "rgba(255,255,255,0.85)",
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
          background: "#ffffff",
          border: `1px solid hsl(220, 15%, 88%)`,
          borderTop: "3px solid hsl(42, 95%, 42%)",
          borderRadius: 12,
          padding: "36px 32px",
          maxWidth: 400,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          boxShadow: "0 20px 60px rgba(184,134,11,0.22)",
          textAlign: "center",
        }}
      >
        {/* Gold accent */}
        <div style={{
          width: 52,
          height: 2,
          borderRadius: 1,
          background: "linear-gradient(90deg, transparent, hsl(43,89%,38%), transparent)",
        }} />

        {/* Icon */}
        <div style={{ fontSize: 36 }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="21" stroke="hsl(43,60%,50%)" strokeWidth="1.5" fill="hsl(43,60%,96%)" />
            <path d="M22 10 L32 16 V26 Q22 36 12 26 V16 Z" fill="hsl(43,60%,88%)" stroke="hsl(43,80%,36%)" strokeWidth="1.2" />
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
          fontSize: 14,
          lineHeight: 1.75,
          color: "hsl(222, 12%, 28%)",
          margin: 0,
          maxWidth: 320,
        }}>
          You have used your {TRIAL_LIMIT} free readings. Join the remnant — enter your
          email to unlock {TRIAL_LIMIT} more analyses and stay informed when new
          discernment tools are released.
        </p>

        {/* Divider */}
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(184,134,11,0.4), transparent)" }} />

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
            <p style={{ fontSize: 13, color: "hsl(222,12%,28%)", margin: 0, lineHeight: 1.6 }}>
              Your next {TRIAL_LIMIT} analyses are unlocked. The Prophet is ready.
            </p>
            <button
              onClick={handleUnlock}
              style={{
                background: "#059669",
                color: "#ffffff",
                fontFamily: ARIAL,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "1px solid #047857",
                borderRadius: 20,
                padding: "0.6rem 2.4rem",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(5,150,105,0.25)",
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
                background: "#ffffff",
                border: `1px solid ${error ? CRIMSON : "hsl(220, 15%, 84%)"}`,
                borderRadius: 6,
                padding: "10px 16px",
                textAlign: "center",
                fontSize: 15,
                color: "hsl(222, 20%, 12%)",
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
                background: "linear-gradient(135deg, hsl(45, 95%, 50%), hsl(38, 90%, 42%))",
                color: "hsl(222, 30%, 8%)",
                fontFamily: ARIAL,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: 20,
                padding: "0.6rem 2.4rem",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(184,134,11,0.32)",
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
                color: "hsl(222, 10%, 36%)",
                fontSize: 12,
                fontFamily: ARIAL,
                textDecoration: "underline",
                textDecorationColor: "hsl(222,10%,60%)",
                padding: "4px 0",
              }}
            >
              Not now — return without submitting
            </button>
          </div>
        )}

        <p style={{ fontSize: 11, color: "hsl(222,10%,36%)", margin: 0, lineHeight: 1.5 }}>
          No spam. No third-party sharing. For the remnant only.
        </p>

        {/* Real paid product, offered alongside the free-trial unlock above —
            not a replacement for it. The email unlock stays as a no-friction
            lead-capture path; this is for anyone ready to go deeper right now. */}
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(184,134,11,0.4), transparent)" }} />
        <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "hsl(222, 10%, 46%)", margin: 0, fontWeight: 700 }}>
          Or go deeper
        </p>
        <BookOffer compact />
      </motion.div>
    </motion.div>
  );
}
