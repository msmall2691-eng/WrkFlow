/*
  Central content for M Studio. Keeping copy here makes the
  service list and headline iterations a one-file change.
*/

/*
  The proving-ground company named in the origin story and Work section.
  Option A (default, most credible): the real company. Option B: swap to
  "our own operating company" if the owner prefers not to name it.
*/
export const provingGroundCompany = "The Maine Cleaning Company";

/** "Who this is for" — names the buyer plainly. */
export const whoIsItFor =
  "Service companies, trades, property managers, short-term-rental operators, founders, or anyone with a project worth building right. Any size, any kind. A whole business or a single personal project, both work.";

/** Founder note. Owner to edit voice/details. */
export const founderNote = `I got into this by building software for my own company, ${provingGroundCompany}, because nothing on the market quite fit. I built the whole thing, from the website to the scheduling and daily operations behind it, and that's where I learned the work. Now I build websites, apps, tools, and workflows for all kinds of businesses and personal projects, while finishing a Business Analytics & AI degree at USM with a Computer Science minor. Based on the coast of Maine.`;


/** On-brand animated illustration types (used when no true screenshot fits). */
export type VisualType = "database" | "automation" | "audit" | "cleanup";

export type ServiceExample = {
  /** Short client/project label shown on the example card. */
  client: string;
  /** One-line description of what was built for this service. */
  built: string;
  /** A concrete, numeric-where-possible result. */
  result: string;
  /** Real screenshot in /shots, when one genuinely matches. */
  shot?: string;
  /** Branded animated visual, used when a screenshot would mislead. */
  visual?: VisualType;
};

export type Service = {
  id: string;
  index: string;
  title: string;
  /** One-line essence shown under the title. */
  tagline: string;
  /** Concrete kinds we build in this discipline — shown as chips. */
  kinds: string[];
  /** What it is. */
  what: string;
  /** The business pain it solves. */
  pain: string;
  /** What changes after. */
  outcome: string;
  /** A real example of this service in the wild. */
  example: ServiceExample;
};

