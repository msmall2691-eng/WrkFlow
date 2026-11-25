import type { ServiceCategory } from "./content";

/*
  The cast — which creature stands for which service, and why.

  **This was inside `lib/reef.ts` and had to come out, for the reason the
  last change was about.** That module is the homepage reef *map*: it holds
  where on one picture an annotation points. The creature and the analogy
  are not facts about that picture, they are facts about the service, and
  the moment a second page wanted them the module's name was a lie about
  its contents. A component named for one page that every page needs is a
  trap for the next reader, and so is a module. `reef.ts` now imports this
  and adds the only thing it genuinely owns: `x`, `y` and which side the
  label sits on.

  **The art is Meg's own, cut from her Shot_01 footage.** Her subjects sit
  on near-black, so a frame reads as a piece of art on the page rather than
  as a screenshot of a video. That is the Like a King move she keeps
  pointing at, where every section has something of its own to look at.

  **Nothing here is a claim**, which is the constraint that makes this safe
  to spread across the site. The HUD in Meg's original still carried
  invented telemetry (pH 8.1, "BIODIVERSITY INDEX HIGH"), ordinary scene
  dressing on an ocean picture and exactly what must not happen once the
  same treatment sits beside a price. These carry a creature's name and one
  sentence about a reef. No number, no outcome, no client.

  **The titles are still not written here.** `services[]` in lib/content.ts
  is the single definition of what the studio sells, so this adds only the
  two things the picture contributes. Change a service and every surface
  reading this changes with it.

  **Nov 25 2026: `reef` is gone, and the art is not.** Each member carried
  an analogy line, "a clean exchange, both sides get something and neither
  negotiates" and three more, which the homepage printed between a service
  title and its price and /services printed under each picture. Meg's
  verdict was that the metaphor sounds ridiculous, and asked a second time
  she said to take it off /services too. Removing the field rather than
  the two call sites is the point: a line nothing renders is a line the
  next edit renders again, and this one had already outlived the section
  it was written for.

  The creature names stay. They say what is in the photograph, which is a
  fact about the art rather than a claim about the software, and one test
  reads them to make sure none of them has crept back onto the four doors
  on the homepage. The frames on /services are uncaptioned now, which is
  what /marketplace and /tools already do.
*/

export type CastMember = {
  /**
   * The service this creature stands for. Typed as the union rather than
   * `string` so a typo is a build error: spelled loosely, a renamed service
   * would silently drop its picture and caption, and a page would just
   * quietly have less art on it than the one beside it.
   */
  id: ServiceCategory;
  /** What is actually in the frame. */
  creature: string;
  /** A still from Meg's own footage. */
  art: string;
  /** What the still shows, for anyone who cannot see it. */
  artAlt: string;
};

export const CAST: readonly CastMember[] = [
  {
    id: "websites",
    creature: "The light above",
    art: "/ocean/cast/light.webp",
    artAlt:
      "A manta and a jellyfish in a beam of light reaching down to a dark reef.",
  },
  {
    id: "leads",
    creature: "Anemone and clownfish",
    /* The creature this entry is named for, finally in the picture.
       `turtle.webp` was here and shows a turtle, so the panel said
       "Anemone and clownfish" over art with neither of them in it. It
       was also the last inverted image in the set: luma 44.3 at the
       border against 34.2 in the middle, darker exactly where a subject
       should be, so `.creature-bleed` had nothing to leave behind.

       Meg's own frame reads 17.6 against 51.1, a ratio of 2.90 and the
       cleanest fall to black of any art on this site, and it shows a lit
       anemone with a clownfish sheltering in it. The metaphor and the
       measurement agreed for once. */
    art: "/ocean/cast/anemone.webp",
    artAlt:
      "A lit anemone on the reef at night with a clownfish sheltering in it, shoals streaming overhead.",
  },
  {
    id: "software",
    creature: "The reef itself",
    /* The red octopus, which is Meg's favourite image and also, measured,
       the best one on the site: luma 17.5 at its border against 39.3 in
       the middle, the cleanest fall to black in the set. He was only on
       /marketplace.

       What he replaces is the argument for moving him. `cast/ray.webp`
       measures 44 at the border against 18.7 in the middle, which is
       backwards: darker where the subject should be. It is the one image
       here with no lit subject at all, so it read as a smear in every
       frame it was put in, and this slot is the reef map's panel, where
       a visitor has just clicked to see what "the reef itself" means.
       He is literally that: an animal in the structure it lives on. */
    art: "/ocean/reef-ember.webp",
    artAlt:
      "An octopus on the reef at night, among fan coral, anemones and drifting jellyfish.",
  },
  {
    id: "integrations",
    creature: "The shoals",
    art: "/ocean/cast/octopus.webp",
    artAlt:
      "Two shoals of lit fish streaming past an octopus, with a turtle above it.",
  },
] as const;

/** The cast member for a service id, or undefined if it has none. */
export function castFor(serviceId: ServiceCategory): CastMember | undefined {
  return CAST.find((c) => c.id === serviceId);
}
