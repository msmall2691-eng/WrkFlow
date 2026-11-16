import Opening from "@/components/home/Opening";
import CategoryDoors from "@/components/home/CategoryDoors";
import HowToStart from "@/components/home/HowToStart";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

/*
  Site restructure (Meg, Nov 15 2026, evening): "the pages none of it makes
  any sense". Five pages (home, /services, /marketplace, /catalog, /demo)
  each listed what is for sale, in different orders and words. Now:

    Opening        headline, two ways in, and six live things to open
    CategoryDoors  "What do you need?": six shelves of /catalog, real screens
    (OneJob removed late Nov 15 at Meg's ask: the homepage should not
     centre on the cleaning company. Its story is on /work/maine-cleaning-co.)
    HowToStart     what pressing send sets in motion
    Contact

  MoreWork moved to /work (all projects), WhatConnects to /catalog (it is
  integrations evidence, which is a catalog shelf), and TryItNow became the
  live strip in Opening. /services, /marketplace and /demo redirect to
  /catalog (next.config.ts). The notes below describe the earlier rebuild.

  Homepage — rebuilt from scratch (Meg, Nov 15 2026).

  **What was here, and why it went.** V2 (Nov 1) put the whole site on one
  screen as a control panel: a headline, a rotating window of four shipped
  screens, a tile listing those same four projects by name, a tile of free
  tools, and a live weather readout. Below it, three case-study cards named
  three of the same projects again, with sentences copied verbatim from the
  tile. The four-door service router landed between those two blocks and
  made it worse, by putting a section in the middle of a repetition rather
  than removing it.

  Meg's verdict, which is the brief for this file: "I'm still not confident
  sharing this, it's very redundant, I cannot see anything that would make
  me want to have someone build something for me, and it all just looks
  like it's all over the place."

  Measured before rewriting: The Remote Admin and linx each appeared three
  times above the fold-and-a-half, and a visitor met four project names
  three times before reaching a single sentence about what any of them
  changed for anybody.

  **The page is now one argument, in the order it gets asked:**

    Opening      who it is for, one way in, and the operating history that
                 answers "has this person done this before"
    ServiceRouter the four things on offer, as four doors — so somebody who
                 is not a cleaning company finds themselves immediately,
                 before the worked example
    OneJob       id="work" — one project all the way through: what was
                 wrong, what got built, what changed, where to look
    MoreWork     everything the worked example does not cover, once each,
                 plus the live readout
    WhatConnects the integrations evidence, cut by tool rather than by
                 project, because "will it work with what I already pay
                 for" is not a question about a project
    TryItNow     the finished things somebody can open or buy today: the
                 three demos, the free planner and the welcome book. All of
                 them were unreachable from this page before
    HowToStart   what pressing send actually sets in motion
    Contact      the form, so no lead depends on a second page
    Footer

  **The rule the rewrite is built on: nothing appears twice.** Every project
  in `work` is rendered in exactly one place on this page, and
  e2e/smoke.spec.ts asserts it, because the repetition was editorial rather
  than structural and editorial problems grow back.

  The doors come BEFORE the worked example deliberately. The example is a
  cleaning company, and a contractor or an admin firm reading it first has
  to work out for themselves whether any of it applies to them. The doors
  answer that in four words each, then the example shows what the work
  actually looks like.

  Everything deeper still has its own page: /work/[slug], /brightbase,
  /tools, /services, /about, /demo. The panel header links each, and ⌘K
  reaches all of them.

  `.cp` scopes the V2 palette to this page and remaps the site's shared
  tokens, so Contact and Footer pick up the same colours without being
  restyled one by one. Since Nov 14 that palette is Daylight by default —
  cream, white cards, aurora as accent — with Harbor still reachable in ⌘K.
*/
export default function Home() {
  return (
    <div className="cp">
      <Opening />
      <CategoryDoors />
      <HowToStart />
      <Contact />
      <Footer />
      <CommandPalette />
    </div>
  );
}
