import { useState, useEffect, useRef } from "react";
import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speakHuldah } from "@/lib/tts";

const STATUS_MESSAGES = [
  "Evaluating spiritual frequency...",
  "Assessing transcendent inducement...",
  "Measuring lyrical doctrine...",
  "Scanning for trance patterns...",
  "Analyzing rhythmic archetype...",
  "Detecting cultural markers...",
  "Cross-referencing scripture alignment...",
  "Mapping frequency signatures...",
  "Scanning for loop saturation...",
  "Assessing consciousness-alteration risk...",
  "Calculating Signal Clarity Score...",
  "Consulting the sacred register...",
  "Weighing the frequency against the standard...",
  "Final calibration in progress...",
];

const TOTAL_DURATION = 120;

function useBrainwaveCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  elapsed: number
) {
  const animFrameRef = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      offsetRef.current += 1.2;

      const progress = elapsed / TOTAL_DURATION;
      const segments = 6;
      const segWidth = w / segments;

      for (let seg = 0; seg < segments; seg++) {
        const seed = (seg * 7 + 3) % 11;
        const isTheta = seed > 5 || (progress > 0.4 && progress < 0.75 && seed > 3);
        const isRepetition = seed === 3 || seed === 8;

        const baseFreq = isTheta ? 0.08 + seed * 0.005 : 0.04 + seed * 0.003;
        const baseAmp = isTheta ? h * 0.35 : h * 0.2;

        const flickerActive =
          isRepetition && Math.sin(offsetRef.current * 0.1 + seg) > 0.3;
        const globalOpacity = flickerActive
          ? 0.15 + Math.random() * 0.3
          : 0.55;

        const color = isTheta
          ? `rgba(220, 38, 38, ${globalOpacity})`
          : `rgba(34, 197, 94, ${globalOpacity})`;

        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = color;

        const startX = seg * segWidth;
        const endX = startX + segWidth;

        for (let x = startX; x <= endX; x += 1) {
          const localX = x - startX;
          const t = localX / segWidth;
          const wave1 =
            Math.sin((x + offsetRef.current) * baseFreq) * baseAmp;
          const wave2 =
            Math.sin((x + offsetRef.current * 0.7) * baseFreq * 1.5) *
            baseAmp *
            0.4;
          const wave3 =
            Math.sin((x + offsetRef.current * 1.3) * baseFreq * 0.6) *
            baseAmp *
            0.3;
          const envelope = Math.sin(t * Math.PI);
          const y =
            h / 2 +
            (wave1 + wave2 + wave3) * envelope * (0.3 + progress * 0.7);

          if (x === startX) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        if (isTheta && progress > 0.3) {
          ctx.beginPath();
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = `rgba(220, 38, 38, ${globalOpacity * 0.4})`;
          for (let x = startX; x <= endX; x += 1) {
            const localX = x - startX;
            const t = localX / segWidth;
            const spike =
              Math.sin((x + offsetRef.current * 1.8) * 0.12) * baseAmp * 0.6;
            const envelope = Math.sin(t * Math.PI);
            const y = h / 2 + spike * envelope;
            if (x === startX) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      const scanX = (offsetRef.current * 1.5) % w;
      const gradient = ctx.createLinearGradient(scanX - 30, 0, scanX + 30, 0);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0.06)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(scanX - 30, 0, 60, h);

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, elapsed]);
}

export function ListeningState() {
  const { phase, songFileName, audioFileUrl, voiceEnabled } = useAppState();
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const hudlahSpokenRef = useRef(false);

  useBrainwaveCanvas(canvasRef, elapsed);

  useEffect(() => {
    if (phase !== "listening") {
      setElapsed(0);
      setStatusIndex(0);
      hudlahSpokenRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    if (audioFileUrl) {
      const audio = new Audio(audioFileUrl);
      audio.volume = 1.0;
      audio.loop = true;
      audioRef.current = audio;
      audio.play().catch(() => {});

      const stopTimer = setTimeout(() => {
        audio.pause();
      }, TOTAL_DURATION * 1000);

      return () => {
        clearTimeout(stopTimer);
        audio.pause();
      };
    }
  }, [phase, audioFileUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (phase !== "listening") {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed((prev) => Math.min(prev + 1, TOTAL_DURATION));
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "listening") return;
    const rotateInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 8000);
    return () => clearInterval(rotateInterval);
  }, [phase]);

  useEffect(() => {
    if (
      phase === "listening" &&
      elapsed === 45 &&
      voiceEnabled &&
      !hudlahSpokenRef.current
    ) {
      hudlahSpokenRef.current = true;
      speakHuldah("How are you feeling as you hear this? The signal doesn't lie.");
    }
  }, [elapsed, phase, voiceEnabled]);

  if (phase !== "listening") return null;

  const progress = (elapsed / TOTAL_DURATION) * 100;
  const minutesLeft = Math.floor((TOTAL_DURATION - elapsed) / 60);
  const secondsLeft = (TOTAL_DURATION - elapsed) % 60;
  const timeLabel =
    elapsed < TOTAL_DURATION
      ? `${minutesLeft}:${String(secondsLeft).padStart(2, "0")} remaining`
      : "Analysis complete...";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto"
    >
      <div className="flex flex-col items-center gap-1">
        <p
          className="font-serif text-lg tracking-wide"
          style={{ color: "hsl(43, 74%, 52%)" }}
          data-testid="text-listening"
        >
          Gad listens.
        </p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {songFileName}
          </p>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMuted(!isMuted)}
            className="text-muted-foreground"
            data-testid="button-mute-playback"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="w-full max-w-[260px] flex flex-col items-center gap-2">
        <div
          className="w-full h-1 rounded-full"
          style={{ background: "hsl(20, 6%, 16%)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "hsl(43, 80%, 48%)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p
          className="text-xs tabular-nums"
          style={{ color: "hsl(40, 8%, 52%)" }}
          data-testid="text-timer"
        >
          {timeLabel}
        </p>
      </div>

      <div
        className="w-full relative rounded-md overflow-hidden"
        style={{
          height: "90px",
          border: "1px solid hsl(40, 8%, 16%)",
          background: "hsl(20, 6%, 8%)",
        }}
        data-testid="brainwave-canvas"
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute bottom-1.5 left-2 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
            <span className="text-[9px]" style={{ color: "hsl(40, 6%, 45%)" }}>
              Alpha
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
            <span className="text-[9px]" style={{ color: "hsl(40, 6%, 45%)" }}>
              Theta
            </span>
          </div>
        </div>
      </div>

      <motion.p
        key={statusIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.6 }}
        className="text-xs text-center tracking-wider italic"
        style={{ color: "hsl(0, 55%, 60%)" }}
        data-testid="text-status-message"
      >
        {STATUS_MESSAGES[statusIndex]}
      </motion.p>

      <p
        className="text-[10px] italic text-center tracking-wider"
        style={{ color: "hsl(40, 6%, 35%)" }}
      >
        The waves show what the spirit already knows.
      </p>
    </motion.div>
  );
}
