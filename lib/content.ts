/*
  Central content for M Studio. Keeping copy here makes the
  service list and headline iterations a one-file change.
*/
import type { VisualType } from "@/components/ProjectVisual";

/*
  Founder note — the belief. Third person, stated as fact rather than
  "I believe" — the origin story (first person, but kept light on "I")
  comes later, in founderBio. Beat order: Belief → What we build → Proof
  (founderBio) → Philosophy. No signature here — this reads as a
  conviction, not a personal letter. Keep this short — it's a belief
  statement, not an essay. Edit here, not in the component.
*/
export const founderNote = {
  headline: "A business background. A love of building.",
  headlineFollow: "Websites and systems shaped around the people using them.",
  paragraphs: [
    "M Studio brings hands-on business experience to websites and systems. Every project starts with understanding the work, the tools already in place, and what could run more smoothly.",
  ],
} as const;

export const founderBio = {
  kicker: "The person behind M Studio",
  heading: "Hi, I'm Meg.",
  paragraphs: [
    "Running The Maine Cleaning Company is where this started. Managing customers, bookings, schedules, and a team made me curious about how much better the systems behind a business could work.",
    "Trying different platforms turned into learning every corner of them, moving data, connecting tools, and building what was missing. That work now includes websites, CRMs, dashboards, a Jobber-to-Airtable integration project, and an extension for Twenty CRM.",
    "I love figuring things out: learning a platform, organizing the information, and turning an idea into something useful. M Studio grew from that interest and now helps businesses with websites, platform setup, migrations, integrations, and custom tools.",
    "M Studio is based in Maine and works remotely with businesses anywhere. Alongside the studio, I am studying Business Analytics and AI at the University of Southern Maine with a minor in Computer Science. Outside of work and school, you will usually find me with the kids and our dog, near the water. Fishing if the day allows.",
  ],
  detail: "The Maine Cleaning Company is the proving ground: $1M+ collected and 4,900+ service visits since 2023.",
  signature: "— Meg",
} as const;

export const founderPhilosophy = {
  heading: "The approach",
  lines: [
    "Understand the business and the people using it.",
    "Then make the everyday work easier.",
  ],
} as const;

export const founderCta = {
  headline: "What do you wish worked better?",
  body: "Share what you use now and where you are getting stuck. That is a good place to start.",
  buttonLabel: "Talk through your project",
} as const;

/*
  Founding offer for custom builds (websites, web apps, tools) — the studio's
  entry price since the $749 Starter site tier was retired (Oct 2026).
  `spotsRemaining` is maintained BY HAND (decrement it as each founding spot
  sells); never computed or animated from fake activity. At 0 the card reverts
  to `fullPrice` and the founding line stops rendering.
*/
export const appOffer = {
  totalSpots: 10,
  spotsRemaining: 10,
  price: 1500,
  fullPrice: 2500,
} as const;

/*
  Offer stats — M STUDIO's own promises. Live beside the pricing cards
  (risk-reversal belongs next to the price, per the site survey); every
  value must stay true of what the site actually delivers.
*/
export const studioStats = [
  { value: "24 hrs", label: "answers → written scope" },
  { value: "3", label: "free concepts, from your answers" },
  { value: "$0", label: "to scope · nothing binding" },
  { value: "100%", label: "you own the code" },
] as const;

/*
  Proving ground — the operating history behind the studio, ATTRIBUTED.
  These are The Maine Cleaning Co's numbers, not M Studio client KPIs
  (per Meg), so the label naming the company renders wherever the tiles
  do. They answer "has this person done this before" — the first question
  a visitor asks — so they sit under the hero on the homepage.
*/
export const provingGround = {
  /* No em dash: house rule is commas or periods in user-facing copy. */
  label: "Built from real business. The Maine Cleaning Co.",
  stats: [
    // Verified Oct 2026 against Jobber invoices and visit exports
    // (Mar 2023 – Oct 2026). Pre-2023 years are not in any system, so
    // nothing here counts them. Founded 2018.
    { value: "8 yrs", label: "running the business" },
    { value: "$1M+", label: "collected since 2023" },
    { value: "4,900+", label: "service visits since 2023" },
    { value: "63%", label: "of clients rebooked" },
  ],
} as const;

