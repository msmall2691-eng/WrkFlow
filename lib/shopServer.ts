// Server-only: imports node:crypto and reads secrets. Never import from a client component.
import { createHmac, timingSafeEqual } from "node:crypto";
import { findShopProduct, type ShopProduct } from "./shop";

/*
  Server half of the shop: Stripe calls and signed download links.
  No Stripe SDK on purpose; two REST calls don't need a dependency.
*/

/** API version that carries Managed Payments on Checkout Sessions. */
const STRIPE_VERSION = "2026-04-22.dahlia";

/** How long one download link works. The thanks page mints a fresh one on every visit. */
const LINK_TTL_SECONDS = 60 * 60 * 24;

export function priceIdFor(product: ShopProduct): string | undefined {
  const v = process.env[product.priceEnv]?.trim();
  return v && v.startsWith("price_") ? v : undefined;
}

/** True only when a sale could actually complete. */
export function isForSale(product: ShopProduct): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && priceIdFor(product));
}

/** On unless explicitly turned off with STRIPE_MANAGED_PAYMENTS=0. */
function managedPaymentsOn() {
  return process.env.STRIPE_MANAGED_PAYMENTS !== "0";
}

async function stripe(path: string, init: { method: "GET" | "POST"; body?: URLSearchParams }) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured");
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Stripe-Version": STRIPE_VERSION,
      ...(init.body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: init.body,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const err = json.error as { message?: string } | undefined;
    throw new Error(`Stripe ${res.status}: ${err?.message ?? "request failed"}`);
  }
  return json;
}

export async function createCheckout(product: ShopProduct, origin: string) {
  const price = priceIdFor(product);
  if (!price) throw new Error("Product is not for sale yet");
  const body = new URLSearchParams({
    mode: "payment",
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    success_url: `${origin}/shop/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/marketplace#downloads`,
    "metadata[product_id]": product.id,
  });
  if (managedPaymentsOn()) body.set("managed_payments[enabled]", "true");
  const session = await stripe("checkout/sessions", { method: "POST", body });
  return session.url as string;
}

/** The product a paid session bought, or null if it isn't paid or isn't ours. */
export async function paidProductForSession(sessionId: string) {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null;
  const s = await stripe(`checkout/sessions/${sessionId}`, { method: "GET" });
  if (s.payment_status !== "paid") return null;
  const meta = s.metadata as Record<string, string> | undefined;
  return findShopProduct(meta?.product_id) ?? null;
}

function secret() {
  const s = process.env.SHOP_DOWNLOAD_SECRET;
  if (!s || s.length < 32) throw new Error("SHOP_DOWNLOAD_SECRET is missing or shorter than 32 characters");
  return s;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function downloadToken(productId: string, sessionId: string) {
  const exp = Math.floor(Date.now() / 1000) + LINK_TTL_SECONDS;
  const payload = Buffer.from(`${productId}.${sessionId}.${exp}`).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** The product a token unlocks, or null if it's forged, malformed or expired. */
export function verifyDownloadToken(token: string): ShopProduct | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  const [productId, , exp] = Buffer.from(payload, "base64url").toString().split(".");
  if (!exp || Number(exp) < Date.now() / 1000) return null;
  return findShopProduct(productId) ?? null;
}
