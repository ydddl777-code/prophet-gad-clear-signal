import { useEffect, useState } from "react";
import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";
import { speakHuldah, playClip, stopClip, VOICE_CLIPS } from "@/lib/tts";
import { WaveBanner } from "@/components/WaveBanner";
import { NavArrows } from "@/components/NavArrows";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const GAD_PHOTOS: { src: string; alt: string; fit?: "contain" | "cover" }[] = [
  // v2 friendly-Gad doctrine (Jul 30): seated breastplate = the one ceremonial keeper;
  // warm/smiling Gad and the Gad & Huldah portrait carry the "come one and all" invitation.
  // Removed: full-regalia paramilitary shot, sunglasses shot, somber tuxedo shot.
  { src: "/images/gad-carousel-1.webp", alt: "Prophet Gad, breastplate of the twelve tribes" },
  { src: "/images/gad-carousel-5.webp", alt: "Prophet Gad, welcoming every nation" },
  { src: "/images/gad-carousel-6.webp", alt: "Prophet Gad and Prophetess Huldah" },
];

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
const BG_COLOR = "hsl(210, 20%, 98.5%)";
const GOLD_DEEP = "hsl(42, 95%, 36%)";
const GOLD_GRADIENT = "linear-gradient(135deg, hsl(45, 95%, 50%), hsl(38, 90%, 42%))";
const INK = "hsl(222, 20%, 12%)";
const BURGUNDY = "hsl(352, 70%, 33%)";

const HULDAH_GREETING =
  "Friend... stranger... welcome. " +
  "You have arrived at Clear Signal, a place of discernment, not judgment. " +
  "I am Huldah, and I am here to guide you. " +
  "Before we begin, how would you like to be addressed? " +
  "You are not required to share your name. " +
  "But if you do, your results will be prepared with that name. " +
  "When you are ready, press Enter.";

// Identical rendered size for both marks — lion and breastplate stay equal.
const MARK_STYLE: import("react").CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid hsl(42, 90%, 45%)",
  boxShadow: "0 2px 10px rgba(184,134,11,0.28)",
  background: "#ffffff",
  display: "block",
};

function LionMark() {
  return <img src="/images/lion-logo.webp" alt="Lion of Judah" style={MARK_STYLE} />;
}

function BreastplateMark() {
  return <img src="/images/breastplate-logo.webp" alt="Twelve-stone breastplate" style={MARK_STYLE} />;
}

