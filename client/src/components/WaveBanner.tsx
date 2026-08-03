
// Deterministic bar heights — a lively, symmetric waveform.
const BAR_COUNT = 88;
const BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const seed =
    Math.sin(i * 0.47) * Math.cos(i * 0.19) * Math.sin(i * 0.83) +
    Math.sin(i * 1.31) * 0.35;
  const h = 4 + Math.abs(seed) * 34;
  return { x: i * 8 + 2, h };
});

export function WaveBanner() {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        height: 56,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "1px solid hsl(352, 70%, 33%)",
        borderBottom: "1px solid hsl(352, 70%, 33%)",
        borderRadius: 6,
        background: "#ffffff",
        boxShadow: "0 4px 16px rgba(141,27,50,0.16)",
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 704 56"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <defs>
          <linearGradient id="wave-banner-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(355, 75%, 42%)" />
            <stop offset="55%" stopColor="hsl(352, 70%, 33%)" />
            <stop offset="100%" stopColor="hsl(348, 70%, 28%)" />
          </linearGradient>
          <linearGradient id="wave-banner-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(355, 75%, 42%)" stopOpacity="0.35" />
            <stop offset="18%" stopColor="hsl(352, 70%, 33%)" stopOpacity="1" />
            <stop offset="82%" stopColor="hsl(352, 70%, 33%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(348, 70%, 28%)" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Gold hairline center axis */}
        <line
          x1="0"
          y1="28"
          x2="704"
          y2="28"
          stroke="hsl(352, 70%, 33%)"
          strokeWidth="0.75"
          strokeOpacity="0.45"
        />

        {/* Vertical waveform bars in a gold gradient */}
        {BARS.map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={28 - bar.h / 2}
            width={4}
            height={bar.h}
            rx={2}
            fill="url(#wave-banner-gold)"
            opacity={0.5 + Math.abs(Math.sin(i * 0.6)) * 0.5}
          />
        ))}

        {/* Horizontal luminosity fade at the edges */}
        <rect
          x="0"
          y="0"
          width="704"
          height="56"
          fill="url(#wave-banner-fade)"
          opacity="0.12"
        />
      </svg>

    </div>
  );
}
