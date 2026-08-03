import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, RotateCcw, Download, HeartHandshake, BookOpen, ExternalLink } from "lucide-react";
import { generateCertificate } from "@/lib/certificate";
import { speakElevenLabs, speakBrowser, playClip, VOICE_CLIPS } from "@/lib/tts";
import { BookOffer } from "@/components/BookOffer";

function ScoreGauge({ score }: { score: number }) {
  const isHigh = score >= 70;
  const isMid = score >= 45;
  const color = isHigh
    ? "hsl(42, 95%, 40%)"
    : isMid
    ? "hsl(35, 85%, 38%)"
    : "hsl(350, 72%, 40%)";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(${color} ${score * 3.6}deg, hsl(220, 15%, 90%) 0deg)`,
          boxShadow: isHigh
            ? "0 8px 28px rgba(184,134,11,0.30), 0 0 60px rgba(184,134,11,0.14)"
            : "0 8px 24px rgba(164,32,54,0.25)",
        }}
      >
        <div
          className="rounded-full flex flex-col items-center justify-center"
          style={{
            width: "82px",
            height: "82px",
            background: "#ffffff",
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
            style={{ color: "hsl(222, 10%, 36%)", display: "block", marginTop: 1 }}
          >
            Signal
          </span>
        </div>
      </div>
      <p className="text-[10px] tracking-widest uppercase" style={{ color: "hsl(222, 10%, 34%)" }}>
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
      ? "hsl(42, 95%, 38%)"
      : score >= 45
      ? "hsl(35, 85%, 36%)"
      : "hsl(350, 72%, 40%)";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest" style={{ color: "hsl(222, 15%, 25%)" }}>
          {label}
        </span>
        <span className="text-[10px] tabular-nums font-bold" style={{ color }}>
          {score}
        </span>
      </div>
      <div
        className="h-0.5 rounded-full w-full"
        style={{ background: "hsl(220, 15%, 90%)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-[9px] italic" style={{ color: "hsl(222, 10%, 36%)" }}>
        {detail}
      </p>
    </div>
  );
}

export function VerdictDisplay() {
  const { phase, verdict, userName, isKidMode, setPhase, setVerdict, voiceEnabled, analysisData, songFileName } =
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
        ? `${namePrefix}This track meets the Clear Signal criteria. The measured patterns show a low-concern profile.`
        : `${namePrefix}This track does not currently meet the Clear Signal criteria. The measured patterns suggest elevated concern and deserve review.`;

      const elevenLabsAudio = await speakElevenLabs(text, "gad");
      if (elevenLabsAudio) {
        audioRef.current = elevenLabsAudio;
      } else {
        // Canon fallback: Prophet Gad's rendered verdict delivery (HeyGen clip).
        const ok = await playClip(VOICE_CLIPS.gadVerdict);
        if (!ok) speakBrowser(text, { rate: 0.75, pitch: 0.6 });
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
    generateCertificate(userName, { songFileName, verdict, analysisData });
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
              style={{ color: "hsl(42, 95%, 34%)", fontWeight: 700 }}
              data-testid="text-verdict-ark"
            >
              {isKidMode ? "This song carries a good signal." : `${userName ? userName + " — " : ""}This track meets the Clear Signal criteria.`}
            </p>
            <p className="text-xs italic" style={{ color: "hsl(270, 30%, 38%)" }}>
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
                background: "linear-gradient(135deg, hsl(45, 95%, 50%), hsl(38, 90%, 42%))",
                color: "hsl(222, 30%, 8%)",
                border: "1px solid hsl(42, 90%, 34%)",
              }}
              data-testid="button-seal-of-approval"
            >
              <Award className="w-4 h-4 mr-2" />
              Download Report
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
            style={{ color: "hsl(350, 72%, 38%)", fontWeight: 700 }}
            data-testid="text-verdict-calf"
          >
            {isKidMode
              ? "This song carries patterns that deserve another look."
              : `${userName ? userName + " — " : ""}This track does not currently meet the Clear Signal criteria.`}
          </p>
          <p className="text-xs italic" style={{ color: "hsl(270, 30%, 38%)" }}>
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
            background: "#ffffff",
            border: "1px solid hsl(220, 15%, 88%)",
            borderTop: "3px solid hsl(42, 95%, 42%)",
            boxShadow: "0 8px 28px rgba(184,134,11,0.16)",
          }}
        >
          <p
            className="text-[10px] uppercase tracking-widest text-center mb-1"
            style={{ color: "hsl(222, 15%, 25%)" }}
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
            style={{ color: "hsl(222, 10%, 36%)" }}
          >
            Applies the same criteria to every tradition, genre, and culture.
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

      {/* The open door — a warm funnel to the wider ministry */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="w-full rounded-md p-5 flex flex-col gap-3"
        style={{
          background: "#ffffff",
          border: "1px solid hsl(220, 15%, 88%)",
          borderTop: "3px solid hsl(42, 95%, 42%)",
          boxShadow: "0 8px 28px rgba(184,134,11,0.16)",
          textAlign: "left",
        }}
        data-testid="panel-open-door"
      >
        <p
          className="text-center"
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textAlign: "center",
            color: "hsl(42, 95%, 34%)",
          }}
        >
          The door is open
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 14,
            textAlign: "center",
            color: "hsl(222, 10%, 36%)",
          }}
        >
          These rooms open in a new tab &mdash; Clear Signal stays right here for you.
        </p>
        <a
          href="https://pgfc.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md p-3"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 6,
            background: "hsl(210, 20%, 98.5%)",
            border: "1px solid hsl(220, 15%, 90%)",
            borderLeft: "3px solid #059669",
            textDecoration: "none",
            boxShadow: "0 2px 10px rgba(5,150,105,0.12)",
          }}
          data-testid="link-portal-pgfc"
        >
          <HeartHandshake style={{ width: 22, height: 22, color: "#059669", flexShrink: 0 }} />
          <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "hsl(222, 20%, 15%)" }}>
              Want prayer? Talk to the prophet
            </span>
            <span style={{ fontSize: 12, color: "hsl(222, 10%, 36%)" }}>
              Fervent Counsel · pgfc.ai
            </span>
          </span>
          <ExternalLink style={{ width: 14, height: 14, color: "hsl(222, 10%, 38%)", marginLeft: "auto", flexShrink: 0 }} />
        </a>
        <a
          href="https://pgdd.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md p-3"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 6,
            background: "hsl(210, 20%, 98.5%)",
            border: "1px solid hsl(220, 15%, 90%)",
            borderLeft: "3px solid #059669",
            textDecoration: "none",
            boxShadow: "0 2px 10px rgba(5,150,105,0.12)",
          }}
          data-testid="link-portal-pgdd"
        >
          <BookOpen style={{ width: 22, height: 22, color: "#059669", flexShrink: 0 }} />
          <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "hsl(222, 20%, 15%)" }}>
              Have a Bible question — any question?
            </span>
            <span style={{ fontSize: 12, color: "hsl(222, 10%, 36%)" }}>
              Ask it · pgdd.ai
            </span>
          </span>
          <ExternalLink style={{ width: 14, height: 14, color: "hsl(222, 10%, 38%)", marginLeft: "auto", flexShrink: 0 }} />
        </a>
      </motion.div>

      {/* The real paid product — the full companion book behind this analysis. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
        className="w-full"
      >
        <BookOffer />
      </motion.div>
    </motion.div>
  );
}
