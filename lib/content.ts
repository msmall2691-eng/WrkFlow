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

/*
  Founder note — Meg's own copy. Two paragraphs + a signature. The first
  paragraph ties the ambient site chrome (live tide, moon, daylight) to
  the studio thesis; the second is the solo-vs-team framing and the
  personal beat. Edit here, not in the component.
*/
export const founderNote = {
  paragraphs: [
    "The tide line up top is live — that's Casco Bay, right now. Same with the moon and the daylight. M Studio builds software that pays attention to the real world. I learned that at The Maine Cleaning Company — the business I still run — where nothing off the shelf fit how the work actually happened, so the tools got built from scratch.",
    "M Studio grew out of those tools. Small builds are me, end to end. Bigger ones bring in people I trust. I'm self-taught and still studying, raising three kids on the coast of Maine, and there hasn't been a stretch yet where I wasn't building something.",
  ],
  signature: "— Meg",
} as const;


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
      "Custom websites and web apps, designed and built from scratch—marketing sites, client portals, booking and scheduling. M Studio handles everything around them too: hosting, domain, analytics, and getting it live.",
    pain:
      "Drag-and-drop builders look like everyone else and box you in the moment you need something specific. Agencies hand back a site you can't edit and don't really own. And almost nobody wires up the hosting, domain, and integrations so the thing just runs.",
    outcome:
      "A fast, custom site or app you own outright—fully set up, connected to the rest of your systems, and live. No monthly fee holding it over you, no logging a ticket just to change a word.",
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
      "M Studio connects the tools you already use and automates the repetitive handoffs between them, so the apps that never talked to each other finally do.",
    pain:
      "Information gets copy-pasted between apps, re-keyed into spreadsheets, and dropped in the cracks between systems that were never meant to talk to each other.",
    outcome:
      "Records flow automatically from one system to the next. The double-entry disappears, the errors that came with it disappear, and your team gets the hours back.",
    example: {
      client: "Booking → follow-up",
      built: "New booking fires a chain: customer confirmation, calendar hold, crew assignment, and a follow-up review request—untouched by hand.",
      result: "Recurring admin handled without anyone re-typing a thing.",
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
      "Customer and operations databases, shaped around how your business really runs—with exactly the fields your work uses and nothing it doesn't.",
    pain:
      "Off-the-shelf tools make you bend your process to fit their forms, then charge a per-seat fee every month on top. The data you actually need lives in the gaps their software never planned for.",
    outcome:
      "One source of truth you own outright. The right fields, the right relationships, no dead weight—and no per-seat fee that climbs every time you grow.",
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
      "Practical AI, wired into the day-to-day—intake, follow-ups, drafting, summarizing, sorting. Everything is built draft-first, so nothing goes out without your sign-off.",
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
      "Your numbers, pulled from wherever they live into one live view—jobs, revenue, pipeline, team—so the metrics that run the business stop hiding in separate tabs.",
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
      "A close look at how your tools and processes actually run—where data's exposed, where things break quietly, where manual steps cost time and money—delivered as a plain-English plan, ranked by what to fix first.",
    pain:
      "Most operations grow by accretion: tools bolted on over years, steps nobody remembers adding, integrations that fail without anyone noticing. The drag is invisible until it isn't.",
    outcome:
      "A clear map of your systems and processes, and a ranked list of what to fix first. No jargon, no upselling—just the facts and a sensible order to work through them.",
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
      "A clean break from rigid, pricey platforms—Jobber, Housecall Pro, and the like—onto a system you own, with your full history carried over cleanly and intact.",
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
      "Messy, duplicated customer data, scattered across systems and merged into one clean, reliable record—deduplicated, consistent, and checked.",
    pain:
      "The same customer exists three times with three spellings. Reports contradict each other. Every automation built on this foundation inherits the mess and quietly compounds it.",
    outcome:
      "Clean, consistent, deduplicated data in one place. Reports you can trust and automations that finally run on a foundation that's actually solid.",
    example: {
      client: "Customer list cleanup",
      built: "Merged duplicate customer records across systems, normalized formats, and validated contact data into one reliable list.",
      result: "Duplicate records merged into one clean, reliable source.",
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
    body: "It starts with how you actually run—where time goes, where data lives, what keeps breaking.",
  },
  {
    index: "02",
    title: "Design",
    body: "The system gets mapped around that: data, flow, screens. Nothing is built until you sign off.",
  },
  {
    index: "03",
    title: "Build",
    body: "It comes together in small, working pieces you can poke at as they land. You steer throughout.",
  },
  {
    index: "04",
    title: "Iterate",
    body: "Then it's tuned against real use, handed over, and supported as it grows. No lock-in.",
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
  /** True if the site allows embedding (show a live iframe preview, not a shot). */
  live?: boolean;
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
  // Tier 1 — live websites (lead with our own flagship, the best work so far)
  {
    tier: "site",
    tag: "Website + system · our own company",
    title: "The Maine Cleaning Co.",
    blurb: "Marketing + booking site, wired straight into the back-office system that runs the company.",
    stack: ["Next.js", "Supabase", "Vercel", "Twilio", "Stripe"],
    url: "https://maineclean.co",
    live: true,
    shot: "/shots/maineclean.png",
  },
  {
    tier: "site",
    tag: "Client work",
    title: "The Remote Admin",
    blurb: "Full marketing site for a Southern-NH admin-services business—designed, built, and shipped end to end.",
    stack: ["Next.js", "Vercel"],
    url: "https://the-remote-admin.com",
    live: true,
    shot: "/shots/remote-admin.png",
    client: true,
  },
  // Tier 2 — product we built
  {
    tier: "product",
    tag: "Product · designed & built by M Studio",
    title: "Autopilot",
    blurb: "A complete CRM + field-service platform—scheduling, invoicing, and STR turnover automation—designed and built from scratch.",
    stack: ["Next.js", "Supabase", "Vercel"],
    url: "https://autopilot-sooty.vercel.app",
    live: true,
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
    price: "from $750 one-time",
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
    price: "from $1,200 one-time",
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
      "Configured to your pricing + branding",
      "Leads emailed straight to you on submit",
      "One line of code to install — we set it up, you go live",
    ],
    price: "$150 setup + $15/mo",
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
    price: "from $1,000 one-time",
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
    price: "from $150 setup + $19/mo",
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
      "Open-source starter on request — calculators only; hosted tools (Quote, Flows) stay set-up-by-us",
      "A friendly way to say hello",
    ],
    price: "Free",
  },
];
