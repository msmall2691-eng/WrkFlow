// app/api/widget-lead/route.ts
// Instant Quote plug-in: lead relay for client sites (Nov 16 2026).
//
// The widget (public/embed/quote.js) runs on somebody else's website and
// POSTs here with a site key. The recipient is looked up server-side in
// WIDGET_SITES (lib/widgetSites.ts), and the request Origin must belong to
// that site. Nothing in the request can choose where mail goes. Rate
// limited per IP and globally, like /api/tool-lead.

import { NextResponse } from "next/server";
import { createMailTransporter, getMailEnv } from "@/lib/mailer";
import { createRateLimiter, clientIp } from "@/lib/rateLimit";
import { siteFor } from "@/lib/widgetSites";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const byIp = createRateLimiter({ windowMs: 10 * 60 * 1000, maxHits: 6 });
const globally = createRateLimiter({ windowMs: 60 * 60 * 1000, maxHits: 300 });

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

function cors(origin: string | null, allowed: boolean) {
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && allowed) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  // Preflight carries no body, so the key is unknown here. Echo the origin;
  // the POST itself enforces the per-site origin check.
  return new NextResponse(null, { status: 204, headers: cors(origin, true) });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400, headers: cors(origin, false) });
  }

  const site = siteFor(body.site, origin);
  if (!site) {
    return NextResponse.json({ ok: false, error: "This site is not set up for Instant Quote." }, { status: 403, headers: cors(origin, false) });
  }
  const headers = cors(origin, true);

  if (byIp(clientIp(req)) || globally("global")) {
    return NextResponse.json({ ok: false, error: "Too many requests. Try again in a few minutes." }, { status: 429, headers });
  }

  // Honeypot: pretend success.
  if (clip(body.company_website, 200)) return NextResponse.json({ ok: true }, { headers });

  const name = clip(body.name, 120);
  const contact = clip(body.contact, 200);
  if (!name || !contact) {
    return NextResponse.json({ ok: false, error: "Name and contact are required." }, { status: 422, headers });
  }

  const extras = Array.isArray(body.extras) ? body.extras.filter((x) => typeof x === "string").slice(0, 20).map((x) => (x as string).slice(0, 80)) : [];
  const lines = [
    `New instant quote request for ${site.business}`,
    `--------------------------------`,
    `Service:  ${clip(body.service, 120)}`,
    clip(body.size, 80) ? `Size:     ${clip(body.size, 80)}` : null,
    extras.length ? `Add-ons:  ${extras.join(", ")}` : null,
    `Estimate: ${clip(body.estimate, 60)}`,
    ``,
    `Name:     ${name}`,
    `Contact:  ${contact}`,
    clip(body.message, 2000) ? `Notes:    ${clip(body.message, 2000)}` : null,
    ``,
    `Page: ${clip(body.page, 500)}`,
    ``,
    `Sent by Instant Quote from M Studio (mlinx.studio).`,
  ].filter((l) => l !== null).join("\n");

  const { GMAIL_USER, GMAIL_APP_PASSWORD } = getMailEnv();
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error("Widget lead: mail env missing.");
    return NextResponse.json({ ok: false, error: "Email is not configured." }, { status: 500, headers });
  }

  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ? contact : undefined;
  try {
    await createMailTransporter(GMAIL_USER, GMAIL_APP_PASSWORD).sendMail({
      from: `"Instant Quote" <${GMAIL_USER}>`,
      to: site.to,
      replyTo: email,
      subject: `Quote request: ${clip(body.service, 80)} (${clip(body.estimate, 40)}) from ${name}`,
      text: lines,
    });
    return NextResponse.json({ ok: true }, { headers });
  } catch (err) {
    console.error("Widget lead: sendMail failed", err);
    return NextResponse.json({ ok: false, error: "Could not send right now." }, { status: 502, headers });
  }
}
