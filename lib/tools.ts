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

/*
  `takeaway` — how a visitor walks away with the result.

  **Meg asked that people "easily obtain" what the site gives them, and
  this page was answering that only after a click.** Every one of these
  nine produces something portable: a PDF, a .vcf, a PNG, a line on the
  clipboard, a .txt, an email to yourself. That is the whole argument for
  the free tools, and it was buried in the buttons *inside* each tool, so
  it was discoverable rather than visible.

  Each string is read off what the tool actually renders, never guessed:
  `SaveResult` (quote, invoice, sitecheck, cost) is copy, .txt download
  and email; `SignatureMaker` copies to the clipboard; `VCard` writes a
  .vcf; `QRCode` writes a .png; `UTMBuilder` copies the link;
  `InvoiceMaker` also prints to PDF. A takeaway that promised a download
  a tool does not do would be invented proof with a file extension on it.

  It is here rather than in the page because it is a fact about the tool,
  and `blurb` is shorter now for the same reason: the sentence used to
  carry the output as well, and saying it twice on one card is the
  opposite of what was asked for.
*/
export const TOOLS: {
  id: Tool;
  label: string;
  blurb: string;
  takeaway: string;
  group: Group;
  nudge: { line: string; cta: string; href: string };
}[] = [
  {
    id: "quote",
    label: "Instant quote",
    blurb: "Service and size into a live price range for a customer.",
    takeaway: "Copy, download or email it",
    group: "Win & bill",
    nudge: { line: "Tuned to your own pricing? That's the marketplace.", cta: "M Linx Quote", href: "/catalog" },
  },
  {
    id: "invoice",
    label: "Invoice maker",
    blurb: "Line items and totals, as an invoice or a proposal.",
    takeaway: "Print to PDF, or email it",
    group: "Win & bill",
    nudge: { line: "Want invoices that send and chase themselves? That's a custom build.", cta: "Say what you need", href: "/#contact" },
  },
  {
    id: "sig",
    label: "Email signature",
    blurb: "Your details, styled for Gmail or Outlook.",
    takeaway: "Copy it, paste it, done",
    group: "Brand & share",
    nudge: { line: "Want the whole brand looking this sharp? That's a custom build.", cta: "Start a conversation", href: "/#contact" },
  },
  {
    id: "vcard",
    label: "Digital card",
    blurb: "A contact card, with a scan-to-save code.",
    takeaway: "Download the .vcf",
    group: "Brand & share",
    nudge: { line: "Want a real site behind that card? That's the marketplace.", cta: "M Linx Site", href: "/catalog" },
  },
  {
    id: "qr",
    label: "QR code",
    blurb: "Any link, or the WiFi, as a real QR code.",
    takeaway: "Download the PNG",
    group: "Brand & share",
    nudge: { line: "Want that code pointed at a page built to convert? That's the marketplace.", cta: "M Linx Site", href: "/catalog" },
  },
  {
    id: "utm",
    label: "Tracked link",
    blurb: "Campaign tags on a link, for emails, ads and bios.",
    takeaway: "Copy the link",
    group: "Brand & share",
    nudge: { line: "Want links tracked and reported automatically? That's the marketplace.", cta: "M Linx Flows", href: "/catalog" },
  },
  {
    id: "sitecheck",
    label: "Website check",
    blurb: "A real Lighthouse read on speed, SEO and accessibility.",
    takeaway: "Copy, download or email the report",
    group: "Site & ops",
    nudge: { line: "Want the fixes done, not just found?", cta: "Start a conversation", href: "/#contact" },
  },
  {
    id: "cost",
    label: "Cost of manual work",
    blurb: "Hours and people into what a year of it costs.",
    takeaway: "Copy, download or email it",
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
  /** As on `TOOLS` — what `TurnoverPlanner` actually renders. */
  takeaway: string;
}[] = [
  {
    key: "turnover",
    label: forRentals.extra.title,
    blurb: forRentals.extra.body,
    group: "Site & ops",
    href: forRentals.extra.href,
    takeaway: "Download or email the schedule",
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

