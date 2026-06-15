import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

  // --- Email notification via Resend (if configured) ---
  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.CONTACT_NOTIFY_TO;
  const notifyFrom =
    process.env.CONTACT_NOTIFY_FROM ?? "onboarding@resend.dev";
  if (resendKey && notifyTo) {
    try {
      const resend = new Resend(resendKey);
      const { error } = await resend.emails.send({
        from: `Workflow Studio <${notifyFrom}>`,
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
      if (error) throw error;
      notified = true;
    } catch (err) {
      console.error("[contact] Resend send failed:", err);
    }
  }

  // If neither backend is configured, log so submissions aren't lost in dev.
  if (!stored && !notified) {
    console.info("[contact] New submission (no backend configured):", submission);
  }

  return NextResponse.json({ ok: true });
}