export function GreetingFlow() {
  const { phase, setPhase, voiceEnabled } = useAppState();
  const [hasGreeted, setHasGreeted] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (phase === "greeting" && !hasGreeted) {
      setHasGreeted(true);
      if (voiceEnabled)
        setTimeout(async () => {
          // Canon entrance: Prophet Gad's welcome (HeyGen render); Huldah TTS as fallback.
          const ok = await playClip(VOICE_CLIPS.gadWelcome);
          if (!ok) speakHuldah(HULDAH_GREETING);
        }, 2000);
    }
  }, [phase, voiceEnabled, hasGreeted]);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => setActiveSlide(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on("select", onSelect);

    const autoplay = setInterval(() => carouselApi.scrollNext(), 4500);

    return () => {
      carouselApi.off("select", onSelect);
      clearInterval(autoplay);
    };
  }, [carouselApi]);

  if (phase !== "greeting") return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        background: BG_COLOR,
        backgroundImage: `
          radial-gradient(ellipse at 20% 20%, rgba(212,160,23,0.07) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 80%, rgba(5,150,105,0.05) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 100%, rgba(212,160,23,0.06) 0%, transparent 50%)
        `,
        fontFamily: ARIAL,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          borderBottom: "2px solid hsl(42, 90%, 45%)",
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 2px 14px rgba(184,134,11,0.12)",
        }}
      >
        <LionMark />

        {/* Center block — title stays truly centered.
            Note: the BETA badge that used to float beside the title was
            removed here now that real monetization (Stripe checkout for
            the Remnant Warning ebook) is live — this is no longer a beta
            product. */}
        <div style={{ textAlign: "center", flex: 1, minWidth: 0 }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <h1
              style={{
                fontFamily: ARIAL,
                fontWeight: 800,
                fontSize: 30,
                letterSpacing: "0.08em",
                background: GOLD_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: GOLD_DEEP,
                filter: "drop-shadow(0 1px 1px rgba(184,134,11,0.35))",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Clear Signal
            </h1>
          </div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "hsl(352, 70%, 33%)",
              fontFamily: ARIAL,
              margin: "3px 0 0",
            }}
          >
            PGAI - Remnant Seed LLC
          </p>
        </div>

        <BreastplateMark />
      </div>

      <NavArrows onForward={() => { stopClip(); setPhase("name"); }} forwardLabel="Continue" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          padding: "24px 20px 40px",
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1 }}
          style={{ width: "min(220px, 60vw)", marginLeft: "auto", marginRight: "auto" }}
        >
          <Carousel
            opts={{ loop: true }}
            setApi={setCarouselApi}
            className="w-full"
            data-testid="carousel-gad-photos"
          >
            <CarouselContent>
              {GAD_PHOTOS.map((photo) => (
                <CarouselItem key={photo.src}>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    draggable={false}
                    style={{
                      width: "100%",
                      height: "min(340px, 55vh)",
                      borderRadius: 8,
                      objectFit: photo.fit ?? "cover",
                      background: "#ffffff",
                      objectPosition: photo.fit === "contain" ? "center" : "top center",
                      border: "1px solid hsl(42, 85%, 55%)",
                      boxShadow: "0 8px 28px rgba(184,134,11,0.18)",
                      display: "block",
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
            {GAD_PHOTOS.map((photo, i) => (
              <button
                key={photo.src}
                onClick={() => carouselApi?.scrollTo(i)}
                aria-label={`Show photo ${i + 1} of ${GAD_PHOTOS.length}`}
                data-testid={`button-carousel-dot-${i}`}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  border: 0,
                  padding: 0,
                  cursor: "pointer",
                  background: i === activeSlide ? GOLD_DEEP : "hsl(220, 12%, 80%)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </motion.div>

        <WaveBanner />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            maxWidth: 560,
            width: "100%",
            background: "#ffffff",
            border: "1px solid hsl(220, 15%, 88%)",
            borderTop: "3px solid hsl(42, 95%, 42%)",
            borderRadius: 8,
            padding: "12px 14px",
            boxShadow: "0 8px 28px rgba(184,134,11,0.16)",
          }}
          data-testid="huldah-greeting-card"
        >
          <img
            src="/images/huldah-headshot.webp"
            alt="Prophetess Huldah"
            draggable={false}
            style={{
              width: 84,
              height: 94,
              borderRadius: 10,
              objectFit: "cover",
              objectPosition: "center top",
              border: "2px solid hsl(42, 90%, 48%)",
              boxShadow: "0 4px 14px rgba(184,134,11,0.28)",
              flexShrink: 0,
              display: "block",
            }}
          />
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: GOLD_DEEP,
                marginBottom: 4,
              }}
            >
              Prophetess Huldah — Your Guide
            </div>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                fontStyle: "italic",
                color: BURGUNDY,
                margin: 0,
              }}
            >
              &ldquo;Welcome. You have arrived at Clear Signal, a place of discernment, not
              judgment. I am Huldah, and I am here to guide you.&rdquo;
            </p>
          </div>
        </div>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            textAlign: "justify",
            color: BURGUNDY,
            fontFamily: ARIAL,
            margin: 0,
            maxWidth: 560,
          }}
        >
          Clear Signal applies the same listening criteria across traditions, genres, and nations:
          rhythm, repetition, lyric signal, dynamic movement, and trance-inducement risk. Its
          visual world honors the ancient office of Prophet Gad while keeping the analysis itself
          focused on measurable patterns in the sound.
        </p>

        <button
          onClick={() => setPhase("name")}
          style={{
            background: GOLD_GRADIENT,
            color: "hsl(222, 30%, 8%)",
            border: "1px solid hsl(42, 90%, 34%)",
            borderRadius: 6,
            padding: "12px 22px",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.04em",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(184,134,11,0.35)",
          }}
          data-testid="button-start-greeting"
        >
          Begin Analysis
        </button>
      </motion.div>
    </div>
  );
}
