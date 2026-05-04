import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

const GOLD    = "hsl(43, 74%, 52%)";
const CRIMSON = "hsl(0, 72%, 32%)";
const DIM     = "hsl(40, 10%, 52%)";
const CARD_BG = "hsl(20, 6%, 9%)";
const BORDER  = "hsl(40, 8%, 14%)";

const CATEGORIES = [
  {
    icon: "♩",
    title: "BPM & Frequency Profile",
    desc: "Tempo analysis against known brainwave entrainment thresholds. Safe zone: 60–100 BPM. Genre-appropriate patterns (reggae, roots, dub, bachata) are recognized and not penalized.",
  },
  {
    icon: "📖",
    title: "Lyrical Doctrine",
    desc: "Scripture alignment, doctrinal substance, and red-flag terminology detection. Prophetic declaration, Torah-aligned themes, and KJV language score high.",
  },
  {
    icon: "⚠",
    title: "Trance Inducement Risk",
    desc: "Repetition patterns, monotony index, and entrainment duration. Distinguishes genre-appropriate repetition from monotonous trance induction.",
  },
  {
    icon: "🔁",
    title: "Loop & Repetition Analysis",
    desc: "Mantra-like structures that bypass conscious engagement. Measures whether repetition serves rhythm or creates dissociative saturation.",
  },
  {
    icon: "🌍",
    title: "Cultural Degradation Markers",
    desc: "Historical patterns associated with civilizational decline through music. Applied equally across all cultural traditions and genres.",
  },
  {
    icon: "🥁",
    title: "Rhythmic Archetype Classification",
    desc: "Genre-aware analysis that distinguishes cultural rhythm from spiritual manipulation. Roots, dub, nyabinghi, and prophetic percussion are evaluated in context.",
  },
];

