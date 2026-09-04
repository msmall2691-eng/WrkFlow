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
  /*
    This band answers "why is the software any good", not "what do we sell".
    Same ten years, same numbers, doing better work: it stops reading as an
    ops consultancy and starts reading as an engineer with an unfair
    advantage. Shown on the homepage (OperatorBand) and /about (FounderNote).
  */
  headline: "Why the software is any good.",
  headlineFollow: "Most developers have never had to run the business they're building for.",
  paragraphs: [
    "We did it for ten years first — so every pattern in your build has already been used at 6am with a crew waiting.",
  ],
} as const;

/** "What we build" — a quick, tag-only teaser up top; Services.tsx below has the deep dive. */
export const whatWeBuild = [
  "AI Workflows",
  "Custom Software",
  "Internal Tools",
  "Automation",
  "Dashboards",
  "Operations Systems",
] as const;

/*
  Founder bio — the proof: an operator's story, not a résumé. Leads with
  the problem-solving instinct, not the company name — the Maine Cleaning
  Company is mentioned once, in passing, as a footnote detail rather than
  the headline. Education is left out entirely per Meg's call. Kept to a
  single "I" — enough to read as a person, not a pitch. Signature lives
  here — this is the personal letter, not the belief statement.
*/
export const founderBio = {
  kicker: "The story behind it",
  heading: "Built by someone who ran one",
  paragraphs: [
    "Running a business exposed the real problem — not the work, but the disconnected systems behind it. I rebuilt those systems, and now I build them for other businesses.",
  ],
  detail:
    "Built while running internal systems for a service business that grew past 1,000 customers and 7,000+ service visits.",
  signature: "— Megan",
} as const;

/*
  Philosophy — the short manifesto that caps the narrative arc, right
  before the CTA. Kept deliberately small; this is a pull-quote, not
  another paragraph block.
*/
export const founderPhilosophy = {
  heading: "My Philosophy",
  lines: [
    "Good software disappears.",
    "Understand the business first. Technology comes second.",
  ],
} as const;

/** CTA that closes the founder section's arc before handing off to Services. */
export const founderCta = {
  headline: "Let's build something that actually fits.",
  body: "Replacing spreadsheets, connecting tools, or starting from scratch — let's talk.",
  buttonLabel: "Start a Project",
} as const;

/*
  Founding offer — the real, current state of the first-10-businesses deal.
  `spotsRemaining` is maintained BY HAND (decrement it as each founding spot
  sells). It is never computed or animated from fake activity — Pricing.tsx
  reads it as-is. When it hits 0, the Starter card auto-reverts to
  `fullPrice` and the founding banner stops rendering.
*/
export const foundingOffer = {
  totalSpots: 10,
  spotsRemaining: 8,
  price: 749,
  deposit: 375,
  balance: 374,
  fullPrice: 1200,
} as const;

