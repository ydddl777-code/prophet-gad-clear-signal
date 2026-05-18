import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";
const gadSuitImg = "/images/gad-prophet-kid.jpg";

export function GadCharacter() {
  const { phase, verdict } = useAppState();

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        animate={{
          filter:
            verdict === "ark"
              ? "drop-shadow(0 0 30px rgba(184,134,11,0.45))"
              : verdict === "calf"
              ? "drop-shadow(0 0 10px rgba(0,0,0,0.3))"
              : "drop-shadow(0 0 15px rgba(184,134,11,0.2))",
        }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src={gadSuitImg}
          alt="Prophet Gad"
          className="w-48 sm:w-56 md:w-64 h-auto object-contain select-none rounded-md"
          style={{ maxHeight: "46vh" }}
          animate={
            phase === "listening"
              ? { scale: 1, rotateY: 0, x: 0 }
              : verdict === "calf"
              ? { rotateY: 15, x: 10 }
              : { rotateY: 0, x: 0 }
          }
          transition={{ duration: 1.5, ease: "easeInOut" }}
          draggable={false}
          data-testid="img-gad-character"
        />
      </motion.div>

      {verdict === "ark" && (
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0.8], y: [-10, -30, -25] }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="w-12 h-12 text-amber-500" style={{ fontSize: "2rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
              <path d="M12 3C7 8 4 12 4 16c0 2.5 1.5 5 8 5s8-2.5 8-5c0-4-3-8-8-13z" fill="rgba(184,134,11,0.2)" stroke="hsl(38,80%,45%)" />
            </svg>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
