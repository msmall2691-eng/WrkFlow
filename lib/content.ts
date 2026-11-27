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
  /* "shaped around the people using them" was one of eleven
     `<verb>ed around <your noun>` constructions on the site, and the main
     verb was the maker's. See `.claude/brand-voice-guidelines.md` §2.2, §7. */
  headlineFollow: "Websites and systems that fit how the work already happens.",
  paragraphs: [
    "M Studio came out of running a cleaning company. Every project starts with the tools you already pay for and the part of the week that keeps going wrong.",
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
  body: "Share what you use now and where you are getting stuck. A written scope comes back within a day.",
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

  Both of these were read off the live GitHub profile on Nov 27 2026 rather
  than guessed, which is the rule this block was written to enforce: a wrong
  profile link points a reader at somebody who is not her. The LinkedIn
  address is the one her own GitHub sidebar publishes.
*/
export const profiles: readonly string[] = [
  "https://github.com/msmall2691-eng",
  "https://www.linkedin.com/in/megan-small-75b806410",
];

/*
  The public GitHub profile, as evidence rather than as a link in a footer.

  **Meg's ask, Nov 27 2026: "Show GitHub as proof on the site."** It belongs
  on /about under `Stack`, which is the one place already talking to the
  reader who wants to know what this is built with and whether they could
  hire somebody else to maintain it. The stack list is a claim; this is the
  account where the claim can be checked.

  `shot` is captured by `npm run shots` like every other live capture, so it
  cannot quietly go stale the way a hand-taken screenshot of a page that
  changes weekly would. Nothing here is a number: the profile's own counts
  are whatever they are on the day somebody clicks, and copying one into this
  file would be a claim about evidence written by hand, which is the rule
  `ServiceRouter`'s project count already answers to.
*/
export const githubProof = {
  url: "https://github.com/msmall2691-eng",
  heading: "The code is public, and so is the history.",
  body: "The profile below is live. It lists the projects on this site, what each one involved, and the technologies behind them.",
  linkLabel: "Open the GitHub profile",
  shot: "/shots/github.webp",
  alt: "The GitHub profile for msmall2691-eng: a README headed Megan, Mainer, Web designer, Systems guru, with a Selected work table naming The Maine Cleaning Company, BrightBase, M Studio and The Remote Admin.",
} as const;

/** Appended to every free-tool takeaway (copied text, .txt download, emailed result). */
export const toolsStamp =
  "Made with the free tools at mlinx.studio. Get one tuned to your business.";


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
  /*
    The category id, not a free string. `work.category`, ServiceRouter's
    `/services#${id}` anchors and the ladder all key off these four values,
    so the relationship was already load-bearing and only enforced by them
    happening to agree. Typed, a renamed service fails the build instead of
    silently emptying a ladder column. Declared below; type aliases hoist.
  */
  id: ServiceCategory;
  index: string;
  title: string;
  /*
    The label for the places a full title will not fit.

    **It is a field here rather than a table beside the thing that needs
    it**, because this array is the single definition of what the studio
    sells, and a second list of names for the same four things is how one
    of them gets renamed and the other does not. Added for the reef map's
    pins, which sit on a picture about 600px wide with fixed-width mono
    labels: measured there, "Getting your tools to talk" ran off the left
    edge of the frame and "Websites that bring work in" came within a few
    pixels of the right. The pins used to read "THE LIGHT ABOVE" and "THE
    SHOALS", which fit and said nothing.
  */
  short: string;
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

/*
  Four categories, named for what somebody arrived wanting.

  **This was five, organised by discipline.** "CRM & platform setup", "Data
  migration & cleanup" and "Integrations & automations" are three things Meg
  does; to the person reading they are one complaint — my systems do not
  talk to each other and I keep typing the same thing twice. They are one
  category now, with the detail carried in `kinds`.

  **And the thing she sells hardest was not on the list at all.** Leads: the
  quote form, the instant estimate, the booking step. It is the category
  with the clearest buying intent, it has real work behind it already
  (Instant Estimate, the booking flow on The Maine Cleaning Co., half the
  free tools), and a visitor who came for it previously found nothing with
  that name on it.

  Order is deliberate: websites first because it is what most people arrive
  for and the cheapest thing to say yes to, leads second because it is the
  upsell from the first, then the two that need more trust to sell.
*/
export const services: Service[] = [
  {
    "id": "websites",
    "index": "01",
    "title": "Websites that bring work in",
    "short": "Websites",
    "tagline": "A site somebody can hire you from, not just read about you on.",
    "kinds": [
      "Business websites",
      "Booking & quote forms",
      "Rebuilds & improvements"
    ],
    "pain": "Your site is a few years old, slow on a phone, and the only thing it asks a visitor to do is read.",
    "outcome": "A visitor who would have called asks for a quote instead, at ten at night.",
    "example": {
      "client": "The Remote Admin",
      "built": "A complete website for an administrative services business in New Hampshire.",
      "result": "Services, business details, and a clear way to get in touch.",
      "shot": "/shots/remote-admin.webp"
    }
  },
  {
    "id": "leads",
    "index": "02",
    "title": "Turning visitors into booked work",
    "short": "Quotes & booking",
    "tagline": "The quote, the estimate and the booking step people actually finish.",
    "kinds": [
      "Instant quotes",
      "Online booking",
      "Lead capture & follow-up"
    ],
    "pain": "Inquiries arrive as voicemails and half-filled forms, and quoting each one by hand eats an evening.",
    "outcome": "A path from first click to a booked job, with the quoting mostly done before it reaches you.",
    "example": {
      "client": "Instant Estimate",
      "built": "Reads an incoming request, drafts a quote, and queues a reply for approval.",
      "result": "Around twenty minutes of manual quoting per lead, handled before a person sees it.",
      "shot": "/shots/instant-estimate.webp"
    }
  },
  {
    "id": "software",
    "index": "03",
    "title": "Custom software",
    "short": "Custom software",
    "tagline": "The app a business runs on, when nothing off the shelf fits it.",
    "kinds": [
      "Custom CRMs",
      "Dashboards & reporting",
      "Client & team portals"
    ],
    "pain": "The real work lives in a spreadsheet one person maintains and a group text nobody can search.",
    "outcome": "One place to look, instead of a spreadsheet, a group text and somebody's memory.",
    "example": {
      "client": "BrightBase",
      "built": "A custom dashboard for jobs, customer records, revenue, occupancy, and crew information.",
      "result": "Daily operations brought into one view."
    }
  },
  {
    "id": "integrations",
    "index": "04",
    "title": "Getting your tools to talk",
    "short": "Integrations",
    "tagline": "Connect what you already use, so nothing gets typed in twice.",
    "kinds": [
      "API connections",
      "Calendar & booking sync",
      "CRM setup & cleanup",
      "Data migration"
    ],
    "pain": "The same customer gets typed in twice, and the schedule is only right because somebody keeps fixing it.",
    "outcome": "You stop entering the same details twice, and the schedule keeps itself up to date.",
    "example": {
      "client": "Vacation rental booking sync",
      "built": "Rental bookings appear on the cleaning schedule automatically, for turnover planning.",
      "result": "One less booking to enter by hand.",
      "shot": "/shots/brightbase-crew-schedule.webp"
    }
  }
];

// Estimates for a single, agreed piece of work; final quotes follow review.
export const smallProjects = [
  { title: "Website updates & forms", price: "$250–$500", scope: "One page improvement, quote form, or booking feature on an existing site.", offer: "website" },
  { title: "CRM & platform setup", price: "$300–$750", scope: "Fields, views, settings and one workflow, on the platform you already pay for.", offer: "platform" },
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
    body: "It starts with how you actually run: where time goes, where data lives, what keeps breaking.",
  },
  {
    index: "02",
    title: "Design",
    body: "Data, flow and screens get mapped out first. Nothing is built until you sign off.",
  },
  {
    index: "03",
    title: "Build",
    body: "It comes together in small, working pieces you can poke at as they land. You steer throughout.",
  },
  {
    index: "04",
    title: "Iterate",
    body: "Then it is tuned against real use and handed over. Files, database, domain and keys go with it.",
  },
];

