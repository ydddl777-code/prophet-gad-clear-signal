import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  AudioWaveform,
  BookOpen,
  TriangleAlert,
  Repeat,
  Globe,
  Drum,
} from "lucide-react";
import { NavArrows } from "@/components/NavArrows";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

const GOLD    = "hsl(42, 95%, 36%)";
const CRIMSON = "hsl(352, 70%, 33%)";
const DIM     = "hsl(222, 10%, 30%)";
const BODY    = "hsl(222, 20%, 15%)";
const CARD_BG = "#ffffff";
const BORDER  = "hsl(220, 15%, 88%)";

const CATEGORIES = [
  {
    icon: AudioWaveform,
    title: "BPM & Frequency Profile",
    desc: "Tempo analysis against known brainwave entrainment thresholds. Safe zone: 60–100 BPM. Genre-appropriate patterns (reggae, roots, dub, bachata) are recognized and not penalized.",
  },
  {
    icon: BookOpen,
    title: "Lyrical Doctrine",
    desc: "Lyric clarity, source language, and red-flag terminology detection. Clear declaration, coherent meaning, and KJV-rooted language score high.",
  },
  {
    icon: TriangleAlert,
    title: "Trance Inducement Risk",
    desc: "Repetition patterns, monotony index, and entrainment duration. Distinguishes genre-appropriate repetition from monotonous trance induction.",
  },
  {
    icon: Repeat,
    title: "Loop & Repetition Analysis",
    desc: "Mantra-like structures that bypass conscious engagement. Measures whether repetition serves rhythm or creates dissociative saturation.",
  },
  {
    icon: Globe,
    title: "Cultural Degradation Markers",
    desc: "Historical patterns associated with civilizational decline through music. Applied equally across all cultural traditions and genres.",
  },
  {
    icon: Drum,
    title: "Rhythmic Archetype Classification",
    desc: "Genre-aware analysis that distinguishes cultural rhythm from manipulative repetition. Roots, dub, nyabinghi, and prophetic percussion are evaluated in context.",
  },
];

