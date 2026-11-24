import { services, type ServiceCategory } from "./content";
import { castFor, type CastMember } from "./ocean";

/*
  The reef map — where each of the four services sits in the picture.

  **This module owns positions and nothing else now.** The creature, the
  analogy and the art moved to `lib/ocean.ts` when a second page wanted
  them: they are facts about the service, not about this one picture, and
  a module named for the reef holding the art that /services and /tools
  render would be the same mis-filing as a heading component living under
  `components/home/`. What is left here is the only thing the map
  genuinely owns, which is where on `public/ocean/reef.webp` an annotation
  points.

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
*/

export type ReefPin = CastMember & {
  /** Left position on the image, 0-100. */
  x: number;
  /** Top position on the image, 0-100. */
  y: number;
  /** Which side the label sits on, so it never runs off the edge. */
  side: "left" | "right";
};

/** Where each service's pin sits on the reef picture. */
const PLACEMENTS: {
  id: ServiceCategory;
  x: number;
  y: number;
  side: "left" | "right";
}[] = [
  { id: "websites", x: 49, y: 23, side: "right" },
  { id: "leads", x: 40, y: 80, side: "right" },
  { id: "software", x: 72, y: 56, side: "right" },
  { id: "integrations", x: 35, y: 47, side: "left" },
];

/** Each pin joined to its cast member and the service it labels. Pins with
    no service, or no cast member, are dropped rather than half-rendered. */
export const reefPins = PLACEMENTS.map((place) => {
  const service = services.find((s) => s.id === place.id);
  const member = castFor(place.id);
  return service && member ? { ...member, ...place, service } : null;
}).filter(
  (p): p is ReefPin & { service: (typeof services)[number] } => p !== null,
);
