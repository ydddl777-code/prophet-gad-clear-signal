import { useState, type CSSProperties } from "react";
import { BookOpen } from "lucide-react";
import {
  startBookCheckout,
  CheckoutUnavailableError,
  BOOK_PRICE_DISPLAY,
  BOOK_TITLE_DISPLAY,
  BOOK_SUBTITLE_DISPLAY,
} from "@/lib/bookCheckout";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

interface Props {
  /** Slightly tighter layout for use inside the trial-exhausted modal. */
  compact?: boolean;
}

const CARD_STYLE: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#ffffff",
  border: "1px solid hsl(220, 15%, 88%)",
  borderTop: "3px solid hsl(42, 95%, 42%)",
  borderRadius: 8,
  padding: "16px 18px",
  boxShadow: "0 8px 28px rgba(184,134,11,0.16)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  fontFamily: ARIAL,
};

export function BookOffer({ compact }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuy = async () => {
    setError("");
    setLoading(true);
    try {
      await startBookCheckout();
      // Browser is navigating away to Stripe Checkout; leave loading=true.
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof CheckoutUnavailableError
          ? "The book isn't available for purchase yet — check back soon."
          : "Checkout couldn't start. Please try again in a moment."
      );
    }
  };

  return (
    <div style={CARD_STYLE} data-testid="panel-book-offer">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <BookOpen style={{ width: 26, height: 26, color: "hsl(42, 95%, 38%)", flexShrink: 0 }} strokeWidth={1.6} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
          <span style={{ fontSize: compact ? 14 : 15, fontWeight: 800, color: "hsl(222, 20%, 15%)" }}>
            {BOOK_TITLE_DISPLAY}
          </span>
          <span style={{ fontSize: 12, color: "hsl(222, 10%, 40%)" }}>{BOOK_SUBTITLE_DISPLAY}</span>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: "hsl(222, 10%, 36%)", textAlign: "left" }}>
        The full companion ebook — Prophet Gad Speaks, Volume 1. The doctrine and technical parameters behind
        Clear Signal's Signal Clarity Score, in one downloadable book.
      </p>
      {error && (
        <p role="alert" style={{ margin: 0, fontSize: 12, color: "hsl(350, 72%, 40%)" }}>
          {error}
        </p>
      )}
      <button
        onClick={handleBuy}
        disabled={loading}
        data-testid="button-buy-book"
        style={{
          background: "linear-gradient(135deg, hsl(45, 95%, 50%), hsl(38, 90%, 42%))",
          color: "hsl(222, 30%, 8%)",
          fontFamily: ARIAL,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          border: "1px solid hsl(42, 90%, 34%)",
          borderRadius: 20,
          padding: "0.7rem 1.6rem",
          cursor: loading ? "default" : "pointer",
          opacity: loading ? 0.7 : 1,
          boxShadow: "0 4px 14px rgba(184,134,11,0.30)",
        }}
      >
        {loading ? "Opening secure checkout…" : `Get the Book — ${BOOK_PRICE_DISPLAY}`}
      </button>
      <p style={{ margin: 0, fontSize: 10.5, color: "hsl(222, 10%, 50%)" }}>
        Secure checkout via Stripe. One-time purchase, instant PDF download.
      </p>
    </div>
  );
}
