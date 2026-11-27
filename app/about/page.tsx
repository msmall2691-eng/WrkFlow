import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import StageTopBar from "@/components/stage/StageTopBar";
import Footer from "@/components/Footer";
import FounderNote from "@/components/FounderNote";
import Approach from "@/components/Approach";
import Stack from "@/components/Stack";
import GitHubProof from "@/components/GitHubProof";
import CommandPalette from "@/components/CommandPalette";
import { siteNav } from "@/lib/content";

/*
  /about — the person, the process, the toolkit.

  The founder story moved here first ("less words, more boxes"). Approach and
  Stack have now joined it for the same reason: on the homepage they were two
  more things between a visitor and the price, and both are things you go
  looking for rather than things that should stop you. Read in order this page
  answers who, how, and with what.

  Nov 26 2026: converted to the approved homepage's clothes with
  `.cp-inner` — the homepage's bar, its two faces, its one accent, and the
  V2 aurora gone. A token re-point, so FounderNote, Approach and Stack are
  untouched. CLAUDE.md says this is the one page where a human voice may
  still be worth keeping, and nothing here changes a word of it.
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

        {/* No hero band here: FounderNote opens the page, and it carries its
            own heading. No pt-16 either, since the bar is in flow. */}
        <main className="relative z-10">
          <FounderNote />
          <Approach />
          <Stack />
          {/* Under Stack deliberately: that strip claims the tools are
              ones she could hand over, and this is where a reader checks
              the claim. See the note in GitHubProof. */}
          <GitHubProof />
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

