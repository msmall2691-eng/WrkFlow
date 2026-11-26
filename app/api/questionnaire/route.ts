// app/api/questionnaire/route.ts
// M Studio — new-client project questionnaire handler (intake.mlinx.studio).
//
// Sends two emails through the same Gmail SMTP account the contact form uses
// (GMAIL_USER / GMAIL_APP_PASSWORD, delivered to CONTACT_TO):
//   1. The full scoped brief, to Meg.
//   2. A copy back to the client, so they have a record of what they sent.
//
// Because email #2 goes to an address the caller supplies, this route is an
// open mail relay unless it's gated — so it carries the same protections as
// /api/tool-lead: an Origin check so a third-party script can't drive it,
// per-IP and global rate limits, a honeypot, and hard length caps.
//
// Every question label in the email is read from lib/questionnaire.ts, never
// from the request body. The client posts field ids and values; anything it
// sends that isn't a known field id, or a checkbox value that isn't a known
// option, is dropped rather than echoed into an inbox.

import { NextResponse } from "next/server";
import { createMailTransporter, getMailEnv } from "@/lib/mailer";
import { createRateLimiter, clientIp } from "@/lib/rateLimit";
import { storeLead } from "@/lib/leads";
import {
  questionnaireSteps,
  questionnaireFields,
  MAX_FIELD_LEN,
  type Answers,
} from "@/lib/questionnaire";

// Nodemailer (SMTP) does not run on the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A questionnaire is a considered, one-time submission — nobody legitimately
// files four in ten minutes. The global cap protects the sending account's
// reputation even if an abuser spreads requests across many IPs.
const rateLimitedByIp = createRateLimiter({ windowMs: 10 * 60 * 1000, maxHits: 4 });
const rateLimitedGlobally = createRateLimiter({ windowMs: 60 * 60 * 1000, maxHits: 60 });

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin === "https://mlinx.studio") return true;
  if (origin === "https://intake.mlinx.studio") return true;
  if (origin === "https://www.intake.mlinx.studio") return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true; // preview deployments
  if (/^http:\/\/(intake\.)?localhost(:\d+)?$/.test(origin)) return true; // local dev
  return false;
}

type Payload = {
  answers?: Answers;
  /*
    Concepts generated for the visitor during the form, riding along so the
    notification email carries exactly what they saw. Client-supplied, so
    treated as hostile until validated: count-capped, size-capped, and any
    document containing script, inline handlers, or javascript: URLs is
    dropped rather than attached.
  */
  concepts?: { title?: string; html?: string }[];
  // Honeypot: real users never see/fill this. Bots do.
  botField?: string;
};

const MAX_CONCEPTS = 3;
const MAX_CONCEPT_HTML = 120_000;

function sanitizeConcepts(
  raw: unknown,
): { title: string; html: string }[] {
  if (!Array.isArray(raw)) return [];
  const out: { title: string; html: string }[] = [];
  for (const c of raw.slice(0, MAX_CONCEPTS)) {
    if (!c || typeof c !== "object") continue;
    const title = typeof c.title === "string" ? c.title.trim().slice(0, 80) : "";
    const html = typeof c.html === "string" ? c.html : "";
    if (!title || !html || html.length > MAX_CONCEPT_HTML) continue;
    if (!/<style[\s>]/i.test(html) || !/<body[\s>]/i.test(html)) continue;
    if (/<script[\s>]/i.test(html)) continue;
    if (/\son\w+\s*=/i.test(html)) continue; // inline event handlers
    if (/javascript:/i.test(html)) continue;
    out.push({ title, html });
  }
  return out;
}