/*
  Client testimonial — renders under the pricing cards ONLY when
  `quote` is non-empty. Paste TJ's real words here when they land; never
  invent one. One specific sentence beats three vague ones.
*/
export const testimonial: { quote: string; name: string; business: string } = {
  quote: "",
  name: "",
  business: "",
};

/*
  Downloadable résumé.

  Set this to the public path once the PDF is in /public, e.g.
  "/megan-small-resume.pdf". While it is "", every résumé link on the site
  renders nothing at all rather than 404ing — the same gate the testimonial
  and the case-study results use.
*/
export const resumeUrl = "";

/*
  Meg's own public profiles, for `sameAs` on the Person node in structured
  data. An answer engine asked "who is Megan Small" needs at least one
  corroborating profile to bind this site to a real person; with none, the
  Person node is just an assertion the site makes about itself.

  TODO(Meg) — paste the full https URLs of any you want linked, e.g.
  "https://www.linkedin.com/in/…", "https://github.com/…". While this is
  empty no `sameAs` is emitted at all, rather than a guessed URL: a wrong
  profile link is worse than none, because it points a reader at someone
  who is not you.
*/
export const profiles: readonly string[] = [];

/** Appended to every free-tool takeaway (copied text, .txt download, emailed result). */
export const toolsStamp =
  "Made with the free tools at mlinx.studio — get one tuned to your business.";


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
  /** The business pain it solves — ONE sentence; renders as a labeled box. */
  pain: string;
  /** What changes after — ONE sentence; renders as a labeled box. */
  outcome: string;
  /** A real example of this service in the wild. */
  example: ServiceExample;
};

export const services: Service[] = [
  {
    "id": "websites",
    "index": "01",
    "title": "Websites & website improvements",
    "tagline": "A new site, a better page, or the feature your website is missing.",
    "kinds": [
      "Business websites",
      "Quotes & booking",
      "Existing site updates"
    ],
    "pain": "Your website is outdated, hard to use, or missing a way for customers to take the next step.",
    "outcome": "A clear, useful website with the pages, forms, and features your business needs.",
    "example": {
      "client": "The Remote Admin",
      "built": "A complete website for an administrative services business in New Hampshire.",
      "result": "Services, business details, and a clear way to get in touch.",
      "shot": "/shots/remote-admin.png"
    }
  },
  {
    "id": "platforms",
    "index": "02",
    "title": "CRM & platform setup",
    "tagline": "Get your software organized around how your business actually runs.",
    "kinds": [
      "CRM setup",
      "Fields & workflows",
      "Platform cleanup"
    ],
    "pain": "You have a platform, but the records, settings, and workflow are not set up the way you need them.",
    "outcome": "A clearer setup with useful fields, views, and a walkthrough of how to use it.",
    "example": {
      "client": "Twenty CRM extension",
      "built": "An extension for Twenty CRM with recurring service plans, a dispatch board, and a shared inbox.",
      "result": "A general-purpose CRM adapted to a specific business workflow.",
      "visual": "database"
    }
  },
  {
    "id": "migration",
    "index": "03",
    "title": "Data migration & cleanup",
    "tagline": "Move your information into a new system and make it easier to use.",
    "kinds": [
      "Exports & imports",
      "Field mapping",
      "Record cleanup"
    ],
    "pain": "You want to switch platforms, but your customer and job information is still in the old system or scattered across files.",
    "outcome": "An agreed set of records cleaned, mapped, and imported, with checks before the handover.",
    "example": {
      "client": "Jobber data migration",
      "built": "Exported Jobber data and moved records into other systems for The Maine Cleaning Company.",
      "result": "Practical experience with the move from one platform to another.",
      "visual": "cleanup"
    }
  },
  {
    "id": "automation",
    "index": "04",
    "title": "Integrations & automations",
    "tagline": "Connect your tools and cut down on entering the same information twice.",
    "kinds": [
      "API connections",
      "Calendar sync",
      "Workflow automation"
    ],
    "pain": "You are copying details between systems or updating a schedule by hand whenever something changes.",
    "outcome": "A connection built around what your platforms support and checked against the workflow you need.",
    "example": {
      "client": "Vacation rental booking sync",
      "built": "Rental bookings automatically appear on our cleaning schedule for turnover planning.",
      "result": "One less booking to enter by hand.",
      "shot": "/shots/brightbase-crew-schedule.png"
    }
  },
  {
    "id": "apps",
    "index": "05",
    "title": "Custom CRMs & business tools",
    "tagline": "Build the dashboard, portal, or small app you cannot find off the shelf.",
    "kinds": [
      "Custom CRMs",
      "Dashboards & reporting",
      "Client & team portals"
    ],
    "pain": "The tools you have do not quite fit, and important work still lives in spreadsheets and messages.",
    "outcome": "A focused tool built around your process, with the features and handover agreed before work starts.",
    "example": {
      "client": "BrightBase",
      "built": "A custom dashboard for jobs, customer records, revenue, occupancy, and crew information.",
      "result": "Daily operations brought into one view."
    }
  }
];

