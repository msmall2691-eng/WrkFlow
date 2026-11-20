import CableHero from "@/components/cable/CableHero";
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

    CableHero    one screen: "Follow the Cable". A fiber crosses a granite
                 slab, slips through a seam and splits into the two things
                 this studio sells, with every control as real HTML
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
    <div className="cp">
      <CableHero />
      <TakeReel />
      <Shelf />
      <TryItNow />
      <OneJob />
      <MoreWork />
      <WhatConnects />
      <HowToStart />
      <Contact />
      <Footer />
      <CommandPalette />
    </div>
  );
}