export type WorkTier = "site" | "product" | "private";

/**
 * Which of the four things on `services` this piece of work is evidence for.
 *
 * **Deliberately not `tier`.** They answer different questions: `tier` is
 * "can a visitor go and look at it", which is why BrightBase is `private`
 * and The Remote Admin is a `site`. `category` is "what does this prove I
 * can do for you", which is the question somebody browsing actually has.
 * Overloading one onto the other is how the work list ended up sorted by
 * whether Meg could share a URL, which is not a thing a buyer cares about.
 */
export type ServiceCategory = "websites" | "leads" | "software" | "integrations";

export type WorkItem = {
  tier: WorkTier;
  /** The service this is proof of. See `ServiceCategory`. */
  category: ServiceCategory;
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
  shot?: string; // /shots/*.webp
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
    tag: "Website + system · Meg's own company",
    category: "websites",
    title: "The Maine Cleaning Co.",
    caseStudy: "maine-cleaning-co",
    blurb: "Marketing + booking site, wired straight into the back-office system that runs the company.",
    stack: ["React", "Node", "Python · FastAPI", "Postgres", "Twilio", "Stripe"],
    url: "https://maineclean.co",
    live: true,
    shot: "/shots/maineclean.webp",
  },
  {
    tier: "site",
    tag: "Guest experience · Meg's own rental",
    category: "websites",
    title: "The Keystone House",
    blurb: "A digital welcome book for a Maine short-term rental: check-in, WiFi, the house guide, and local picks, all on one link guests actually open.",
    stack: ["Next.js", "Vercel"],
    url: "https://keystonestay.maineclean.co",
    /* Captured from the live site on Nov 20 2026, at the 2208x1380 every
       other shot here uses. It was the one work item with a destination
       and no capture, which the reel renders as a browser window with a
       URL in its chrome and nothing inside it. */
    shot: "/shots/keystone.webp",
    live: true,
  },
  {
    tier: "site",
    tag: "Client work",
    category: "websites",
    title: "The Remote Admin",
    caseStudy: "the-remote-admin",
    blurb: "Full marketing site for a Southern-NH admin-services business, from first sketch to launch.",
    stack: ["Next.js", "Vercel"],
    url: "https://the-remote-admin.com",
    live: true,
    shot: "/shots/remote-admin.webp",
    client: true,
  },
  {
    tier: "site",
    tag: "Website project · construction",
    category: "websites",
    title: "Nash Construction",
    blurb: "A construction company website with service pages, a project portfolio, and a consultation form.",
    stack: ["Next.js", "Vercel"],
    url: "https://nash-alpha.vercel.app/",
    shot: "/shots/nash.webp",
  },
  /*
    Arrowhead Explorers — the public site and the parent portal behind it.

    Filed under `software` rather than `websites`, which is the judgement
    `ServiceCategory` exists to make: `category` answers "what is this proof
    of", and the distinctive half here is not the marketing page, it is a
    multi-role app. "Client & team portals" is already one of the `kinds`
    listed under Custom software, and until now nothing on the site proved
    it.

    `tag` says whose it is, in the same shape as the other two personal
    builds ("our own company", "our own rental"). Meg built it herself
    rather than for a client, and the site distinguishes those everywhere
    else, so it says so here too.

    The capture is the public marketing page only. The portal is noindex,
    behind a family code, and its screens carry children's names, daily logs
    and photographs; none of that belongs in a public repository. The hero
    photograph of two children was cropped out of the capture for the same
    reason — it is on Meg's own childcare site with whatever permission she
    has for that, and reusing it on a portfolio is a separate decision that
    is hers rather than one to make by default.
  */
  {
    tier: "site",
    tag: "Website + parent portal · Meg's own project",
    category: "software",
    title: "Arrowhead Explorers",
    blurb:
      "A nature-based childcare site with a private parent portal: families sign in with a code to see their child's day, a door kiosk takes QR badge check-ins, and staff run attendance, daily logs and photos.",
    stack: ["Next.js", "Supabase", "Vercel"],
    url: "https://www.lacexplorers.online",
    shot: "/shots/arrowhead.webp",
  },
  // Tier 2 — product we built
  {
    tier: "product",
    tag: "Product · designed & built by M Studio",
    category: "software",
    title: "linx",
    caseStudy: "linx",
    blurb: "A cleaning marketplace for Southern Maine: hosts post a turnover, vetted local cleaners bid, and you pay when the job is done.",
    stack: ["Python", "Stripe Connect", "Railway"],
    // Replaced the Autopilot demo (Oct 2026), whose page carried invented
    // stats, testimonials and contact details. linx is a real, launched
    // product. Swap `url` for a custom domain once one is attached.
    url: "https://linx-production-6edf.up.railway.app",
    shot: "/shots/linx.webp",
  },
  // Tier 3 — private internal/client systems (no links)
  {
    tier: "private",
    tag: "Product · in daily use",
    category: "software",
    title: "BrightBase",
    /* Was "The operations app I built for my cleaning company", which is
       first person on the homepage and `/catalog` — the one rule CLAUDE.md
       grants an exception to only on /about. The eight-year figure is
       `provingGround`'s own, and the ladder entry already words it this way. */
    blurb: "The operations app behind an eight-year-old cleaning company: leads, quotes, scheduling, a crew app, invoicing and payouts.",
    stack: ["FastAPI", "Postgres", "React", "Railway"],
    replaced: "12 overlapping tools, now one system",
    status: "In use every day since 2026",
    // A real capture of the app on demo data (a fictional company), see lib/brightbase.ts.
    shot: "/shots/brightbase/home-dark.webp",
    page: "/brightbase",
  },
  {
    tier: "private",
    tag: "Private system",
    category: "integrations",
    title: "Turnover scheduling",
    blurb: "Vacation rental bookings automatically appear on the cleaning schedule, keeping turnover dates and assignments in one place.",
    stack: ["FastAPI", "Postgres", "iCal sync", "Google Calendar"],
    replaced: "A shared Google Calendar and text threads",
    status: "In use every day",
    shot: "/shots/brightbase-crew-schedule.webp",
  },
  {
    tier: "private",
    tag: "Private system",
    category: "leads",
    title: "Instant Estimate",
    blurb: "Reads requests, drafts a quote, and queues a reply for approval.",
    stack: ["Next.js", "Anthropic API", "Postgres"],
    replaced: "~20 min of manual quoting per lead",
    status: "In use, nothing sends unapproved",
    shot: "/shots/instant-estimate.webp",
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
export type CaseStudyFlowNode = { label: string };

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
    tag: "Website + system · Meg's own company",
    outcome: "Customers can get an estimate and book online.",
    url: "https://maineclean.co",
    hero: {
      src: "/shots/maineclean.webp",
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
          src: "/shots/maineclean.webp",
          alt: "The public site, with the quote request and booking flow.",
        },
      },
      {
        label: "Instant estimate",
        body: "Reads requests, drafts a quote, and queues a reply for approval.",
        shot: {
          src: "/shots/instant-estimate.webp",
          alt: "The instant estimate screen, showing a drafted quote awaiting approval.",
        },
      },
      {
        label: "Crew workspace",
        body: "A phone workspace for the crew, separate from the office: today's work, cleaning tips, availability, time off, paperwork and what each person is owed.",
        shot: {
          src: "/shots/brightbase-crew-tools.webp",
          alt: "The crew's Today screen with the day's turnover, pay and access notes, and the Me screen with availability, time off, paperwork and payouts.",
        },
      },
      {
        label: "Turnover scheduling",
        body: "Vacation rental bookings automatically appear on the cleaning schedule, keeping turnover dates and assignments in one place.",
        shot: {
          src: "/shots/brightbase-crew-schedule.webp",
          alt: "The crew's phone view: two open turnovers to request with their addresses and pay, and the month schedule.",
        },
      },
    ],
    flow: [
      { label: "Site" },
      { label: "Back office" },
      { label: "Schedule" },
      { label: "Customer" },
    ],
    stack: ["React", "Node", "Python · FastAPI", "Postgres", "Twilio", "Stripe"],
    // Confirmed Oct 2026: 12 paid tools covered (bank records), 4,028 tests
    // counted in the BrightBase repo. Business financials stay off the site.
    results: [
      { value: "12 → 1", label: "overlapping tools for jobs, CRM, phone and booking, now one system" },
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
      { phase: "Phased rollout", body: "Rolled out in small steps while the old tools kept running. The crew app went out in five stages, each one in use before the next began." },
      { phase: "Launch and iterate", body: "Launched, then kept improving it against real use. In use every day since 2026." },
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
      src: "/shots/linx.webp",
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
      { label: "Host posts" },
      { label: "Cleaners bid" },
      { label: "Job done" },
      { label: "Stripe releases" },
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
      "Full marketing site for a Southern-NH admin-services business, from first sketch to launch.",
    url: "https://the-remote-admin.com",
    hero: {
      src: "/shots/remote-admin.webp",
      alt: "The the-remote-admin.com home page: a marketing site for an admin-services business.",
    },
    problem: "", // TODO(Meg)
    built: [
      {
        label: "Designed, built and launched",
        body: "Full marketing site for a Southern-NH admin-services business, from first sketch to launch.",
        shot: {
          src: "/shots/remote-admin.webp",
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
  /**
   * What the card shows where a price goes.
   *
   * Nov 2026: the three build tiers read "Quoted to your scope" rather than
   * "from $299", "from $1,000" and "from $1,200". Meg is about to start
   * posting to find website work and did not want a visitor deciding she is
   * out of reach before asking. A "from" price is the worst of both: it
   * anchors high AND implies it will grow.
   *
   * The cheap end deliberately KEEPS its numbers, because those do the
   * opposite job: Free on the tools and $99 on the welcome book are the
   * proof that she is affordable. Do not strip those for consistency.
   */
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
    tagline: "The check-in binder your guests actually open: house guide, WiFi and local picks, on one link.",
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
      "No sign-up, nothing to install",
    ],
    price: "Free",
    // A real capture of this site's own /tools page, calculator and all.
    shot: "/shots/tools.webp",
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
      "One line of code to install, set up for you before it goes live",
    ],
    price: "$150 setup + $15/mo",
    shot: "/shots/instant-estimate.webp",
  },
  {
    id: "automation-pack",
    name: "M Linx Flows",
    model: "embed",
    category: "Automation",
    illustration: "flow",
    /* "configured to your stack" said nothing to a roofer: "stack" is
       developer vocabulary on a card aimed at somebody who is not one. */
    tagline: "Pre-built booking-to-follow-up flows, set up with the tools you already pay for.",
    includes: [
      "Confirmation + reminder flows",
      "Review-request follow-ups",
      "Lead-to-CRM sync",
      "Works with the tools you already have",
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
    price: "Quoted to your scope",
    shot: "/shots/maineclean.webp",
    featured: true,
  },
  {
    id: "dashboard-starter",
    name: "M Linx Dashboard",
    model: "template",
    category: "Dashboard",
    tagline: "The dashboard behind BrightBase, showing your jobs and revenue instead of a demo's.",
    includes: [
      "Live KPIs, jobs & revenue views",
      "Connected to your data sources",
      "Hosted for you, or run it on your own server",
      "Room to grow into",
    ],
    price: "Quoted to your scope",
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
    tagline: "Customers book a time that is actually open. You get the calendar and the confirmations.",
    includes: [
      "Online booking + availability",
      "Automated email/text confirmations",
      "Owner calendar + admin view",
      "Connects to your existing tools",
    ],
    price: "Quoted to your scope",
    // The turnover scheduler running in daily production: the owner calendar
    // and the confirm step this card sells. Same capture the Work section
    // uses for "Turnover scheduling"; the address and pay are redacted in it.
    shot: "/shots/brightbase-crew-schedule.webp",
  },
];

/*
  The three demos.

  **These lived in a local array inside `app/demo/page.tsx`**, which was fine
  while /demo was the only page that showed them and stopped being fine the
  moment the homepage needed them too. An audit of what a visitor can
  actually reach found the demos one hop behind /demo with no other path in,
  and the homepage never mentioning the most clickable proof on the site.

  Here instead, for the same reason `marketItems` and `smallProjects` own
  their own prices: two pages rendering the same three things from two
  arrays is how they drift.

  Deliberately NOT in `work[]`. Every business in them is invented, and
  `work` is the list of things real businesses are running — the homepage's
  whole argument rests on that distinction, and every demo page says it is a
  demo in its own first line.
*/
export type Demo = {
  href: string;
  kind: string;
  name: string;
  what: string;
  /** What the demo proves can be built, as opposed to what it looks like. */
  proves: string;
  /** The demo's own two colours, so a card can preview three different looks. */
  swatch: [string, string];
};

export const demos: Demo[] = [
  {
    href: "/demo/shop",
    kind: "Storefront",
    name: "Fathom & Fog",
    what: "A print shop. Browse, filter, pick a size that changes the price, fill a cart and reach a checkout.",
    proves:
      "Catalog, options that affect price, and cart arithmetic that still adds up at quantity two.",
    swatch: ["#fbf7f1", "#2f5d73"],
  },
  {
    href: "/demo/studio",
    kind: "Booking",
    name: "Blue Hour Bodywork",
    what: "A massage studio. Pick a treatment, a practitioner and a time, and hold it.",
    proves:
      "Real availability: different treatment lengths, two practitioners with different skills and shifts, appointments already on the books, and a cleanup gap between them. Book one and watch the neighboring times disappear.",
    swatch: ["#f3f6f5", "#2f6b63"],
  },
  {
    href: "/demo/directory",
    kind: "Directory",
    name: "Midcoast Growers",
    what: "A local food directory. Search, then narrow by what they grow, the day they are out, and the town.",
    proves:
      "Filters that combine rather than replace each other, a count that moves, and an empty result that names which filter to drop instead of showing a blank page.",
    swatch: ["#f6f7fa", "#2d4ed8"],
  },
];

/*
  The ladder — one spine for everything on sale.

  **The site described the same business three separate ways.** `services`
  sorts it by what is wrong (websites, leads, software, integrations),
  `marketItems` sorts it by how you buy (free, hosted, buy-and-own), and
  `smallProjects` is a third list of fixed-price jobs on a fourth page. Nine
  free tools and three demos sit on two more. So a visitor met "CRM &
  platform setup, $300-$750" on /services and "M Linx Dashboard, quoted to
  your scope" on /marketplace with nothing anywhere saying how the two
  relate, or which one they wanted.

  Meg's ask, in her words: structure it for the audience, and make things
  easier for customers to obtain.

  So there is one taxonomy now — the four `services`, which are already named
  for what somebody arrived wanting — and every sellable thing hangs off one
  of them at one of three rungs:

    try    free, works right now, no conversation
    buy    a real fixed price, a decision somebody can make today
    build  scoped and quoted, the conversation this page exists to start

  The three rungs are the answer to "easier to obtain": the cheapest way in
  is visible beside the expensive one, in the same column, so nobody has to
  guess whether there is a smaller version of what they need.

  **Prices have one author.** An item that already exists in `marketItems`
  or `smallProjects` carries only its id here, and the component resolves
  the title, price and copy from the source. Retyping them is how /services
  and /marketplace drifted apart in the first place, and a price that
  disagrees with itself across two pages is worse than no price at all.
  `title`/`price`/`body` are written inline only for things in neither list:
  the free tools, and the custom builds that are quoted by definition.
*/
export type LadderRung = "try" | "buy" | "build";

/** The `offer` keys on `smallProjects`, which are also `lib/offer.ts` keys. */
export type SmallProjectOffer = (typeof smallProjects)[number]["offer"];

export type LadderItem = {
  service: ServiceCategory;
  rung: LadderRung;
  /** Resolve from `marketItems` by id. Mutually exclusive with `project`. */
  market?: string;
  /** Resolve from `smallProjects` by its offer key. */
  project?: SmallProjectOffer;
  /** Written here ONLY when the item is in neither list. */
  title?: string;
  price?: string;
  body?: string;
  /** An internal page somebody can open right now. */
  href?: string;
  /** An `OFFERS` key, which opens the contact form with that sentence in it. */
  offer?: string;
};

export const ladder: LadderItem[] = [
  // ── Websites that bring work in ──────────────────────────────────────────
  {
    service: "websites",
    rung: "try",
    title: "Website check",
    price: "Free",
    body: "Paste any URL and get a real speed, SEO and accessibility report. Yours or a competitor's.",
    href: "/tools?tool=sitecheck",
  },
  /*
    The Digital Welcome Book was missing from this list entirely, which is a
    plain gap rather than a decision. It is the most tangible thing on the
    site: a real product, at a real price, with its own page and its own
    demo, and the only item anywhere carrying a number a visitor can act on
    without a conversation. It was reachable from `forRentals` and from
    /marketplace and from nowhere else, so the one list that answers "what
    can I get and what does it cost" left out the clearest answer it had.

    `href` sends somebody to the product's own page rather than to the
    marketplace index, which is the point of having one.
  */
  { service: "websites", rung: "buy", market: "welcome-book", href: "/welcome-book" },
  { service: "websites", rung: "buy", project: "website" },
  {
    service: "websites",
    rung: "build",
    title: "A website, start to launch",
    price: "Quoted to your scope",
    body: "Every page, from the first draft to the day it goes live. Yours to keep, code and all.",
    offer: "custom",
  },

  // ── Turning visitors into booked work ────────────────────────────────────
  {
    service: "leads",
    rung: "try",
    title: "Instant quote calculator",
    price: "Free",
    body: "Price a job by service and size, and see the range you would send a customer.",
    href: "/tools?tool=quote",
  },
  { service: "leads", rung: "buy", market: "quote-widget" },
  { service: "leads", rung: "buy", market: "automation-pack" },
  {
    service: "leads",
    rung: "build",
    title: "Quoting and booking, built in",
    price: "Quoted to your scope",
    body: "The whole path from first click to a booked job, wired into whatever you already run on.",
    offer: "custom",
  },

  // ── Custom software ──────────────────────────────────────────────────────
  {
    service: "software",
    rung: "try",
    title: "Three working demos",
    price: "Free",
    body: "A storefront, a booking app and a searchable directory. Real interfaces you can click, not pictures of them.",
    href: "/demo",
  },
  {
    service: "software",
    rung: "try",
    title: "Look inside BrightBase",
    price: "Free",
    body: "The operations app behind an eight-year-old cleaning company: jobs, quotes, scheduling, crew, invoicing.",
    href: "/brightbase",
  },
  {
    service: "software",
    rung: "build",
    title: "Dashboard, CRM or client portal",
    price: "Quoted to your scope",
    body: "The app your business runs on, when nothing off the shelf fits. Features and handover agreed before work starts.",
    offer: "custom",
  },

  // ── Getting your tools to talk ───────────────────────────────────────────
  {
    service: "integrations",
    rung: "try",
    title: "Turnover Planner",
    price: "Free",
    body: "Paste an Airbnb or Vrbo calendar and get the cleaning schedule it implies, same-day turnarounds flagged. Nothing is stored.",
    href: "/turnover",
  },
  {
    service: "integrations",
    rung: "try",
    title: "Cost of manual work",
    price: "Free",
    body: "Hours and people in, the yearly cost out, and how fast automating it pays for itself.",
    href: "/tools?tool=cost",
  },
  { service: "integrations", rung: "buy", project: "platform" },
  { service: "integrations", rung: "buy", project: "integration" },
  { service: "integrations", rung: "buy", project: "migration" },
  {
    service: "integrations",
    rung: "build",
    title: "Several systems, talking",
    price: "Quoted to your scope",
    body: "Jobber, HubSpot, a booking feed, a spreadsheet nobody wants to give up. All of them reading from the same information.",
    offer: "integration",
  },
];

/** What each rung promises, in the heading above it. */
export const ladderRungs: { id: LadderRung; label: string; note: string }[] = [
  { id: "try", label: "Try it now", note: "Free, works today, no conversation needed." },
  { id: "buy", label: "Buy a piece of it", note: "A real price for one agreed piece of work." },
  { id: "build", label: "Have it built", note: "Scoped and priced with you before anything starts." },
];

/*
  Short-term rentals — an audience, deliberately not a fifth service.

  Meg names this one first when asked what she wants to sell, and it is the
  only corner of the business where two finished things already exist that
  somebody can have today without talking to anybody: the welcome book and
  the turnover planner. A host arriving from an Airbnb group should not have
  to read four service categories to find the two things aimed at them.

  It is an audience band rather than a category because both items are
  already filed under a service above — the book is a website product, the
  planner is an integration — and the one rule the homepage rebuild rests on
  is that nothing appears twice without meaning to. Here the repetition is
  the point and is labelled as such: same items, sorted by who you are
  instead of by what is broken.
*/
export const forRentals = {
  heading: "Running a short-term rental?",
  body: "Two of these are finished and waiting. Neither needs a call, and one of them is free.",
  /** Resolved from `marketItems`, so the price has one author. */
  market: ["welcome-book"],
  /** The free planner, which is a page rather than a product. */
  extra: {
    title: "Turnover Planner",
    price: "Free",
    body: "Paste your booking calendar, get the cleaning schedule, with same-day turnarounds flagged.",
    href: "/turnover",
  },
} as const;

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
    sub: "One link with the check-in steps, the WiFi, the house manual and your own local picks, on the phone that's already in their hand. Built for you, yours to keep.",
  },
  // What the host gets — written around the questions hosts answer every week.
  includes: [
    "Check-in steps, door code and parking: the questions you answer every single week",
    "WiFi, thermostat, grill, laundry: your whole house manual in one tap",
    "Local food, beaches and things to do: your recommendations, not a generic list",
    "House rules + a checkout checklist guests can't skim past",
    "A printable QR code for the door or the fridge",
    "Your own link, yours to keep, with no monthly app fee",
  ],
  steps: [
    {
      n: "01",
      title: "Share the details",
      body: "Share your listing and the basics: check-in, WiFi, rules, your favorite local spots. A short form is all it takes to get started.",
    },
    {
      n: "02",
      title: "Your book takes shape",
      body: "You get a custom welcome book matched to your place, usually within a few days. One round of tweaks is included, so it reads exactly how you'd say it.",
    },
    {
      n: "03",
      title: "Share the link",
      body: "Drop it into your Airbnb or VRBO message and print the QR for the door. Fewer “how do I…” texts at nine at night.",
    },
  ],
  faqs: [
    {
      q: "Do I need any tech skills?",
      a: "None. Share the information and receive a finished book, a link, and a printable QR code. That's the whole job on your end.",
    },
    {
      q: "Does it work for VRBO, Booking.com, or direct bookings?",
      a: "Yes. It's just a link, so it works with any platform, or with none, for direct guests.",
    },
    {
      q: "Can I update it later?",
      a: "Yes. Small changes are quick. If you'd rather have seasonal updates handled for you, that can be a simple ongoing plan.",
    },
    {
      q: "What does it cost?",
      a: "$99 for the first few books at the founding price, then $149. One-time, with no monthly app fee, and the book is yours.",
    },
    {
      q: "How long does it take?",
      a: "Usually just a few days from when you send your details.",
    },
    {
      q: "Do you only work with Maine rentals?",
      a: "No, anywhere. The Keystone House in Maine is one example, but the welcome book works for any short-term rental.",
    },
  ],
} as const;

