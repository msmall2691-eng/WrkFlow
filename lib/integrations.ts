import { brightbase } from "./brightbase";
import { work, type WorkItem } from "./content";

/*
  integrations.ts — the tools M Studio has actually connected, and where
  each one is running.

  **Why this file exists.** "Getting your tools to talk" is one of the four
  services, and it is the one Meg names first when asked what she sells. On
  the homepage it was also the thinnest thing on the page: the service
  router counts the work filed under each category from `work`, and
  integrations came to exactly one project. Meanwhile eight real
  integrations were already written down in this repo and invisible —
  `brightbase.integrations` is a list of eight, rendered only on
  /brightbase, which a visitor reaches by clicking into a case study they
  have not been given a reason to click into yet.

  So the evidence was there and it was filed by project. A buyer asking
  "can you connect the thing I already pay for" is not asking about a
  project. This is the same evidence cut the other way, by tool.

  **It invents nothing, and `proof` is what makes that checkable.** Every
  integration here names the exact record elsewhere in the repo that backs
  it: a chip in a project's own `stack`, or an entry in
  `brightbase.integrations`. `e2e/smoke.spec.ts` resolves every one of them
  and fails naming any that does not land, so an integration cannot be
  added here by typing it. That matters more on this list than on most,
  because a wall of familiar logos is the easiest thing on a portfolio to
  pad out, and CLAUDE.md's first rule is that proof is never invented.

  `project` is a `work[]` title rather than a free string for the same
  reason `Service.id` is a `ServiceCategory`: it is a relationship, so it
  should fail the test rather than quietly point at nothing.

  **What is deliberately not here.** Supabase, Vercel, Railway, Postgres
  and the rest of the `stack` chips. Those are what the work is built on,
  not tools a business already runs that got connected to something else,
  and listing them would turn an honest answer into a longer one. And the
  turnover sync to Connecteam or Jobber is not here at all, because it is
  not built. It is an idea Meg has, and an idea on this list would be the
  one kind of claim this file exists to refuse.
*/

export type IntegrationProof = {
  /** A `work[]` title, exactly. */
  project: string;
  /**
   * The exact string in that project's own record that backs this: a chip
   * in its `stack`, or, for BrightBase, the `name` of an entry in
   * `brightbase.integrations`. The spellings genuinely differ between
   * sources, which is why this is stored rather than matched on `name`:
   * the turnover work records "iCal sync" where BrightBase records
   * "Airbnb · VRBO · Booking.com", and both are the same integration.
   */
  source: string;
};

export type Integration = {
  /** What a visitor reads. */
  name: string;
  /** What it does for their business, in their words rather than the vendor's. */
  what: string;
  proof: IntegrationProof[];
};

/*
  Ordered by what a visitor arrived worrying about, not alphabetically and
  not by how interesting it was to build. Booking calendars first because
  short-term rental hosts are an audience the site addresses by name, then
  getting paid, then talking to customers.
*/
export const integrations: Integration[] = [
  {
    name: "Airbnb, Vrbo and Booking.com",
    what: "Booking calendars become the cleaning schedule, with same-day turnarounds flagged.",
    proof: [
      { project: "BrightBase", source: "Airbnb · VRBO · Booking.com" },
      { project: "Turnover scheduling", source: "iCal sync" },
    ],
  },
  {
    name: "Stripe",
    what: "Customers pay online from the invoice, with a receipt by email.",
    proof: [
      { project: "BrightBase", source: "Stripe" },
      { project: "The Maine Cleaning Co.", source: "Stripe" },
    ],
  },
  {
    name: "Twilio",
    what: "Texts and calls from inside the system, so the thread stays attached to the job.",
    proof: [
      { project: "BrightBase", source: "Twilio" },
      { project: "The Maine Cleaning Co.", source: "Twilio" },
    ],
  },
  {
    name: "Google Calendar",
    what: "Jobs sync both ways, so the calendar everybody already checks stays right.",
    proof: [
      { project: "BrightBase", source: "Google Calendar" },
      { project: "Turnover scheduling", source: "Google Calendar" },
    ],
  },
  {
    name: "Gmail",
    what: "Inbox sync and sending, so customer email is logged against the right job.",
    proof: [{ project: "BrightBase", source: "Gmail" }],
  },
  {
    name: "Stripe Connect",
    what: "Subcontractors are paid their share per job, with year-to-date totals for 1099s.",
    proof: [
      { project: "BrightBase", source: "Stripe Connect" },
      { project: "linx", source: "Stripe Connect" },
    ],
  },
  {
    name: "Facebook and Instagram lead ads",
    what: "A form fill arrives as a real lead instead of an email somebody has to re-type.",
    proof: [{ project: "BrightBase", source: "Facebook & Instagram" }],
  },
  {
    name: "Claude",
    what: "Drafts and instant price ranges written from the job's own details.",
    proof: [
      { project: "BrightBase", source: "Claude" },
      { project: "Instant Estimate", source: "Anthropic API" },
    ],
  },
];

/** Every `name` in `brightbase.integrations`, which is one of the two sources. */
const BRIGHTBASE_SOURCES = new Set(brightbase.integrations.map((i) => i.name));

/**
 * Does this proof actually land? Returns the `work` row it names, or null.
 *
 * Exported because the test asserts on it rather than re-deriving the rule.
 * A second copy of "what counts as backed" is how a list like this drifts
 * into decoration.
 */
export function resolveProof(p: IntegrationProof): WorkItem | null {
  const project = work.find((w) => w.title === p.project);
  if (!project) return null;

  const inStack = project.stack?.includes(p.source) ?? false;
  const inBrightbase = p.project === "BrightBase" && BRIGHTBASE_SOURCES.has(p.source);

  return inStack || inBrightbase ? project : null;
}

/** The projects an integration is running in, in the order it lists them. */
export function provenIn(i: Integration): WorkItem[] {
  return i.proof
    .map(resolveProof)
    .filter((w): w is WorkItem => w !== null);
}
