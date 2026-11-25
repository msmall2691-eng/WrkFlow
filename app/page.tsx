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
import Drift from "@/components/ocean/Drift";
import MovingChapter from "@/components/ocean/MovingChapter";
import Reveal from "@/components/Reveal";

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
    /* `isolate` is load-bearing and not decoration. `.cp` paints an
       opaque #08070c background and does **not** create a stacking
       context, so the drift canvas — fixed, z-index -10 — resolved
       against the root instead and painted *behind* that background.
       It rendered 25,615 pixels per frame and not one of them was ever
       on screen: the canvas readout said it was working and a
       screenshot of the same scroll position showed absolutely nothing.
       Making this div a stacking context puts a negative z-index child
       above its own background and still below every section. */
    <div className="cp isolate">
      {/*
        **The ocean is chapters now, not a backdrop, and that is Meg's
        call after seeing what the backdrop cost.**

        What was here: `OceanBackdrop`, one clip fixed behind the whole
        page with its playhead tied to scroll. It read well at the top
        and then spent the rest of the page being hidden — faded to 22%
        from a third of the way down, and covered by a 42% wash over
        every section below the hero. The page paid 2.8MB for water it
        then suppressed twice, and the suppression was not decoration: it
        was the only way to keep 14px prices legible over moving water.
        Three rounds of scrim tuning are in this file's history for one
        violet link.

        It also had a ceiling. A scrubbed backdrop can show exactly one
        clip, and Meg has twenty-four. Phones and `prefers-reduced-motion`
        never got the video at all, so the characters she most wanted to
        show reached a phone visitor as a poster.

        So the descent is told as a sequence instead: the hero is the
        surface, a chapter is the deep, and the page ends at the floor.
        Her words for the original ask were "the further we scroll it goes
        into the bottom of ocean floor", and that still happens — in five
        pictures rather than one playhead.

        **Deleting the wash is the quiet win.** It existed only to protect
        text from bright water. With no water under the content, every
        card, price and link on this page gets its full contrast back for
        free.
      */}
      {/* Behind everything, fixed, never interactive. The hero is the
          one orchestrated moment; this is the water it sits in, and it is
          what stops the rest of the page from being a still picture. */}
      <Drift />

      <OceanHero />
      <Reveal>
        <ReefMap />
      </Reveal>
      {/*
        **The shop comes before the work, not after it.** Merging the two
        work sections pushed the shelf from 5,139px to 6,218px and broke
        the guard that exists for Meg's own first instruction about this
        page: "hard to see what is for sale that's tangible". The test
        failing was correct.

        Putting the shelf back where it was would only restore the split.
        Moving it above the work serves both: the price list arrives
        about two screens in instead of five, and the reel and the rest
        of the work stay as one run instead of being separated by it.
      */}
      <Reveal>
        <Shelf />
      </Reveal>

      <Reveal>
        <TakeReel />
      </Reveal>

      {/*
        **The rest of the work, directly under the work.** These two were
        separated by the shop, the free tools, a chapter and the case
        study — about 7,700px — so the page announced the work, wandered
        off through four unrelated things, and announced it again. Meg's
        word for the result was that it did not flow.

        The join matters more than the distance did. `TakeReel`'s own
        "Selected work" heading is `sr-only`, so nothing visible ever said
        *work* before this section said "The rest of it." A visitor read
        "the rest" with no first part on screen anywhere. Now it follows
        the reel it is the rest of.
      */}
      <Reveal>
        <MoreWork />
      </Reveal>
      <Reveal>
        <TryItNow />
      </Reveal>

      {/*
        The deep, between the shop and the proof.

        It sits here because of what surrounds it: the visitor has just
        been shown everything that is for sale with prices, and the next
        section asks them to believe one project went well. A screen of
        black with one lit animal in it is the breath between the two.
        The clip that replaced the still is the magenta octopus: of the
        nine Meg sent it is the one that reads from across a room, and a
        chapter is the only place on this page where that is the whole
        job.
      */}
      {/*
        **One chapter, not four.** This branch briefly carried four, and
        walked end to end that was 4,104px of decoration on an 18.8-screen
        page: two of them landed back to back with nothing in between,
        which is the reel this file's own note says a chapter is not. The
        page was rebuilt in the first place because it ran too long, and
        adding three pictures to it made that worse rather than better.

        So the ocean moves here and nowhere else on the page. One clip, in
        the slot a chapter already earned, between the shop and the proof.
      */}
      <MovingChapter
        id="chapters-deep"
        clip="shot-one"
        poster="/ocean/video/shot-one-poster.webp"
      />

      <Reveal>
        <OneJob />
      </Reveal>

      {/*
        The violet octopus, which was the hero until the reef loop took
        that screen. It is Meg's 26-megapixel piece and the measurements in
        #154 still hold — border luma 8.0 against a page ground of 8, the
        closest match of anything here, so it needs no mask or vignette to
        stop at the page.

        It is better here than it was at the top. As a hero it had to carry
        a headline, two buttons and the nav, which meant a gradient over
        its left third and a scrim over its top: the picture was never once
        shown whole. A chapter asks nothing of it, so for the first time
        the full piece is on screen with nothing written across it.
      */}


      <Reveal>
        <WhatConnects />
      </Reveal>
      <Reveal>
        <HowToStart />
      </Reveal>
      <Reveal>
        <Contact />
      </Reveal>
      <Footer />
      <CommandPalette />
    </div>
  );
}