/*
  The approved homepage — "Cinematic" (Meg, Nov 25 2026), chosen from three
  options and ported in #156.

  **Why its copy is here and not in the components.** The design arrived as
  a standalone HTML mockup with every string typed into it, which is the
  right way to draw a page and the wrong way to ship one: the site already
  has one place where the four services, the nine projects, the four fixed
  prices and the four promises live, and a second copy of any of them is
  the drift this file exists to prevent. So the sections below read
  `services`, `work`, `caseStudies`, `smallProjects`, `studioStats` and
  `welcomeBook` directly, and what is left here is only the page's own
  furniture: the eyebrows, the headings and the link labels.

  Nothing countable was added. Every number the page shows — the prices,
  the two case-study results, the project count, the promises — resolves to
  a value that was already in this file and was already true.
*/
export const homeHero = {
  eyebrow: "For contractors, admin firms and service businesses",
  /* Already the studio's own sentence: it was the hero's supporting line
     before this design made it the headline. "No 'I' either" (CLAUDE.md):
     it describes the work and the reader, and names no maker. */
  headline: "Websites, web apps and custom tools for small businesses.",
  /*
    **Meg rejected the previous second sentence by name** ("I don't really
    like built around the one thing you want your visitor to do", Nov 26).
    The audit found why rather than guessing: its main verb was the maker's
    (*built*), so it described how the work was made instead of what the
    reader gets. See `.claude/brand-voice-guidelines.md` §2.2.

    Both halves of the replacement are claims this site already keeps, which
    is the other rule: the pricing band below shows the `smallProjects`
    bands, and "100% you own the code" is a `studioStats` promise. Nothing
    new is asserted here.
  */
  sub: "Real prices on the page, and you own what gets built.",
  /* The house location line, verbatim. */
  location: "Southern Maine · clients anywhere.",
  /*
    **Three doors, from the Linx Brand Plan (Nov 27 2026).** Its job-1
    brief says: "Homepage hero: replace the current call-to-action with
    three buttons: I'm a rental host -> /turnover, I run a service
    business -> /brightbase, I need a site or app -> /catalog."

    It is the same idea the plan opens with — "pick the front door by
    buyer" — and it answers the question Meg asked of the live site in
    her own words: "idk if im even in the right place". Two buttons that
    said what to *do* become three that say who you *are*.
  */
  doors: [
    { label: "I'm a rental host", href: "/turnover" },
    { label: "I run a service business", href: "/brightbase" },
    { label: "I need a site or app", href: "/catalog" },
  ],
  /* Still the top bar's button label — see StageTopBar. The hero no
     longer renders it. */
  primary: "Start a project",
  /* Unused since the doors replaced the hero's pair. Left rather than
     deleted: removing a content key is its own decision, and this one
     is the obvious label if a "see the work" door is ever wanted back. */
  secondary: "See the work",
} as const;

