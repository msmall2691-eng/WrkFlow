import { marketItems, smallProjects } from "@/lib/content";
import type { OfferKey } from "@/lib/offer";

/*
  The catalog: everything on the site somebody can use, buy or have built,
  in one browsable list (Meg, Nov 15 2026).

  Her brief, in her words: "they really need to see all of this upfront so
  they can find what they are looking for." The pieces already existed, but
  across six pages: free tools on /tools, demos on /demo, products on
  /marketplace, fixed-price jobs on /services, the rental things on the
  homepage, BrightBase on its own page. A visitor arriving from a Facebook
  post had to know which page to open before they could find the thing.

  This list does not replace any of them. It points at them, sorted by who
  the visitor is (`audience`) and what shape the thing comes in (`format`),
  which are the two questions a stranger actually asks.

  **The honesty rule, applied per card.** `status` says exactly how real a
  thing is, and the card prints it:

    try        works on this site right now, free
    buy        a fixed price you can decide on today
    built      running for a real business already; yours is adapted and
               quoted. `proof` links to where it can be seen
    workbench  NOT built yet. Listed so people can say they want it, and
               labelled that way on the card. Never give one of these a
               `proof` link or a screenshot

  **Prices have one author.** Anything that already lives in `marketItems`
  or `smallProjects` takes its price from there through `marketPrice()` and
  `projectPrice()`, so this page cannot disagree with /marketplace or
  /services. The same rule `ladder` follows in lib/content.ts.

  `connects` lists only services this work has actually been wired to in a
  shipped build (see the `stack` fields on `work`). Do not add a logo-name
  here because it is popular; add it when something real talks to it.
*/

export type CatalogAudience = "rentals" | "service" | "family" | "any";
export type CatalogFormat =
  | "tool"
  | "plugin"
  | "template"
  | "app"
  | "integration"
  | "ai"
  | "service";
export type CatalogStatus = "try" | "buy" | "built" | "workbench";

export type CatalogLink = { label: string; href: string; external?: boolean };

export type CatalogItem = {
  id: string;
  name: string;
  audience: CatalogAudience[];
  format: CatalogFormat;
  status: CatalogStatus;
  /** What it does for the person reading, in one or two sentences. */
  outcome: string;
  price: string;
  /** The main action: open the tool, the demo, or the product page. */
  primary?: CatalogLink;
  /** Where a real version can be seen. `built` items should have one. */
  proof?: CatalogLink;
  /** Which contact-form opener "Ask about this" uses. */
  offer: OfferKey;
  connects?: string[];
};

export const audienceLabels: Record<CatalogAudience, string> = {
  rentals: "Rental hosts",
  service: "Service businesses",
  family: "Childcare & family programs",
  any: "Any small business",
};

export const formatLabels: Record<CatalogFormat, string> = {
  tool: "Free tool",
  plugin: "Add to your site",
  template: "Buy & own",
  app: "Web app",
  integration: "Integration",
  ai: "AI assistant",
  service: "Done for you",
};

export const statusLabels: Record<CatalogStatus, { label: string; note: string }> = {
  try: { label: "Use it now", note: "Free, works on this site today." },
  buy: { label: "Ready to buy", note: "A fixed price you can decide on today." },
  built: {
    label: "Built & running",
    note: "Already running for a real business. Yours is adapted and quoted.",
  },
  workbench: {
    label: "On the workbench",
    note: "Not built yet. Say you want it and it moves up the list.",
  },
};

function marketPrice(id: string): string {
  const item = marketItems.find((m) => m.id === id);
  if (!item) throw new Error(`catalog: no marketItem "${id}"`);
  return item.price;
}

function projectPrice(offer: (typeof smallProjects)[number]["offer"]): string {
  const p = smallProjects.find((s) => s.offer === offer);
  if (!p) throw new Error(`catalog: no smallProject "${offer}"`);
  return p.price;
}