// Estimates for a single, agreed piece of work; final quotes follow review.
export const smallProjects = [
  { title: "Website updates & forms", price: "$250–$500", scope: "One page improvement, quote form, or booking feature on an existing site.", offer: "website" },
  { title: "CRM & platform setup", price: "$300–$750", scope: "A focused setup or cleanup: fields, views, settings, and one workflow.", offer: "platform" },
  { title: "Data migration", price: "$400–$900", scope: "One export and import, with agreed record types, field mapping, and checks.", offer: "migration" },
  { title: "One integration", price: "$300–$750", scope: "One supported connection, such as a booking feed or form-to-CRM workflow.", offer: "integration" },
] as const;

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
  /**
   * What the preview card's browser chrome should read, when the real host is
   * not the one to show (site survey O-03). Leave undefined and the card shows
   * the host from `url` — never set this to a domain that isn't actually
   * serving the site, or the chrome starts lying about where the link goes.
   */
  displayDomain?: string;
  /** True if the site allows embedding (show a live iframe preview, not a shot). */
  live?: boolean;
  /** Screenshot for static/private cards. Live sites render via iframe, so they can omit it. */
  shot?: string; // /shots/*.png
  /** What this system displaced — the case for it, in one line. */
  replaced?: string;
  /** Production status, e.g. "In daily production since 2025". */
  status?: string;
  /** Set for outside-client work so it gets a distinct accent. */
  client?: boolean;
  /** A single REAL outcome number (e.g. "0 double-bookings since launch"). Never fabricate—leave undefined until Meg confirms. */
  metric?: string;
  /**
   * Slug of the `caseStudies` entry that expands this card. Set it and the
   * card links INWARD to the case study; the external "visit live site" link
   * then lives on that page, not on the card. One card, one destination.
   */
  caseStudy?: string;
  /** An internal page that tells this item's full story (e.g. "/brightbase"). */
  page?: string;
};

/*
  Stack — what the software is actually built with.

  The site named no technology anywhere. For someone buying a website that is
  fine; for someone commissioning software they will own and maintain, it is
  the first thing they look for, and its absence reads as evasive.

  Every entry below is in real use across mlinx.studio and BrightBase. Do not
  add a technology here to look complete — this list is a promise about what a
  client inherits, and it is the easiest thing on the site to be caught out on.
*/
export type StackColumn = { heading: string; items: string[] };