/** The eyebrow and heading over each band, in the order they render. */
export const homeBands = {
  services: {
    /*
      **Meg's own framing, Nov 26 2026, and the count is deliberately
      gone.** This read "Four things, named for what you came here
      wanting." She disliked it on her phone and, asked what she would
      say instead, reached for "common issues", so the section is framed
      as problems a visitor recognizes rather than as a menu.

      Two things fell out of that. "Let's take a look at common issues"
      was her first phrasing and "let's" is "let us", which the voice
      rule in CLAUDE.md rules out for the same reason as "we": a solo
      founder writing as a company. The question survives instead, which
      is also the one good half of the service router this page used to
      carry, whose own note records that the question was right and the
      answer under it was a table of contents.

      And the word "Four" went with it. It was typed here while nothing
      reads `services.length`, so a fifth service would have made this
      line quietly false. CLAUDE.md's rule about the router's project
      count applies exactly: a count is a claim about evidence, and one
      written by hand is one that drifts. The four rows below still say
      how many there are, by being four.
    */
    eyebrow: "Common issues",
    heading: "Most people arrive with one of these.",
  },
  work: {
    eyebrow: "Real screens, real businesses",
    heading: "Every picture below is a real business using it.",
    /*
      **The design's closing link read "All nine projects" and pointed at
      `/work`, which is not a page on this site** — `app/work` holds only
      the `[slug]` case studies, and nothing in the repo has ever linked
      to a `/work` index. A link to a 404 is worse than no link, and
      inventing a route is a decision rather than a port, so this points
      at `/catalog`, which is the site's own index of what has been built
      and what it costs, and says that instead of claiming a count the
      destination does not show. The nine projects are still argued on
      this page and in the three case studies.

      If Meg wants the index the design assumed, it is a page and this is
      the one line that changes.
    */
    all: "Everything built, with prices",
    allHref: "/catalog",
    caseStudy: "Read the case study",
  },
  approach: {
    /* `founderPhilosophy` carries the statement itself and `approachSteps`
       the note under it, so only the link label is new. */
    link: "How a project runs",
  },
  pricing: {
    eyebrow: "What it costs",
    heading: "Numbers, before you ask for them.",
    /* The sentence that has sat in a comment above `smallProjects` since
       those prices were written. It belongs on the page. */
    lede: "Estimates for a single, agreed piece of work. Final quotes follow review.",
    note: `Full websites, apps and custom tools are quoted to your scope. At the other end, the calculators on this site are free to use today, and the Digital Welcome Book for a short-term rental is $${welcomeBook.introPrice} intro, reg. $${welcomeBook.regularPrice}.`,
  },
  start: {
    eyebrow: "Start a project",
    /* `founderCta` carries the heading, the body and the button label. */
    note: "Nothing binding. Scoping is free.",
  },
} as const;

