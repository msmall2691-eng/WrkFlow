import type { Metadata } from "next";
import Questionnaire from "@/components/Questionnaire";
import LinxMark from "@/components/LinxMark";
import MaineReadout from "@/components/MaineReadout";

/*
  The new-client project questionnaire, served at intake.mlinx.studio (the
  subdomain is rewritten to this route in middleware.ts) and equally at
  mlinx.studio/intake — both are intended entry points, not a fallback.

  Deliberately stripped of the main site's Nav and Footer: this page is a
  focused, one-job surface a prospective client is sent to directly. Every
  extra link is a way out of a form we want them to finish.
*/

export const metadata: Metadata = {
  title: "Project Questionnaire",
  description:
    "A few questions about your business, how it runs, and your goals, so our first conversation starts from something real. Ten minutes or so, and nothing here is binding.",
  alternates: { canonical: "/intake" },
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
    <main className="min-h-screen bg-[var(--color-base)]">
      <header className="mx-auto max-w-2xl px-6 pb-2 pt-12 md:pt-16">
        <a
          href="https://mlinx.studio"
          className="mb-2 inline-flex items-center gap-2.5 text-ink transition-opacity hover:opacity-75"
        >
          <LinxMark className="h-4 w-auto" />
          <span className="font-mono text-xs uppercase tracking-widest text-gold">
            M Studio
          </span>
        </a>

        {/* The intro screen inside <Questionnaire /> carries the headline,
            time expectations, and trust strip — a second pitch up here would
            just push the first question below the fold. */}
        <h1 className="sr-only">M Studio project intake</h1>
      </header>

      <Questionnaire previewEnabled={previewEnabled} />

      {/* Live Maine data — the same real-time feed that drives mlinx.studio,
          shown here as quiet proof: this studio builds pages that react to
          the world, and this one is doing it right now. */}
      <footer className="mx-auto max-w-2xl px-6 pb-14">
        <div className="border-t border-line pt-6">
          <MaineReadout className="text-faint" />
          <p className="mt-2 text-[12px] leading-relaxed text-faint">
            Live from the Maine coast — this page runs on real-time weather,
            tide, and daylight data, the same kind of live detail we can build
            into yours.
          </p>
        </div>
      </footer>
    </main>
  );
}
