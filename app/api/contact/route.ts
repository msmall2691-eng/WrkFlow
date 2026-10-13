// app/api/contact/route.ts
// M Studio — contact form handler.
//
// Order matters: the lead is written to Postgres FIRST (lib/leads.ts), then
// emailed. Before that, a lead existed only as an email, so a missing Gmail
// credential or an SMTP blip meant the visitor saw an error and the lead was
// gone for good. Now email is the notification and the database is the record;
// the visitor is only ever told something went wrong if BOTH failed.
//
// SETUP — env vars, locally in .env.local and in Vercel → Settings → Environment Variables:
//   SUPABASE_URL          = https://<project-ref>.supabase.co
//   SUPABASE_ANON_KEY     = publishable key (INSERT-only on leads by RLS)
//   GMAIL_USER            = contact@mlinx.studio  (the account that SENDS the mail)
//   GMAIL_APP_PASSWORD    = xxxx xxxx xxxx xxxx   (16-char Google App Password)
//   CONTACT_TO            = contact@mlinx.studio  (where leads land; defaults to GMAIL_USER)
//   NEXT_PUBLIC_BOOKING_URL = the booking page offered in the auto-reply (optional)

import { NextResponse } from "next/server";
import { createMailTransporter, getMailEnv } from "@/lib/mailer";
import { createRateLimiter, clientIp } from "@/lib/rateLimit";
import { storeLead } from "@/lib/leads";
import { BOOKING_URL } from "@/lib/booking";

// Force the Node.js runtime — Nodemailer (SMTP) does not run on the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  message?: string;
  // Which CTA sent them (site survey O-02) — "starter", "care", "custom",
  // "quote", "call", "project". Absent when they came in cold.
  offer?: string;
  // Honeypot: real users never see/fill this. Bots do. If present, we silently drop.
  botField?: string;
};