/** The top bar and the footer, which are navigation rather than copy. */
export const homeNav = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "/tools", label: "Free tools" },
] as const;

/*
  The inner pages' top bar. Six links, and the count is a decision rather
  than an oversight — it lived in `components/panel/PanelHeader.tsx` and
  moved here when `StageTopBar` became the second component rendering it,
  because two copies of a nav is how a link quietly disappears from one
  half of a site.

  PanelHeader's own note, kept because it is the record of why there are
  six: five links, ⌘K and one call to action was the brief ("Meg: keep it
  calm"), and Demos was the sixth, added once the three demos shipped,
  "because a showcase nothing links to is a showcase nobody opens". Demos
  sits next to Work because they are the same argument twice: Work is what
  she built for real clients, Demos is what somebody can click right now.
  Nov 15 2026: "Tools" became "Catalog", on Meg's ask that everything for
  sale be visible up front; /tools is still in ⌘K and the footer.

  **It is deliberately not `homeNav`.** That one is the approved
  homepage's four in-page anchors, which only resolve on the homepage.
  These are routes. Whether the two lists should become one is a question
  about what the site's nav is, not about what it looks like, so the pass
  that made the two bars identical left the link sets alone.
*/
export const siteNav = [
  { href: "/#work", label: "Work" },
  { href: "/demo", label: "Demos" },
  { href: "/brightbase", label: "BrightBase" },
  { href: "/services", label: "Services" },
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About" },
] as const;