// Canvas-rendered waveform hero — no image file needed
function WaveformHero() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 680,
        height: 130,
        position: "relative",
        overflow: "hidden",
        borderRadius: 8,
        background: "hsl(20, 6%, 7%)",
        border: `1px solid ${BORDER}`,
      }}
    >
      <svg
        viewBox="0 0 680 130"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="hsl(0,72%,32%)"  stopOpacity="0.3" />
            <stop offset="40%"  stopColor="hsl(43,74%,52%)" stopOpacity="0.9" />
            <stop offset="70%"  stopColor="hsl(43,74%,52%)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(0,72%,32%)"  stopOpacity="0.2" />
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
        <line x1="0" y1="65" x2="680" y2="65" stroke="hsl(43,40%,30%)" strokeWidth="0.5" strokeOpacity="0.4" />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, hsl(20,8%,7%) 0%, transparent 12%, transparent 88%, hsl(20,8%,7%) 100%)",
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
      style={{ width: "100%", maxWidth: 680 }}
    >
      <h2
        style={{
          fontFamily: ARIAL,
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: GOLD,
          marginBottom: 14,
          paddingBottom: 8,
          borderBottom: `1px solid ${BORDER}`,
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
        background: "hsl(20, 8%, 6%)",
        fontFamily: ARIAL,
        color: "hsl(40, 15%, 86%)",
        overflowX: "hidden",
      }}
    >
      {/* Top crimson bar */}
      <div style={{ height: 2, background: `linear-gradient(to right, transparent, ${CRIMSON}, transparent)` }} />

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
            fontSize: 12,
            fontFamily: ARIAL,
            letterSpacing: "0.06em",
            padding: "4px 0",
          }}
          data-testid="button-back-about"
        >
          <ArrowLeft style={{ width: 14, height: 14 }} />
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
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: CRIMSON,
            fontFamily: ARIAL,
          }}
        >
          Music Discernment · Remnant Seed Sound Framework
        </p>
        <h1
          style={{
            fontFamily: ARIAL,
            fontWeight: 800,
            fontSize: "clamp(22px, 5vw, 36px)",
            color: GOLD,
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
            fontSize: 15,
            color: "hsl(40, 12%, 68%)",
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
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "hsl(40, 10%, 72%)", margin: 0 }}>
            Every sound that enters the human ear triggers a measurable neurological response. This is not
            opinion — it is documented neuroscience. Specific frequencies, tempos, and rhythmic patterns
            can induce altered states of consciousness, bypass critical thinking, and create emotional
            dependency. The question is not whether music affects the brain. The question is whether the
            music you allow into your worship, your home, and your spirit has been designed to help you —
            or to manipulate you.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "hsl(40, 10%, 72%)", margin: "14px 0 0" }}>
            Clear Signal applies a framework built on decades of neuroscience research and thousands of
            years of documented history to answer that question for any song you submit.
          </p>
        </Section>

        {/* Section 2 */}
        <Section title="Civilizations Have Known This for Millennia">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "hsl(40, 10%, 72%)", margin: 0 }}>
            The relationship between music and the rise or fall of civilizations is not new. Ancient China's{" "}
            <em>Yue Ji</em> (Record of Music) documented how the corruption of court music preceded dynastic
            collapse. The Roman Empire's shift from sacred hymns to theatrical spectacle paralleled its moral
            decline. The Bwa Kayiman ceremony of 1791 demonstrated the raw spiritual power of rhythmic
            invocation. Tibetan, Kurdish, West African, and Indigenous traditions worldwide have long
            understood that certain rhythmic and tonal patterns open gates — and others close them.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "hsl(40, 10%, 72%)", margin: "14px 0 0" }}>
            Western science has only recently caught up. Brainwave entrainment, binaural beat research,
            the documented effects of 432Hz vs. 440Hz tuning systems, the use of infrasound in crowd
            control and mass emotion manipulation — these are not fringe topics. They are peer-reviewed,
            funded, and actively studied. And yet most people never ask whether the music playing on
            Sunday morning — or in their child's headphones — has been engineered with any of these
            techniques in mind.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "hsl(40, 10%, 72%)", margin: "14px 0 0" }}>
            Clear Signal stands on this historical foundation. We are not inventing a theory. We are
            applying what civilizations have understood for millennia to the music being played in
            churches, homes, and headphones today. The full historical analysis is documented in the
            Remnant Seed Sound publication, available through Prophet Gad's catalog.
          </p>
        </Section>

        {/* Section 3 — cards */}
        <Section title="What We Measure">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
                  borderRadius: 8,
                  padding: "16px 18px",
                }}
                data-testid={`card-category-${cat.title.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <h3
                    style={{
                      fontFamily: ARIAL,
                      fontWeight: 700,
                      fontSize: 12,
                      color: GOLD,
                      margin: 0,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {cat.title}
                  </h3>
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.7, color: DIM, margin: 0 }}>{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Section 4 — disclosure */}
        <Section title="Important Notice">
          <div
            style={{
              background: "hsl(0, 20%, 7%)",
              border: `1px solid hsl(0, 30%, 18%)`,
              borderRadius: 8,
              padding: "20px 22px",
            }}
          >
            <p style={{ fontSize: 13, lineHeight: 1.85, color: "hsl(40, 8%, 62%)", margin: 0 }}>
              Clear Signal is a personal discernment tool developed by Prophet Gad under the Remnant
              Seed Sound framework. Analysis results reflect alignment with this framework's criteria
              and are provided for personal educational and spiritual reference only. Clear Signal does
              not claim legal, scientific, or theological authority over any commercial music product.
              All music remains the intellectual property of its respective owners. No personal data,
              uploaded audio files, or listening history is stored, transmitted, or retained by this
              application. Analysis is performed in-session only and discarded upon exit.
            </p>
            <p
              style={{
                fontSize: 12,
                fontStyle: "italic",
                color: GOLD,
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
              fontSize: 12,
              color: GOLD,
              textDecoration: "none",
              letterSpacing: "0.06em",
              fontFamily: ARIAL,
            }}
            data-testid="link-remnant-seed-publication"
          >
            Read the full Remnant Seed Sound publication
            <ExternalLink style={{ width: 12, height: 12 }} />
          </a>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: `1px solid hsl(0, 40%, 22%)`,
              borderRadius: 4,
              padding: "7px 22px",
              cursor: "pointer",
              color: "hsl(0, 55%, 55%)",
              fontSize: 12,
              fontFamily: ARIAL,
              letterSpacing: "0.08em",
            }}
            data-testid="button-return-analysis"
          >
            Return to Analysis
          </button>
          <p style={{ fontSize: 10, color: "hsl(40, 6%, 28%)", textAlign: "center", fontFamily: ARIAL }}>
            A product of Prophet Gad — Remnant Seed LLC · Thread Bear Studio
          </p>
        </motion.div>
      </main>
    </div>
  );
}
