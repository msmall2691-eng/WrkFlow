import { marketItems, smallProjects } from "@/lib/content";
import type { OfferKey } from "@/lib/offer";

/*
  The catalog: everything somebody can use, buy or have built, on one page
  (Meg, Nov 15 2026).

  Her brief, in her words: "they really need to see all of this upfront so
  they can find what they are looking for." Second pass, also hers: cleaner,
  fewer colours, real images, no blank boxes, less scattered.

  So it is organised the way a buyer browses a store: by what they need
  (`categories`), with a real screen on every card. Status ("Ready to buy",
  "Built & running" …) is a quiet label on the card, not the organising
  principle; sorting by how real something is was the maker's view, not
  the buyer's.

  **The honesty rule, per card.** `status` says exactly how real it is:

    try        works on this site right now, free
    buy        a fixed price you can decide on today
    built      running for a real business already; yours is adapted and
               quoted. `proof` links to where it can be seen
    workbench  NOT built yet. Listed so people can say they want it. These
               render as a short text list with no image, never as a card

  **Every image is a real capture**: Meg's live sites, the site's own demos,
  or BrightBase running on its demo dataset (fictional names and addresses,
  see the notes in lib/content.ts). Never a mock-up. If a new item has no
  real screen, it does not get a stand-in; find a real one or leave it on
  the workbench list.

  **Prices have one author.** Anything already in `marketItems` or
  `smallProjects` takes its price from there, so this page cannot disagree
  with /marketplace or /services.

  `connects` lists only services this work is actually wired to in a
  shipped build.
*/

export type CatalogCategory =
  | "websites"
  | "booking"
  | "apps"
  | "rentals"
  | "connect"
  | "ai"
  | "tools";

export type CatalogStatus = "try" | "buy" | "built" | "workbench";

export type CatalogLink = { label: string; href: string; external?: boolean };

export type CatalogItem = {
  id: string;
  name: string;
  /** First entry is where the card lives on the "All" view. */
  categories: CatalogCategory[];
  status: CatalogStatus;
  /** What it does for the person reading, one or two short sentences. */
  outcome: string;
  price: string;
  primary?: CatalogLink;
  proof?: CatalogLink;
  offer: OfferKey;
  connects?: string[];
  /** A real capture. Required for everything except `workbench`. */
  image?: string;
  /** Portrait phone captures sit centred on a plain well instead of cropping. */
  fit?: "contain";
  chips?: CatalogLink[];
};

export const categories: {
  id: CatalogCategory;
  label: string;
  blurb: string;
  /** A real capture that stands for the category on the homepage doors. */
  image: string;
}[] = [
  { id: "websites", label: "Websites", blurb: "Sites that bring in work, built around one goal and yours to keep.", image: "/shots/catalog/live-maineclean.webp" },
  { id: "booking", label: "Quotes & booking", blurb: "From first click to a booked job, without the back-and-forth.", image: "/shots/catalog/live-book.webp" },
  { id: "apps", label: "Apps & portals", blurb: "The software a business runs on, for the office, the crew and the customer.", image: "/shots/brightbase/schedule.webp" },
  { id: "rentals", label: "Rental hosts", blurb: "Built by a team that cleans and hosts short-term rentals.", image: "/shots/catalog/welcome-book.webp" },
  { id: "connect", label: "Integrations & data", blurb: "Your tools talking to each other, and your data where it belongs.", image: "/shots/brightbase/turnovers.webp" },
  { id: "ai", label: "AI", blurb: "AI that drafts and waits for your OK. Nothing goes out on its own.", image: "/shots/catalog/live-estimate.webp" },
  { id: "tools", label: "Free tools", blurb: "Use them right now. No signup.", image: "/shots/catalog/tools-light.webp" },
];

/** How many finished items sit in a category, computed, never typed. */
export function categoryCount(id: CatalogCategory): number {
  return catalog.filter((i) => i.status !== "workbench" && i.categories.includes(id)).length;
}

