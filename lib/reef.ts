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

  **Why a reef at all, and why the copy no longer says so.** Meg's words,
  Nov 24 2026: the ocean floor as a metaphor for systems that live together
  and complement each other. The copy took the sharper version of it, "a
  reef has no manager, nobody assigns the cleaner shrimp to the eel", and
  her verdict on Nov 25 was that it sounds ridiculous. On a page selling
  websites to contractors and admin firms she is right: it asks a buyer to
  enjoy an analogy before they have been told what is for sale, and the
  pins made it worse by labelling the four doors "THE LIGHT ABOVE" and "THE
  SHOALS" with the service name only in the panel behind a click.

  **The picture stays and the argument moved into plain words.** The one
  true thing inside the metaphor, that each part's output is the next one's
  input and nothing needs a person in the middle, is a literal description
  of the fourth service and is now simply stated as that. What this module
  owns is unaffected: these are still positions on a photograph of a reef,
  which is still the art the section is built on.

  **The anchors are percentages, not pixels**, so the annotation stays on
  its creature at every width. They are placed against a percentage grid
  rendered over the actual file and then checked on the built page, because
  a pin pointing at empty water is worse than no pin. Every set so far has
  needed that: the first was eyeballed and all four missed.

  **Nov 24 2026: the picture changed, so all four moved.** Meg sent the
  scene as a clean 2000px render, where what shipped was a 1600x900 frame
  grabbed out of `Shot_01`. Same composition, far more of it: the anemones
  and clownfish along the bottom, the anglerfish, the rock mass, all of
  which the video frame had crushed into near-black. The co-ordinates here
  are measured on `reef-wide.webp` and are not transferable back — on the
  old frame `leads` was at 40/80 and the new anemone cluster is at 37/86.

  **A label must fit as well as point, and fit is measured on the rendered
  card, not on the file.** The picture sits in the wider half of a two
  column grid, which is about 610px at 1440, so a label reading right needs
  its pin before roughly 60% of the width or the frame clips it. `software`
  is the one this binds: the rock mass it names runs to the right edge, it
  was tried at 80% reading right and came out as "03 THE REEF ITS", and
  reading left from 84% put the words across the octopus, which is the
  subject of the picture and the one thing that must not carry writing. It
  reads left from 88% now, high enough on the rock that the words cross a
  tentacle and clear the head.

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
  /* The light above, in the beam itself just left of the ray. */
  { id: "websites", x: 58, y: 14, side: "right" },
  /* The big white anemone cluster with the clownfish in it. */
  { id: "leads", x: 37, y: 86, side: "right" },
  /* The rock mass on the right, reading left. Measured on the rendered
     card rather than the file: this column is about 610px wide, so a
     right-running label needs its pin before roughly 60% or it is clipped
     by the frame, and at 80% it was. Reading left from 88% at this height
     the words cross one tentacle and clear the octopus's head. */
  { id: "software", x: 88, y: 58, side: "left" },
  /* The shoal streaming left below the turtle, clear of the turtle itself.
     **It reads right, and that is the service name's doing.** At 22% across
     there is only about 110px to the left of the pin on a 670px card and
     less on a narrower one, which held "THE SHOALS" and cannot hold
     "INTEGRATIONS" — the label was clipped by the frame the moment it
     started naming the service. Reading right it runs into open water
     below the turtle, away from the octopus, which is the one thing on
     this picture that must not carry writing. */
  { id: "integrations", x: 22, y: 44, side: "right" },
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