// Labels for the offer tag, so the inbox reads in English rather than slugs.
const OFFER_LABELS: Record<string, string> = {
  project: "Start a project (hero)",
  starter: "Website (old Starter link)",
  care: "Care Plan",
  custom: "Custom build",
  call: "Free 15-min call",
  quote: "Instant quote calculator",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// At most 5 submissions per IP within 10 minutes.
const rateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, maxHits: 5 });

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many messages just now. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const company = (body.company || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim();
  const offerKey = (body.offer || "").trim();
  const offer = OFFER_LABELS[offerKey] || "";

  // Honeypot tripped → pretend success so bots don't learn anything.
  if (body.botField && body.botField.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Validation
  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and a short note are required." },
      { status: 422 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right." }, { status: 422 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ ok: false, error: "Message is too long." }, { status: 422 });
  }

  /* 1. Record it. Never throws — a storage problem must not cost us the lead. */
  const stored = await storeLead({
    source: "contact",
    name,
    email,
    company,
    phone,
    message,
    offer: offer || undefined,
  });

  /* 2. Notify Meg, then confirm to the visitor. Both are best-effort. */
  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = getMailEnv();
  let notified = false;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error("Contact form: missing GMAIL_USER or GMAIL_APP_PASSWORD env vars.");
  } else {
    const transporter = createMailTransporter(GMAIL_USER, GMAIL_APP_PASSWORD);
    const to = CONTACT_TO || GMAIL_USER;
    const subject = `New M Studio inquiry${offer ? ` · ${offer}` : ""} — ${name}${company ? ` (${company})` : ""}`;

    const text = [
      `New inquiry from mlinx.studio`,
      `--------------------------------`,
      `Name:    ${name}`,
      `Email:   ${email}`,
      company ? `Company: ${company}` : null,
      phone ? `Phone:   ${phone}` : null,
      offer ? `Offer:   ${offer}` : null,
      stored ? null : `(NOT saved to the database — this email is the only copy.)`,
      ``,
      `What they're trying to solve:`,
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b1722;line-height:1.5;">
      <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#0d9488;margin:0 0 4px;">New inquiry · mlinx.studio</p>
      <h2 style="margin:0 0 16px;font-size:18px;">${escapeHtml(name)}${company ? ` <span style="color:#64748b;font-weight:400;">· ${escapeHtml(company)}</span>` : ""}</h2>
      <table style="border-collapse:collapse;font-size:14px;margin-bottom:16px;">
        <tr><td style="padding:2px 12px 2px 0;color:#64748b;">Email</td><td><a href="mailto:${escapeAttr(email)}">${escapeHtml(email)}</a></td></tr>
        ${phone ? `<tr><td style="padding:2px 12px 2px 0;color:#64748b;">Phone</td><td><a href="tel:${escapeAttr(phone)}">${escapeHtml(phone)}</a></td></tr>` : ""}
        ${offer ? `<tr><td style="padding:2px 12px 2px 0;color:#64748b;">Offer</td><td><strong>${escapeHtml(offer)}</strong></td></tr>` : ""}
      </table>
      ${stored ? "" : `<p style="font-size:13px;color:#b91c1c;margin:0 0 16px;">Not saved to the database — this email is the only copy.</p>`}
      <p style="font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#64748b;margin:0 0 6px;">What they're trying to solve</p>
      <div style="white-space:pre-wrap;font-size:15px;background:#f1f5f9;border-radius:10px;padding:14px 16px;">${escapeHtml(message)}</div>
    </div>`;

    try {
      await transporter.sendMail({
        from: `"M Studio Website" <${GMAIL_USER}>`,
        to,
        replyTo: email, // hit "Reply" and it goes straight to the lead
        subject,
        text,
        html,
      });
      notified = true;
    } catch (err) {
      console.error("Contact form: sendMail failed", err);
    }

    /*
      Auto-reply, so the visitor has something in their inbox confirming the
      message landed. Only attempted when the notification above got through:
      if SMTP just failed there is no reason to believe a second send will
      work, and two stacked SMTP timeouts would stall the whole request.
    */
    if (notified) {
      try {
        await transporter.sendMail({
          from: `"Meg · M Studio" <${GMAIL_USER}>`,
          to: email,
          replyTo: to,
          subject: "Got it — thanks for reaching out",
          text: autoReplyText(name),
          html: autoReplyHtml(name),
        });
      } catch (err) {
        console.error("Contact form: visitor auto-reply failed", err);
      }
    }
  }

  /*
    3. Only tell the visitor it failed when the lead reached neither the
       database nor an inbox. Anything else is a success from where they sit.
  */
  if (!stored && !notified) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Couldn't send right now. Please email contact@mlinx.studio directly and I'll pick it up.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

/* ----------------------------------------------------- visitor auto-reply */

function autoReplyText(name: string): string {
  return [
    `Hi ${name},`,
    ``,
    `Got it. I'll reply within 24 hours.`,
    ``,
    BOOKING_URL
      ? `If it's easier to talk it through, you can grab a free 15-minute slot here:\n${BOOKING_URL}`
      : `If it's easier to talk it through, just reply to this email and we'll find a time.`,
    ``,
    `Meg`,
    `M Studio · mlinx.studio`,
  ].join("\n");
}

function autoReplyHtml(name: string): string {
  const cta = BOOKING_URL
    ? `<p style="font-size:15px;margin:0 0 20px;">If it's easier to talk it through, you can <a href="${escapeAttr(BOOKING_URL)}" style="color:#0d9488;">grab a free 15-minute slot</a>.</p>`
    : `<p style="font-size:15px;margin:0 0 20px;">If it's easier to talk it through, just reply to this email and we'll find a time.</p>`;

  return `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b1722;line-height:1.6;">
      <p style="font-size:15px;margin:0 0 16px;">Hi ${escapeHtml(name)},</p>
      <p style="font-size:17px;margin:0 0 16px;"><strong>Got it. I'll reply within 24 hours.</strong></p>
      ${cta}
      <p style="font-size:15px;margin:0;">Meg</p>
      <p style="font-size:13px;color:#64748b;margin:2px 0 0;">M Studio · <a href="https://mlinx.studio" style="color:#64748b;">mlinx.studio</a></p>
    </div>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
function escapeAttr(s: string) {
  return escapeHtml(s).replace(/`/g, "&#96;");
}
