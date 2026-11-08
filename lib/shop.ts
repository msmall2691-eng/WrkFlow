/*
  M Linx Instant downloads — digital products a visitor buys and downloads
  on the spot, with no setup work from Meg afterwards.

  How a sale works (details in docs/SHOP.md):
    1. The Buy button asks /api/shop/checkout for a Stripe Checkout Session.
    2. Stripe takes the payment. With Managed Payments on, Stripe is the
       merchant of record and handles sales tax.
    3. Stripe sends the buyer to /shop/thanks?session_id=…, which checks with
       Stripe that the session is paid and for which product, then shows a
       download link that expires (signed, see lib/shopServer.ts).

  The files live in /private/downloads, which is never served as a static
  asset. Only /api/shop/download hands them out, and only with a valid link.

  A product shows a Buy button only when its Stripe price is configured
  (STRIPE_SECRET_KEY plus the product's priceEnv). Until then it shows
  "Coming soon" and points to the contact form, so nothing on the page
  can take money that has nowhere to go.
*/

export type ShopProduct = {
  id: string;
  name: string;
  /** What the buyer gets, e.g. "Excel / Google Sheets". */
  format: string;
  tagline: string;
  includes: string[];
  /**
   * Display price. Stripe's price is the real one at checkout; keep these in
   * step. TODO(Meg): confirm prices.
   */
  priceLabel: string;
  /** Env var holding the Stripe Price id (price_…) for this product. */
  priceEnv: string;
  /** File in /private/downloads and the name the buyer's browser saves. */
  file: string;
  contentType: string;
  /** Real capture of the product itself, in /public/shots/shop. */
  shot: string;
};

export const shopProducts: ShopProduct[] = [
  {
    id: "quote-calculator",
    name: "Cleaning Quote Calculator",
    format: "Excel · Google Sheets · LibreOffice",
    tagline:
      "Price a house clean in a minute: rooms, size, service type, add-ons, travel and recurring discounts, with estimated labor hours.",
    includes: [
      "A Rates tab for your own prices",
      "Standard, deep, move-out and turnover pricing",
      "Add-ons, travel fee and frequency discounts",
      "Estimated hours and your rate per labor hour",
    ],
    priceLabel: "$19",
    priceEnv: "STRIPE_PRICE_QUOTE_CALCULATOR",
    file: "Cleaning-Quote-Calculator.xlsx",
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    shot: "/shots/shop/quote-calculator.webp",
  },
  {
    id: "turnover-checklist",
    name: "Turnover Checklist & Onboarding Pack",
    format: "Printable PDF · 7 pages",
    tagline:
      "Room-by-room checklists for short-term rental turnovers, plus a simple way to train a new cleaner.",
    includes: [
      "Room-by-room turnover checklist",
      "Restock list and photo checklist",
      "Issue and damage report",
      "First-day training plan and sign-off sheet",
    ],
    priceLabel: "$15",
    priceEnv: "STRIPE_PRICE_TURNOVER_CHECKLIST",
    file: "Turnover-Checklist-and-Onboarding-Pack.pdf",
    contentType: "application/pdf",
    shot: "/shots/shop/turnover-checklist.webp",
  },
  {
    id: "welcome-book-template",
    name: "Guest Welcome Book Template",
    format: "Word / Google Docs",
    tagline:
      "Fill-in-the-blanks house guide for your rental: arrival, Wi-Fi, house rules, local picks, safety and checkout.",
    includes: [
      "Every section a guest asks about",
      "Clear placeholders to replace",
      "Save as PDF or print for the house",
      "Want it as a live link instead? See the Digital Welcome Book",
    ],
    priceLabel: "$12",
    priceEnv: "STRIPE_PRICE_WELCOME_BOOK_TEMPLATE",
    file: "Guest-Welcome-Book-Template.docx",
    contentType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    shot: "/shots/shop/welcome-book-template.webp",
  },
];

export function findShopProduct(id: string | null | undefined) {
  return shopProducts.find((p) => p.id === id);
}

/*
  Ideas list — private, never rendered. Anything that comes to mind goes here
  as one line. When one is ready, build the file, add it to shopProducts and
  create its price in Stripe.
*/
export type ShopIdeaStatus = "idea" | "building" | "for sale" | "dropped";

export const shopIdeas: {
  name: string;
  status: ShopIdeaStatus;
  priceGuess?: string;
  note?: string;
}[] = [
  { name: "Cleaning Quote Calculator", status: "for sale", priceGuess: "$19" },
  { name: "Turnover Checklist & Onboarding Pack", status: "for sale", priceGuess: "$15" },
  { name: "Guest Welcome Book Template", status: "for sale", priceGuess: "$12" },
  {
    name: "Airbnb/VRBO calendar to turnover sync (Google Sheets script)",
    status: "idea",
    note: "Lite version of the BrightBase iCal turnover feature.",
  },
  { name: "Small-business CRM template (Airtable or Notion)", status: "idea" },
  { name: "Power BI dashboard template for a service business", status: "idea" },
  { name: "Service-business website starter (Next.js)", status: "idea", note: "For other developers." },
];