export async function POST(req: Request) {
  if (!isAllowedOrigin(req.headers.get("origin"))) {
    return NextResponse.json({ ok: false, error: "Request not allowed." }, { status: 403 });
  }

  const ip = clientIp(req);
  if (rateLimitedByIp(ip) || rateLimitedGlobally("global")) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions just now. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot tripped → pretend success so bots don't learn anything.
  if (body.botField && body.botField.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const raw = body.answers;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Whitelist against the schema: unknown ids dropped, checkbox values
  // constrained to their declared options, free text capped.
  const clean: Record<string, string | string[]> = {};
  for (const [id, value] of Object.entries(raw)) {
    const field = questionnaireFields.get(id);
    if (!field) continue;

    // Chips and multi-select cards arrive as arrays; both are constrained to
    // their declared options. Single-select cards arrive as one string and
    // must equal a declared option exactly.
    if (field.kind === "chips" || (field.kind === "cards" && field.multi)) {
      if (!Array.isArray(value)) continue;
      const allowed =
        field.kind === "chips"
          ? field.options
          : field.options.map((o) => o.value);
      const picked = value.filter(
        (v): v is string => typeof v === "string" && allowed.includes(v),
      );
      if (picked.length) clean[id] = picked;
      continue;
    }

    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (trimmed.length > MAX_FIELD_LEN) {
      return NextResponse.json(
        { ok: false, error: `That answer for "${field.label}" is too long.` },
        { status: 422 },
      );
    }
    if (field.kind === "cards" && !field.options.some((o) => o.value === trimmed))
      continue;
    if (field.kind === "select" && !field.options.includes(trimmed)) continue;
    clean[id] = trimmed;
  }

  /*
    previewChoice is not a schema field — it's set by the AI concept-preview
    step when the visitor picks a direction. Whitelisted here explicitly:
    a short free-text label, hard-capped, never echoed anywhere but the
    notification email.
  */
  if (typeof raw.previewChoice === "string" && raw.previewChoice.trim()) {
    clean.previewChoice = raw.previewChoice.trim().slice(0, 300);
  }

  // Required fields, per the same schema the form validates against.
  for (const step of questionnaireSteps) {
    for (const field of step.fields) {
      if (!("required" in field) || !field.required) continue;
      if (!clean[field.id]) {
        return NextResponse.json(
          { ok: false, error: `"${field.label}" is required.` },
          { status: 422 },
        );
      }
    }
  }

  const contactEmail = clean.contactEmail as string;
  const contactName = clean.contactName as string;
  const bizName = (clean.bizName as string) || "";

  if (!EMAIL_RE.test(contactEmail)) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right." }, { status: 422 });
  }

  const concepts = sanitizeConcepts(body.concepts);
  const text = renderText(clean, concepts.length);
  const html = renderHtml(clean);

  /*
    Record it first. A questionnaire is ten minutes of a prospect's work — by
    far the most expensive lead on the site to lose to an SMTP blip. The full
    rendered brief goes in `message`, and the validated answers in `details`
    so nothing the visitor typed is only ever an email attachment.
  */
  const stored = await storeLead({
    source: "questionnaire",
    name: contactName,
    email: contactEmail,
    company: bizName || undefined,
    message: text,
    details: { answers: clean, concepts: concepts.map((c) => c.title) },
  });

  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = getMailEnv();
  let notified = false;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error("Questionnaire: missing GMAIL_USER or GMAIL_APP_PASSWORD env vars.");
  } else {
    const transporter = createMailTransporter(GMAIL_USER, GMAIL_APP_PASSWORD);
    const to = CONTACT_TO || GMAIL_USER;
    // Attached to Meg's brief only — the visitor already saw them live, and
    // the client copy stays light.
    const attachments = concepts.map((c, i) => ({
      filename: `concept-${i + 1}-${c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`,
      content: c.html,
      contentType: "text/html",
    }));

    try {
      // 1. The brief, to Meg. replyTo is the client so hitting Reply just works.
      await transporter.sendMail({
        from: `"M Studio Questionnaire" <${GMAIL_USER}>`,
        to,
        replyTo: contactEmail,
        subject: `Project questionnaire — ${bizName || contactName}`,
        text: stored ? text : `(NOT saved to the database. This email is the only copy.)\n\n${text}`,
        html,
        attachments,
      });
      notified = true;
    } catch (err) {
      console.error("Questionnaire: sendMail failed", err);
    }

    // 2. A copy back to the client. Sent second and non-fatally: if this one
    //    fails, Meg still has the brief, and the client shouldn't be told to
    //    resubmit work that already landed.
    if (notified) {
      try {
        await transporter.sendMail({
          from: `"M Studio" <${GMAIL_USER}>`,
          to: contactEmail,
          replyTo: to,
          subject: `Your project scope request — M Studio`,
          text: [
            `Thanks, your answers are in. Here's your copy.`,
            ``,
            `Within 24 hours you'll get a personal reply with a rough scope:`,
            `pages, features, a price range, and a timeline. A real person reads`,
            `all of this first, with no autoresponder and no sales sequence. If anything`,
            `else comes to mind, just reply to this email.`,
            ``,
            `— M Studio · mlinx.studio`,
            ``,
            `--------------------------------`,
            ``,
            text,
          ].join("\n"),
          html: `
            <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b1722;line-height:1.6;">
              <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#b9842b;margin:0 0 6px;">M Studio</p>
              <h2 style="margin:0 0 14px;font-size:20px;">Thanks, your answers are in.</h2>
              <p style="font-size:15px;margin:0 0 10px;">Within 24 hours you'll get a personal reply with a rough scope: pages, features, a price range, and a timeline. A real person reads all of this first.</p>
              <p style="font-size:15px;margin:0 0 24px;">If anything else comes to mind, just reply to this email.</p>
              ${html}
            </div>`,
        });
      } catch (err) {
        console.error("Questionnaire: client confirmation copy failed", err);
      }
    }
  }

  /* Only a total loss is reported as a failure to the visitor. */
  if (!stored && !notified) {
    return NextResponse.json(
      { ok: false, error: "Couldn't send right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

/* ------------------------------------------------------------ rendering */

/** Plain-text brief, grouped by section, skipping anything left blank. */
function renderText(
  answers: Record<string, string | string[]>,
  conceptCount = 0,
): string {
  const out: string[] = [`Project intake from intake.mlinx.studio`, ``];

  for (const step of questionnaireSteps) {
    const rows = step.fields
      .filter((f) => answers[f.id] !== undefined)
      .map((f) => {
        const v = answers[f.id];
        return `${f.label}:\n  ${Array.isArray(v) ? v.join("\n  ") : v.replace(/\n/g, "\n  ")}`;
      });
    if (!rows.length) continue;
    out.push(step.kicker.toUpperCase(), `--------------------------------`, ...rows, ``);
  }

  if (typeof answers.previewChoice === "string" || conceptCount > 0) {
    out.push(`CONCEPT PREVIEW`, `--------------------------------`);
    if (typeof answers.previewChoice === "string") {
      out.push(`Direction they picked:\n  ${answers.previewChoice}`);
    }
    if (conceptCount > 0) {
      out.push(
        `The ${conceptCount} concept${conceptCount === 1 ? "" : "s"} they were shown are attached to this email.`,
      );
    }
    out.push(``);
  }

  return out.join("\n");
}

/** HTML version — same content, grouped and readable in a mail client. */
function renderHtml(answers: Record<string, string | string[]>): string {
  const sections = questionnaireSteps
    .map((step) => {
      const rows = step.fields
        .filter((f) => answers[f.id] !== undefined)
        .map((f) => {
          const v = answers[f.id];
          const rendered = Array.isArray(v)
            ? v.map((item) => `<li style="margin:0 0 2px;">${escapeHtml(item)}</li>`).join("")
            : null;
          return `
            <div style="margin:0 0 14px;">
              <div style="font-size:12px;color:#7a8697;margin:0 0 3px;">${escapeHtml(f.label)}</div>
              ${
                rendered
                  ? `<ul style="margin:0;padding-left:18px;font-size:15px;">${rendered}</ul>`
                  : `<div style="font-size:15px;white-space:pre-wrap;">${escapeHtml(v as string)}</div>`
              }
            </div>`;
        });
      if (!rows.length) return "";
      return `
        <div style="margin:0 0 26px;">
          <p style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#b9842b;margin:0 0 10px;border-bottom:1px solid #e3e8ec;padding-bottom:6px;">${escapeHtml(step.kicker)}</p>
          ${rows.join("")}
        </div>`;
    })
    .join("");

  const preview =
    typeof answers.previewChoice === "string"
      ? `
        <div style="margin:0 0 26px;">
          <p style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#b9842b;margin:0 0 10px;border-bottom:1px solid #e3e8ec;padding-bottom:6px;">Concept preview</p>
          <div style="font-size:12px;color:#7a8697;margin:0 0 3px;">Direction they picked</div>
          <div style="font-size:15px;">${escapeHtml(answers.previewChoice)}</div>
        </div>`
      : "";

  return `<div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b1722;line-height:1.5;">${sections}${preview}</div>`;
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string),
  );
}