export const services: Service[] = [
  {
    id: "web",
    index: "01",
    title: "Websites & Web Apps",
    tagline: "A site or app that's actually yours—built, connected, and live.",
    kinds: ["Marketing sites", "Booking & scheduling", "Client portals", "Marketplaces", "Internal tools"],
    what:
      "Custom websites and web applications designed and built from scratch—marketing sites, client portals, booking and scheduling apps—with everything around them handled too: hosting, domain, analytics, and the deploy pipeline.",
    pain:
      "Drag-and-drop builders look like everyone else and box you in the moment you need something specific. Agencies hand back a site you can't edit and don't really own. And almost nobody wires up the hosting, domain, and integrations so the thing just runs.",
    outcome:
      "A fast, custom site or app you own outright—fully set up, connected to the rest of your systems, and live. No monthly hostage situation, no logging a ticket to change a word.",
    example: {
      client: "The Maine Cleaning Co.",
      built: "Custom marketing site with instant online quoting and booking, wired to the back-office system.",
      result: "Quote-to-booking handled on the site itself—no phone tag.",
      shot: "/shots/maineclean.png",
    },
  },
  {
    id: "automation",
    index: "02",
    title: "Workflow Automation & Integration",
    tagline: "Data moves itself. Nobody re-types anything.",
    kinds: ["Lead intake", "Follow-ups", "Scheduling", "Invoicing sync", "Notifications"],
    what:
      "Connecting the tools you already run and automating the repetitive handoffs between them with APIs, webhooks, and custom connectors built for your stack.",
    pain:
      "Information gets copy-pasted between apps, re-keyed into spreadsheets, and dropped in the cracks between systems that were never meant to talk to each other.",
    outcome:
      "Records flow automatically from one system to the next. The double-entry disappears, the errors that came with it disappear, and your team gets the hours back.",
    example: {
      client: "Booking → follow-up",
      built: "New booking fires a chain: customer confirmation, calendar hold, crew assignment, and a follow-up review request—untouched by hand.",
      result: "Hours of weekly admin handed off to automation.",
      visual: "automation",
    },
  },
  {
    id: "crm",
    index: "03",
    title: "Custom CRM & Database Design",
    tagline: "A system shaped to your business, not the other way around.",
    kinds: ["Customer records", "Job tracking", "Pipelines", "Owner reporting"],
    what:
      "Purpose-built customer and operations databases with a clean schema and exactly the fields your work actually uses—built around how your business really runs.",
    pain:
      "Off-the-shelf tools force you to bend your process to fit their forms, then charge a monthly per-seat ransom for the privilege. The data you need lives in the gaps their software never anticipated.",
    outcome:
      "One source of truth you own outright. The right fields, the right relationships, no dead weight—and no recurring per-seat tax on growth.",
    example: {
      client: "Owned CRM",
      built: "A custom customer + job database with exactly the fields the work uses—accessible from anywhere, owned outright.",
      result: "One source of truth replacing scattered spreadsheets.",
      visual: "database",
    },
  },
  {
    id: "ai-agents",
    index: "04",
    title: "AI Agent Implementation",
    tagline: "AI does the busywork. You keep the decisions.",
    kinds: ["Inbox triage", "Draft replies", "Summaries", "Smart intake"],
    what:
      "Practical AI wired directly into operations—intake, follow-ups, drafting, summarizing, and triage—designed draft-first and owner-approved so nothing goes out without a human's sign-off.",
    pain:
      "Generic AI tools either do too little to matter or too much to trust. The repetitive thinking work—reading, sorting, drafting the same replies—still eats hours every week.",
    outcome:
      "The routine handled in the background and surfaced for approval. Faster responses, less manual drafting, and a human firmly in control of every decision that counts.",
    example: {
      client: "Instant Estimate",
      built: "An AI intake layer that reads inbound requests, drafts a quote and a reply, and queues both for one-click owner approval.",
      result: "Same-day replies, drafted automatically, approved by a human.",
      shot: "/shots/instant-estimate.png",
    },
  },
  {
    id: "dashboards",
    index: "05",
    title: "Operational Dashboards",
    tagline: "The numbers that matter, finally in one view.",
    kinds: ["Revenue & KPIs", "Occupancy", "Team & jobs", "Live pipeline"],
    what:
      "Real-time insight pulled from scattered sources into a single view—jobs, revenue, pipeline, and team—so the metrics that run the business stop hiding in separate tabs.",
    pain:
      "Answering a simple question—how's this month tracking?—means opening five tools, exporting three spreadsheets, and reconciling them by hand. By the time you know, it's old news.",
    outcome:
      "A live picture of the business at a glance. The right numbers, current, in one place—so decisions get made on what's happening now, not last month's export.",
    example: {
      client: "BrightBase",
      built: "An operations command center pulling jobs, revenue, occupancy, and crew into one live view—the same kind of dashboard demoed on this site.",
      result: "The whole operation visible at a glance, in real time.",
      shot: "/shots/brightbase-dashboard.png",
    },
  },
  {
    id: "audit",
    index: "06",
    title: "Systems & Process Optimization",
    tagline: "Find what's slow, broken, or costing you—and fix it in order.",
    kinds: ["Tool audit", "Process mapping", "Fix-it roadmap"],
    what:
      "A thorough review of how your tools and processes actually run—where data is exposed, where things break silently, and where manual steps quietly cost time and money—delivered as a prioritized, plain-English plan to streamline it.",
    pain:
      "Most operations grow by accretion: tools bolted on over years, steps nobody remembers adding, integrations that fail without anyone noticing. The drag is invisible until it isn't.",
    outcome:
      "A precise map of your systems and processes, and a ranked list of what to fix first. No jargon, no fear-mongering—just the facts and a sensible order of operations.",
    example: {
      client: "Operations review",
      built: "A full walk-through of an operator's tools and handoffs—mapping where data leaked, where steps doubled up, and where time quietly vanished.",
      result: "A ranked, plain-English fix-it plan—biggest wins first.",
      visual: "audit",
    },
  },
  {
    id: "migration",
    index: "07",
    title: "Legacy Software Migration",
    tagline: "Leave the platform. Keep the history.",
    kinds: ["Jobber / Housecall exit", "Data export", "Clean cutover"],
    what:
      "Getting you off rigid, expensive platforms—Jobber, Housecall Pro, and the like—and onto a system you own, with your full history migrated cleanly and intact.",
    pain:
      "You're locked in by years of accumulated data and the fear of losing it. Every month you stay, the subscription climbs and the software still doesn't fit.",
    outcome:
      "A clean cutover to a system built around your real process, with your customers, jobs, and records carried over faithfully. The lock-in is gone for good.",
    example: {
      client: "BrightBase turnovers",
      built: "Moved scheduling and turnover tracking off a rigid SaaS platform onto an owned system—full history migrated intact.",
      result: "Off the monthly subscription, history kept in full.",
      shot: "/shots/brightbase-turnovers.png",
    },
  },
  {
    id: "data-cleanup",
    index: "08",
    title: "Data Cleanup & Consolidation",
    tagline: "One trustworthy source instead of five conflicting ones.",
    kinds: ["Dedupe", "Normalize", "Merge sources", "Validate"],
    what:
      "Messy, duplicated customer data scattered across systems—deduplicated, normalized, validated, and merged into a single record you can rely on.",
    pain:
      "The same customer exists three times with three spellings. Reports contradict each other. Every automation built on this foundation inherits the mess and quietly compounds it.",
    outcome:
      "Clean, consistent, deduplicated data in one place. Reports you can trust and automations that finally run on a foundation that's actually solid.",
    example: {
      client: "Customer list cleanup",
      built: "Merged duplicate customer records across systems, normalized formats, and validated contact data into one reliable list.",
      result: "Thousands of records de-duplicated into one clean source.",
      visual: "cleanup",
    },
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
    body: "First I figure out how you actually run. Where time goes, where data lives, what keeps breaking.",
  },
  {
    index: "02",
    title: "Design",
    body: "I sketch the system around that: data, flow, screens. You sign off before I build anything.",
  },
  {
    index: "03",
    title: "Build",
    body: "I build in small, working pieces you can poke at. You steer.",
  },
  {
    index: "04",
    title: "Iterate",
    body: "I tune it against real use, hand it over, and stick around to add to it. No lock-in.",
  },
];

