// app/api/shop/checkout/route.ts
// Starts a Stripe Checkout for one Instant download. The client posts
// { productId } and gets back { url } to send the browser to. Done as fetch +
// redirect in the browser rather than a form POST answered with a 303,
// because the site's CSP has form-action 'self' and a browser may refuse to
// follow a form submission's redirect to checkout.stripe.com.

import { NextResponse } from "next/server";
import { findShopProduct } from "@/lib/shop";
import { createCheckout, isForSale } from "@/lib/shopServer";
import { createRateLimiter, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, maxHits: 20 });

// Same allow-list as /api/contact: production, Vercel previews, local dev.
function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false;
  if (origin === "https://mlinx.studio") return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true;
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ ok: false, error: "Request not allowed." }, { status: 403 });
  }
  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ ok: false, error: "Too many tries. Please wait a few minutes." }, { status: 429 });
  }
  let productId: unknown;
  try {
    ({ productId } = (await req.json()) as { productId?: unknown });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  const product = findShopProduct(typeof productId === "string" ? productId : null);
  if (!product) return NextResponse.json({ ok: false, error: "Unknown product." }, { status: 404 });
  if (!isForSale(product)) {
    return NextResponse.json({ ok: false, error: "This one isn't on sale yet." }, { status: 409 });
  }
  try {
    const url = await createCheckout(product, origin);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[shop/checkout]", err);
    return NextResponse.json(
      { ok: false, error: "Checkout couldn't start. Please try again, or email megan.small@maine.edu." },
      { status: 502 },
    );
  }
}
