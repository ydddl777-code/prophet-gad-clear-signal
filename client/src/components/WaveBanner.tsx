// Clear Signal wave banner — Adlai's custom sound-wave graphic (already gold-framed).
export function WaveBanner() {
  return (
    <img
      src="/images/wave-banner.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{
        display: "block",
        width: "100%",
        maxWidth: 704,
        height: "auto",
        margin: "0 auto",
      }}
    />
  );
}
