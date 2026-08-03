import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import {
  getBookSessionIdFromUrl,
  wasCheckoutCancelled,
  bookDownloadUrl,
  clearBookParamsFromUrl,
} from "@/lib/bookCheckout";

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

/**
 * Mounted once near the app root. Detects the Stripe Checkout success
 * redirect (?book_session_id=...) or a cancelled checkout (?book_cancelled=1)
 * and shows the appropriate confirmation banner. The actual PDF is only
 * ever produced after the server re-verifies the session with Stripe.
 */
export function BookDownloadBanner() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setSessionId(getBookSessionIdFromUrl());
    setCancelled(wasCheckoutCancelled());
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    clearBookParamsFromUrl();
  };

  const show = (!!sessionId || cancelled) && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 300,
            width: "calc(100% - 32px)",
            maxWidth: 440,
            background: "#ffffff",
            border: "1px solid hsl(220, 15%, 88%)",
            borderTop: sessionId ? "3px solid #059669" : "3px solid hsl(350, 72%, 42%)",
            borderRadius: 10,
            padding: "16px 18px",
            boxShadow: "0 12px 34px rgba(0,0,0,0.18)",
            fontFamily: ARIAL,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
          data-testid="banner-book-download"
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div>
              {sessionId ? (
                <>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "hsl(161, 84%, 20%)" }}>
                    Thank you — your purchase is confirmed.
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "hsl(222, 10%, 36%)" }}>
                    Remnant Warning is ready to download.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "hsl(350, 72%, 36%)" }}>
                    Checkout cancelled
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "hsl(222, 10%, 36%)" }}>
                    No charge was made. You can try again any time.
                  </p>
                </>
              )}
            </div>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "hsl(222, 10%, 55%)" }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {sessionId && (
            <a
              href={bookDownloadUrl(sessionId)}
              onClick={() => setTimeout(handleDismiss, 300)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#059669",
                color: "#ffffff",
                border: "1px solid #047857",
                borderRadius: 8,
                padding: "10px 0",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(5,150,105,0.30)",
              }}
              data-testid="link-download-book"
            >
              <Download style={{ width: 16, height: 16 }} />
              Download Your Book (PDF)
            </a>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
