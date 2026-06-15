/*
  Central content for Workflow Studio. Keeping copy here makes the
  "six-vs-seven services" and headline iterations a one-file change.
*/

export type Service = {
  id: string;
  index: string;
  title: string;
  /** One-line essence shown under the title. */
  tagline: string;
  /** What it is. */
  what: string;
  /** The business pain it solves. */
  pain: string;
  /** What changes after. */
  outcome: string;
};

export const services: Service[] = [
  {
    id: "crm",
    index: "01",
    title: "Custom CRM & Database Design",
    tagline: "A system shaped to your business, not the other way around.",
    what:
      "Purpose-built customer and operations databases with a clean schema and exactly the fields your work actually uses—built around how your business really runs.",
    pain:
      "Off-the-shelf tools force you to bend your process to fit their forms, then charge a monthly per-seat ransom for the privilege. The data you need lives in the gaps their software never anticipated.",
    outcome:
      "One source of truth you own outright. The right fields, the right relationships, no dead weight—and no recurring per-seat tax on growth.",
  },
  {
    id: "ai-agents",
    index: "02",
    title: "AI Agent Implementation",
    tagline: "AI does the busywork. You keep the decisions.",
    what:
      "Practical AI wired directly into operations—intake, follow-ups, drafting, summarizing, and triage—designed draft-first and owner-approved so nothing goes out without a human's sign-off.",
    pain:
      "Generic AI tools either do too little to matter or too much to trust. The repetitive thinking work—reading, sorting, drafting the same replies—still eats hours every week.",
    outcome:
      "The routine handled in the background and surfaced for approval. Faster responses, less manual drafting, and a human firmly in control of every decision that counts.",
  },
  {
    id: "automation",
    index: "03",
    title: "Workflow Automation & Integration",
    tagline: "Data moves itself. Nobody re-types anything.",
    what:
      "Connecting the tools you already run and automating the repetitive handoffs between them with APIs, webhooks, and custom connectors built for your stack.",
    pain:
      "Information gets copy-pasted between apps, re-keyed into spreadsheets, and dropped in the cracks between systems that were never meant to talk to each other.",
    outcome:
      "Records flow automatically from one system to the next. The double-entry disappears, the errors that came with it disappear, and your team gets the hours back.",
  },
  {
    id: "migration",
    index: "04",
    title: "Legacy Software Migration",
    tagline: "Leave the platform. Keep the history.",
    what:
      "Getting you off rigid, expensive platforms—Jobber, Housecall Pro, and the like—and onto a system you own, with your full history migrated cleanly and intact.",
    pain:
      "You're locked in by years of accumulated data and the fear of losing it. Every month you stay, the subscription climbs and the software still doesn't fit.",
    outcome:
      "A clean cutover to a system built around your real process, with your customers, jobs, and records carried over faithfully. The lock-in is gone for good.",
  },
  {
    id: "audit",
    index: "05",
    title: "Systems Auditing & Security Review",
    tagline: "A clear-eyed look at how it's all actually wired.",
    what:
      "A thorough review of your current stack—where data is exposed, where things break silently, and what's quietly costing you money or risk—delivered as a prioritized, plain-English action plan.",
    pain:
      "Most operations grow by accretion: tools bolted on over years, permissions nobody remembers granting, integrations that fail without anyone noticing. The risk is invisible until it isn't.",
    outcome:
      "A precise map of your systems and a ranked list of what to fix first. No jargon, no fear-mongering—just the facts and a sensible order of operations.",
  },
  {
    id: "data-cleanup",
    index: "06",
    title: "Data Cleanup & Consolidation",
    tagline: "One trustworthy source instead of five conflicting ones.",
    what:
      "Messy, duplicated customer data scattered across systems—deduplicated, normalized, validated, and merged into a single record you can rely on.",
    pain:
      "The same customer exists three times with three spellings. Reports contradict each other. Every automation built on this foundation inherits the mess and quietly compounds it.",
    outcome:
      "Clean, consistent, deduplicated data in one place. Reports you can trust and automations that finally run on a foundation that's actually solid.",
  },
  {
    id: "dashboards",
    index: "07",
    title: "Operational Dashboards",
    tagline: "The numbers that matter, finally in one view.",
    what:
      "Real-time insight pulled from scattered sources into a single view—jobs, revenue, pipeline, and team—so the metrics that run the business stop hiding in separate tabs.",
    pain:
      "Answering a simple question—how's this month tracking?—means opening five tools, exporting three spreadsheets, and reconciling them by hand. By the time you know, it's old news.",
    outcome:
      "A live picture of the business at a glance. The right numbers, current, in one place—so decisions get made on what's happening now, not last month's export.",
  },
];

export type ApproachStep = {
  index: string;
  title: string;
  body: string;
};

export const approachSteps: ApproachStep[] = [
  {
    index: "01",
    title: "Discovery",
    body: "We map how your business actually runs today—the real process, not the org chart. Where the time goes, where the data lives, where it breaks.",
  },
  {
    index: "02",
    title: "Design",
    body: "We shape the system around that reality. Schema, flows, and interfaces drafted for your work—reviewed with you before a line of it is built.",
  },
  {
    index: "03",
    title: "Build",
    body: "We build it for real, in working increments you can see and react to. Draft-first throughout, so you steer the direction the whole way.",
  },
  {
    index: "04",
    title: "Iterate",
    body: "We refine against real use, hand over a system you fully own, and stay available to extend it. No lock-in, no dependency by design.",
  },
];

export type Project = {
  label: string;
  title: string;
  body: string;
};

export const projects: Project[] = [
  {
    label: "CRM / Operations",
    title: "Custom CRM for an operating business",
    body: "A full customer and job database built from the ground up to replace a rented platform—designed around the real workflow and owned outright.",
  },
  {
    label: "AI Systems",
    title: "Multi-agent operations assistant",
    body: "A draft-first system of cooperating AI agents handling intake, summarization, and follow-up drafting—every output routed for human approval.",
  },
  {
    label: "Migration",
    title: "Database migration & cutover",
    body: "A clean migration off legacy software with full history preserved, mapped into a new schema purpose-built for how the business operates.",
  },
  {
    label: "Security",
    title: "Systems audit & security review",
    body: "An end-to-end review of a live operational stack, delivered as a prioritized, plain-English plan for closing gaps and reducing risk.",
  },
];
