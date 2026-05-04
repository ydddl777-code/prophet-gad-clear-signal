import waveformImg from "@assets/waveform_v5_dark_preview_1777787656877.png";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

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
        borderTop: "1px solid rgba(180,10,10,0.14)",
        borderBottom: "1px solid rgba(180,10,10,0.14)",
      }}
    >
      <img
        src={waveformImg}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 35%",
          display: "block",
          opacity: 0.92,
        }}
      />

      <p
        style={{
          position: "relative",
          zIndex: 2,
          fontFamily: ARIAL,
          fontSize: "clamp(9px, 2vw, 11px)",
          fontWeight: "bold",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "hsl(43, 72%, 52%)",
          textShadow: "0 0 14px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.9)",
          margin: 0,
          padding: "0 8px",
        }}
      >
        Music Discernment · For All Nations
      </p>
    </div>
  );
}