export type WorkTier = "site" | "product" | "private";

export type WorkItem = {
  tier: WorkTier;
  /** Eyebrow tag, e.g. "Client work" / "Website + system" / "Product" / "Private system". */
  tag: string;
  title: string;
  blurb: string;
  /** Tech chips (replaces a repo link — repos are private). */
  stack?: string[];
  /** Live URL — Tier 1 & 2 only; Tier 3 has no link. */
  url?: string;
  shot: string; // /shots/*.png
  /** Set for outside-client work so it gets a distinct accent. */
  client?: boolean;
  /** A single REAL outcome number (e.g. "0 double-bookings since launch"). Never fabricate—leave undefined until Meg confirms. */
  metric?: string;
};

/*
  Selected work — three tiers: live websites (linked), a product demo (linked),
  and private internal systems (screenshot only, never linked).
*/
export const work: WorkItem[] = [
  // Tier 1 — live websites (lead with the outside-client one)
  {
    tier: "site",
    tag: "Client work",
    title: "The Remote Admin",
    blurb: "Full marketing site for a Southern-NH admin-services business—designed, built, and shipped end to end.",
    stack: ["Next.js", "Vercel"],
    url: "https://the-remote-admin.com",
    shot: "/shots/remote-admin.png",
    client: true,
    // TODO: real metric — e.g. metric: "Shipped in N weeks" (confirm with Meg)
  },
  {
    tier: "site",
    tag: "Website + system · my own company",
    title: "The Maine Cleaning Co.",
    blurb: "Marketing + booking site, wired straight into the back-office system I run the company on.",
    stack: ["Next.js", "Supabase", "Vercel", "Twilio", "Stripe"],
    url: "https://maineclean.co",
    shot: "/shots/maineclean.png",
    // TODO: real metric — e.g. metric: "0 double-bookings since launch" or "~N hrs/week back" (confirm with Meg)
  },
  // Tier 2 — product we built
  {
    tier: "product",
    tag: "Product · designed & built by M Studio",
    title: "Autopilot",
    blurb: "A complete CRM + field-service platform—scheduling, invoicing, and STR turnover automation—designed and built from scratch.",
    stack: ["Next.js", "Supabase", "Vercel"],
    url: "https://autopilot-sooty.vercel.app",
    shot: "/shots/autopilot.png",
  },
  // Tier 3 — private internal/client systems (no links)
  {
    tier: "private",
    tag: "Private system",
    title: "BrightBase — Command Center",
    blurb: "Jobs, revenue, occupancy & crew in one live view.",
    shot: "/shots/brightbase-dashboard.png",
  },
  {
    tier: "private",
    tag: "Private system",
    title: "Turnover scheduling",
    blurb: "Internal board for STR turnovers—who, where, and when, at a glance.",
    shot: "/shots/brightbase-turnovers.png",
  },
  {
    tier: "private",
    tag: "Private system",
    title: "Instant Estimate",
    blurb: "Reads requests, drafts a quote, and queues a reply for approval.",
    shot: "/shots/instant-estimate.png",
  },
];

