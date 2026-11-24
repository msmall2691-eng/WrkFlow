import OceanHero from "@/components/ocean/OceanHero";
import ReefMap from "@/components/ocean/ReefMap";
import TakeReel from "@/components/reel/TakeReel";
import Shelf from "@/components/home/Shelf";
import TryItNow from "@/components/home/TryItNow";
import OneJob from "@/components/home/OneJob";
import MoreWork from "@/components/home/MoreWork";
import WhatConnects from "@/components/home/WhatConnects";
import HowToStart from "@/components/home/HowToStart";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import OceanBackdrop from "@/components/ocean/OceanBackdrop";

/*
  Homepage — a storefront (Meg, Nov 16 2026).

  **The brief, in her words:** "hard to see what is for sale that's
  tangible", and then, asked to choose a shape, the full storefront rather
  than a tidier portfolio.

  **Measured on the live site at phone width before changing anything**, so
  the decision rests on numbers rather than taste:

    · the page ran 17.9 screens
    · the first price for anything purchasable was on screen 12
    · there were two prices on the whole page, and one of them, "$1M+", is
      a statistic about her old cleaning company, not something on sale
    · the one priced product was followed by the sentence "There are eight
      more free tools on this site, and the rest of the products are priced
      and ready", which is a page pointing at a shop instead of being one

  The stock was never the problem. /services ran 20.6 screens with prices
  at screens 3, 5 and 10; /marketplace, which holds most of the goods, ran
  12.8 and is reached by nobody. Seventeen real offers existed, spread
  across three long pages, none of them the page everybody sees.

  **So the order is the change.** Proof used to come first and product last,
  which is backwards for a stranger: proof matters once somebody wants the
  thing, not before.

    OceanHero    one screen: the dive. Meg's own Firefly footage of a deep
                 reef, played once and held at the bottom, with a 45 kB
                 poster carrying the first paint
    ReefMap      id="reef" — the same reef as a still, annotated. Four pins,
                 one per service, read from `services[]`
    TakeReel     the work, as a browser window pinned on the right with
                 four takes swapping inside it. Cards, not globes, at
                 Meg's ask, and DOM rather than WebGL because nothing
                 here needs a GPU
    Shelf        id="shelf" — the whole catalog, with prices, grouped by
                 what it costs rather than by what it is
    TryItNow     the three demos, which the shelf deliberately carries as
                 one row and which have to stay individually reachable
    OneJob       id="work" — one project told all the way through, which is
                 now the evidence FOR the shelf rather than the main event
    MoreWork     the rest of the work, once each
    WhatConnects the tools these already talk to
    HowToStart   what pressing send sets in motion
    Contact      the form
    Footer

  **ServiceRouter is gone from this page, and that is the one real
  deletion.** It asked "What are you trying to fix?" and answered with four
  categories and a count of past projects. The question is good and the
  answer was a table of contents in front of a shop: no price, no product,
  1.4 screens, and a link to another page. Every item on the shelf now
  carries its service as a tag, so the four categories are still readable
  here, and /services still argues them in full with the pain, the outcome
  and the same ladder. What the router uniquely had, the project counts, is
  kept honest in the test that replaced its own: the shelf must cover all
  four services, asserted against `services` itself.

  **The rule the previous rebuild rested on still holds: nothing appears
  twice.** TryItNow used to carry the demos, the turnover planner and the
  welcome book; the shelf lists all of those with prices, so that section
  shrank to the one thing the shelf cannot do, which is link each demo
  individually. `e2e/smoke.spec.ts` asserts both halves.

  `.cp` scopes the V2 palette to this page and remaps the site's shared
  tokens, so Contact and Footer pick up the same colours without being
  restyled one by one. Daylight by default, Harbor still in ⌘K.
*/
export default function Home() {
  return (
    <div className="cp cp-dive">
      {/*
        **The ocean is the page's ground, not the hero's.** Meg: a 3D
        immersive background that moves when you scroll. So the dive is
        fixed behind everything and its playhead is the document's scroll
        position, which means the descent is still going while somebody
        reads the shop rather than being finished a screen and a half in.
        `cp-dive` is what takes `.cp`'s flat ground away so it shows; see
        globals.css, and OceanBackdrop for why Daylight opts out entirely.
      */}
      <OceanBackdrop />

      {/* Everything else rides above it. One wrapper rather than a z-index
          on each section, so a section added later cannot forget. */}
      <div className="relative z-10">
        <OceanHero />
        {/*
          **A light wash over everything below the hero, and the hero
          deliberately outside it.**

          Bright water and 14px text are in direct tension, and the
          measurement found where it breaks: a violet shop link over a lit
          patch of water came out at 4.16:1, then 4.35:1 after the scrim
          was weighted, where it needs 4.5. Violet on teal is the worst
          pairing this palette can make and it is exactly what the shop's
          links are. Pushing the backdrop's own scrim further would have
          fixed one link by dimming the whole ocean, including the hero,
          which is the part worth looking at.

          So the hero sits on the backdrop directly at its lightest, and
          everything from the reef down takes another 22%. That is the
          difference between 4.35:1 and passing, it costs the lower page
          about four points of luma, and a section added later inherits it
          rather than having to remember.
        */}
        <div className="bg-[rgba(5,7,11,0.22)]">
        <ReefMap />
        <TakeReel />
        <Shelf />
        <TryItNow />
        <OneJob />
        <MoreWork />
        <WhatConnects />
        <HowToStart />
        <Contact />
        <Footer />
        </div>
      </div>
      <CommandPalette />
    </div>
  );
}