/*
  The phone menu, which is a site map rather than a bar.

  **It exists because the header hid the whole site behind nothing.** Below
  860px the design's bar drops its links, so at 390 a visitor had a
  wordmark, a search affordance and one button: no way to reach /services
  or /tools from the header at all, on the width Meg's buyers actually
  use. The links were not missing, they were unreachable, which no build,
  test or Lighthouse run says a word about.

  It is longer than `siteNav` on purpose and that is not the seventh bar
  link Meg reserved for herself. A bar is a choice about what deserves the
  width; a menu somebody opened is a choice about what the site contains,
  so /tools — one click from the footer and from ⌘K, and not reachable
  from the bar — is in it. The order is the bar's, then the one the bar
  has no room for.

  **The Marketplace row came off this list on Nov 27 2026**, with the
  page it pointed at. Meg:
  "get rid of mlinxmaretet place i like the catalog better i think its
  just crazyyyy mix of hsit lol its so confusting". It was a second index
  of things /catalog already lists: every one of the seven `marketItems`
  is in `catalog[]`, six of them resolving their price from the same
  `marketItems` record through `marketPrice`, and the seventh,
  `calc-kit`, as "8 free business tools". Two indexes of one shelf, one
  of them wearing a product name over plainer ones.
*/
export const siteMenu = [
  ...siteNav,
  { href: "/tools", label: "Free tools" },
] as const;

export const homeFooterNav = [
  { href: "/services", label: "Services" },
  /* `/#work` rather than the mockup's `/work`, for the reason recorded on
     `homeBands.work.allHref`: there is no `/work` index on this site, and
     this is the href the site's own footer has always used. */
  { href: "/#work", label: "Work" },
  { href: "/tools", label: "Free tools" },
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

/*
  Which work the page shows, and that is an editorial choice rather than a
  derivable one — the design features one project in full and three beside
  it, out of nine.

  Named here rather than in the component for `MoreWork`'s reason: a list
  of titles buried in a layout file is the kind of thing that goes stale
  the week somebody renames a project. These are matched against
  `work[].title`, and a name that stops resolving would silently render one
  card fewer, so `e2e/smoke.spec.ts` asserts every one of them resolves.
*/
export const homeFeature = "The Maine Cleaning Co.";
export const homeCards = [
  "The Remote Admin",
  "Instant Estimate",
  "Turnover scheduling",
] as const;
