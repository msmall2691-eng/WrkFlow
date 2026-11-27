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
export type Tool = "sitecheck" | "quote" | "invoice" | "sig" | "vcard" | "qr" | "utm" | "cost";
export type Group = "Win & bill" | "Brand & share" | "Site & ops";

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
  How many free tools there are, read from the list rather than typed.

  `StageTry` says the number on the homepage, and a hand-written count is
  a claim about evidence that drifts the first time a tool is added — the
  rule CLAUDE.md sets for the project count under each service door.
*/
export const TOOL_COUNT = TOOLS.length;


/** How many free tools there are, read from the list rather than typed. */

