/*
  The four modules under the storefront floor.

  **Data here, drawing in the scene, for the reason this repo keeps
  writing down:** two readers now want these four facts. The 3D blocks
  draw them as geometry with a floating label, and act three of the
  homepage lists them as ordinary text. One definition, so the picture and
  the prose cannot drift into describing different products.

  It also keeps the scene's data out of a `"use client"` module that
  imports three.js: the page can read this list without pulling the whole
  3D stack into its own bundle.

  **No caption quotes a number, and one of them used to.** `spec` on the
  CRM module read "0s Latency", which is a performance claim about systems
  on other people's servers that nothing here has measured, and the first
  rule in CLAUDE.md is that proof is never invented. It says what the
  module does instead: the form fills the pipeline, so nobody retypes it.
  That is also the complaint the category exists to answer, in Meg's own
  words: my systems do not talk and I keep typing the same thing twice.
*/

export type EngineNode = {
  id: string;
  /** What the module is. */
  label: string;
  /** A short tag: what it runs on, or what it spares you. Never a metric. */
  spec: string;
  /** One line on what it does. */
  blurb: string;
  /** Where the block sits under the deck, in scene units. */
  at: [number, number, number];
};

export const engineNodes: EngineNode[] = [
  {
    id: "crm",
    label: "CRM & Lead Sync",
    spec: "No double entry",
    blurb: "Auto-routes form submissions into custom pipelines.",
    at: [-2.5, -2.4, 0.3],
  },
  {
    id: "billing",
    label: "Checkout & Billing",
    spec: "Stripe + Webhooks",
    blurb: "Instant provisioning and automated client receipts.",
    at: [-0.85, -2.6, -0.6],
  },
  {
    id: "followup",
    label: "SMS & Email Triggers",
    spec: "24/7 Follow-Up",
    blurb: "Eliminates manual scheduling and repetitive admin.",
    at: [0.85, -2.4, 0.4],
  },
  {
    id: "modules",
    label: "Modular Add-Ons",
    spec: "Plug & Play",
    blurb: "Attach premade widgets or custom-built modules anytime.",
    at: [2.5, -2.65, -0.4],
  },
];

/**
 * The event that says which module is lit.
 *
 * **The highlight is driven from the page, not from the canvas, and that
 * is a correction rather than a preference.** The blocks carried their own
 * `onPointerOver` and `onClick`, which could never fire: the stage is a
 * `fixed`, `-z-10`, `pointer-events-none` layer behind the whole site, so
 * nothing in it has ever received a pointer. Act three's copy said "hover
 * any block to see what it does", which was an instruction the page could
 * not follow, and the captions were unreadable to everybody rather than
 * merely awkward.
 *
 * Making 3D hit-testing work would mean turning `pointer-events` off on
 * the page wrapper and back on for every section inside it, so that a
 * click can fall through the gaps to the canvas. One missed `auto` there
 * silently kills a link, and the cost lands on the whole page to buy one
 * hover.
 *
 * So the four captions are real DOM in act three, and hovering or
 * focusing one lights its block. It works with a mouse, a finger and a
 * keyboard, a screen reader reads it, and the scene stays a background
 * that cannot intercept anything. `lib/theme.ts` already talks to the
 * scene this way, so this is the house pattern rather than a new one.
 */
export const ENGINE_NODE_EVENT = "engine:node";

export type EngineNodeEvent = CustomEvent<{ id: string | null }>;

/** Light a module, or clear it with `null`. Safe to call on the server. */
export function litEngineNode(id: string | null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(ENGINE_NODE_EVENT, { detail: { id } }),
  );
}
