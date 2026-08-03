// Client helpers for the "Remnant Warning" ebook purchase flow (Stripe
// Checkout, hosted page — the app never touches card data).

// Keep this in sync with the server default in server/lib/stripe.ts
// (STRIPE_BOOK_PRICE_USD_CENTS fallback). This is a *display* value only;
// the server is always the source of truth for the actual charge amount.
export const BOOK_PRICE_DISPLAY = "$9.99";
export const BOOK_TITLE_DISPLAY = "Remnant Warning";
export const BOOK_SUBTITLE_DISPLAY =
  "No Contemporary Worship Music for the Israelites";

export class CheckoutUnavailableError extends Error {}

/**
 * Starts a Stripe Checkout session for the book and redirects the browser
 * to the hosted Checkout page. Throws CheckoutUnavailableError if Stripe
 * isn't configured yet (e.g. STRIPE_SECRET_KEY missing in this environment).
 */
export async function startBookCheckout(): Promise<void> {
  const response = await fetch("/api/checkout/book-session", { method: "POST" });
  if (response.status === 503) {
    throw new CheckoutUnavailableError("Payments are not configured yet.");
  }
  if (!response.ok) {
    throw new Error("Could not start checkout.");
  }
  const data = (await response.json()) as { url?: string };
  if (!data.url) {
    throw new Error("Checkout session did not return a redirect URL.");
  }
  window.location.href = data.url;
}

/** Reads ?book_session_id=... from the current URL, if present. */
export function getBookSessionIdFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("book_session_id");
}

export function wasCheckoutCancelled(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("book_cancelled") === "1";
}

export function bookDownloadUrl(sessionId: string): string {
  return `/api/book/download?session_id=${encodeURIComponent(sessionId)}`;
}

/** Strips the book_session_id / book_cancelled params back out of the URL bar. */
export function clearBookParamsFromUrl(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("book_session_id");
  url.searchParams.delete("book_cancelled");
  window.history.replaceState({}, "", url.toString());
}
