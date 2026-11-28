/*
  The free tools, as data.

  **This was inside `components/Playground.tsx`, which is a client
  component, and that made the count unusable anywhere else.** `StageTry`
  on the homepage is a server component; importing `TOOL_COUNT` across
  that boundary does not fail the build or the type check — it renders
  the string "function(){throw Error(\"Attempted to call TOOL_COUNT()
  from the server...\")}" as the card's title. Nothing caught it but
  looking at the page, which is the rule CLAUDE.md keeps restating.

  Separating them is also what the repo already says to do: the data and
  the drawing are different things, even when there is one reader.
*/
import { forRentals } from "@/lib/content";

export type Tool = "sitecheck" | "quote" | "invoice" | "sig" | "vcard" | "qr" | "utm" | "cost";
export type Group = "Win & bill" | "Brand & share" | "Site & ops";

/*
  The order the groups are read in, which is the order they are drawn in.

  **It lived in `components/Playground.tsx` as a second list of the same
  three strings.** `Group` is the type, this is the sequence, and a
  component holding the sequence is how a fourth group gets added to the
  union and silently never renders — the switcher filters by group, so a
  group nobody listed has no column and its tools disappear from the page
  while every type check passes.
*/
export const GROUPS: Group[] = ["Win & bill", "Brand & share", "Site & ops"];

export const TOOLS: {
  id: Tool;
  label: string;
  blurb: string;
  group: Group;
  nudge: { line: string; cta: string; href: string };
}[] = [
  {
    id: "quote",
    label: "Instant quote",
    blurb: "Service + size → a live price range you can send a customer.",
    group: "Win & bill",
    nudge: { line: "Tuned to your pricing? That's the marketplace.", cta: "M Linx Quote", href: "/catalog" },
  },
  {
    id: "invoice",
    label: "Invoice maker",
    blurb: "Build an invoice or proposal → print to a clean PDF in one click.",
    group: "Win & bill",
    nudge: { line: "Want invoices that send and track themselves? That's a custom build.", cta: "Say what you need", href: "/#contact" },
  },
  {
    id: "sig",
    label: "Email signature",
    blurb: "Fill in your details → a styled signature, ready to paste into Gmail or Outlook.",
    group: "Brand & share",
    nudge: { line: "Want your whole brand looking this sharp? That's a custom build.", cta: "Start a conversation", href: "/#contact" },
  },
  {
    id: "vcard",
    label: "Digital card",
    blurb: "Your details → a .vcf and a scan-to-save QR for cards, emails & signatures.",
    group: "Brand & share",
    nudge: { line: "Want a real site behind that card? That's the marketplace.", cta: "M Linx Site", href: "/catalog" },
  },
  {
    id: "qr",
    label: "QR code",
    blurb: "Any link, or your WiFi, into a real QR code to download & print.",
    group: "Brand & share",
    nudge: { line: "Want that QR pointed at a page built to convert? That's the marketplace.", cta: "M Linx Site", href: "/catalog" },
  },
  {
    id: "utm",
    label: "Tracked link",
    blurb: "Add campaign tags to any link → a tracked URL for emails, ads & bios.",
    group: "Brand & share",
    nudge: { line: "Want links tracked and reported automatically? That's the marketplace.", cta: "M Linx Flows", href: "/catalog" },
  },
  {
    id: "sitecheck",
    label: "Website check",
    blurb: "Paste any URL → a real Lighthouse speed, SEO & accessibility report.",
    group: "Site & ops",
    nudge: { line: "Want the fixes done, not just found?", cta: "Start a conversation", href: "/#contact" },
  },
  {
    id: "cost",
    label: "Cost of manual work",
    blurb: "Hours + people → the yearly cost, and how fast automation pays for itself.",
    group: "Site & ops",
    nudge: { line: "Want that time back? This is exactly what M Studio automates.", cta: "Start a conversation", href: "/#contact" },
  },
];

/*
  The free tools that are not on /tools.

  **The Turnover Planner is the ninth free tool and the tools page did not
  mention it**, because `TOOLS` above is the switcher's list and the
  switcher only knows how to render something in the page. So the one free
  tool with a route of its own, the one CLAUDE.md records Meg most wanting
  people sent to, was reachable from ⌘K, the catalog and the homepage and
  not from the page called Free tools.

  It is a separate list rather than a ninth entry in `TOOLS` on purpose:
  `Tool` is the switcher's state, every id in it has a component behind it,
  and widening that union for something that is a link would make the
  exhaustive render below silently incomplete.

  The copy is read from `forRentals.extra`, which is where the planner's
  title, price and sentence already live and where the homepage and
  /services read them. A second spelling of the same product in a second
  file is how it comes to be two slightly different products.
*/
export const OFFSITE_TOOLS: {
  key: string;
  label: string;
  blurb: string;
  group: Group;
  href: string;
  /** Said on the card, because this one leaves the page it is listed on. */
  note: string;
}[] = [
  {
    key: "turnover",
    label: forRentals.extra.title,
    blurb: forRentals.extra.body,
    group: "Site & ops",
    href: forRentals.extra.href,
    note: "Opens on its own page",
  },
];

/*
  How many free tools there are, read from the list rather than typed.

  `StageTry` says the number on the homepage, and a hand-written count is
  a claim about evidence that drifts the first time a tool is added — the
  rule CLAUDE.md sets for the project count under each service door.

  **Two counts, because they answer two questions.** `TOOL_COUNT` is how
  many run inside the switcher, which is what `lib/catalog.ts` is naming
  when it lists their deep links. `FREE_TOOL_COUNT` is how many free tools
  the site has, which is what a card pointing at /tools is claiming and
  what /tools itself shows. They differed by one the moment the planner
  was listed, and saying either number by hand is how they come to differ
  by more.
*/
export const TOOL_COUNT = TOOLS.length;
export const FREE_TOOL_COUNT = TOOLS.length + OFFSITE_TOOLS.length;