/*
  The same deal for web apps. Kept separate from foundingOffer because the two
  ladders sell out independently — and because an app has to price above a
  website, or the page says an application costs less than a marketing site.
  `spotsRemaining` is maintained BY HAND here too; at 0 the card reverts to
  `fullPrice` and the founding line stops rendering.
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
  label: "Built from real business — The Maine Cleaning Co.",
  stats: [
    { value: "10 yrs", label: "building systems" },
    { value: "1,000+", label: "customers served" },
    { value: "7,000+", label: "service visits" },
    { value: "$1M+", label: "operations managed" },
  ],
} as const;

/*
  Client testimonial — renders under the Starter card in Pricing ONLY when
  `quote` is non-empty. Paste TJ's real words here when they land; never
  invent one. One specific sentence beats three vague ones.
*/
export const testimonial: { quote: string; name: string; business: string } = {
  quote: "",
  name: "",
  business: "",
};

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
  /*
    Three, not eight (brief A3). Eight equal-weight cards read as "I will do
    anything", which reads as a freelancer with an empty calendar rather than a
    studio with a specialty — and six of the eight argued against the headline
    once it started saying websites and web apps. Nothing was thrown away: the
    old cards 02–08 live on as the kinds chips under these three, and each of
    these keeps a real example that actually shipped.
  */
  {
    id: "websites",
    index: "01",
    title: "Websites",
    tagline: "A site that takes the booking, not just the phone number.",
    kinds: ["Marketing sites", "Booking & scheduling", "Instant quoting", "Intake forms", "Online payments"],
    pain:
      "Your site is a business card. Every enquiry still turns into a phone call, a text thread, and a quote you type by hand.",
    outcome:
      "Customers book and get priced on the site itself, and it lands in the system you already use.",
    example: {
      client: "The Maine Cleaning Co.",
      built:
        "Custom marketing site with instant online quoting and booking, wired to the back-office system.",
      result: "Quote-to-booking handled on the site itself—no phone tag.",
      shot: "/shots/maineclean.png",
    },
  },
  {
    id: "apps",
    index: "02",
    title: "Web apps & internal tools",
    tagline: "The thing your team opens every morning.",
    kinds: [
      "Operations dashboards",
      "Client portals",
      "Scheduling & dispatch",
      "Job tracking",
      "Custom CRM",
      "Moving off rented software",
    ],
    pain:
      "The real work lives in four spreadsheets, a shared calendar and a group chat, and only one person knows where anything is.",
    outcome:
      "One place, live, built around how you already work — and yours to keep, not rented by the month.",
    example: {
      client: "BrightBase",
      built:
        "An operations command center pulling jobs, revenue, occupancy, and crew into one live view—the same system that runs the company day to day.",
      result: "The whole operation visible at a glance, in real time.",
      shot: "/shots/brightbase-dashboard.png",
    },
  },
  {
    id: "automation",
    index: "03",
    title: "The automation inside them",
    tagline: "The busywork happens on its own. You still approve it.",
    kinds: [
      "Lead intake",
      "Follow-ups & reminders",
      "Invoicing sync",
      "AI drafting & triage",
      "Connecting tools you already pay for",
      "Cleaning up the data first",
    ],
    pain:
      "The same information gets re-typed into three places, and the follow-up only happens when somebody remembers.",
    outcome:
      "Routine work handled in the background and surfaced for a one-click yes — never sent behind your back.",
    example: {
      client: "Instant Estimate",
      built:
        "An AI intake layer that reads inbound requests, drafts a quote and a reply, and queues both for one-click owner approval.",
      result: "Same-day replies, drafted automatically, approved by a human.",
      shot: "/shots/instant-estimate.png",
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
    blurb: "Marketing + booking site, wired straight into the back-office system that runs the company.",
    stack: ["Next.js", "Supabase", "Vercel", "Twilio", "Stripe"],
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
    // O-03 closed: the domain is attached to the Autopilot project in Vercel
    // and serves, so the card's browser chrome now reads autopilot.mlinx.studio
    // instead of the auto-generated vercel.app slug. The chrome label is derived
    // from this URL, so there is nothing else to keep in sync.
    url: "https://autopilot.mlinx.studio",
    live: true,
    shot: "/shots/autopilot.png",
  },
  // Tier 3 — private internal/client systems (no links)
  {
    tier: "private",
    tag: "Private system",
    title: "BrightBase — Command Center",
    blurb: "Jobs, revenue, occupancy & crew in one live view.",
    stack: ["FastAPI", "Postgres", "React", "Railway"],
    replaced: "4 spreadsheets and a group chat",
    status: "In daily production since 2025",
    shot: "/shots/brightbase-dashboard.png",
  },
  {
    tier: "private",
    tag: "Private system",
    title: "Turnover scheduling",
    blurb: "Internal board for STR turnovers—who, where, and when, at a glance.",
    stack: ["FastAPI", "Postgres", "iCal sync", "Google Calendar"],
    replaced: "A shared Google Calendar and text threads",
    status: "In daily production",
    shot: "/shots/brightbase-turnovers.png",
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
  /**
   * A live URL to embed as the preview instead of a static shot — an
   * always-current, interactive-looking thumbnail. Only use for sites that
   * allow framing. Takes precedence over `shot`.
   */
  liveUrl?: string;
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
    tagline: "The printed check-in binder, reborn as one link guests actually open — house guide, WiFi, and local picks for your short-term rental.",
    includes: [
      "Check-in steps, WiFi & the full house manual",
      "Local food, beaches & things-to-do picks",
      "House rules + a checkout checklist",
      "Your own link & QR code — yours to own",
    ],
    price: "$99 intro · reg. $149",
    liveUrl: "https://keystonestay.maineclean.co",
    featured: true,
  },
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
    price: "from $299 one-time",
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
      title: "Send me the details",
      body: "Share your listing and the basics — check-in, WiFi, rules, your favorite local spots. A short form is all it takes; I'll pull the rest together.",
    },
    {
      n: "02",
      title: "I build your book",
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
      a: "None. You send the info, I build it, and you get a link plus a printable QR code. That's the whole job on your end.",
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
      a: "$99 for the first few (a founding price while I gather reviews), then $149. One-time — no monthly app fee, and the book is yours.",
    },
    {
      q: "How long does it take?",
      a: "Usually just a few days from when you send your details.",
    },
    {
      q: "Do you only work with Maine rentals?",
      a: "No — anywhere. The Keystone House is my own place here in Maine, but the welcome book works for any short-term rental.",
    },
  ],
} as const;
