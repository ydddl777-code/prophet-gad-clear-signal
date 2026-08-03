import Stripe from "stripe";

// ─────────────────────────────────────────────────────────────────────────
// Stripe client for the "Remnant Warning" ebook one-time purchase.
//
// Required env vars (set in Vercel project settings — see the work-product
// report for exactly where to get each value):
//   STRIPE_SECRET_KEY        - sk_live_... / sk_test_...
//   STRIPE_WEBHOOK_SECRET    - whsec_... (from the Stripe webhook endpoint)
//   STRIPE_BOOK_PRICE_ID     - price_... (preferred: a real Stripe Price
//                              object created for the "Remnant Warning"
//                              product). If unset, we fall back to an
//                              inline price built from STRIPE_BOOK_PRICE_USD_CENTS.
//   STRIPE_BOOK_PRICE_USD_CENDS (fallback numeric price, see below)
// ─────────────────────────────────────────────────────────────────────────

let cachedClient: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cachedClient) {
    // No explicit apiVersion pin — let the installed Stripe SDK use its
    // own bundled default API version (avoids drift between this file
    // and whatever "stripe" version actually ends up installed).
    cachedClient = new Stripe(key);
  }
  return cachedClient;
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

// Recommended retail price: $9.99 USD. See work-product report for full
// reasoning (comparable short prophetic/devotional PDF ebooks in this niche
// commonly sell in the $4.99-$14.99 range; $9.99 sits at a confident
// mid-point for a ~40-page themed companion book sold as an impulse add-on
// right after a free analysis, without under-pricing a niche/passionate
// audience).
const DEFAULT_BOOK_PRICE_USD_CENTS = 999;

export function getBookPriceUsdCents(): number {
  const raw = process.env.STRIPE_BOOK_PRICE_USD_CENTS;
  if (!raw) return DEFAULT_BOOK_PRICE_USD_CENTS;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_BOOK_PRICE_USD_CENTS;
}

export function getBookPriceId(): string | undefined {
  return process.env.STRIPE_BOOK_PRICE_ID || undefined;
}