export const stackColumns: StackColumn[] = [
  {
    heading: "Front end",
    items: ["TypeScript", "React", "Next.js (App Router)", "Tailwind"],
  },
  {
    heading: "Back end",
    items: ["Python · FastAPI", "Node", "REST + typed clients", "Background jobs"],
  },
  {
    heading: "Data & auth",
    items: ["Postgres", "Supabase", "Row-level security", "Role-based access"],
  },
  {
    heading: "Ship & run",
    items: ["Vercel · Railway", "GitHub + CI", "Anthropic API", "Twilio"],
  },
];

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
    caseStudy: "maine-cleaning-co",
    blurb: "Marketing + booking site, wired straight into the back-office system that runs the company.",
    stack: ["React", "Node", "Python · FastAPI", "Postgres", "Twilio", "Stripe"],
    url: "https://maineclean.co",
    live: true,
    shot: "/shots/maineclean.png",
  },
  {
    tier: "site",
    tag: "Guest experience · our own rental",
    title: "The Keystone House",
    blurb: "A digital welcome book for our Maine short-term rental — check-in, WiFi, the house guide, and local picks, all on one link guests actually open.",
    stack: ["Next.js", "Vercel"],
    url: "https://keystonestay.maineclean.co",
    live: true,
  },
  {
    tier: "site",
    tag: "Client work",
    title: "The Remote Admin",
    caseStudy: "the-remote-admin",
    blurb: "Full marketing site for a Southern-NH admin-services business, designed, built, and shipped end to end.",
    stack: ["Next.js", "Vercel"],
    url: "https://the-remote-admin.com",
    live: true,
    shot: "/shots/remote-admin.png",
    client: true,
  },
  {
    tier: "site",
    tag: "Website project · construction",
    title: "Nash Construction",
    blurb: "A construction company website with service pages, a project portfolio, and a consultation form.",
    stack: ["Next.js", "Vercel"],
    url: "https://nash-alpha.vercel.app/",
    shot: "/shots/nash.jpg",
  },
  // Tier 2 — product we built
  {
    tier: "product",
    tag: "Product · designed & built by M Studio",
    title: "linx",
    caseStudy: "linx",
    blurb: "A cleaning marketplace for Southern Maine: hosts post a turnover, vetted local cleaners bid, and you pay when the job is done.",
    stack: ["Python", "Stripe Connect", "Railway"],
    // Replaced the Autopilot demo (Oct 2026), whose page carried invented
    // stats, testimonials and contact details. linx is a real, launched
    // product. Swap `url` for a custom domain once one is attached.
    url: "https://linx-production-6edf.up.railway.app",
    shot: "/shots/linx.png",
  },
  // Tier 3 — private internal/client systems (no links)
  {
    tier: "private",
    tag: "Product · in daily use",
    title: "BrightBase",
    blurb: "The operations app I built for my cleaning company: leads, quotes, scheduling, a crew app, invoicing and payouts.",
    stack: ["FastAPI", "Postgres", "React", "Railway"],
    replaced: "12 overlapping tools, now one system",
    status: "In daily production since 2026",
    // A real capture of the app on demo data (a fictional company), see lib/brightbase.ts.
    shot: "/shots/brightbase/home-dark.webp",
    page: "/brightbase",
  },
  {
    tier: "private",
    tag: "Private system",
    title: "Turnover scheduling",
    blurb: "Vacation rental bookings automatically appear on the cleaning schedule, keeping turnover dates and assignments in one place.",
    stack: ["FastAPI", "Postgres", "iCal sync", "Google Calendar"],
    replaced: "A shared Google Calendar and text threads",
    status: "In daily production",
    shot: "/shots/brightbase-crew-schedule.png",
  },
  {
    tier: "private",
    tag: "Private system",
    title: "Instant Estimate",
    blurb: "Reads requests, drafts a quote, and queues a reply for approval.",
    stack: ["Next.js", "Anthropic API", "Postgres"],
    replaced: "~20 min of manual quoting per lead",
    status: "Production, approval-gated",
    shot: "/shots/instant-estimate.png",
  },
];

/*
  Case studies — the deep version of a Work card, at /work/[slug].

  The site could say it builds things but never showed one project all the
  way through, which is the single biggest gap between "looks capable" and
  "has done this". A Work card now links here, and the external "visit live
  site" link moved onto this page: one card, one destination, and the deeper
  page is the better first click.

  Two blocks are deliberately EMPTY and render NOTHING while empty, exactly
  as `testimonial` above does: `results` and `quote`. There is not one
  confirmed client outcome number on this site — `WorkItem.metric` is unset
  on all seven items, and `provingGround` is explicitly The Maine Cleaning
  Co's own operating history, not client KPIs. A case study is the easiest
  place in the world to get caught inventing a number, so these stay empty
  until Meg confirms real words. The page is complete without them.

  `problem` is the same: empty until she writes it in her own voice.

  Everything non-empty below is lifted from copy already shipping in this
  file, not newly written claims. Note the absence of `as const` — it would
  narrow "" and [] to literal types and make every `{x && ...}` gate dead
  code, which is why `testimonial` is annotated rather than asserted too.
*/

