// app/api/tool-lead/route.ts
// M Studio — free-tool lead capture ("Email me this →" on the Playground
// tools). A visitor gets their result emailed to them, and Meg gets a lead
// notice — email + which tool — in the same inbox the contact form uses
// (CONTACT_TO), since there's no separate CRM yet.

import { NextResponse } from "next/server";
import { createMailTransporter, getMailEnv } from "@/lib/mailer";
import { createRateLimiter, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ToolLeadPayload = {
  email?: string;
  tool?: string;
  toolLabel?: string;
  summary?: string;
  attachment?: { filename?: string; contentBase64?: string; contentType?: string };
  // Honeypot: real users never see/fill this. Bots do. If present, we silently drop.
  botField?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A bit more generous than the contact form — this is a low-stakes,
// no-signup action a visitor might repeat across a few tools in one visit.
const rateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, maxHits: 8 });

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
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
  const tool = (body.tool || "tool").trim();
  const toolLabel = (body.toolLabel || tool).trim();
  const summary = (body.summary || "").trim();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right." }, { status: 422 });
  }
  if (summary.length > 20000) {
    return NextResponse.json({ ok: false, error: "That result is too large to email." }, { status: 422 });
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = getMailEnv();
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error("Tool lead: missing GMAIL_USER or GMAIL_APP_PASSWORD env vars.");
    return NextResponse.json({ ok: false, error: "Server email is not configured." }, { status: 500 });
  }

  let attachments: { filename: string; content: Buffer; contentType?: string }[] | undefined;
  if (body.attachment?.contentBase64 && body.attachment.filename) {
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

  try {
    // 1. Send the result to the visitor — the thing they actually asked for.
    await transporter.sendMail({
      from: `"M Studio Tools" <${GMAIL_USER}>`,
      to: email,
      subject: `Your ${toolLabel} result from mlinx.studio`,
      text: summary || `Here's your ${toolLabel} result.`,
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
