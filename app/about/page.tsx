import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import StageTopBar from "@/components/stage/StageTopBar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutProof from "@/components/about/AboutProof";
import AboutProcess from "@/components/about/AboutProcess";
import AboutCta from "@/components/about/AboutCta";
import Stack from "@/components/Stack";
import GitHubProof from "@/components/GitHubProof";
import CommandPalette from "@/components/CommandPalette";
import { siteNav } from "@/lib/content";

/*
  /about — the page where somebody decides whether to hand a project to one
  person.

  **Measured before this rebuild, at 1440x900: 5.6 screens, four sections,
  four images, five links in the whole page body and no buttons.** The page
  made its argument in four paragraphs and then gave a reader who believed
  it nowhere to go. That is the failure this is a fix for, and it is two
  failures rather than one: nothing to press, and nothing to check.

  **The arc is who, then proof, then how, then start.**

  1. `AboutHero` — the title, the one sentence under it, the face, two
     buttons, and the operating history as its own attributed row. All of
     that on the first screen; previously the title sat four hundred pixels
     below a centered photograph and the first clickable thing was two
     thousand pixels below that.
  2. `AboutStory` — `founderBio` unchanged, with `founderPhilosophy` as a
     pull quote beside it and the social links moved down here from above
     the headline, where they were three unlabelled glyphs competing with
     the page title.
  3. `AboutProof` — every row in `work[]` as a door. This is the section the
     page did not have: it argued that somebody who ran a service business
     built this software and then offered no way to look.
  4. `AboutProcess` — `approachSteps`, keeping the `#approach` anchor the
     footer and ⌘K both point at, and closing on `studioStats`, which is
     what happens if it does not work out.
  5. `Stack` then `GitHubProof`, in that order and unchanged: the strip
     claims the tools are ones you could hire for later, and the capture
     under it is where a reader checks the claim. `#github` is asserted by
     name in `e2e/smoke.spec.ts`.
  6. `AboutCta` — `founderCta`, with somewhere to press.

  **`FounderNote` and `Approach` lost their only caller here.** They are
  left in place rather than deleted inside a redesign, which is the posture
  CLAUDE.md already records for the nine components the homepage port
  orphaned; removing one is its own change with `seam-check-before-removal`
  applied to it. `Approach`'s heading and lede moved into `lib/content.ts`
  on the way past, since this page was the one place on the site with
  visitor-facing copy outside that file.

  **Nothing new is claimed.** Every number is `provingGround` or
  `studioStats`, every paragraph is `founderBio` or `founderNote`, and the
  proof section counts nothing: the rows say how many there are by being
  that many.

  **No Daylight branch**, like the rest of the converted routes: `.cp-inner`
  is one near-black world in both themes, and a test asserts it.
*/

export const metadata: Metadata = pageMeta({
  // No "| M Studio" here — the root layout's title template appends the
  // brand already; doubling it renders "… | M Studio · M Studio".
  title: "About · Meet Meg",
  description:
    "Meet Meg, founder of M Studio. Websites, CRMs, platform setup, data migration and integrations, built from hands-on business experience and a love of figuring out systems.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="cp cp-inner">
      <div className="relative overflow-hidden">
        <StageTopBar
          inFlow
          cta="book"
          nav={siteNav}
          here="About"
          bookHref="/?offer=call#contact"
        />

        {/* No pt-16: the bar is in flow and the hero carries its own top
            padding. */}
        <main className="relative z-10">
          <AboutHero />
          <AboutStory />
          <AboutProof />
          <AboutProcess />
          <Stack />
          <GitHubProof />
          <AboutCta />
        </main>
      </div>
      <Footer />
      {/* The floating "DAYLIGHT" pill lived here. It overlapped content on
          every page and on a phone sat on top of the cards. The theme
          toggle is now a command in the ⌘K palette (lib/theme.ts), so
          nobody who picked Harbor is stranded in it. */}
      <CommandPalette />
    </div>
  );
}
