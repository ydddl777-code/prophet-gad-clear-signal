import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";

export function TTTBanner() {
  const { verdict } = useAppState();

  const borderColor =
    verdict === "ark"
      ? "hsl(43, 80%, 40%)"
      : verdict === "calf"
      ? "hsl(0, 60%, 35%)"
      : "hsl(40, 8%, 22%)";

  const textColor =
    verdict === "ark"
      ? "hsl(43, 80%, 60%)"
      : verdict === "calf"
      ? "hsl(0, 60%, 58%)"
      : "hsl(40, 8%, 55%)";

  return (
    <motion.div
      className="relative px-6 py-1.5 rounded-sm overflow-visible"
      style={{
        border: `1px solid ${borderColor}`,
        background: "hsl(20, 6%, 9%)",
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
      data-testid="banner-ttt"
    >
      {verdict === "ark" && (
        <div className="absolute inset-0 animate-shimmer rounded-sm" />
      )}
      <div className="relative flex items-center gap-3">
        <span
          className="font-serif text-xs tracking-[0.35em] uppercase font-bold"
          style={{ color: textColor }}
        >
          TTT
        </span>
        <span style={{ color: "hsl(40, 6%, 30%)" }}>—</span>
        <span className="text-[10px] tracking-widest uppercase" style={{ color: "hsl(40, 6%, 42%)" }}>
          Tabernacle · Temple · Tone
        </span>
      </div>
    </motion.div>
  );
}