/*
  Marketplace — premade tools and starter sites a visitor can buy or embed.
  Models:
    • "template"  — a starter site/app you buy once and own (done-for-you setup).
    • "embed"     — a hosted widget you drop into an existing site (small monthly).
    • "open"      — free / open-source starter, kept as a lead-in.
  Pricing here is indicative; CTAs route to contact rather than live checkout.
*/
export type MarketItemModel = "template" | "embed" | "open";

export type MarketItem = {
  id: string;
  name: string;
  model: MarketItemModel;
  /** Short category, e.g. "Website" / "Tool" / "Automation". */
  category: string;
  tagline: string;
  /** 3–4 bullets of what's included. */
  includes: string[];
  /** Indicative price label, e.g. "$1,200 one-time" or "$19/mo". */
  price: string;
  /** Preview screenshot in /shots. Optional — a gradient renders without one. */
  shot?: string;
  /** True for the highlighted / recommended card. */
  featured?: boolean;
};

export const marketModelLabels: Record<MarketItemModel, string> = {
  template: "Buy & own",
  embed: "Embed / hosted",
  open: "Free / open-source",
};

export const marketItems: MarketItem[] = [
  {
    id: "service-site",
    name: "M Linx Site",
    model: "template",
    category: "Website",
    tagline: "A fast, custom marketing site for trades and service companies—yours to own.",
    includes: [
      "Custom design + copy structure",
      "Instant-quote + contact forms wired up",
      "Hosting, domain & analytics set up",
      "You own the code outright",
    ],
    price: "from $1,800 one-time",
    shot: "/shots/maineclean.png",
    featured: true,
  },
  {
    id: "booking-app",
    name: "M Linx Booking",
    model: "template",
    category: "Web app",
    tagline: "A client-facing booking flow with an owner calendar and confirmations.",
    includes: [
      "Online booking + availability",
      "Automated email/text confirmations",
      "Owner calendar + admin view",
      "Connects to your existing tools",
    ],
    price: "from $2,400 one-time",
    shot: "/shots/brightbase-turnovers.png",
  },
  {
    id: "quote-widget",
    name: "M Linx Quote",
    model: "embed",
    category: "Tool",
    tagline: "Drop the live quoting tool from this site straight into your own.",
    includes: [
      "Embeddable estimate calculator",
      "Your pricing + branding",
      "Leads emailed to you on submit",
      "One line of code to install",
    ],
    price: "$29/mo",
    shot: "/shots/instant-estimate.png",
  },
  {
    id: "dashboard-starter",
    name: "M Linx Dashboard",
    model: "template",
    category: "Dashboard",
    tagline: "The command-center dashboard, set up around your numbers.",
    includes: [
      "Live KPIs, jobs & revenue views",
      "Connected to your data sources",
      "Hosted or self-hosted—your call",
      "Built to extend later",
    ],
    price: "from $2,000 one-time",
    shot: "/shots/brightbase-dashboard.png",
  },
  {
    id: "automation-pack",
    name: "M Linx Flows",
    model: "embed",
    category: "Automation",
    tagline: "Pre-built booking-to-follow-up flows, configured to your stack.",
    includes: [
      "Confirmation + reminder flows",
      "Review-request follow-ups",
      "Lead-to-CRM sync",
      "Tuned to your tools",
    ],
    price: "from $39/mo",
    shot: "/shots/autopilot.png",
  },
  {
    id: "calc-kit",
    name: "M Linx Tools",
    model: "open",
    category: "Tool",
    tagline: "The free calculators on this site—use them, or take the source.",
    includes: [
      "Quote, rate & signature tools",
      "Free to use, right now",
      "Open-source starter on request",
      "A friendly way to say hello",
    ],
    price: "Free",
  },
];
