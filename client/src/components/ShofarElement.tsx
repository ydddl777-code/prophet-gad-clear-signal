import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";

export function ShofarElement() {
  const { verdict, phase } = useAppState();

  const rotation =
    verdict === "ark" ? -30 : verdict === "calf" ? 120 : 0;

  const opacity =
    verdict === "ark" ? 1 : verdict === "calf" ? 0.3 : 0.7;

  const yOffset =
    verdict === "ark" ? -15 : 0;

  const glowColor =
    verdict === "ark"
      ? "drop-shadow(0 0 12px rgba(184, 155, 40, 0.6))"
      : "drop-shadow(0 0 4px rgba(100, 80, 50, 0.2))";

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{
        rotate: rotation,
        y: yOffset,
        opacity: opacity,
        filter: glowColor,
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      data-testid="shofar-element"
    >
      <svg
        viewBox="0 0 80 40"
        className="w-16 h-8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 28C8 28 12 24 20 22C28 20 36 18 44 14C52 10 58 6 64 4C68 2 72 2 74 4C76 6 74 10 70 14C66 18 60 22 52 26C44 30 36 32 28 32C20 32 14 32 10 30C8 29 8 28 8 28Z"
          fill={verdict === "ark" ? "hsl(43, 74%, 49%)" : verdict === "calf" ? "hsl(30, 10%, 40%)" : "hsl(30, 40%, 55%)"}
          stroke={verdict === "ark" ? "hsl(43, 64%, 38%)" : verdict === "calf" ? "hsl(30, 8%, 30%)" : "hsl(30, 30%, 45%)"}
          strokeWidth="1.5"
        />
        <path
          d="M74 4C76 6 78 4 78 6C78 8 76 10 74 10"
          stroke="hsl(43, 74%, 49%)"
          strokeWidth="2"
          fill="none"
          opacity={verdict === "ark" ? 1 : 0.4}
        />
        <path
          d="M8 28C8 28 6 26 4 28C2 30 4 34 8 34C12 34 12 30 10 28L8 28Z"
          fill={verdict === "ark" ? "hsl(43, 64%, 44%)" : verdict === "calf" ? "hsl(30, 8%, 35%)" : "hsl(30, 35%, 50%)"}
          stroke={verdict === "ark" ? "hsl(43, 55%, 35%)" : verdict === "calf" ? "hsl(30, 6%, 25%)" : "hsl(30, 25%, 40%)"}
          strokeWidth="1"
        />
      </svg>

      {verdict === "ark" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, rgba(184, 155, 40, 0.3), transparent)" }} />
        </motion.div>
      )}

      {phase === "listening" && (
        <motion.div
          className="absolute -right-1 -top-1"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-3 h-3 rounded-full bg-amber-500/40" />
        </motion.div>
      )}
    </motion.div>
  );
}
