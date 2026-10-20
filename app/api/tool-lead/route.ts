// app/api/tool-lead/route.ts
// M Studio — free-tool lead capture ("Email me this →" on the Playground
// tools). A visitor gets their result emailed to them, and Meg gets a lead
// notice — email + which tool — in the same inbox the contact form uses
// (CONTACT_TO), since there's no separate CRM yet.
//
// Unlike /api/contact (which always mails a fixed internal address), this
// route sends to a caller-supplied recipient — so it needs its own
// anti-abuse gate or it's just an open mail relay: whitelist the tool id
// (derive the label/subject ourselves, never trust the client's), check
// Origin so a random third-party script can't drive it directly, cap
// content size, and rate-limit both per-IP and globally so a distributed
// abuser can't burn through the sending account's reputation either.

import { NextResponse } from "next/server";
import { createMailTransporter, getMailEnv } from "@/lib/mailer";
import { createRateLimiter, clientIp } from "@/lib/rateLimit";
import { storeLead } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ToolLeadPayload = {
  email?: string;
  tool?: string;
  summary?: string;
  attachment?: { filename?: string; contentBase64?: string; contentType?: string };
  // Honeypot: real users never see/fill this. Bots do. If present, we silently drop.
  botField?: string;
};

// The only tools wired up to "Email me this →" — everything else is rejected.
// Labels are derived here, never taken from the client, so the subject line
// and "from" framing can't be forged.
const TOOL_LABELS: Record<string, string> = {
  quote: "Instant quote",
  invoice: "Invoice maker",
  sig: "Email signature",
  qr: "QR code",
  sitecheck: "Website check",
  cost: "Cost of manual work",
  "workflow-map": "Workflow map",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUMMARY_LEN = 4000; // every real tool summary + stamp is well under 1,000 chars
const MAX_ATTACHMENT_BASE64_LEN = 2_000_000; // ~1.5MB decoded — generous for a QR PNG

// Per-IP: a visitor might reasonably email themselves results from a few
// tools in one sitting. Global: hard-caps total outbound volume regardless
// of how many IPs an abuser spreads requests across.
const rateLimitedByIp = createRateLimiter({ windowMs: 10 * 60 * 1000, maxHits: 8 });
const rateLimitedGlobally = createRateLimiter({ windowMs: 60 * 60 * 1000, maxHits: 200 });

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin === "https://mlinx.studio") return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true; // preview deployments
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true; // local dev
  return false;
}

export async function POST(req: Request) {
  // Same-origin gate — this route sends to a caller-chosen recipient, so
  // (unlike /api/contact) it must not be directly reachable from anywhere
  // that isn't our own site.
  if (!isAllowedOrigin(req.headers.get("origin"))) {
    return NextResponse.json({ ok: false, error: "Request not allowed." }, { status: 403 });
  }

  const ip = clientIp(req);
  if (rateLimitedByIp(ip) || rateLimitedGlobally("global")) {
    return NextResponse.json(
      { ok: false, error: "Too many requests just now. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: ToolLeadPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot tripped → pretend success so bots don't learn anything.
  if (body.botField && body.botField.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email || "").trim();
  const toolLabel = TOOL_LABELS[(body.tool || "").trim()];
  const summary = (body.summary || "").trim();

  if (!toolLabel) {
    return NextResponse.json({ ok: false, error: "Unknown tool." }, { status: 422 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right." }, { status: 422 });
  }
  if (summary.length > MAX_SUMMARY_LEN) {
    return NextResponse.json({ ok: false, error: "That result is too large to email." }, { status: 422 });
  }

  /*
    Record the lead before sending anything (lib/leads.ts). Unlike the contact
    form, the email here IS what the visitor asked for, so a send failure is
    still reported to them below — but the lead itself is safe either way.
  */
  await storeLead({
    source: "tool",
    email,
    message: summary || undefined,
    offer: toolLabel,
    details: { tool: toolLabel },
  });

  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = getMailEnv();
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error("Tool lead: missing GMAIL_USER or GMAIL_APP_PASSWORD env vars.");
    return NextResponse.json({ ok: false, error: "Server email is not configured." }, { status: 500 });
  }

  let attachments: { filename: string; content: Buffer; contentType?: string }[] | undefined;
  if (body.attachment?.contentBase64 && body.attachment.filename) {
    if (body.attachment.contentBase64.length > MAX_ATTACHMENT_BASE64_LEN) {
      return NextResponse.json({ ok: false, error: "That attachment is too large to email." }, { status: 422 });
    }
    try {
      attachments = [
        {
          filename: body.attachment.filename,
          content: Buffer.from(body.attachment.contentBase64, "base64"),
          contentType: body.attachment.contentType,
        },
      ];
    } catch {
      attachments = undefined;
    }
  }

  const transporter = createMailTransporter(GMAIL_USER, GMAIL_APP_PASSWORD);
  const to = CONTACT_TO || GMAIL_USER;

  // Framed as clearly automated, since the body itself is visitor-supplied —
  // this is a free-tool notification, not a personal message from M Studio.
  const visitorText = [
    `Automated result from a free tool at mlinx.studio — you (or someone using this email) requested it from the site.`,
    ``,
    summary || `Here's your ${toolLabel} result.`,
  ].join("\n");

  try {
    // 1. Send the result to the visitor — the thing they actually asked for.
    await transporter.sendMail({
      from: `"M Studio Tools" <${GMAIL_USER}>`,
      to: email,
      subject: `Your ${toolLabel} result from mlinx.studio`,
      text: visitorText,
      attachments,
    });

    // 2. Log the lead in Meg's inbox — email + which tool drove it.
    await transporter.sendMail({
      from: `"M Studio Website" <${GMAIL_USER}>`,
      to,
      replyTo: email,
      subject: `Tool lead — ${toolLabel} — ${email}`,
      text: [
        `New free-tool lead from mlinx.studio`,
        `--------------------------------`,
        `Tool:  ${toolLabel}`,
        `Email: ${email}`,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Tool lead: sendMail failed", err);
    return NextResponse.json({ ok: false, error: "Couldn't send right now. Please try again." }, { status: 502 });
  }
}
