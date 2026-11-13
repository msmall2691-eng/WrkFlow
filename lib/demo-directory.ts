/*
  Demo directory: Midcoast Growers, a fictional local food directory.

  WHY A DIRECTORY, specifically.

  /demo/shop is a catalog of six things with a cart. /demo/studio reasons
  about time. This one is the third shape a small-business site takes and
  the one neither of those shows: finding the right entry among many, by
  typing and by narrowing. "Find a grower near me", "find a contractor who
  does X on a Saturday", "find a provider who takes my insurance" are all
  this page with the nouns changed.

  What makes it a real demo rather than a list: the filters COMBINE. Text,
  category, pickup day and town all narrow the same set at once, the count
  updates, and an empty result says which filter to loosen rather than
  showing a blank page. Getting that wrong is the usual failure, and it is
  invisible until somebody searches for something that genuinely has no
  match.

  No photography, and none wanted. Each grower gets a drawn plot mark, so
  nothing pretends to be a photograph of a farm that does not exist.

  RULES FOR EDITING THIS FILE

    · Every grower is invented and must stay obviously so. No street
      addresses, no phone numbers, no email that resolves, no reviews, no
      ratings, no "established 1962", no acreage or yield figures. A town
      is geography, not a claim about a business.
    · Prices are deliberately absent. This directory lists who grows what,
      not what anything costs, so there is nothing to misread as Meg's
      rates.
    · If a real farm is ever added, the note above stops being true.
*/

export type Category = "Vegetables" | "Fruit" | "Dairy" | "Meat" | "Seafood" | "Flowers" | "Bakery";

export const CATEGORIES: Category[] = [
  "Vegetables",
  "Fruit",
  "Dairy",
  "Meat",
  "Seafood",
  "Flowers",
  "Bakery",
];

/** Pickup days, indexed the way Date does it so the labels cannot drift. */
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export type Day = (typeof DAYS)[number];

export type Grower = {
  id: string;
  name: string;
  town: string;
  categories: Category[];
  /** Days they are at a market or open for pickup. */
  days: Day[];
  /** Do they run a weekly subscription box? */
  csa: boolean;
  blurb: string;
  /** What they actually grow or make, which is what people search for. */
  sells: string[];
  /** Two colours for the drawn plot mark. Stored, never derived from the name. */
  palette: [string, string];
};

