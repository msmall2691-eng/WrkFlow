import StageTopBar from "@/components/stage/StageTopBar";
import StageHero, { type HeroVariant } from "@/components/stage/StageHero";
import StageServices from "@/components/stage/StageServices";
import StageWork from "@/components/stage/StageWork";
import StageApproach from "@/components/stage/StageApproach";
import StagePricing from "@/components/stage/StagePricing";
import StageFooter from "@/components/stage/StageFooter";
import StageMotion from "@/components/stage/StageMotion";
import Contact from "@/components/Contact";
import CommandPalette from "@/components/CommandPalette";

/*
  The homepage, as one component, so that `app/page.tsx` and the hero
  comparison at /lab/hero/[variant] render the *same* page rather than two
  pages that look alike.

  That is the only reason this file exists. The composition and the reasons
  for its order are documented on `app/page.tsx`, which is still where a
  reader goes to find out why the page is shaped this way. Copying the tree
  into the lab instead would have made the comparison worthless the first
  time either copy was edited: Meg would be choosing between a hero on the
  real page and a hero on a page that had quietly drifted from it.

  `variant` reaches `StageHero` and nothing else. Everything below the first
  screen is identical in all three.
*/
export default function StageHome({ variant }: { variant?: HeroVariant }) {
  return (
    <div className="stage">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <StageTopBar spy />

      <main id="main">
        <StageHero variant={variant} />
        <StageServices />
        <StageWork />
        <StageApproach />
        <StagePricing />
        <Contact variant="stage" />
      </main>

      <StageFooter />

      {/* ⌘K, outside the stage: a fixed overlay belongs at the end of the
          page, and keeping it out of `.stage` keeps the design's element
          styles off a component drawn in the site's own palette. */}
      <CommandPalette />

      {/*
        One controller for the whole page's motion: the reveals, the two
        clips and the two CSS loops. It reconciles intersection, the
        motion preference and tab visibility in one place, which is the
        correction `MovingChapter` and `HeroLoop` were both brought to.
      */}
      <StageMotion />
    </div>
  );
}
