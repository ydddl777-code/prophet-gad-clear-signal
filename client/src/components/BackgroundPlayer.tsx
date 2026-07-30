import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Loader } from "lucide-react";

const ARIAL  = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
const SRC    = "/audio/thunder-road-gospel.mp3";
const VOL    = 0.55;

// ── Web Audio API player — works in nested iframes ───────────────────────────
// HTML5 <audio> is blocked in nested iframes (Replit canvas, etc.)
// Web Audio API + fetch + user-gesture creation bypasses this restriction.

interface PlayerState {
  ctx:    AudioContext;
  gain:   GainNode;
  source: AudioBufferSourceNode | null;
  buffer: AudioBuffer | null;
  startedAt: number;   // ctx.currentTime when playback began
  offset: number;      // where in the buffer we paused
}

export function BackgroundPlayer() {
  const playerRef   = useRef<PlayerState | null>(null);
  const [status,    setStatus]  = useState<"idle"|"loading"|"playing"|"paused">("idle");
  const [isMuted,   setIsMuted] = useState(false);
  const [errMsg,    setErrMsg]  = useState<string|null>(null);

  // ── Build or return existing AudioContext ───────────────────────────────────
  const getState = (): PlayerState => {
    if (playerRef.current) return playerRef.current;
    const ctx  = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gain = ctx.createGain();
    gain.gain.value = VOL;
    gain.connect(ctx.destination);
    const state: PlayerState = { ctx, gain, source: null, buffer: null, startedAt: 0, offset: 0 };
    playerRef.current = state;
    return state;
  };

  // ── Load buffer once, cache it ──────────────────────────────────────────────
  const loadBuffer = async (state: PlayerState): Promise<AudioBuffer> => {
    if (state.buffer) return state.buffer;
    const res = await fetch(SRC);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arr = await res.arrayBuffer();
    const buf = await state.ctx.decodeAudioData(arr);
    state.buffer = buf;
    return buf;
  };

  // ── Play from a given offset ────────────────────────────────────────────────
  const startSource = (state: PlayerState, offset: number) => {
    if (state.source) {
      state.source.onended = null;
      try { state.source.stop(); } catch {}
    }
    const src = state.ctx.createBufferSource();
    src.buffer = state.buffer!;
    src.loop   = true;
    src.connect(state.gain);
    src.start(0, offset % state.buffer!.duration);
    state.source    = src;
    state.startedAt = state.ctx.currentTime;
    state.offset    = offset % state.buffer!.duration;
  };

  // ── Handle PLAY click ───────────────────────────────────────────────────────
  const handlePlay = useCallback(async () => {
    setErrMsg(null);
    setStatus("loading");
    try {
      const state = getState();
      await state.ctx.resume(); // unlock AudioContext inside gesture
      const _buf  = await loadBuffer(state);
      state.gain.gain.value = isMuted ? 0 : VOL;
      startSource(state, state.offset);
      setStatus("playing");
    } catch (e: any) {
      console.error("BackgroundPlayer error:", e);
      setErrMsg(e?.message ?? "Playback failed");
      setStatus("idle");
    }
  }, [isMuted]);

  // ── Handle PAUSE click ──────────────────────────────────────────────────────
  const handlePause = useCallback(() => {
    const state = playerRef.current;
    if (!state?.source) return;
    // Store elapsed position so resume picks up where we left off
    const elapsed = state.ctx.currentTime - state.startedAt;
    state.offset  = (state.offset + elapsed) % (state.buffer?.duration ?? 1);
    state.source.onended = null;
    try { state.source.stop(); } catch {}
    state.source = null;
    setStatus("paused");
  }, []);

  // ── Mute/unmute ─────────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    setIsMuted(m => {
      const next = !m;
      if (playerRef.current) {
        playerRef.current.gain.gain.value = next ? 0 : VOL;
      }
      return next;
    });
  }, []);

  const btn = (active = false): React.CSSProperties => ({
    background: active ? "#047857" : "#059669",
    border: "1px solid #047857", cursor: "pointer",
    padding: "6px 8px", borderRadius: "50%",
    color: "#ffffff",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 10px rgba(5,150,105,0.35)",
  });

  const isPlaying = status === "playing";
  const isLoading = status === "loading";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      style={{
        position: "fixed", bottom: 16, right: 16, zIndex: 60,
        background: "#ffffff",
        backdropFilter: "blur(10px)",
        border: `1px solid ${errMsg ? "hsl(350,72%,42%)" : "hsl(42, 85%, 50%)"}`,
        borderRadius: 8, padding: "7px 10px",
        display: "flex", flexDirection: "column", gap: 4,
        boxShadow: "0 8px 24px rgba(184,134,11,0.20)",
        fontFamily: ARIAL, maxWidth: 240,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
          color: "hsl(222,20%,15%)", flex: 1,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}
          data-testid="text-track-name"
        >
          Thunder Road Gospel
        </span>

        <div style={{ width: 1, height: 16, background: "hsl(42, 85%, 55%)", margin: "0 2px" }} />

        {isLoading ? (
          <div style={{ padding: "4px 7px" }}>
            <Loader style={{ width: 16, height: 16, color: "#047857", animation: "spin 1s linear infinite" }} />
          </div>
        ) : isPlaying ? (
          <button onClick={handlePause} style={btn(true)} title="Pause" data-testid="button-pause">
            <Pause style={{ width: 16, height: 16 }} />
          </button>
        ) : (
          <button onClick={handlePlay} style={btn(false)} title="Play" data-testid="button-play">
            <Play style={{ width: 16, height: 16 }} />
          </button>
        )}

        <button onClick={toggleMute} style={btn(isMuted)} title={isMuted ? "Unmute" : "Mute"} data-testid="button-mute">
          {isMuted
            ? <VolumeX style={{ width: 14, height: 14 }} />
            : <Volume2 style={{ width: 14, height: 14 }} />
          }
        </button>

        {isPlaying && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 14, marginLeft: 2 }}>
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                style={{ width: 2, borderRadius: 1, background: "linear-gradient(180deg, hsl(45,95%,50%), hsl(38,90%,42%))" }}
                animate={{ height: ["3px","12px","5px","10px","3px"] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
              />
            ))}
          </div>
        )}
      </div>

      {errMsg && (
        <p style={{ fontSize: 10, color: "hsl(350,72%,38%)", margin: 0, lineHeight: 1.4 }}>
          {errMsg}
        </p>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
