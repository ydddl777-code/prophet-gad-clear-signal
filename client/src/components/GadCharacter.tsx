import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";

// v2 friendly-Gad doctrine (Jul 30): the finger-raised "prophet kid" image is OUT.
// The seated breastplate keeper is the one ceremonial face — shown modest, not looming.
const gadImg = "/images/gad-carousel-1.webp";

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
              ? "drop-shadow(0 0 24px rgba(184,134,11,0.4))"
              : verdict === "calf"
              ? "drop-shadow(0 0 8px rgba(0,0,0,0.2))"
              : "drop-shadow(0 4px 14px rgba(184,134,11,0.22))",
        }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src={gadImg}
          alt="Prophet Gad"
          className="w-28 sm:w-32 md:w-36 select-none"
          style={{
            maxHeight: "24vh",
            borderRadius: "50%",
            aspectRatio: "1 / 1",
            objectFit: "cover",
            objectPosition: "center 12%",
            border: "3px solid hsl(42, 90%, 45%)",
            background: "#ffffff",
            boxShadow: "0 6px 20px rgba(184,134,11,0.25)",
          }}
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
