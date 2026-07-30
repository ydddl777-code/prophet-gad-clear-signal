import { useAppState } from "@/lib/appState";
import { Volume2, VolumeX } from "lucide-react";
import { useLocation } from "wouter";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

export function ControlToggles() {
  const { voiceEnabled, setVoiceEnabled } = useAppState();
  const [, navigate] = useLocation();

  const pill: React.CSSProperties = {
    background: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(8px)",
    border: "1px solid hsl(42,80%,52%)",
    borderRadius: 20,
    padding: "6px 13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: ARIAL,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    whiteSpace: "nowrap" as const,
    boxShadow: "0 2px 10px rgba(184,134,11,0.18)",
  };

  return (
    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 40, display: "flex", gap: 6 }}>
      {/* About the Analysis */}
      <button
        onClick={() => navigate("/about")}
        style={{ ...pill, color: "hsl(42,95%,32%)" }}
        data-testid="button-nav-about"
      >
        About the Analysis
      </button>

      {/* Voice on/off */}
      <button
        onClick={() => setVoiceEnabled(!voiceEnabled)}
        style={{
          ...pill,
          color: voiceEnabled ? "#047857" : "hsl(222,10%,36%)",
          border: `1px solid ${voiceEnabled ? "#059669" : "hsl(220,15%,78%)"}`,
          boxShadow: voiceEnabled
            ? "0 2px 10px rgba(5,150,105,0.20)"
            : "0 2px 10px rgba(184,134,11,0.12)",
        }}
        title={voiceEnabled ? "Turn voices off" : "Turn voices on"}
        data-testid="button-voice-toggle"
      >
        {voiceEnabled
          ? <Volume2 style={{ width: 12, height: 12 }} />
          : <VolumeX  style={{ width: 12, height: 12 }} />
        }
        {voiceEnabled ? "Voices On" : "Voices Off"}
      </button>
    </div>
  );
}
