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
  /** The reef's half of the analogy, one line. */
  reef: string;
  /** A still from Meg's own footage. */
  art: string;
  /** What the still shows, for anyone who cannot see it. */
  artAlt: string;
};

export const CAST: readonly CastMember[] = [
  {
    id: "websites",
    creature: "The light shaft",
    reef: "Everything down here eats because light reaches the water.",
    art: "/ocean/cast/light.webp",
    artAlt:
      "Light shafts reaching down through dark water, a ray and a jellyfish drifting in them.",
  },
  {
    id: "leads",
    creature: "Anemone and clownfish",
    reef: "A clean exchange. Both sides get something and neither negotiates.",
    art: "/ocean/cast/turtle.webp",
    artAlt:
      "A turtle gliding low over the reef, past anemones and a clownfish.",
  },
  {
    id: "software",
    creature: "The reef itself",
    reef: "The structure the rest of it lives on, and is built from.",
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
    reef: "Thousands of separate things moving as one, with no one steering.",
    art: "/ocean/cast/octopus.webp",
    artAlt: "Thousands of lit fish streaming past an octopus on the rocks.",
  },
] as const;

/** The cast member for a service id, or undefined if it has none. */
export function castFor(serviceId: ServiceCategory): CastMember | undefined {
  return CAST.find((c) => c.id === serviceId);
}
