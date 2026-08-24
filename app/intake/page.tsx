import type { Metadata } from "next";
import Questionnaire from "@/components/Questionnaire";
import LinxMark from "@/components/LinxMark";

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
  return (
    <main className="min-h-screen bg-[var(--color-base)]">
      <header className="mx-auto max-w-2xl px-6 pb-2 pt-14 md:pt-20">
        <a
          href="https://mlinx.studio"
          className="mb-9 inline-flex items-center gap-2.5 text-ink transition-opacity hover:opacity-75"
        >
          <LinxMark className="h-4 w-auto" />
          <span className="font-mono text-xs uppercase tracking-widest text-gold">
            M Studio
          </span>
        </a>

        <h1 className="display-serif text-3xl leading-[1.1] text-ink sm:text-4xl md:text-5xl">
          Let&apos;s scope your project.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
          A few questions about your business, how it runs, and what
          you&apos;re trying to build — so our first conversation starts from
          something real instead of a blank page. Ten minutes or so, most of it
          optional, and nothing here is binding.
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-faint">
          Your answers save as you go, so you can close this and come back.
        </p>
      </header>

      <Questionnaire />
    </main>
  );
}