export const statusLabels: Record<CatalogStatus, { label: string; note: string }> = {
  try: { label: "Free", note: "Works on this site today." },
  buy: { label: "Ready to buy", note: "A fixed price you can decide on today." },
  built: { label: "Built & running", note: "Running for a real business. Yours is adapted and quoted." },
  workbench: { label: "Coming", note: "Not built yet." },
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

const S = "/shots/catalog";
const BB = "/shots/brightbase";

export const catalog: CatalogItem[] = [
  // ── Websites ────────────────────────────────────────────────────────────
  {
    id: "service-site",
    name: "Website that brings in work",
    categories: ["websites"],
    status: "built",
    outcome: "Booking and instant quotes built in, fast on a phone, and the code is yours.",
    price: marketPrice("service-site"),
    proof: { label: "See the case study", href: "/work/maine-cleaning-co" },
    offer: "custom",
    image: `${S}/live-maineclean.webp`,
  },
  {
    id: "trades-site",
    name: "Contractor & trades website",
    categories: ["websites"],
    status: "built",
    outcome: "Services, a project portfolio and a consultation request, for builders and trades.",
    price: "Quoted to your scope",
    proof: { label: "View the live site", href: "https://www.nashconstructionnh.com", external: true },
    offer: "custom",
    image: `${S}/live-nash.webp`,
  },
  {
    id: "firm-site",
    name: "Professional services website",
    categories: ["websites"],
    status: "built",
    outcome: "A polished site for an admin, bookkeeping or consulting business that books calls.",
    price: "Quoted to your scope",
    proof: { label: "See the case study", href: "/work/the-remote-admin" },
    offer: "custom",
    image: `${S}/live-remote-admin.webp`,
  },
  {
    id: "brand-kit",
    name: "Brand & launch kit",
    categories: ["websites"],
    status: "built",
    outcome: "Name, logo and colors, the website, a printed welcome guide and a month of social posts.",
    price: "Quoted to your scope",
    proof: { label: "View the live site", href: "https://www.lacexplorers.online", external: true },
    offer: "custom",
    image: `${S}/live-arrowhead.webp`,
  },
  {
    id: "site-updates",
    name: "Website updates & care",
    categories: ["websites"],
    status: "buy",
    outcome: "A page fixed or a form added on the site you have, or hosting and edits handled monthly.",
    price: `${projectPrice("website")} · or $49/mo`,
    offer: "website",
    image: `${S}/live-maineclean-mobile.webp`,
    fit: "contain",
  },
  {
    id: "storefront",
    name: "Online store",
    categories: ["websites", "booking"],
    status: "try",
    outcome: "Products with options that change the price, a cart and checkout. Try the demo.",
    price: "Quoted to your scope",
    primary: { label: "Try the demo", href: "/demo/shop" },
    offer: "custom",
    image: `${S}/demo-shop.webp`,
  },

  // ── Quotes & booking ────────────────────────────────────────────────────
  {
    id: "quote-widget",
    name: "Instant quote on your site",
    categories: ["booking"],
    status: "buy",
    outcome: "Visitors price the job themselves and you get the lead by email.",
    price: marketPrice("quote-widget"),
    primary: { label: "Try it free", href: "/tools?tool=quote" },
    offer: "quote",
    image: `${S}/quote-tool.webp`,
  },
  {
    id: "booking",
    name: "Online booking",
    categories: ["booking"],
    status: "built",
    outcome: "Customers pick a service and a time that is actually open. You get the calendar.",
    price: marketPrice("booking-app"),
    primary: { label: "Try the demo", href: "/demo/studio" },
    proof: { label: "A live one", href: "https://www.maineclean.co/book", external: true },
    offer: "custom",
    image: `${S}/live-book.webp`,
  },
  {
    id: "online-quotes",
    name: "Quotes customers accept online",
    categories: ["booking", "apps"],
    status: "built",
    outcome: "A clean quote page they open on their phone, approve, and turn into a booked job.",
    price: "Quoted to your setup",
    proof: { label: "See it in BrightBase", href: "/brightbase" },
    offer: "custom",
    image: `${BB}/customer-quote.webp`,
    fit: "contain",
  },
  {
    id: "recurring",
    name: "Recurring service scheduling",
    categories: ["booking"],
    status: "built",
    outcome: "Weekly and biweekly visits that schedule themselves. Change one without breaking the rest.",
    price: "Quoted to your setup",
    proof: { label: "See it in BrightBase", href: "/brightbase" },
    offer: "custom",
    image: `${BB}/recurring.webp`,
  },
  {
    id: "flows",
    name: "Automatic follow-ups & reminders",
    categories: ["booking", "connect"],
    status: "buy",
    outcome: "Confirmations, reminders, quote follow-ups and review requests that send themselves.",
    price: marketPrice("automation-pack"),
    offer: "integration",
    connects: ["Twilio", "Email"],
    image: `${BB}/quote.webp`,
  },

  // ── Apps & portals ──────────────────────────────────────────────────────
  {
    id: "brightbase",
    name: "Operations app (BrightBase)",
    categories: ["apps"],
    status: "built",
    outcome: "Leads, quotes, scheduling, crew, invoicing and payouts in one system.",
    price: "Book a demo",
    primary: { label: "Look inside", href: "/brightbase" },
    offer: "brightbase",
    connects: ["Stripe", "Twilio", "Google Calendar"],
    image: `${BB}/schedule.webp`,
  },
  {
    id: "customer-portal",
    name: "Customer portal",
    categories: ["apps"],
    status: "built",
    outcome: "Customers see visits, confirm or reschedule, and pay invoices without calling you.",
    price: "Quoted to your setup",
    proof: { label: "See it in BrightBase", href: "/brightbase" },
    offer: "custom",
    image: `${BB}/customer-portal.webp`,
    fit: "contain",
  },
  {
    id: "crew-app",
    name: "Crew & staff mobile app",
    categories: ["apps"],
    status: "built",
    outcome: "Today's jobs, door codes, checklists and pay on the phone in their pocket.",
    price: "Quoted to your setup",
    proof: { label: "See it in BrightBase", href: "/brightbase" },
    offer: "custom",
    image: `${BB}/crew-my-day.webp`,
    fit: "contain",
  },
  {
    id: "invoicing",
    name: "Invoicing & online payments",
    categories: ["apps", "connect"],
    status: "built",
    outcome: "Invoices that send, get paid by card and show what is overdue at a glance.",
    price: "Quoted to your setup",
    proof: { label: "See it in BrightBase", href: "/brightbase" },
    offer: "custom",
    connects: ["Stripe"],
    image: `${BB}/invoicing.webp`,
  },
  {
    id: "dashboard",
    name: "Owner dashboard",
    categories: ["apps"],
    status: "built",
    outcome: "Jobs, revenue and the numbers you check every morning, on one screen.",
    price: marketPrice("dashboard-starter"),
    proof: { label: "See it in BrightBase", href: "/brightbase" },
    offer: "custom",
    image: `${BB}/owner-dashboard.webp`,
  },
  {
    id: "parent-portal",
    name: "Family portal with QR check-in",
    categories: ["apps"],
    status: "built",
    outcome: "Families sign in with a code, a door tablet takes check-ins, staff run logs and attendance.",
    price: "Quoted to your program",
    proof: { label: "Open the portal", href: "https://www.lacexplorers.online/portal", external: true },
    offer: "custom",
    image: `${S}/live-portal.webp`,
  },
  {
    id: "directory",
    name: "Searchable directory",
    categories: ["apps"],
    status: "try",
    outcome: "Members, vendors or listings with filters that combine. Try the demo.",
    price: "Quoted to your scope",
    primary: { label: "Try the demo", href: "/demo/directory" },
    offer: "custom",
    image: `${S}/demo-directory.webp`,
  },
  {
    id: "linx",
    name: "Job marketplace with payouts",
    categories: ["apps", "rentals"],
    status: "built",
    outcome: "Post a job, vetted pros bid, payment releases when it is done.",
    price: "Quoted to your scope",
    proof: { label: "Open linx", href: "https://linx-production-6edf.up.railway.app", external: true },
    offer: "custom",
    connects: ["Stripe Connect"],
    image: `${S}/live-linx.webp`,
  },

  // ── Rental hosts ────────────────────────────────────────────────────────
  {
    id: "welcome-book",
    name: "Digital Welcome Book",
    categories: ["rentals"],
    status: "buy",
    outcome: "Check-in, WiFi, house manual and local picks on one link and a QR code.",
    price: marketPrice("welcome-book"),
    primary: { label: "See what's in it", href: "/welcome-book" },
    proof: { label: "Open a live one", href: "https://keystonestay.maineclean.co", external: true },
    offer: "custom",
    image: `${S}/welcome-book.webp`,
  },
  {
    id: "turnover-planner",
    name: "Turnover Planner",
    categories: ["rentals", "tools"],
    status: "try",
    outcome: "Paste your Airbnb or Vrbo calendar and see every cleaning, same-day turns flagged.",
    price: "Free",
    primary: { label: "Use it now", href: "/turnover" },
    offer: "integration",
    image: `${S}/turnover.webp`,
  },
  {
    id: "turnover-sync",
    name: "Turnover Sync",
    categories: ["rentals", "connect"],
    status: "built",
    outcome: "New bookings land on your cleaner's schedule by themselves, with times and door codes.",
    price: "Quoted to your setup",
    proof: { label: "See it in BrightBase", href: "/brightbase" },
    offer: "integration",
    connects: ["Airbnb", "Vrbo", "Google Calendar"],
    image: `${BB}/turnovers.webp`,
  },

  // ── Integrations & data ─────────────────────────────────────────────────
  {
    id: "one-integration",
    name: "Connect two tools",
    categories: ["connect"],
    status: "buy",
    outcome: "A booking feed into your calendar, or a web form into your CRM. No more retyping.",
    price: projectPrice("integration"),
    offer: "integration",
    image: `${BB}/property.webp`,
  },
  {
    id: "migration",
    name: "Data migration",
    categories: ["connect"],
    status: "buy",
    outcome: "Customers out of a spreadsheet or old system and into the new one, mapped and checked.",
    price: projectPrice("migration"),
    offer: "migration",
    image: `${BB}/custom-fields.webp`,
  },
  {
    id: "crm-setup",
    name: "CRM setup & cleanup",
    categories: ["connect"],
    status: "buy",
    outcome: "The CRM you pay for, set up to match how you work, with leads landing in one place.",
    price: projectPrice("platform"),
    offer: "platform",
    image: `${BB}/requests.webp`,
  },

  // ── AI ──────────────────────────────────────────────────────────────────
  {
    id: "instant-estimate",
    name: "AI quote drafting",
    categories: ["ai", "booking"],
    status: "built",
    outcome: "Reads a request, drafts the quote and reply, and waits for your approval.",
    price: "Quoted to your setup",
    proof: { label: "See it in the work", href: "/#work" },
    offer: "custom",
    connects: ["Anthropic AI"],
    image: `${S}/live-estimate.webp`,
  },
  {
    id: "ai-setup",
    name: "AI, set up for your business",
    categories: ["ai"],
    status: "buy",
    outcome: "Find where AI saves you hours, then set it up so it drafts and you approve.",
    price: "Free first call",
    offer: "call",
    image: `${BB}/inbox.webp`,
  },

  // ── Free tools ──────────────────────────────────────────────────────────
  {
    id: "free-tools",
    name: "8 free business tools",
    categories: ["tools"],
    status: "try",
    outcome: "Quotes, invoices, signatures, QR codes, tracked links and a website check.",
    price: "Free",
    primary: { label: "Open the tools", href: "/tools" },
    offer: "custom",
    image: `${S}/tools-light.webp`,
    chips: (
      [
        ["quote", "Instant quote"],
        ["invoice", "Invoices"],
        ["sig", "Email signature"],
        ["vcard", "Digital card"],
        ["qr", "QR codes"],
        ["utm", "Tracked links"],
        ["sitecheck", "Website check"],
        ["cost", "Cost of manual work"],
      ] as const
    ).map(([tool, label]) => ({ label, href: `/tools?tool=${tool}` })),
  },

  // ── Coming next: not built, listed as text only ─────────────────────────
  {
    id: "guest-replies",
    name: "AI guest replies for rentals",
    categories: ["rentals", "ai"],
    status: "workbench",
    outcome: "Answers your guests' common questions from your house guide, with your OK first.",
    price: "",
    offer: "custom",
  },
  {
    id: "direct-booking",
    name: "Direct booking site for rentals",
    categories: ["rentals", "websites"],
    status: "workbench",
    outcome: "Repeat guests book you directly, alongside Airbnb and Vrbo.",
    price: "",
    offer: "custom",
  },
  {
    id: "meal-planner",
    name: "AI meal planner & grocery list",
    categories: ["ai"],
    status: "workbench",
    outcome: "A week of meals around your family's tastes and budget, turned into one shopping list.",
    price: "",
    offer: "custom",
  },
];

/* Legacy ?for= shelf links (homepage, earlier posts) map onto categories. */
export const legacyShelf: Record<string, CatalogCategory> = {
  rentals: "rentals",
  service: "booking",
  family: "apps",
  any: "connect",
};

/* The "Try it live" row: things that open and work right now. */
export const liveDemoIds = [
  "storefront",
  "booking",
  "directory",
  "turnover-planner",
  "welcome-book",
  "linx",
] as const;