/** A real capture in /public/shots. There are no video assets in the repo. */
export type CaseStudyShot = {
  src: string;
  /** What the screen actually shows, for someone who cannot see it. */
  alt: string;
};

/**
 * One "What I built" bullet. Drives the pinned scroll sequence: each bullet
 * swaps the pinned screen. `shot` is optional — a bullet with no capture yet
 * reads as text, and the sequence falls back to a plain stack.
 */
export type CaseStudyBuild = {
  label: string;
  body: string;
  shot?: CaseStudyShot;
};

/** One tile in the Result block. REAL, CONFIRMED numbers only. */
export type CaseStudyResult = {
  value: string;
  label: string;
  /** Whose number it is, when that isn't self-evident. Mirrors `provingGround.label`. */
  attribution?: string;
};

/** A node in the "How it works" chain. Same shape WorkflowDemo takes. */
export type CaseStudyFlowNode = { icon: string; label: string };

/**
 * A measured Lighthouse run against the live site. REAL RUNS ONLY — generated
 * by `npm run measure`, never typed by hand. `when` and `tool` render next to
 * the scores so a reader can see how old they are and reproduce them, which
 * is the entire reason they are worth showing.
 */
export type CaseStudyMeasured = {
  url: string;
  /** ISO date of the run. */
  when: string;
  /** e.g. "Lighthouse 12.8.2 · mobile". */
  tool: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

/** One phase of how the work actually ran. */
export type CaseStudyPhase = { phase: string; body: string };

export type CaseStudy = {
  /** URL segment, and the key a Work card points at. */
  slug: string;
  /** Matches the `WorkItem.title` it expands on. */
  title: string;
  /** Eyebrow — same vocabulary as `WorkItem.tag`. */
  tag: string;
  /** One line. No numbers unless they are real. */
  outcome: string;
  /** Live URL. The external link moved off the Work card and onto this page. */
  url?: string;
  hero: CaseStudyShot;
  /** 2-3 sentences in Meg's words. "" until she writes it; the block is skipped. */
  problem: string;
  built: CaseStudyBuild[];
  /** What connects to what, left to right. [] renders no diagram. */
  flow: CaseStudyFlowNode[];
  /** Reuse strings from `stackColumns` or the card's own `stack`. */
  stack: string[];
  /** REAL numbers only. [] until Meg confirms — the block renders nothing. */
  results: CaseStudyResult[];
  /** Owner's words. Renders nothing while `quote` is "". */
  quote: { quote: string; name: string; business: string };
  /**
   * What Meg owned on this project, in one line. A hiring manager reads this
   * before anything else: it is the difference between "a site exists" and
   * "this person took it from request to launch".
   */
  role: string;
  /** How the work ran, in order. [] renders nothing. */
  process: CaseStudyPhase[];
  /*
    What this thing IS, in schema.org's vocabulary, for the CreativeWork node
    on the case study page. "WebSite" for a site, "WebApplication" for
    something a user logs into and operates. Keep it accurate: claiming an
    app where there is a brochure site is the structured-data version of
    inventing a number.
  */
  schemaKind: "WebSite" | "WebApplication";
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "maine-cleaning-co",
    title: "The Maine Cleaning Co.",
    tag: "Website + system · our own company",
    outcome: "Customers can get an estimate and book online.",
    url: "https://maineclean.co",
    hero: {
      src: "/shots/maineclean.png",
      alt: "The maineclean.co home page: a cleaning company site with instant estimate and online booking.",
    },
    // Drafted from Meg's own cover-letter wording and approved by her (Oct 2026).
    // Public-safe on purpose: no revenue, spend, client or staff details.
    problem:
      "Running the cleaning company, I was paying for a dozen tools that didn't talk to each other: one for quotes and invoices, another for the crew schedule and time clock, others for the phone, booking and automation. Every handoff between them was done by hand. I mapped how a job actually moves from request to paid, and built one system around it.",
    built: [
      {
        label: "Marketing and booking site",
        body: "Marketing and booking site, wired straight into the back-office system that runs the company.",
        shot: {
          src: "/shots/maineclean.png",
          alt: "The public site, with the quote request and booking flow.",
        },
      },
      {
        label: "Instant estimate",
        body: "Reads requests, drafts a quote, and queues a reply for approval.",
        shot: {
          src: "/shots/instant-estimate.png",
          alt: "The instant estimate screen, showing a drafted quote awaiting approval.",
        },
      },
      {
        label: "Crew workspace",
        body: "A phone workspace for the crew, separate from the office: today's work, cleaning tips, availability, time off, paperwork and what each person is owed.",
        shot: {
          src: "/shots/brightbase-crew-tools.png",
          alt: "The crew's Today screen with a cleaning tip, and the Me screen with availability, time off, paperwork and payouts. Names are blurred.",
        },
      },
      {
        label: "Turnover scheduling",
        body: "Vacation rental bookings automatically appear on the cleaning schedule, keeping turnover dates and assignments in one place.",
        shot: {
          src: "/shots/brightbase-crew-schedule.png",
          alt: "The crew's phone view: an open turnover to request, and the month schedule. Addresses and pay are blurred.",
        },
      },
    ],
    flow: [
      { icon: "🌐", label: "Site" },
      { icon: "🗂️", label: "Back office" },
      { icon: "📅", label: "Schedule" },
      { icon: "💬", label: "Customer" },
    ],
    stack: ["React", "Node", "Python · FastAPI", "Postgres", "Twilio", "Stripe"],
    // Confirmed Oct 2026: 12 paid tools covered (bank records), 4,028 tests
    // counted in the BrightBase repo. Business financials stay off the site.
    results: [
      { value: "12 → 1", label: "overlapping tools for jobs, CRM, phone and booking, now one system" },
      { value: "4,000+", label: "automated checks run before any change goes live" },
      { value: "Daily", label: "in use by the office and field crews since 2026" },
    ],
    quote: { quote: "", name: "", business: "" }, // TODO(Meg)
    role: "Design and build, end to end: the public site, the back office behind it, and the integrations between them.",
    schemaKind: "WebSite",
    process: [
      { phase: "Discovery", body: "Ran the cleaning company day to day, so the requirements came from doing the work rather than from a brief." },
      { phase: "Requirements", body: "Mapped every step from request to paid, documented where each tool fell short, and wrote the requirements and acceptance criteria before building." },
      { phase: "Design", body: "Interface and flows for two audiences at once: customers requesting a quote, and crew working the schedule." },
      { phase: "Build", body: "Built the public site and the back office as one system, so a quote someone requests on the website becomes a scheduled, invoiced job without anybody retyping it." },
      { phase: "Phased rollout", body: "Shipped in small, tested steps while the old tools kept running. The crew app went out in five phases, each in use before the next began." },
      { phase: "Launch and iterate", body: "Shipped, then kept changing it against real use. In daily production since 2026." },
    ],
  },
  {
    slug: "linx",
    title: "linx",
    tag: "Product · designed & built by M Studio",
    outcome:
      "Hosts post a turnover, vetted local cleaners bid, and you pay when the job is done.",
    url: "https://linx-production-6edf.up.railway.app",
    hero: {
      src: "/shots/linx.png",
      alt: "The linx marketplace: a cleaning marketplace for Southern Maine.",
    },
    problem: "", // TODO(Meg)
    built: [
      {
        label: "Post a turnover",
        body: "A host posts a turnover and vetted local cleaners bid on it.",
        // TODO(Meg) — capture needed. Reads as text until then.
      },
      {
        label: "Payment through Stripe",
        body: "Nobody pays up front. The money is held until the cleaner marks the job complete, which is the part both sides need to trust.",
      },
    ],
    flow: [
      { icon: "🏠", label: "Host posts" },
      { icon: "🧹", label: "Cleaners bid" },
      { icon: "✅", label: "Job done" },
      { icon: "💳", label: "Stripe releases" },
    ],
    stack: ["Python", "Stripe Connect", "Railway"],
    results: [], // TODO(Meg)
    quote: { quote: "", name: "", business: "" }, // TODO(Meg)
    role: "Product design and build: the marketplace, the bidding flow, and the Stripe Connect payout path.",
    schemaKind: "WebApplication",
    process: [
      { phase: "Discovery", body: "The turnover problem came out of scheduling cleaners for short-term rentals week after week." },
      { phase: "Design", body: "Two sides of a marketplace: hosts posting work, cleaners bidding on it, each needing a different view of the same job." },
      { phase: "Build", body: "Built both sides and the payment path between them, so a host can hand a key to somebody they have not met and still know the money is safe." },
    ],
  },
  {
    slug: "the-remote-admin",
    title: "The Remote Admin",
    tag: "Client work",
    outcome:
      "Full marketing site for a Southern-NH admin-services business, designed, built, and shipped end to end.",
    url: "https://the-remote-admin.com",
    hero: {
      src: "/shots/remote-admin.png",
      alt: "The the-remote-admin.com home page: a marketing site for an admin-services business.",
    },
    problem: "", // TODO(Meg)
    built: [
      {
        label: "Designed, built and shipped",
        body: "Full marketing site for a Southern-NH admin-services business, designed, built, and shipped end to end.",
        shot: {
          src: "/shots/remote-admin.png",
          alt: "The Remote Admin home page.",
        },
      },
    ],
    flow: [], // No integration story here; the section is skipped.
    stack: ["Next.js", "Vercel"],
    results: [], // TODO(Meg)
    // An outside client, so any quote here needs their sign-off as well as hers.
    quote: { quote: "", name: "", business: "" }, // TODO(Meg)
    role: "Sole designer and developer: discovery, design, build, launch and handover for an outside client.",
    schemaKind: "WebSite",
    process: [
      { phase: "Discovery", body: "" },
      { phase: "Design", body: "" },
      { phase: "Build", body: "Next.js on Vercel." },
      { phase: "Launch", body: "" },
    ],
  },
];

