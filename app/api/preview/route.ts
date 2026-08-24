// app/api/preview/route.ts
// M Studio — AI concept previews for the intake form.
//
// Takes a visitor's fit-check + project answers and has Claude draft three
// style-distinct, single-file homepage concepts for THEIR business, which the
// form renders in sandboxed iframes so they can look around and pick a
// direction before submitting. The pick travels with the submission, so the
// scope reply can start from a direction the client already reacted to.
//
// Guardrails, in order of importance:
//   - Feature is env-gated: no ANTHROPIC_API_KEY → 503, and the form hides
//     the step entirely (the page checks the same env server-side).
//   - Same origin allowlist as /api/questionnaire, plus tight rate limits —
//     this route spends real money per call (~3 Opus generations).
//   - Only whitelisted, length-capped answer fields reach the prompt.
//   - Generated HTML is rendered client-side in <iframe sandbox=""> (no
//     scripts, no navigation), and the model is instructed to emit inline
//     CSS only — srcdoc iframes inherit the page CSP, which blocks external
//     requests anyway, so self-contained is the only thing that renders.

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createRateLimiter, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Three parallel Opus generations comfortably exceed the default function
// window; 60s is the ceiling that works on every Vercel plan.
export const maxDuration = 60;

// Expensive route: one preview set per visitor sitting, hard global cap.
const rateLimitedByIp = createRateLimiter({ windowMs: 10 * 60 * 1000, maxHits: 2 });
const rateLimitedGlobally = createRateLimiter({ windowMs: 60 * 60 * 1000, maxHits: 30 });

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin === "https://mlinx.studio") return true;
  if (origin === "https://intake.mlinx.studio") return true;
  if (origin === "https://www.intake.mlinx.studio") return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true;
  if (/^http:\/\/(intake\.)?localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

/* The only answer fields the prompt ever sees, with hard caps. */
const PROMPT_FIELDS: Record<string, number> = {
  bizName: 120,
  bizType: 60,
  whatMakesYouDifferent: 400, // reserved; not collected today
  goals: 400,
  features: 400,
  pages: 300,
  painPoint: 600,
};

type PreviewPayload = { answers?: Record<string, unknown>; botField?: string };

const DIRECTIONS = [
  {
    key: "warm",
    title: "Warm & Personal",
    style:
      "Warm, inviting, human. Cream/off-white background, a warm accent (terracotta, amber, or forest green), generous whitespace, serif display headings, rounded corners, soft shadows. Feels like a trusted local business.",
  },
  {
    key: "modern",
    title: "Modern & Minimal",
    style:
      "Clean, contemporary, confident. White background, near-black text, ONE saturated accent color, tight grid, sans-serif throughout, sharp corners, strong typographic hierarchy, lots of negative space. Feels like a sharp, current brand.",
  },
  {
    key: "bold",
    title: "Bold & Established",
    style:
      "Substantial, credible, high-contrast. Deep dark background (navy or charcoal) with light text and a metallic or bright accent, large display type, full-width sections. Feels established and premium.",
  },
];

const SYSTEM_PROMPT = `You are a senior web designer at M Studio producing a quick visual CONCEPT of a small-business homepage, to help a prospective client react to a direction. Output ONLY a complete single-file HTML document — no markdown fences, no commentary.

Hard constraints (the render environment enforces these — anything else shows broken):
- Everything inline: one <style> block in <head>. No JavaScript at all. No external requests of any kind — no external fonts, images, CDNs, or imports.
- Use system font stacks (e.g. Georgia/'Times New Roman' for display serif, system-ui/-apple-system for sans).
- Where a photo would go, use a CSS gradient block with a short caption like "Photo: your team at work" — never an <img> with a URL.
- Mobile-responsive with simple max-width layout and flexible sections. No horizontal overflow.
- Keep it around 200-280 lines total.

Content rules:
- Use the client's real business name and facts verbatim where given. Invent NOTHING factual: no fake phone numbers, addresses, reviews, star ratings, client names, or statistics. Where a testimonial or credential would sit, use an obviously-labelled placeholder like "A word from your customers goes here."
- Structure: simple nav (name + 2-4 anchor links), a hero with a headline built from what the business actually does, one section reflecting their stated goals/features (e.g. a booking call-to-action if they want online booking), a services/offer section, and a footer.
- Headline copy should be specific to their business, plain-spoken and professional — no "Welcome to our website", no exclamation marks, no buzzword soup.
- This is a concept sketch, not a final site: favor clear structure and strong typography over decoration.`;

function fieldLines(answers: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const [key, cap] of Object.entries(PROMPT_FIELDS)) {
    const v = answers[key];
    let text = "";
    if (typeof v === "string") text = v.trim();
    else if (Array.isArray(v))
      text = v.filter((x): x is string => typeof x === "string").join(", ");
    if (!text) continue;
    lines.push(`${key}: ${text.slice(0, cap)}`);
  }
  return lines.join("\n");
}