export const catalog: CatalogItem[] = [
  // ── Short-term rentals ──────────────────────────────────────────────────
  {
    id: "welcome-book",
    name: "Digital Welcome Book",
    audience: ["rentals"],
    format: "template",
    status: "buy",
    outcome:
      "Check-in steps, WiFi, the house manual and your local picks on one link and a QR code. Fewer 'how do I' messages from guests.",
    price: marketPrice("welcome-book"),
    primary: { label: "See what is in it", href: "/welcome-book" },
    proof: {
      label: "Open a live one",
      href: "https://keystonestay.maineclean.co",
      external: true,
    },
    offer: "custom",
  },
  {
    id: "turnover-planner",
    name: "Turnover Planner",
    audience: ["rentals"],
    format: "tool",
    status: "try",
    outcome:
      "Paste an Airbnb or Vrbo calendar link and get the cleaning schedule it implies, with same-day turnarounds flagged. Nothing is stored.",
    price: "Free",
    primary: { label: "Use it now", href: "/turnover" },
    offer: "integration",
    connects: ["Airbnb calendar", "Vrbo calendar"],
  },
  {
    id: "turnover-sync",
    name: "Turnover Sync",
    audience: ["rentals", "service"],
    format: "integration",
    status: "built",
    outcome:
      "New bookings land on the cleaning schedule by themselves, with checkout and check-in times attached, so nobody copies dates out of a calendar again.",
    price: "Quoted to your setup",
    proof: { label: "See it in BrightBase", href: "/brightbase" },
    offer: "integration",
    connects: ["Airbnb calendar", "Vrbo calendar", "Google Calendar"],
  },
  {
    id: "linx",
    name: "Cleaner marketplace",
    audience: ["rentals", "service"],
    format: "app",
    status: "built",
    outcome:
      "Hosts post a turnover, vetted local cleaners bid, and payment releases when the job is done. The pattern works for any job board with payouts.",
    price: "Quoted to your scope",
    proof: { label: "How linx was built", href: "/work/linx" },
    offer: "custom",
    connects: ["Stripe Connect"],
  },
  {
    id: "guest-replies",
    name: "AI guest replies",
    audience: ["rentals"],
    format: "ai",
    status: "workbench",
    outcome:
      "Drafts answers to the guest questions you get every week from your own house guide, and waits for your OK before anything is sent.",
    price: "Not priced yet",
    offer: "custom",
  },
  {
    id: "direct-booking",
    name: "Direct booking site",
    audience: ["rentals"],
    format: "template",
    status: "workbench",
    outcome:
      "Your own site where repeat guests book you directly, alongside your Airbnb and Vrbo listings rather than instead of them.",
    price: "Not priced yet",
    offer: "custom",
  },

  // ── Websites and getting booked ─────────────────────────────────────────
  {
    id: "service-site",
    name: "Business website",
    audience: ["service", "any"],
    format: "template",
    status: "built",
    outcome:
      "A fast site built around one goal, usually a quote or a booking, with the forms wired up and the code yours to keep.",
    price: marketPrice("service-site"),
    proof: { label: "See sites built", href: "/#work" },
    offer: "custom",
  },
  {
    id: "site-updates",
    name: "Website updates & forms",
    audience: ["service", "any"],
    format: "service",
    status: "buy",
    outcome:
      "One page improved, a quote form added or a booking feature put on the site you already have.",
    price: projectPrice("website"),
    offer: "website",
  },
  {
    id: "quote-widget",
    name: "M Linx Quote",
    audience: ["service"],
    format: "plugin",
    status: "buy",
    outcome:
      "The instant-quote calculator from this site, set to your prices and brand, on your own site. Leads are emailed to you on submit.",
    price: marketPrice("quote-widget"),
    primary: { label: "Try the free version", href: "/tools?tool=quote" },
    offer: "quote",
  },
  {
    id: "flows",
    name: "M Linx Flows",
    audience: ["service", "rentals"],
    format: "plugin",
    status: "buy",
    outcome:
      "Booking confirmations, reminders and review requests that send themselves, set up on the tools you already use.",
    price: marketPrice("automation-pack"),
    offer: "integration",
  },
  {
    id: "booking",
    name: "Online booking",
    audience: ["service", "family"],
    format: "app",
    status: "built",
    outcome:
      "Customers pick a service, a person and a time that is actually free. You get an owner calendar and confirmations.",
    price: marketPrice("booking-app"),
    primary: { label: "Try the demo", href: "/demo/studio" },
    proof: { label: "The production scheduler", href: "/brightbase" },
    offer: "custom",
  },
  {
    id: "storefront",
    name: "Online store",
    audience: ["service", "any"],
    format: "app",
    status: "try",
    outcome:
      "Browse, filter, pick options that change the price and check out. Built to your products rather than a theme you fight.",
    price: "Quoted to your scope",
    primary: { label: "Try the demo", href: "/demo/shop" },
    offer: "custom",
  },
  {
    id: "directory",
    name: "Searchable directory",
    audience: ["any"],
    format: "app",
    status: "try",
    outcome:
      "A members, vendors or listings directory where filters combine, the count updates and an empty search tells people what to change.",
    price: "Quoted to your scope",
    primary: { label: "Try the demo", href: "/demo/directory" },
    offer: "custom",
  },
  {
    id: "instant-estimate",
    name: "AI quote drafting",
    audience: ["service"],
    format: "ai",
    status: "built",
    outcome:
      "Reads an incoming request, drafts the quote and the reply, and queues both for you to approve. Nothing goes out on its own.",
    price: "Quoted to your setup",
    proof: { label: "See it in the work", href: "/#work" },
    offer: "custom",
    connects: ["Anthropic AI"],
  },

  // ── Apps a business runs on ─────────────────────────────────────────────
  {
    id: "brightbase",
    name: "Operations app (BrightBase)",
    audience: ["service"],
    format: "app",
    status: "built",
    outcome:
      "Leads, quotes, scheduling, a crew app, invoicing and payouts in one system, in place of the pile of apps most service companies juggle.",
    price: "Book a demo",
    primary: { label: "Look inside", href: "/brightbase" },
    offer: "brightbase",
    connects: ["Stripe", "Twilio", "Google Calendar"],
  },
  {
    id: "dashboard",
    name: "Owner dashboard",
    audience: ["service", "any"],
    format: "app",
    status: "built",
    outcome:
      "Jobs, revenue and the numbers you check every morning on one screen, pulled live from the tools you already pay for.",
    price: marketPrice("dashboard-starter"),
    proof: { label: "See the BrightBase dashboard", href: "/brightbase" },
    offer: "custom",
  },
  {
    id: "parent-portal",
    name: "Parent portal with QR check-in",
    audience: ["family"],
    format: "app",
    status: "built",
    outcome:
      "Families sign in to see their child's day, a door kiosk takes QR badge check-ins, and staff run attendance, daily logs and photos.",
    price: "Quoted to your program",
    proof: {
      label: "See the program site",
      href: "https://www.lacexplorers.online",
      external: true,
    },
    offer: "custom",
    connects: ["Supabase"],
  },

  // ── Getting your tools to talk ──────────────────────────────────────────
  {
    id: "one-integration",
    name: "One integration",
    audience: ["any"],
    format: "integration",
    status: "buy",
    outcome:
      "One connection between two tools, such as a booking feed into your calendar or a web form into your CRM. No more typing it twice.",
    price: projectPrice("integration"),
    offer: "integration",
  },
  {
    id: "migration",
    name: "Data migration",
    audience: ["any"],
    format: "service",
    status: "buy",
    outcome:
      "Your customers out of a spreadsheet or an old system and into the new one, with the fields mapped and the result checked.",
    price: projectPrice("migration"),
    offer: "migration",
  },
  {
    id: "crm-setup",
    name: "CRM & platform setup",
    audience: ["any"],
    format: "service",
    status: "buy",
    outcome:
      "The CRM you already pay for, set up properly: fields, views, settings and one workflow that matches how you work.",
    price: projectPrice("platform"),
    offer: "platform",
  },
  {
    id: "systems",
    name: "Several systems, talking",
    audience: ["any", "service"],
    format: "integration",
    status: "built",
    outcome:
      "Payments, texts, calendars and booking feeds connected around the workflow you actually have, with one place that holds the truth.",
    price: "Quoted to your scope",
    proof: { label: "See one job, start to finish", href: "/work/maine-cleaning-co" },
    offer: "integration",
    connects: ["Stripe", "Twilio", "Google Calendar", "Airbnb calendar"],
  },
  {
    id: "ai-setup",
    name: "AI, set up for your business",
    audience: ["any"],
    format: "service",
    status: "buy",
    outcome:
      "Help choosing where AI saves you time, then setting it up so it drafts and you approve. Starts with a free 15-minute call.",
    price: "Free first call",
    offer: "call",
  },

  // ── Free tools ──────────────────────────────────────────────────────────
  ...(
    [
      ["quote", "Instant quote", "Service and size in, a live price range you can send a customer.", ["service"]],
      ["invoice", "Invoice maker", "Build an invoice or proposal and print a clean PDF in one click.", ["service", "any"]],
      ["sig", "Email signature", "A styled signature ready to paste into Gmail or Outlook.", ["any"]],
      ["vcard", "Digital business card", "A contact card file plus a scan-to-save QR code.", ["any"]],
      ["qr", "QR code maker", "Any link, or your WiFi, as a QR code to download and print.", ["any", "rentals"]],
      ["utm", "Tracked link builder", "Campaign tags on any link, so you can see which post brought people in.", ["any"]],
      ["sitecheck", "Website check", "Paste any URL and get a real speed, SEO and accessibility report.", ["any"]],
      ["cost", "Cost of manual work", "Hours and people in, the yearly cost out, and how fast automating it pays back.", ["any"]],
    ] as const
  ).map(
    ([tool, name, outcome, audience]): CatalogItem => ({
      id: `tool-${tool}`,
      name,
      audience: [...audience],
      format: "tool",
      status: "try",
      outcome,
      price: "Free",
      primary: { label: "Use it now", href: `/tools?tool=${tool}` },
      offer: "custom",
    }),
  ),

  // ── Workbench: ideas, clearly labelled as not built ─────────────────────
  {
    id: "meal-planner",
    name: "AI meal planner & grocery list",
    audience: ["any"],
    format: "ai",
    status: "workbench",
    outcome:
      "Plans the week's meals around your family's tastes and budget, then turns them into one grocery list sorted by store aisle.",
    price: "Not priced yet",
    offer: "custom",
  },
];

/*
  Section order on the page. Things with a price come first, then proven
  builds, then the free tools. Free first buried every product under eleven
  free cards, which was the "I can't tell what's for sale" problem this page
  exists to fix.
*/
export const statusOrder: CatalogStatus[] = ["buy", "built", "try", "workbench"];

export const sectionHeadings: Record<CatalogStatus, string> = {
  buy: "Ready to buy",
  built: "Built and running, adapted for you",
  try: "Free to use right now",
  workbench: "On the workbench",
};
