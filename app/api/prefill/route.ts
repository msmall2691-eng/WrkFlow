// app/api/prefill/route.ts
// M Studio — "describe it your way" fast-fill for the intake form.
//
// The visitor writes a few plain-English sentences about their business and
// what they want; Claude maps that onto the form's own fields, and the form
// pre-fills so every later step becomes review-and-adjust instead of
// authoring. Entirely optional, and nothing is submitted by it — the visitor
// still walks every step and can change anything.
//
// This is also a live demo of the studio's actual service — turning messy
// human input into structured data — sitting inside the sales funnel.
//
// Same guardrails as /api/preview: env-gated, origin allowlist, rate
// limits, honeypot, capped input. Cheaper than previews (one small call),
// so limits are a little looser. Multi-select values are validated
// server-side against the schema's exact option strings — the model can't
// invent an option the form doesn't have.

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { createRateLimiter, clientIp } from "@/lib/rateLimit";
import { questionnaireFields } from "@/lib/questionnaire";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const rateLimitedByIp = createRateLimiter({ windowMs: 10 * 60 * 1000, maxHits: 4 });
const rateLimitedGlobally = createRateLimiter({ windowMs: 60 * 60 * 1000, maxHits: 80 });

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin === "https://mlinx.studio") return true;
  if (origin === "https://intake.mlinx.studio") return true;
  if (origin === "https://www.intake.mlinx.studio") return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true;
  if (/^http:\/\/(intake\.)?localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

const MAX_DESCRIPTION_LEN = 2000;

/*
  What the model returns. Free-text fields are plain strings; multi-selects
  come back as string arrays that get intersected with the schema's real
  options below, so hallucinated options are silently dropped rather than
  ever reaching the form.
*/
const PrefillSchema = z.object({
  bizName: z.string().nullable(),
  currentSite: z.string().nullable(),
  whatYouDo: z.string().nullable(),
  idealCustomer: z.string().nullable(),
  whyNow: z.string().nullable(),
  frustration: z.string().nullable(),
  goals: z.array(z.string()),
  features: z.array(z.string()),
  pages: z.string().nullable(),
  loveSites: z.string().nullable(),
  brandColors: z.string().nullable(),
  timeline: z.string().nullable(),
});

/** Exact allowed option strings for a multi-select field in the schema. */
function allowedOptions(fieldId: string): string[] {
  const field = questionnaireFields.get(fieldId);
  if (!field) return [];
  if (field.kind === "chips") return [...field.options];
  if (field.kind === "cards") return field.options.map((o) => o.value);
  return [];
}

const TEXT_CAPS: Record<string, number> = {
  bizName: 120,
  currentSite: 200,
  whatYouDo: 400,
  idealCustomer: 200,
  whyNow: 400,
  frustration: 400,
  pages: 300,
  loveSites: 300,
  brandColors: 120,
  timeline: 120,
};

function buildSystemPrompt(): string {
  return `You extract structured intake answers from a small-business owner's free-form description of their website, platform setup, data migration, integration, or custom business-tool project.

Rules:
- Only extract what the description actually says or clearly implies. Leave a field null (or an empty array) rather than guessing — an empty field the client fills themselves beats a wrong one they have to notice and fix.
- Free-text fields must be in the client's own substance, lightly tidied — never embellished, never marketing-ified.
- For each multi-select field, choose ONLY from its allowed values, verbatim:
  goals: ${JSON.stringify(allowedOptions("goals"))}
  features: ${JSON.stringify(allowedOptions("features"))}
- "frustration" is what bothers them about their current website, software, records, or process, if mentioned.
- "whyNow" is why they're doing this now, if the description says.`;
}

type Payload = { description?: string; botField?: string };

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "Fast fill isn't available right now." },
      { status: 503 },
    );
  }
  if (!isAllowedOrigin(req.headers.get("origin"))) {
    return NextResponse.json({ ok: false, error: "Request not allowed." }, { status: 403 });
  }
  const ip = clientIp(req);
  if (rateLimitedByIp(ip) || rateLimitedGlobally("global")) {
    return NextResponse.json(
      { ok: false, error: "Fast fill is busy right now — the questions are quick by hand too." },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (body.botField && body.botField.trim() !== "") {
    return NextResponse.json({ ok: true, answers: {} });
  }
  const description = (body.description ?? "").trim();
  if (description.length < 20) {
    return NextResponse.json(
      { ok: false, error: "Give us a sentence or two more to work with." },
      { status: 422 },
    );
  }
  if (description.length > MAX_DESCRIPTION_LEN) {
    return NextResponse.json(
      { ok: false, error: "That's a bit long — trim it to a few paragraphs." },
      { status: 422 },
    );
  }

  const client = new Anthropic();
  try {
    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 2000,
      output_config: { effort: "low", format: zodOutputFormat(PrefillSchema) },
      system: buildSystemPrompt(),
      messages: [
        {
          role: "user",
          content: `The client wrote:\n\n"""\n${description}\n"""\n\nExtract their intake answers.`,
        },
      ],
    });

    const parsed = response.parsed_output;
    if (!parsed) {
      return NextResponse.json(
        { ok: false, error: "Couldn't read that this time — the questions are quick by hand." },
        { status: 502 },
      );
    }

    // Server-side validation: cap free text, intersect multi-selects with
    // the schema's real options.
    const answers: Record<string, string | string[]> = {};
    for (const [key, cap] of Object.entries(TEXT_CAPS)) {
      const v = parsed[key as keyof typeof parsed];
      if (typeof v === "string" && v.trim()) answers[key] = v.trim().slice(0, cap);
    }
    for (const key of ["goals", "features"] as const) {
      const allowed = new Set(allowedOptions(key === "features" ? "features" : key));
      const picked = parsed[key].filter((v) => allowed.has(v));
      if (picked.length) answers[key] = picked;
    }

    return NextResponse.json({ ok: true, answers });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error(`Prefill: Anthropic API error ${err.status}`, err.message);
    } else {
      console.error("Prefill: failed", err);
    }
    return NextResponse.json(
      { ok: false, error: "Couldn't read that this time — the questions are quick by hand." },
      { status: 502 },
    );
  }
}
