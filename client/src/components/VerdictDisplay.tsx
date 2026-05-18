import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, RotateCcw, Download } from "lucide-react";
import { generateCertificate } from "@/lib/certificate";
import { speakElevenLabs, speakBrowser } from "@/lib/tts";

function ScoreGauge({ score }: { score: number }) {
  const isHigh = score >= 70;
  const isMid = score >= 45;
  const color = isHigh
    ? "hsl(43, 80%, 52%)"
    : isMid
    ? "hsl(35, 70%, 48%)"
    : "hsl(0, 72%, 48%)";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(${color} ${score * 3.6}deg, hsl(20, 6%, 14%) 0deg)`,
          boxShadow: isHigh
            ? `0 0 40px ${color}44, 0 0 80px ${color}22`
            : `0 0 30px hsl(0, 72%, 40%)44`,
        }}
      >
        <div
          className="rounded-full flex flex-col items-center justify-center"
          style={{
            width: "82px",
            height: "82px",
            background: "hsl(20, 8%, 7%)",
            textAlign: "center",
          }}
        >
          <span
            className="font-serif text-3xl font-bold tabular-nums"
            style={{ color, display: "block", lineHeight: 1.1 }}
          >
            {score}
          </span>
          <span
            className="text-[9px] tracking-widest uppercase"
            style={{ color: "hsl(40, 6%, 50%)", display: "block", marginTop: 1 }}
          >
            Signal
          </span>
        </div>
      </div>
      <p className="text-[10px] tracking-widest uppercase" style={{ color: "hsl(40, 6%, 45%)" }}>
        Clarity Score
      </p>
    </div>
  );
}

type CategoryBarProps = {
  label: string;
  score: number;
  detail: string;
};

function CategoryBar({ label, score, detail }: CategoryBarProps) {
  const color =
    score >= 70
      ? "hsl(43, 80%, 50%)"
      : score >= 45
      ? "hsl(35, 60%, 46%)"
      : "hsl(0, 72%, 45%)";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest" style={{ color: "hsl(40, 8%, 58%)" }}>
          {label}
        </span>
        <span className="text-[10px] tabular-nums font-bold" style={{ color }}>
          {score}
        </span>
      </div>
      <div
        className="h-0.5 rounded-full w-full"
        style={{ background: "hsl(20, 6%, 16%)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-[9px] italic" style={{ color: "hsl(40, 6%, 42%)" }}>
        {detail}
      </p>
    </div>
  );
}

export function VerdictDisplay() {
  const { phase, verdict, userName, isKidMode, setPhase, setVerdict, voiceEnabled, analysisData } =
    useAppState();
  const hasSpoken = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (phase !== "result" || !verdict || hasSpoken.current || !voiceEnabled) return;
    hasSpoken.current = true;

    const timer = setTimeout(async () => {
      const namePrefix = userName ? `${userName}. ` : "";
    const text = isKidMode
        ? verdict === "ark"
          ? `${namePrefix}This song carries a good signal. It is worthy.`
          : `${namePrefix}This song carries patterns that may not serve your spirit. Seek something that uplifts.`
        : verdict === "ark"
        ? `${namePrefix}King David would approve. This signal aligns with the eternal standard.`
        : `${namePrefix}This signal does not align with the tabernacle standard. The patterns measured here invite careful discernment. I do not condemn — I counsel. Let Prophetess Huldah guide you further.`;

      const elevenLabsAudio = await speakElevenLabs(text, "gad");
      if (elevenLabsAudio) {
        audioRef.current = elevenLabsAudio;
      } else if (!isKidMode && verdict !== "ark") {
        const fallback = new Audio("/audio/gad-voice.mp3");
        fallback.volume = 1;
        fallback.play().catch(() => {});
        audioRef.current = fallback;
      } else {
        speakBrowser(text, { rate: 0.75, pitch: 0.6 });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [phase, verdict, voiceEnabled, isKidMode]);

  useEffect(() => {
    if (phase !== "result") {
      hasSpoken.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, [phase]);

  if (phase !== "result" || !verdict) return null;

  const isArk = verdict === "ark";

  const handleDownloadCertificate = () => {
    generateCertificate(userName);
  };

  const handleTryAgain = () => {
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setVerdict(null);
    setPhase("main");
  };

  const score = analysisData?.signalClarityScore ?? (isArk ? 72 : 28);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="flex flex-col items-center gap-6 w-full max-w-md mx-auto"
      style={{ textAlign: "center", alignSelf: "center" }}
    >
      <ScoreGauge score={score} />

      {isArk ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p
              className="font-serif text-xl tracking-wide mb-1"
              style={{ color: "hsl(43, 80%, 54%)" }}
              data-testid="text-verdict-ark"
            >
              {isKidMode ? "This song carries a good signal. It is worthy." : `${userName ? userName + " — " : ""}King David would approve.`}
            </p>
            <p className="text-xs italic" style={{ color: "hsl(270, 22%, 62%)" }}>
              The shofar rises in honor.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              onClick={handleDownloadCertificate}
              className="text-base px-8 py-5 animate-glow-gold font-serif tracking-widest"
              style={{
                background: "hsl(43, 80%, 48%)",
                color: "hsl(43, 10%, 8%)",
              }}
              data-testid="button-seal-of-approval"
            >
              <Award className="w-4 h-4 mr-2" />
              Seal of Approval
            </Button>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p
            className="font-serif text-xl tracking-wide mb-1"
            style={{ color: "hsl(0, 60%, 58%)" }}
            data-testid="text-verdict-calf"
          >
            {isKidMode
              ? "This song carries patterns that may not serve your spirit."
              : `${userName ? userName + " — " : ""}This signal does not align with the tabernacle standard.`}
          </p>
          <p className="text-xs italic" style={{ color: "hsl(270, 22%, 55%)" }}>
            The patterns measured here invite careful discernment.
          </p>
        </motion.div>
      )}

      {analysisData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="w-full rounded-md p-4 flex flex-col gap-3"
          style={{
            background: "hsl(20, 6%, 9%)",
            border: "1px solid hsl(40, 8%, 16%)",
          }}
        >
          <p
            className="text-[10px] uppercase tracking-widest text-center mb-1"
            style={{ color: "hsl(40, 8%, 46%)" }}
          >
            Signal Analysis Report
          </p>
          <CategoryBar
            label="BPM Profile"
            score={analysisData.bpmProfile.score}
            detail={analysisData.bpmProfile.label}
          />
          <CategoryBar
            label="Lyrical Doctrine"
            score={analysisData.lyricalDoctrine.score}
            detail={analysisData.lyricalDoctrine.label}
          />
          <CategoryBar
            label="Trance Inducement"
            score={analysisData.tranceInducement.score}
            detail={analysisData.tranceInducement.label}
          />
          <CategoryBar
            label="Loop Repetition"
            score={analysisData.loopRepetition.score}
            detail={analysisData.loopRepetition.label}
          />
          <CategoryBar
            label="Cultural Degradation"
            score={analysisData.culturalDegradation.score}
            detail={analysisData.culturalDegradation.label}
          />
          <CategoryBar
            label="Rhythmic Archetype"
            score={analysisData.rhythmicArchetype.score}
            detail={analysisData.rhythmicArchetype.label}
          />
          <p
            className="text-[9px] italic text-center mt-1"
            style={{ color: "hsl(40, 6%, 35%)" }}
          >
            Applies the same standard to every tradition, genre, and culture.
            — 1 Thessalonians 5:21
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <Button
          variant="ghost"
          onClick={handleTryAgain}
          className="text-muted-foreground gap-2"
          data-testid="button-try-again"
        >
          <RotateCcw className="w-4 h-4" />
          Submit another song
        </Button>
      </motion.div>
    </motion.div>
  );
}
