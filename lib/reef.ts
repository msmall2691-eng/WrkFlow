import { services } from "./content";

/*
  The reef map — where each of the four services sits in the picture.

  **The labels are not written here.** `services[]` in lib/content.ts is the
  single definition of what this studio sells, and CLAUDE.md is explicit
  that everything else reads it. So this module holds only the two things
  the picture adds: where on the image an annotation points, and the one
  line about the reef itself. Titles, taglines and the order come from the
  service.

  **Why a reef at all.** Meg's words, Nov 24 2026: the ocean floor as a
  metaphor for systems that live together and complement each other. The
  sharper version, and the one the copy uses: a reef has no manager. Nobody
  assigns the cleaner shrimp to the eel. Each organism does one job and its
  output is the next one's input, and the whole thing runs unsupervised.
  That is not a mood, it is a literal description of integrated software,
  which is the fourth service on this very list.

  **The anchors are percentages, not pixels**, so the annotation stays on
  its creature at every width. The first set was eyeballed and every one of
  them missed: the light shaft's source is at 23% down, not 14%, and the
  clownfish are at 73%, not 70%. They were re-placed against a percentage
  grid rendered over `public/ocean/reef.webp` and then checked again on the
  built page, because a pin pointing at empty water is worse than no pin.

  **A label must also fit.** `leads` first sat on the left-most clownfish
  at 31% with its label running left, and the label ran off the edge of the
  frame: the picture is cropped by its container, so a pin near an edge has
  to point its label inward. It is on the large anemone at 40% now, reading
  right across the dark reef floor.

  **"The reef itself" points at the rock mass on the right, not the
  octopus.** The octopus is the picture's subject and needs no label; the
  structure everything else is attached to is the thing that service is
  actually about.

  **Each pin carries a creature now**, cut from Meg's own Shot_01 rather
  than drawn: the subjects in that clip sit on near-black, so a crop of a
  frame reads as a piece of art on the page rather than as a screenshot of
  a video. That is the Like a King move she keeps pointing at, where every
  section has something of its own to look at.

  **Nothing here is a claim.** The HUD in Meg's original still carried
  invented telemetry (pH 8.1, "BIODIVERSITY INDEX HIGH"), which is fine as
  scene dressing on an ocean illustration and is exactly what must not
  happen once the same treatment carries business numbers. These callouts
  carry service names and nothing measurable.
*/

export type ReefPin = {
  /** Matches a `services[].id`. */
  id: string;
  /** Left position on the image, 0-100. */
  x: number;
  /** Top position on the image, 0-100. */
  y: number;
  /** Which side the label sits on, so it never runs off the edge. */
  side: "left" | "right";
  /** What is actually at that point in the picture. */
  creature: string;
  /** The reef's half of the analogy, one line. */
  reef: string;
  /** A still of that creature from Meg's own footage, for the panel. */
  art: string;
  /** What the still shows, for anyone who cannot see it. */
  artAlt: string;
};

const PINS: ReefPin[] = [
  {
    id: "websites",
    art: "/ocean/cast/light.webp",
    artAlt: "Light shafts reaching down through dark water, a ray and a jellyfish drifting in them.",
    x: 49,
    y: 23,
    side: "right",
    creature: "The light shaft",
    reef: "Everything down here eats because light reaches the water.",
  },
  {
    id: "leads",
    art: "/ocean/cast/turtle.webp",
    artAlt: "A turtle gliding low over the reef, past anemones and a clownfish.",
    x: 40,
    y: 80,
    side: "right",
    creature: "Anemone and clownfish",
    reef: "A clean exchange. Both sides get something and neither negotiates.",
  },
  {
    id: "software",
    art: "/ocean/cast/ray.webp",
    artAlt: "The reef floor with a ray passing above it and shoals of lit fish streaming across.",
    x: 72,
    y: 56,
    side: "right",
    creature: "The reef itself",
    reef: "The structure the rest of it lives on, and is built from.",
  },
  {
    id: "integrations",
    art: "/ocean/cast/octopus.webp",
    artAlt: "Thousands of lit fish streaming past an octopus on the rocks.",
    x: 35,
    y: 47,
    side: "left",
    creature: "The shoals",
    reef: "Thousands of separate things moving as one, with no one steering.",
  },
];

/** Each pin joined to the service it labels. Pins with no service are dropped. */
export const reefPins = PINS.map((pin) => {
  const service = services.find((s) => s.id === pin.id);
  return service ? { ...pin, service } : null;
}).filter((p): p is ReefPin & { service: (typeof services)[number] } => p !== null);