export const GROWERS: Grower[] = [
  {
    id: "stonewall",
    name: "Stonewall Field",
    town: "Waldoboro",
    categories: ["Vegetables", "Flowers"],
    days: ["Tue", "Sat"],
    csa: true,
    blurb: "Mixed vegetables on eight raised beds, plus whatever the cutting garden gives up.",
    sells: ["carrots", "kale", "garlic", "dahlias", "sunflowers", "salad mix"],
    palette: ["#6b8f5e", "#c9d8b6"],
  },
  {
    id: "two-ponds",
    name: "Two Ponds Creamery",
    town: "Hope",
    categories: ["Dairy"],
    days: ["Thu", "Sat"],
    csa: false,
    blurb: "A small herd, a small cheese room, and a short list that changes with the season.",
    sells: ["chevre", "feta", "yogurt", "butter", "raw milk"],
    palette: ["#c8b89a", "#f0e7d6"],
  },
  {
    id: "longwater",
    name: "Longwater Shellfish",
    town: "Friendship",
    categories: ["Seafood"],
    days: ["Fri", "Sat"],
    csa: false,
    blurb: "Oysters and clams off the same stretch of water, sold the day they come up.",
    sells: ["oysters", "steamers", "quahogs", "mussels"],
    palette: ["#4a7183", "#cfe0e6"],
  },
  {
    id: "bramble",
    name: "Bramble Row",
    town: "Union",
    categories: ["Fruit"],
    days: ["Wed", "Sat"],
    csa: false,
    blurb: "Berries in summer, apples and cider in the fall, and not much in between.",
    sells: ["blueberries", "raspberries", "apples", "cider", "jam"],
    palette: ["#8c5a7a", "#e4cdd9"],
  },
  {
    id: "northfield",
    name: "Northfield Pastures",
    town: "Appleton",
    categories: ["Meat", "Dairy"],
    days: ["Sat"],
    csa: true,
    blurb: "Grass-fed beef and lamb, sold by the cut or by the share.",
    sells: ["beef", "lamb", "ground beef", "sausage", "bone broth"],
    palette: ["#8a6a4f", "#ddcbb6"],
  },
  {
    id: "hearth",
    name: "Hearth & Hedge",
    town: "Camden",
    categories: ["Bakery"],
    days: ["Wed", "Thu", "Fri", "Sat"],
    csa: false,
    blurb: "Sourdough from a wood oven, four days a week, until it runs out.",
    sells: ["sourdough", "baguette", "scones", "galette", "rye"],
    palette: ["#b07c4a", "#eddcc6"],
  },
  {
    id: "kettle-cove",
    name: "Kettle Cove Greens",
    town: "Rockport",
    categories: ["Vegetables"],
    days: ["Mon", "Thu"],
    csa: true,
    blurb: "Year-round salad and greens from two unheated houses.",
    sells: ["spinach", "arugula", "salad mix", "microgreens", "scallions"],
    palette: ["#5d8a6a", "#c6ddc9"],
  },
  {
    id: "ledgeview",
    name: "Ledgeview Orchard",
    town: "Hope",
    categories: ["Fruit", "Bakery"],
    days: ["Sat", "Sun"],
    csa: false,
    blurb: "Old apple varieties, pressed cider, and pie when there is fruit to spare.",
    sells: ["apples", "pears", "cider", "pie", "cider donuts"],
    palette: ["#a8603f", "#eed2bd"],
  },
  {
    id: "saltmeadow",
    name: "Saltmeadow Flowers",
    town: "Belfast",
    categories: ["Flowers"],
    days: ["Fri", "Sat"],
    csa: true,
    blurb: "Field-grown stems, bunched the morning they are cut.",
    sells: ["dahlias", "zinnias", "ranunculus", "wreaths", "bouquets"],
    palette: ["#a45d7c", "#f0d4e0"],
  },
  {
    id: "quarry",
    name: "Quarry Road Poultry",
    town: "Warren",
    categories: ["Meat"],
    days: ["Tue", "Sat"],
    csa: false,
    blurb: "Chicken and eggs, and turkeys if you ask early enough in the year.",
    sells: ["chicken", "eggs", "turkey", "stock"],
    palette: ["#b08a3e", "#eee0bb"],
  },
  {
    id: "tidewalk",
    name: "Tidewalk Seaweed",
    town: "Stonington",
    categories: ["Seafood"],
    days: ["Thu"],
    csa: false,
    blurb: "Hand-harvested kelp and dulse, dried and flaked.",
    sells: ["kelp", "dulse", "nori", "seaweed flakes"],
    palette: ["#3f6f63", "#c3dcd4"],
  },
  {
    id: "sheepscot",
    name: "Sheepscot Dairy",
    town: "Wiscasset",
    categories: ["Dairy", "Bakery"],
    days: ["Wed", "Sat"],
    csa: false,
    blurb: "Milk, cream and a cultured butter that sells out before noon.",
    sells: ["milk", "cream", "cultured butter", "buttermilk", "biscuits"],
    palette: ["#c2b183", "#f2ecd9"],
  },
  {
    id: "wild-rose",
    name: "Wild Rose Market Garden",
    town: "Belfast",
    categories: ["Vegetables", "Flowers"],
    days: ["Tue", "Fri"],
    csa: true,
    blurb: "A one-acre garden run by two people, with a subscription box most of the year.",
    sells: ["tomatoes", "peppers", "squash", "beans", "cosmos", "salad mix"],
    palette: ["#77905a", "#d6e2c0"],
  },
  {
    id: "granite",
    name: "Granite Hill Maple",
    town: "Appleton",
    categories: ["Bakery", "Fruit"],
    days: ["Sat"],
    csa: false,
    blurb: "Syrup in the spring, maple cream all year, and nothing else at all.",
    sells: ["maple syrup", "maple cream", "maple sugar"],
    palette: ["#9c6327", "#ecd6b4"],
  },
  {
    id: "harbor-light",
    name: "Harbor Light Fish",
    town: "Port Clyde",
    categories: ["Seafood"],
    days: ["Wed", "Fri", "Sat"],
    csa: true,
    blurb: "Whatever the boat landed, which is the whole point and the whole problem.",
    sells: ["haddock", "hake", "scallops", "lobster", "monkfish"],
    palette: ["#43657f", "#cddde7"],
  },
  {
    id: "coldspring",
    name: "Cold Spring Mushrooms",
    town: "Warren",
    categories: ["Vegetables"],
    days: ["Thu", "Sat"],
    csa: false,
    blurb: "Oyster and shiitake on hardwood, grown in a converted barn.",
    sells: ["oyster mushrooms", "shiitake", "lion's mane", "mushroom powder"],
    palette: ["#7a6a86", "#ddd4e6"],
  },
];

