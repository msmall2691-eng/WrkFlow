import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Questionnaire from "@/components/Questionnaire";
import Logo from "@/components/Logo";
import MaineReadout from "@/components/MaineReadout";

/*
  The new-client project questionnaire, served at intake.mlinx.studio (the
  subdomain is rewritten to this route in middleware.ts) and equally at
  mlinx.studio/intake — both are intended entry points, not a fallback.

  Deliberately stripped of the main site's Nav and Footer: this page is a
  focused, one-job surface a prospective client is sent to directly. Every
  extra link is a way out of a form we want them to finish.

  V2 pass, and the one page in the batch that gets the palette WITHOUT the
  header. CLAUDE.md asks inner pages to be built in the `.cp` palette and
  tokens; it does not ask them to grow a nav, and the paragraph above is a
  deliberate decision about this page that predates V2 and still holds. So
  the wrapper goes on, a site header does not, and the wordmark stays the
  only way back to the main site.

  **Nov 27 2026: `.cp-inner` added, and deliberately still no header.** Every
  other inner page took `StageTopBar` in the same pass; this one takes only
  the token half, because the reason it has no nav is the sentence at the
  top of this comment rather than an oversight the pass should tidy up. What
  it would have become otherwise is the one form on the site with six ways
  out of it. It needs the tokens all the same: leaving it on the old `.cp`
  values would have made the questionnaire the one screen in a different
  near-black, which is the same drift by a quieter route.

  Wrapping is enough on its own: `.cp` redefines --color-base, --color-ink,
  --color-muted, --color-line and --color-faint in its own scope, so the
  Questionnaire and MaineReadout below convert untouched. The <main> keeps
  its own `bg-[var(--color-base)]`, which now resolves to the V2 near-black
  rather than the old cream, so the page has a real opaque ground under the
  form instead of inheriting the body's.
*/

export const metadata: Metadata = {
  ...pageMeta({
    title: "Project Questionnaire",
    description:
      "A few questions about your business, how it runs, and your goals, so the first conversation starts from something real. Ten minutes or so, and nothing here is binding.",
    path: "/intake",
  }),
  // Intake, not marketing — it shouldn't compete with the main site in
  // search, and it's reachable on two hostnames, which is a duplicate-content
  // trap if indexed.
  robots: { index: false, follow: false },
};

export default function StartPage() {
  // Server-side gate for the AI concept-preview step: the client never
  // learns whether a key exists, only whether the step should render.
  const previewEnabled = Boolean(process.env.ANTHROPIC_API_KEY);
  return (
    <div className="cp cp-inner">
      <main className="min-h-screen bg-[var(--color-base)]">
      {/* Same wordmark as the main site's nav, so this reads as a page OF
          mlinx.studio rather than a funnel pointed at it. */}
      <header className="mx-auto flex max-w-2xl items-center justify-between px-6 pb-2 pt-10 md:pt-14">
        <a href="https://mlinx.studio" aria-label="M Studio — back to the main site" className="transition-opacity hover:opacity-75">
          <Logo tag />
        </a>
        <a
          href="https://mlinx.studio"
          className="font-mono text-xs text-faint transition-colors hover:text-ink"
        >
          mlinx.studio
        </a>
        <h1 className="sr-only">M Studio project intake</h1>
      </header>

      <Questionnaire previewEnabled={previewEnabled} />

      {/* Live Maine data — the same real-time feed that drives mlinx.studio,
          shown here as quiet proof: this studio builds pages that react to
          the world, and this one is doing it right now. */}
      <footer className="mx-auto max-w-2xl px-6 pb-14">
        <div className="border-t border-line pt-6 opacity-70">
          {/* One quiet line — proof, not a pitch. */}
          <MaineReadout className="text-faint" />
          <p className="mt-4 text-xs text-faint">
            © {new Date().getFullYear()} M Studio · <a href="https://mlinx.studio" className="transition-colors hover:text-ink">mlinx.studio</a> · Built on the Maine coast
          </p>
        </div>
      </footer>
      </main>
    </div>
  );
}
