/*
  Demo store: Fathom & Fog, a fictional print shop.

  WHY A PRINT SHOP, specifically.

  Meg wanted a demo that shows she can build e-commerce. Every e-commerce
  demo needs product photography, and there is none to be had honestly: the
  studio owns no product photos, CLAUDE.md bans invented proof "anywhere,
  including demos and placeholders", and using somebody else's stock shots
  in a portfolio piece is the kind of thing that is fine until it isn't.

  A print shop dissolves the problem instead of working around it. The
  product IS the artwork, so the "product photo" is not a photo of a thing
  that does not exist, it is the thing itself, drawn here as SVG. Nothing on
  the page pretends to be a photograph of inventory nobody owns.

  RULES FOR EDITING THIS FILE

    · The brand is fictional and must stay obviously so. No address, no
      phone number, no email that resolves, no reviews, no "as seen in", no
      customer counts. The store demonstrates a storefront; it does not
      demonstrate a business with a history.
    · Prices here are product data in a shop demo, not a claim about what
      Meg charges. They exist so the cart has something to total.
    · If a real photograph is ever added, it has to be one the studio owns
      or licensed, and the note above stops being true.
*/

export type PrintArt = {
  /** Background wash, top to bottom. */
  sky: [string, string];
  /** Horizon band colour. */
  sea: string;
  /** Foreground silhouette colour. */
  land: string;
  /** Which scene to draw. */
  scene: "lighthouse" | "islands" | "harbor" | "pines" | "dunes" | "cove";
  /** Sun or moon disc, if the scene has one. */
  disc?: { x: number; y: number; r: number; fill: string };
};

export type Print = {
  id: string;
  name: string;
  /** What a buyer is actually choosing between. */
  category: "Coast" | "Forest" | "Harbor";
  /** Cents, so the cart never does float arithmetic on money. */
  priceCents: number;
  blurb: string;
  art: PrintArt;
};

/** Sizes change the price; the artwork is the same. */
export type PrintSize = { id: string; label: string; addCents: number };

export const SIZES: PrintSize[] = [
  { id: "sm", label: '8 × 10"', addCents: 0 },
  { id: "md", label: '16 × 20"', addCents: 1800 },
  { id: "lg", label: '24 × 36"', addCents: 4200 },
];

export const PRINTS: Print[] = [
  {
    id: "first-light",
    name: "First Light",
    category: "Coast",
    priceCents: 2800,
    blurb: "The hour before the harbor wakes up, when the water still holds the sky.",
    art: {
      sky: ["#f8c9a4", "#f4e4d2"],
      sea: "#2f5d73",
      land: "#1d2b35",
      scene: "lighthouse",
      disc: { x: 300, y: 196, r: 34, fill: "#ffd9a0" },
    },
  },
  {
    id: "outer-islands",
    name: "Outer Islands",
    category: "Coast",
    priceCents: 2800,
    blurb: "Three islands and a lot of weather, which is most of the view from here.",
    art: {
      sky: ["#cfe0e8", "#eef3f4"],
      sea: "#43707f",
      land: "#223640",
      scene: "islands",
    },
  },
  {
    id: "slack-tide",
    name: "Slack Tide",
    category: "Harbor",
    priceCents: 3200,
    blurb: "Moorings, masts, and the ten quiet minutes when the tide forgets which way it is going.",
    art: {
      sky: ["#e9d6c3", "#f6ece2"],
      sea: "#37607a",
      land: "#1b2a33",
      scene: "harbor",
      disc: { x: 150, y: 150, r: 26, fill: "#f3e2bd" },
    },
  },
  {
    id: "standing-pines",
    name: "Standing Pines",
    category: "Forest",
    priceCents: 2800,
    blurb: "The treeline doing what it has done for two hundred years, which is stand there.",
    art: {
      sky: ["#d9e4dc", "#f2f5f1"],
      sea: "#5b7a63",
      land: "#1f3026",
      scene: "pines",
    },
  },
  {
    id: "dune-grass",
    name: "Dune Grass",
    category: "Coast",
    priceCents: 2600,
    blurb: "Low light across the dunes, the week after everyone has gone home.",
    art: {
      sky: ["#f2dcc0", "#f9efe0"],
      sea: "#c9a97b",
      land: "#6b5436",
      scene: "dunes",
      disc: { x: 450, y: 210, r: 30, fill: "#ffcf96" },
    },
  },
  {
    id: "night-cove",
    name: "Night Cove",
    category: "Harbor",
    priceCents: 3200,
    blurb: "One light on across the water, which is enough to steer by.",
    art: {
      sky: ["#16263a", "#2c4256"],
      sea: "#0f1d2c",
      land: "#070d14",
      scene: "cove",
      disc: { x: 470, y: 120, r: 22, fill: "#e8edf2" },
    },
  },
];

export const CATEGORIES = ["All", "Coast", "Harbor", "Forest"] as const;
export type Category = (typeof CATEGORIES)[number];

export const money = (cents: number) =>
  `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;

export const shop = {
  name: "Fathom & Fog",
  tagline: "Hand-drawn prints of the Maine coast.",
  /*
    Shown in the demo banner. Deliberately blunt: a visitor should never be
    one glance away from thinking this is a real shop with real stock.
  */
  demoNote:
    "A demo store built by M Studio. Fathom & Fog is not a real company, the prints are drawn in code, and nothing here takes payment.",
};