export const TOWNS: string[] = [...new Set(GROWERS.map((g) => g.town))].sort();

export type Filters = {
  text: string;
  categories: Category[];
  days: Day[];
  towns: string[];
  csaOnly: boolean;
};

export const NO_FILTERS: Filters = { text: "", categories: [], days: [], towns: [], csaOnly: false };

/**
 * Narrow the list by every filter at once.
 *
 * **The combining is the feature.** Each filter is an AND against the
 * others, and a multi-value filter (three categories ticked) is an OR
 * within itself, which is what people expect without being able to say so:
 * "vegetables or dairy, on a Saturday, in Belfast".
 *
 * Text matches the name, the town, the blurb and what they sell, because
 * somebody searching "oysters" is naming a product and somebody searching
 * "Belfast" is naming a place, and a search box that only reads the title
 * fails both.
 */
export function filterGrowers(all: Grower[], f: Filters): Grower[] {
  const needle = f.text.trim().toLowerCase();
  return all.filter((g) => {
    if (f.csaOnly && !g.csa) return false;
    if (f.categories.length && !f.categories.some((c) => g.categories.includes(c))) return false;
    if (f.days.length && !f.days.some((d) => g.days.includes(d))) return false;
    if (f.towns.length && !f.towns.includes(g.town)) return false;
    if (!needle) return true;
    const hay = [g.name, g.town, g.blurb, ...g.sells, ...g.categories].join(" ").toLowerCase();
    return hay.includes(needle);
  });
}

/** A filter that, dropped on its own, would bring results back. */
export type Loosenable = { key: keyof Filters; label: string; found: number };

/**
 * Which filters, dropped on their own, would bring results back?
 *
 * An empty result that only says "nothing found" leaves somebody switching
 * filters off at random, so the page names the ones actually responsible.
 *
 * **It returns all of them rather than one, because "to blame" often has no
 * single answer.** Dairy in Friendship finds nothing, and dropping either
 * the category or the town fixes it. The first version of this picked the
 * first match from a fixed list and so answered "category" with the same
 * confidence it would have answered anything else, which is a guess wearing
 * the clothes of an explanation. A test caught it by disagreeing about
 * which one was right, and the disagreement was the point: neither was.
 *
 * Ordered by how much each would open up, so the screen can lead with the
 * one that helps most. An empty array means loosening any single filter
 * still finds nothing, which is the honest answer in that case.
 */
export function loosenable(all: Grower[], f: Filters): Loosenable[] {
  if (filterGrowers(all, f).length > 0) return [];
  const candidates: [keyof Filters, string, Filters][] = [
    ["text", `the search for "${f.text.trim()}"`, { ...f, text: "" }],
    ["categories", f.categories.length === 1 ? f.categories[0].toLowerCase() : "the category filter", { ...f, categories: [] }],
    ["days", f.days.length === 1 ? f.days[0] : "the day filter", { ...f, days: [] }],
    ["towns", f.towns.length === 1 ? f.towns[0] : "the town filter", { ...f, towns: [] }],
    ["csaOnly", "subscription boxes only", { ...f, csaOnly: false }],
  ];
  return candidates
    .filter(([key]) => {
      /* Only consider filters that are actually set. */
      if (key === "text") return f.text.trim().length > 0;
      if (key === "csaOnly") return f.csaOnly;
      return (f[key] as unknown[]).length > 0;
    })
    .map(([key, label, relaxed]) => ({ key, label, found: filterGrowers(all, relaxed).length }))
    .filter((c) => c.found > 0)
    .sort((a, b) => b.found - a.found);
}

export const activeCount = (f: Filters) =>
  (f.text.trim() ? 1 : 0) + f.categories.length + f.days.length + f.towns.length + (f.csaOnly ? 1 : 0);

export const directory = {
  name: "Midcoast Growers",
  tagline: "Who grows what, and where to find them this week.",
  /*
    Shown in the demo banner. Blunt on purpose: these read like real small
    farms, which is exactly why the page has to say they are not.
  */
  demoNote:
    "A demo directory built by M Studio. Every grower listed here is invented, the towns are real places but the businesses are not, and nothing on this page sells anything.",
};
