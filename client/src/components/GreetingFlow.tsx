import { useEffect, useState } from "react";
import { useAppState } from "@/lib/appState";
import { motion } from "framer-motion";
import { speakHuldah } from "@/lib/tts";
import { WaveBanner } from "@/components/WaveBanner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const GAD_PHOTOS: { src: string; alt: string }[] = [
  { src: "/images/gad-carousel-1.webp", alt: "Prophet Gad" },
  { src: "/images/gad-carousel-2.webp", alt: "Prophet Gad in full regalia, spear in hand" },
  { src: "/images/gad-carousel-3.webp", alt: "Prophet Gad, warrior stance" },
];

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
const BG_COLOR = "hsl(355, 22%, 6%)";

const HULDAH_GREETING =
  "Friend... stranger... welcome. " +
  "You have arrived at Clear Signal, a place of discernment, not judgment. " +
  "I am Huldah, and I am here to guide you. " +
  "Before we begin, how would you like to be addressed? " +
  "You are not required to share your name. " +
  "But if you do, your results will be prepared with that name. " +
  "When you are ready, press Enter.";

const MARK_STYLE: import("react").CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  objectFit: "cover",
  border: "1px solid rgba(184,134,11,0.35)",
  boxShadow: "0 2px 10px rgba(0,0,0,0.45)",
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
      if (voiceEnabled) setTimeout(() => speakHuldah(HULDAH_GREETING), 2000);
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
          radial-gradient(ellipse at 20% 20%, rgba(180,10,10,0.10) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 80%, rgba(120,5,5,0.08) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 100%, rgba(184,134,11,0.06) 0%, transparent 50%)
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
          borderBottom: "1px solid rgba(184,134,11,0.08)",
          background: "rgba(14,6,4,0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        <LionMark />

        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <h1
              style={{
                fontFamily: ARIAL,
                fontWeight: 800,
                fontSize: 30,
                letterSpacing: "0.08em",
                color: "hsl(43,72%,54%)",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Clear Signal
            </h1>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "hsl(270,50%,75%)",
                background: "hsl(270,30%,18%)",
                border: "1px solid hsl(270,30%,30%)",
                borderRadius: 4,
                padding: "2px 6px",
                alignSelf: "flex-start",
                marginTop: 4,
              }}
            >
              BETA
            </span>
          </div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "hsl(0,45%,40%)",
              fontFamily: ARIAL,
              margin: "2px 0 0",
            }}
          >
            PGAI - Remnant Seed LLC
          </p>
        </div>

        <BreastplateMark />
      </div>

      <button
        onClick={() => setPhase("name")}
        title="Continue"
        style={{
          position: "fixed",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 60,
          background: "rgba(14,8,6,0.7)",
          border: "1px solid hsl(43,35%,20%)",
          borderRadius: "50%",
          width: 34,
          height: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "hsl(43,45%,38%)",
          fontSize: 18,
        }}
        data-testid="button-nav-forward-greeting"
      >
        &gt;
      </button>

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
          style={{ width: "min(220px, 60vw)" }}
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
                      objectFit: "cover",
                      objectPosition: "top center",
                      border: "1px solid rgba(184,134,11,0.15)",
                      boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
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
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  border: 0,
                  padding: 0,
                  cursor: "pointer",
                  background: i === activeSlide ? "hsl(43,72%,54%)" : "hsl(40,10%,30%)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </motion.div>

        <WaveBanner />

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.8,
            textAlign: "justify",
            color: "hsl(40, 12%, 72%)",
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
            background: "hsl(43,72%,46%)",
            color: "hsl(30,20%,8%)",
            border: 0,
            borderRadius: 6,
            padding: "11px 18px",
            fontWeight: 800,
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
          data-testid="button-start-greeting"
        >
          Begin Analysis
        </button>
      </motion.div>
    </div>
  );
}
