import { useAppState } from "@/lib/appState";
import { Volume2, VolumeX } from "lucide-react";
import { useLocation } from "wouter";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

export function ControlToggles() {
  const { voiceEnabled, setVoiceEnabled } = useAppState();
  const [, navigate] = useLocation();

  const pill: React.CSSProperties = {
    background: "rgba(10,6,4,0.70)",
    backdropFilter: "blur(8px)",
    border: "1px solid hsl(43,25%,14%)",
    borderRadius: 20,
    padding: "5px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: ARIAL,
    fontSize: 11,
    letterSpacing: "0.06em",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 40, display: "flex", gap: 6 }}>
      {/* About the Analysis */}
      <button
        onClick={() => navigate("/about")}
        style={{ ...pill, color: "hsl(43,45%,42%)" }}
        data-testid="button-nav-about"
      >
        About the Analysis
      </button>

      {/* Voice on/off */}
      <button
        onClick={() => setVoiceEnabled(!voiceEnabled)}
        style={{
          ...pill,
          color: voiceEnabled ? "hsl(142,45%,44%)" : "hsl(40,10%,38%)",
          border: `1px solid ${voiceEnabled ? "hsl(142,35%,20%)" : "hsl(43,20%,14%)"}`,
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
