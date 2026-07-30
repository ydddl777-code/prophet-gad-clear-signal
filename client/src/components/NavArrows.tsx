import type { CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Green brand navigation arrows — v2 standard across all PG apps.
 * Big, plainly visible, emerald green, fixed mid-page on every screen.
 * Left = back, right = forward. Never faded, never subtle.
 */

const GREEN = "#059669"; // emerald-600 — "a nice cute green", 3.6:1 on white
const GREEN_DARK = "#047857"; // emerald-700

const ARROW_BASE: CSSProperties = {
  position: "fixed",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 80,
  width: 58,
  height: 58,
  borderRadius: "50%",
  background: GREEN,
  border: `2px solid ${GREEN_DARK}`,
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(4, 120, 87, 0.35)",
  padding: 0,
};

const ICON_STYLE: CSSProperties = { width: 34, height: 34 };

interface NavArrowsProps {
  onBack?: () => void;
  onForward?: () => void;
  backLabel?: string;
  forwardLabel?: string;
}

export function NavArrows({
  onBack,
  onForward,
  backLabel = "Go back",
  forwardLabel = "Continue",
}: NavArrowsProps) {
  return (
    <>
      {onBack && (
        <button
          onClick={onBack}
          aria-label={backLabel}
          title={backLabel}
          style={{ ...ARROW_BASE, left: 12 }}
          data-testid="nav-arrow-back"
        >
          <ChevronLeft style={ICON_STYLE} strokeWidth={3} aria-hidden="true" />
        </button>
      )}
      {onForward && (
        <button
          onClick={onForward}
          aria-label={forwardLabel}
          title={forwardLabel}
          style={{ ...ARROW_BASE, right: 12 }}
          data-testid="nav-arrow-forward"
        >
          <ChevronRight style={ICON_STYLE} strokeWidth={3} aria-hidden="true" />
        </button>
      )}
    </>
  );
}
