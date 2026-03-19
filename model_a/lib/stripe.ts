import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null; // demo mode — env vars come last
  if (!cached) {
    cached = new Stripe(key, { apiVersion: "2023-10-16" });
  }
  return cached;
}

export const PRICE_CENTS = 500; // $5.00 / month
