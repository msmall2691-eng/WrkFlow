"use client";

import { track } from "@vercel/analytics";

/*
  trackTool — lightweight per-tool event tracking on top of the Vercel
  Analytics already wired into the site (see app/layout.tsx). Lets Meg see
  which free tools actually drive leads (opened → generated → copied/
  downloaded → emailed) in the Vercel Analytics dashboard. Best-effort: a
  blocked/absent analytics script should never break a tool.
*/
export type ToolEvent = "opened" | "generated" | "copied" | "downloaded" | "emailed";

export function trackTool(tool: string, event: ToolEvent) {
  try {
    track(`tool_${event}`, { tool });
  } catch {
    /* analytics best-effort — never block the tool on it */
  }
}

/*
  Lead + booking conversion events.

  The free tools were already instrumented above, but the three things that
  actually pay — a contact submission, a finished questionnaire, a click on
  "book a call" — were invisible. Without them there is no way to tell whether
  a change to the homepage helped or hurt, which is the whole point of the
  redesign that follows.

  Kept as a small union rather than importing LeadSource from lib/leads.ts:
  that module pulls in the Supabase client, and this one ships to the browser.
*/
export type LeadEventSource = "contact" | "questionnaire" | "tool" | "site-check";

/** A lead actually landed. The one event to compare week over week. */
export function trackLead(source: LeadEventSource, offer?: string) {
  try {
    track("lead_submitted", { source, offer: offer || "none" });
  } catch {
    /* analytics best-effort — never block a submission on it */
  }
}

/**
 * Questionnaire funnel. "started" fires when the visitor commits to the first
 * question, "completed" when the brief is sent — the gap between them is the
 * drop-off rate for a ten-minute form.
 */
export function trackQuestionnaire(stage: "started" | "completed") {
  try {
    track("questionnaire", { stage });
  } catch {
    /* analytics best-effort */
  }
}

/**
 * A click on a "book a 15-min call" CTA. `where` is the surface it was clicked
 * from (hero, pricing, contact) and `booked` says whether a real scheduler was
 * configured — a false there means the visitor hit the contact-form fallback.
 */
export function trackBooking(where: string, booked: boolean) {
  try {
    track("booking_click", { where, booked });
  } catch {
    /* analytics best-effort */
  }
}