/* Strip accidental markdown fences and validate the shape of a concept. */
function cleanHtml(raw: string): string | null {
  let html = raw.trim();
  const fence = html.match(/^```(?:html)?\s*\n([\s\S]*?)\n```\s*$/);
  if (fence) html = fence[1].trim();
  const start = html.indexOf("<!");
  const startHtml = html.toLowerCase().indexOf("<html");
  if (start > 0 || startHtml > 0) html = html.slice(Math.max(start, 0));
  if (!/<style[\s>]/i.test(html) || !/<body[\s>]/i.test(html)) return null;
  if (/<script[\s>]/i.test(html)) return null; // model ignored the rules — drop it
  if (html.length > 120_000) return null;
  return html;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "Previews aren't available right now." },
      { status: 503 },
    );
  }
  if (!isAllowedOrigin(req.headers.get("origin"))) {
    return NextResponse.json({ ok: false, error: "Request not allowed." }, { status: 403 });
  }
  const ip = clientIp(req);
  if (rateLimitedByIp(ip) || rateLimitedGlobally("global")) {
    return NextResponse.json(
      { ok: false, error: "Preview limit reached for now — your scope will include directions instead." },
      { status: 429 },
    );
  }

  let body: PreviewPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (body.botField && body.botField.trim() !== "") {
    return NextResponse.json({ ok: true, concepts: [] });
  }
  const answers = body.answers;
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const facts = fieldLines(answers as Record<string, unknown>);
  if (!facts.includes("bizName:") && !facts.includes("goals:")) {
    return NextResponse.json(
      { ok: false, error: "Not enough answers yet to draft a concept." },
      { status: 422 },
    );
  }

  const client = new Anthropic();

  try {
    const concepts = await Promise.all(
      DIRECTIONS.map(async (d) => {
        // Streaming keeps the request alive past HTTP idle timeouts; effort
        // low keeps a concept sketch inside the 60s function window.
        const stream = client.messages.stream({
          model: "claude-opus-5",
          max_tokens: 6000,
          output_config: { effort: "low" },
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: `Design direction: ${d.title}. ${d.style}\n\nClient's intake answers:\n${facts}\n\nProduce the concept homepage now.`,
            },
          ],
        });
        const message = await stream.finalMessage();
        const text = message.content
          .filter((b): b is Anthropic.TextBlock => b.type === "text")
          .map((b) => b.text)
          .join("");
        const html = cleanHtml(text);
        return html ? { key: d.key, title: d.title, html } : null;
      }),
    );

    const good = concepts.filter(
      (c): c is { key: string; title: string; html: string } => c !== null,
    );
    if (good.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Couldn't draft concepts this time. Your scope reply will include directions instead." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, concepts: good });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error(`Preview: Anthropic API error ${err.status}`, err.message);
    } else {
      console.error("Preview: generation failed", err);
    }
    return NextResponse.json(
      { ok: false, error: "Couldn't draft concepts this time. Your scope reply will include directions instead." },
      { status: 502 },
    );
  }
}