// Canvas-rendered waveform hero — no image file needed
function WaveformHero() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 680,
        margin: "0 auto",
        height: 130,
        position: "relative",
        overflow: "hidden",
        borderRadius: 8,
        background: "#ffffff",
        border: `1px solid ${BORDER}`,
        borderTop: "2px solid hsl(42, 95%, 45%)",
        borderBottom: "2px solid hsl(42, 95%, 45%)",
        boxShadow: "0 8px 28px rgba(184,134,11,0.16)",
      }}
    >
      <svg
        viewBox="0 0 680 130"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="hsl(355,75%,42%)" stopOpacity="0.55" />
            <stop offset="40%"  stopColor="hsl(352,70%,33%)" stopOpacity="0.98" />
            <stop offset="70%"  stopColor="hsl(42,92%,45%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(161,84%,28%)" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        {/* Main waveform bars */}
        {Array.from({ length: 68 }, (_, i) => {
          const x = i * 10 + 4;
          const seed = Math.sin(i * 0.41) * Math.cos(i * 0.17) * Math.sin(i * 0.73);
          const h = 10 + Math.abs(seed) * 90;
          const y = (130 - h) / 2;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={4}
              height={h}
              rx={2}
              fill="url(#wg)"
              opacity={0.55 + Math.abs(Math.sin(i * 0.6)) * 0.45}
            />
          );
        })}
        {/* Center line */}
        <line x1="0" y1="65" x2="680" y2="65" stroke="hsl(42,90%,45%)" strokeWidth="0.5" strokeOpacity="0.6" />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, #ffffff 0%, transparent 12%, transparent 88%, #ffffff 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      style={{ width: "100%", maxWidth: 680, marginLeft: "auto", marginRight: "auto" }}
    >
      <h2
        style={{
          fontFamily: ARIAL,
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: CRIMSON,
          margin: "0 0 14px",
          paddingBottom: 8,
          borderBottom: `1px solid ${BORDER}`,
          textAlign: "center",
        }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "hsl(210, 20%, 98.5%)",
        fontFamily: ARIAL,
        color: BODY,
        overflowX: "hidden",
      }}
    >
      {/* Top crimson bar */}
      <div style={{ height: 2, background: `linear-gradient(to right, transparent, ${CRIMSON}, transparent)` }} />

      {/* Green brand arrows — in/out of the About page */}
      <NavArrows
        onBack={() => navigate("/")}
        onForward={() => navigate("/")}
        backLabel="Return to the analysis"
        forwardLabel="Return to the analysis"
      />

      {/* Back button */}
      <div style={{ padding: "14px 20px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: DIM,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: ARIAL,
            letterSpacing: "0.06em",
            padding: "4px 0",
          }}
          data-testid="button-back-about"
        >
          <ArrowLeft style={{ width: 15, height: 15 }} />
          Return to Analysis
        </button>
      </div>

      {/* Hero */}
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "24px 20px 36px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: CRIMSON,
            fontFamily: ARIAL,
            margin: 0,
          }}
        >
          Music Discernment · In Harmony with Heaven
        </p>
        <h1
          style={{
            fontFamily: ARIAL,
            fontWeight: 800,
            fontSize: "clamp(24px, 5vw, 38px)",
            background: "linear-gradient(135deg, hsl(45, 95%, 50%), hsl(38, 90%, 42%))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: GOLD,
            filter: "drop-shadow(0 1px 1px rgba(184,134,11,0.35))",
            letterSpacing: "0.04em",
            margin: 0,
            lineHeight: 1.2,
          }}
          data-testid="text-about-title"
        >
          The Science Behind the Signal
        </h1>
        <p
          style={{
            fontSize: 19,
            color: BODY,
            fontStyle: "italic",
            margin: 0,
            fontFamily: ARIAL,
          }}
        >
          Why music matters more than you think
        </p>

        <div style={{ marginTop: 8, width: "100%" }}>
          <WaveformHero />
        </div>
      </motion.header>

      {/* Content */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44,
          padding: "0 20px 60px",
        }}
      >
        {/* Section 1 */}
        <Section title="Sound Shapes the Mind">
          <p style={{ fontSize: 16, lineHeight: 1.8, color: BODY, margin: 0 }}>
            Every sound that enters the human ear triggers a measurable neurological response. This is not
            opinion — it is documented neuroscience. Specific frequencies, tempos, and rhythmic patterns
            can induce altered states of consciousness, bypass critical thinking, and create emotional
            dependency. The question is not whether music affects the brain. The question is whether the
            music you allow into your worship, your home, and your spirit has been designed to help you —
            or to manipulate you.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: BODY, margin: "14px 0 0" }}>
            Clear Signal draws on decades of neuroscience research and thousands of years of documented
            history to answer that question for any song you submit. The measure is simple and universal:
            harmony with heaven — music the Lord would accept, music the angels could sing, music fit for
            every tribe and nation, with nothing in it that offends or manipulates.
          </p>
        </Section>

        {/* Section 2 */}
        <Section title="Civilizations Have Known This for Millennia">
          <p style={{ fontSize: 16, lineHeight: 1.8, color: BODY, margin: 0 }}>
            The relationship between music and the rise or fall of civilizations is not new. Ancient China's{" "}
            <em>Yue Ji</em> (Record of Music) documented how the corruption of court music preceded dynastic
            collapse. The Roman Empire's shift from disciplined hymns to theatrical spectacle paralleled its moral
            decline. The Bwa Kayiman ceremony of 1791 demonstrated the intense social power of rhythmic
            invocation. Tibetan, Kurdish, West African, and Indigenous traditions worldwide have long
            understood that certain rhythmic and tonal patterns open gates — and others close them.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: BODY, margin: "14px 0 0" }}>
            Western science has only recently caught up. Brainwave entrainment, binaural beat research,
            the documented effects of 432Hz vs. 440Hz tuning systems, the use of infrasound in crowd
            control and mass emotion manipulation — these are not fringe topics. They are peer-reviewed,
            funded, and actively studied. And yet most people never ask whether the music playing on
            Sunday morning — or in their child's headphones — has been engineered with any of these
            techniques in mind.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: BODY, margin: "14px 0 0" }}>
            Clear Signal stands on this historical foundation. We are not inventing a theory. We are
            applying what civilizations have understood for millennia to the music being played in
            churches, homes, and headphones today. The full historical analysis is documented in
            Prophet Gad's published study of music and the spirit, available through his catalog.
          </p>
        </Section>

        {/* Section 3 — cards */}
        <Section title="What We Measure">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
              gap: 14,
              width: "100%",
            }}
          >
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{
                  background: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  borderTop: "3px solid hsl(42, 95%, 42%)",
                  borderRadius: 8,
                  padding: "16px 18px",
                  boxShadow: "0 8px 28px rgba(184,134,11,0.14)",
                }}
                data-testid={`card-category-${cat.title.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <cat.icon style={{ width: 18, height: 18, color: GOLD, flexShrink: 0 }} strokeWidth={1.75} />
                  <h3
                    style={{
                      fontFamily: ARIAL,
                      fontWeight: 700,
                      fontSize: 14,
                      color: GOLD,
                      margin: 0,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {cat.title}
                  </h3>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: DIM, margin: 0 }}>{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Section 4 — disclosure */}
        <Section title="Important Notice">
          <div
            style={{
              background: "#ffffff",
              border: `1px solid ${BORDER}`,
              borderLeft: "3px solid hsl(350, 72%, 42%)",
              borderRadius: 8,
              padding: "20px 22px",
              boxShadow: "0 8px 28px rgba(184,134,11,0.12)",
            }}
          >
            <p style={{ fontSize: 15, lineHeight: 1.85, color: DIM, margin: 0 }}>
              Clear Signal is a personal discernment tool developed by Prophet Gad. Analysis results
              reflect one simple measure — harmony with heaven, music with nothing in it that offends
              or manipulates — and are provided for personal educational reference only. Clear Signal does
              not claim legal, scientific, or theological authority over any commercial music product.
              All music remains the intellectual property of its respective owners. No personal data,
              uploaded audio files, or listening history is stored, transmitted, or retained by this
              application. Analysis is performed in-session only and discarded upon exit.
            </p>
            <p
              style={{
                fontSize: 14,
                fontStyle: "italic",
                color: GOLD,
                fontWeight: 700,
                margin: "16px 0 0",
                textAlign: "center",
                letterSpacing: "0.04em",
              }}
            >
              "Prove all things; hold fast that which is good." — 1 Thessalonians 5:21
            </p>
          </div>
        </Section>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            width: "100%",
            maxWidth: 680,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            paddingTop: 10,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <a
            href="https://prophetgad.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 700,
              color: GOLD,
              textDecoration: "underline",
              letterSpacing: "0.06em",
              fontFamily: ARIAL,
            }}
            data-testid="link-remnant-seed-publication"
          >
            Read Prophet Gad's full publication on music
            <ExternalLink style={{ width: 13, height: 13 }} />
          </a>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#059669",
              border: `1px solid #047857`,
              borderRadius: 6,
              padding: "10px 26px",
              cursor: "pointer",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: ARIAL,
              letterSpacing: "0.08em",
              boxShadow: "0 4px 14px rgba(5,150,105,0.32)",
            }}
            data-testid="button-return-analysis"
          >
            Return to Analysis
          </button>
          <p style={{ fontSize: 14, color: "hsl(222, 10%, 30%)", textAlign: "center", fontFamily: ARIAL, margin: 0 }}>
            A product of Prophet Gad · Thread Bear Studio
          </p>
        </motion.div>
      </main>
    </div>
  );
}