/*
  Marketplace — premade tools and starter sites a visitor can buy or embed.
  Models:
    • "template"  — a starter site/app you buy once and own (done-for-you setup).
    • "embed"     — a hosted widget you drop into an existing site (small monthly).
    • "open"      — free / open-source starter, kept as a lead-in.
  Pricing here is indicative; CTAs route to contact rather than live checkout.

  ORDER MATTERS. The array is the funnel, cheapest and most plug-and-play
  first: free tools, then the $99 welcome book, then the hosted embeds, then
  the builds you own outright. /marketplace renders it in this order and
  pulls the welcome book out into its own band above the grid, so a visitor
  meets the thing they can buy today before the thing that needs a scope
  call. Add a new item at the rung its price and setup effort put it on,
  not at the end.
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
  /**
   * A live URL to embed as the preview instead of a static shot — an
   * always-current, interactive-looking thumbnail. Only use for sites that
   * allow framing. Takes precedence over `shot`.
   */
  liveUrl?: string;
  /**
   * A drawn diagram to use as the preview where no real capture exists.
   * Deliberately not a screenshot: it reads as a diagram, so it cannot be
   * mistaken for a product shot of something that was never built.
   */
  illustration?: "flow";
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
    id: "welcome-book",
    name: "Digital Welcome Book",
    model: "template",
    category: "Guest experience",
    tagline: "The printed check-in binder, reborn as one link guests actually open: house guide, WiFi and local picks for your short-term rental.",
    includes: [
      "Check-in steps, WiFi & the full house manual",
      "Local food, beaches & things-to-do picks",
      "House rules + a checkout checklist",
      "Your own link & QR code, yours to own",
    ],
    price: "$99 intro · reg. $149",
    liveUrl: "https://keystonestay.maineclean.co",
    /*
      No `featured` flag: /marketplace now gives the welcome book its own
      band above the grid, so the highlighted-card treatment would be a
      second, competing emphasis on the same product.
    */
  },
  {
    id: "calc-kit",
    name: "M Linx Tools",
    model: "open",
    category: "Tool",
    tagline: "The free calculators on this site. Use them, or take the source.",
    includes: [
      "Quote, rate & signature tools",
      "Free to use, right now",
      "Source available on request, calculators only",
      "A friendly way to say hello",
    ],
    price: "Free",
    // A real capture of this site's own /tools page, calculator and all.
    shot: "/shots/tools.png",
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
      "One line of code to install. I set it up, you go live",
    ],
    price: "$150 setup + $15/mo",
    shot: "/shots/instant-estimate.png",
  },
  {
    id: "automation-pack",
    name: "M Linx Flows",
    model: "embed",
    category: "Automation",
    illustration: "flow",
    tagline: "Pre-built booking-to-follow-up flows, configured to your stack.",
    includes: [
      "Confirmation + reminder flows",
      "Review-request follow-ups",
      "Lead-to-CRM sync",
      "Tuned to your tools",
    ],
    price: "from $150 setup + $19/mo",
  },
  {
    id: "service-site",
    name: "M Linx Site",
    model: "template",
    category: "Website",
    tagline: "A fast, custom marketing site for trades and service companies, yours to own.",
    includes: [
      "Custom design + copy structure",
      "Instant-quote + contact forms wired up",
      "Hosting, domain & analytics set up",
      "You own the code outright",
    ],
    price: "from $299 one-time",
    shot: "/shots/maineclean.png",
    featured: true,
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
      "Hosted for you, or run it on your own server",
      "Room to grow into",
    ],
    price: "from $1,000 one-time",
    /*
      A real capture of BrightBase's owner dashboard running on demo data (a
      fictional company with made-up figures), so no customer or business
      numbers are exposed. Same screen the office uses daily.
    */
    shot: "/shots/brightbase/owner-dashboard.webp",
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
    // The turnover scheduler running in daily production: the owner calendar
    // and the confirm step this card sells. Same capture the Work section
    // uses for "Turnover scheduling"; the address and pay are redacted in it.
    shot: "/shots/brightbase-crew-schedule.png",
  },
];

