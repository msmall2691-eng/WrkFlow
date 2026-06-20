import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

/*
  Live AI automation-blueprint generator.

  A visitor describes their busywork in plain English; Claude returns a concrete,
  realistic automation plan as structured JSON. This is the studio demonstrating
  the product — so the output is honest and specific, not salesy fluff.
*/

type Payload = { busywork?: string };

// Structured output the model must conform to (renders cleanly in the widget).
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      description: "Short, punchy name for the automation, e.g. 'Lead intake autopilot'.",
    },
    summary: {
      type: "string",
      description: "One or two plain-English sentences on what gets automated.",
    },
    steps: {
      type: "array",
      description: "3 to 6 concrete steps in the workflow, in order.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          action: { type: "string", description: "Imperative step name, e.g. 'Sync to the CRM'." },
          detail: { type: "string", description: "One sentence on what happens and how." },
        },
        required: ["action", "detail"],
      },
    },
    stack: {
      type: "array",
      description: "Realistic tools/integrations involved (3 to 6).",
      items: { type: "string" },
    },
    setup_estimate: { type: "string", description: "Rough build time, e.g. '1–2 weeks'." },
    time_saved: { type: "string", description: "Rough time reclaimed, e.g. '~6 hrs/week'." },
  },
  required: ["title", "summary", "steps", "stack", "setup_estimate", "time_saved"],
} as const;

const SYSTEM = `You are the automation architect at Connective Studio, a web + automation + systems studio.

A potential client will describe, in plain English, some repetitive busywork or a messy process they're stuck with. Design a concrete, realistic automation blueprint tailored to exactly what they described.

Rules:
- Be specific to their situation — reference the actual tools, data, and steps they mention. Do not produce a generic template.
- Name realistic, commonly-used tools/integrations (forms, CRMs like HubSpot/Salesforce, Slack, Google Sheets/Workspace, QuickBooks/Stripe, Zapier/Make/n8n, webhooks, APIs). Infer sensible ones when unstated.
- Be honest and grounded. Give a realistic build estimate and a believable time-saved range. Never over-promise.
- 3 to 6 steps. Keep each step and the summary tight and jargon-light.
- If the input is empty, gibberish, or clearly not about a workflow, still return the schema: set title to "Tell us a bit more", put a friendly one-line ask in summary, and use a single generic example step.
Return only the structured output.`;

// Very light per-instance rate limiting to curb abuse/cost (best-effort).
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude memory bound
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The live demo isn't configured yet. Tell us your busywork via the contact form and we'll map it for you." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "You're going fast! Give it a moment and try again." },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const busywork =
    typeof body.busywork === "string" ? body.busywork.trim().slice(0, 600) : "";
  if (busywork.length < 3) {
    return NextResponse.json(
      { error: "Tell us a little about the busywork you'd like to automate." },
      { status: 400 },
    );
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1500,
      system: SYSTEM,
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: SCHEMA },
      },
      messages: [
        {
          role: "user",
          content: `Here's our busywork:\n\n"${busywork}"\n\nDesign the automation.`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { error: "We couldn't process that one. Try describing the task a different way." },
        { status: 422 },
      );
    }

    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    let blueprint: unknown;
    try {
      blueprint = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "We hit a snag generating that. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ blueprint });
  } catch (err) {
    console.error("[blueprint] generation failed:", err);
    return NextResponse.json(
      { error: "Our assistant is briefly unavailable. Please try again in a moment." },
      { status: 502 },
    );
  }
}
