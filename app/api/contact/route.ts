import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  /** Honeypot. Real users never fill this. */
  company_website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max = 5000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bot caught by honeypot — accept silently so it gets no signal.
  if (clean(body.company_website)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 200);
  const email = clean(body.email, 320);
  const company = clean(body.company, 200);
  const message = clean(body.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and a message are required." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That email doesn't look right." },
      { status: 400 },
    );
  }

  const submission = {
    name,
    email,
    company: company || null,
    message,
  };

  let stored = false;
  let notified = false;

  // --- Store in Supabase (if configured) ---
  // Uses the publishable (anon) key. The contact_submissions table has an
  // RLS policy granting anon INSERT-only on well-formed rows, so this key is
  // safe to expose and can never read submissions back.
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });
      const { error } = await supabase
        .from("contact_submissions")
        .insert(submission);
      if (error) throw error;
      stored = true;
    } catch (err) {
      console.error("[contact] Supabase insert failed:", err);
    }
  }

  // --- Email notification via Gmail (if configured) ---
  // Sends through the studio's Gmail account over SMTP using a Google
  // App Password (requires 2-Step Verification on the account). The
  // notification lands in CONTACT_NOTIFY_TO, defaulting to the Gmail inbox.
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const notifyTo = process.env.CONTACT_NOTIFY_TO ?? gmailUser;
  if (gmailUser && gmailPass && notifyTo) {
    try {
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });
      await transport.sendMail({
        from: `Connective Studio <${gmailUser}>`,
        to: notifyTo,
        replyTo: email,
        subject: `New inquiry — ${name}${company ? ` (${company})` : ""}`,
        text: [
          `Name:    ${name}`,
          `Email:   ${email}`,
          `Company: ${company || "—"}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      });
      notified = true;
    } catch (err) {
      console.error("[contact] Gmail send failed:", err);
    }
  }

  // If neither backend is configured, log so submissions aren't lost in dev.
  if (!stored && !notified) {
    console.info("[contact] New submission (no backend configured):", submission);
  }

  return NextResponse.json({ ok: true });
}
