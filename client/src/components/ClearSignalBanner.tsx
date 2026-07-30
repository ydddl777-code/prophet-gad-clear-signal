import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";

export function ClearSignalBanner() {
  const { verdict } = useAppState();

  const borderColor =
    verdict === "ark"
      ? "hsl(43, 85%, 40%)"
      : verdict === "calf"
      ? "hsl(0, 65%, 36%)"
      : "hsl(40, 15%, 78%)";

  const textColor =
    verdict === "ark"
      ? "hsl(43, 89%, 30%)"
      : verdict === "calf"
      ? "hsl(0, 65%, 34%)"
      : "hsl(25, 12%, 30%)";

  return (
    <motion.div
      className="relative px-6 py-1.5 rounded-sm overflow-visible"
      style={{
        border: `1px solid ${borderColor}`,
        background: "#ffffff",
      }}
      animate={{
        boxShadow:
          verdict === "ark"
            ? "0 0 20px rgba(184, 134, 11, 0.3)"
            : verdict === "calf"
            ? "0 0 15px rgba(180, 30, 30, 0.2)"
            : "none",
      }}
      transition={{ duration: 1 }}
      data-testid="banner-clear-signal"
    >
      {verdict === "ark" && (
        <div className="absolute inset-0 animate-shimmer rounded-sm" />
      )}
      <div className="relative flex items-center gap-3">
        <span
          className="font-serif text-xs tracking-[0.35em] uppercase font-bold"
          style={{ color: textColor }}
        >
          Clear Signal
        </span>
        <span style={{ color: "hsl(25, 10%, 40%)" }}>—</span>
        <span className="text-[10px] tracking-widest uppercase" style={{ color: "hsl(25, 10%, 34%)" }}>
          Rhythm · Repetition · Signal
        </span>
      </div>
    </motion.div>
  );
}
