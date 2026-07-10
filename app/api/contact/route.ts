// app/api/contact/route.ts
// M Studio — contact form handler. Emails submissions to your inbox via Gmail SMTP.
//
// SETUP (see contact-form-SETUP.md for the full walkthrough):
//   1. npm install nodemailer        (and: npm install -D @types/nodemailer)
//   2. Add these env vars locally (.env.local) AND in Vercel → Project → Settings → Environment Variables:
//        GMAIL_USER          = contact@mlinx.studio  (the Gmail/Workspace account that SENDS the mail)
//        GMAIL_APP_PASSWORD  = xxxx xxxx xxxx xxxx     (16-char Google App Password, NOT your login password)
//        CONTACT_TO          = contact@mlinx.studio    (where you want to RECEIVE leads; can equal GMAIL_USER)
//   3. Point your form's submit at  POST /api/contact  with a JSON body of the fields below.

import { NextResponse } from "next/server";
import { createMailTransporter, getMailEnv } from "@/lib/mailer";
import { createRateLimiter, clientIp } from "@/lib/rateLimit";

// Force the Node.js runtime — Nodemailer (SMTP) does not run on the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  message?: string;
  // Honeypot: real users never see/fill this. Bots do. If present, we silently drop.
  botField?: string;
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

  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = getMailEnv();
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error("Contact form: missing GMAIL_USER or GMAIL_APP_PASSWORD env vars.");
    return NextResponse.json({ ok: false, error: "Server email is not configured." }, { status: 500 });
  }

  const transporter = createMailTransporter(GMAIL_USER, GMAIL_APP_PASSWORD);
  const to = CONTACT_TO || GMAIL_USER;
  const subject = `New M Studio inquiry — ${name}${company ? ` (${company})` : ""}`;

  const text = [
    `New inquiry from mlinx.studio`,
    `--------------------------------`,
    `Name:    ${name}`,
    `Email:   ${email}`,
    company ? `Company: ${company}` : null,
    phone ? `Phone:   ${phone}` : null,
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
      </table>
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
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form: sendMail failed", err);
    return NextResponse.json({ ok: false, error: "Couldn't send right now. Please try again." }, { status: 502 });
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
function escapeAttr(s: string) {
  return escapeHtml(s).replace(/`/g, "&#96;");
}