/*
  Digital Welcome Book — content for the dedicated /welcome-book landing page.
  Kept here so the campaign copy is a one-file edit. `introPrice` is the
  founding price for the first few; bump the page over to `regularPrice` by
  editing here once the founding run is done. `demoUrl` is the real, live
  example (Meg's own Maine rental) — it embeds and links straight from the page.
*/
export const welcomeBook = {
  introPrice: 99,
  regularPrice: 149,
  demoUrl: "https://keystonestay.maineclean.co",
  demoName: "The Keystone House",
  hero: {
    kicker: "Digital Welcome Book",
    headline: "The welcome binder your guests actually open.",
    sub: "One link — check-in steps, WiFi, the house manual, and your own local picks — on the phone that's already in their hand. Built for you, yours to keep.",
  },
  // What the host gets — written around the questions hosts answer every week.
  includes: [
    "Check-in steps, door code & parking — the questions you answer every single week",
    "WiFi, thermostat, grill, laundry — your whole house manual in one tap",
    "Local food, beaches & things to do — your recommendations, not a generic list",
    "House rules + a checkout checklist guests can't skim past",
    "A printable QR code for the door or the fridge",
    "Your own link, yours to keep — no monthly app fee",
  ],
  steps: [
    {
      n: "01",
      title: "Share the details",
      body: "Share your listing and the basics — check-in, WiFi, rules, your favorite local spots. A short form is all it takes to get started.",
    },
    {
      n: "02",
      title: "Your book takes shape",
      body: "You get a custom welcome book matched to your place, usually within a few days. One round of tweaks is included, so it reads exactly how you'd say it.",
    },
    {
      n: "03",
      title: "Share the link",
      body: "Drop it into your Airbnb or VRBO message and print the QR for the door. Fewer “how do I…” texts, smoother stays, better reviews.",
    },
  ],
  faqs: [
    {
      q: "Do I need any tech skills?",
      a: "None. Share the information and receive a finished book, a link, and a printable QR code. That's the whole job on your end.",
    },
    {
      q: "Does it work for VRBO, Booking.com, or direct bookings?",
      a: "Yes. It's just a link, so it works with any platform — or with none, for direct guests.",
    },
    {
      q: "Can I update it later?",
      a: "Yes. Small changes are quick. If you'd rather have seasonal updates handled for you, that can be a simple ongoing plan.",
    },
    {
      q: "What does it cost?",
      a: "$99 for the first few books at the founding price, then $149. One-time — no monthly app fee, and the book is yours.",
    },
    {
      q: "How long does it take?",
      a: "Usually just a few days from when you send your details.",
    },
    {
      q: "Do you only work with Maine rentals?",
      a: "No — anywhere. The Keystone House in Maine is one example, but the welcome book works for any short-term rental.",
    },
  ],
} as const;

