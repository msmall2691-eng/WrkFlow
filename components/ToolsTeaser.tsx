import Reveal from "./Reveal";

/*
  ToolsTeaser — compact homepage stand-in for the full free-tools kit.
  The tools themselves (quote calc, invoice maker, signature, QR, site
  check, cost-of-busywork) now live in the Playground on /marketplace,
  so this stays a one-line pitch instead of re-hosting six live tools
  on the homepage.

  Keeps id="tools" — CommandPalette's "Free tools" command and
  WorkflowSpine's rail both scroll to this id in-page (see
  components/CommandPalette.tsx and components/WorkflowSpine.tsx).
*/
export default function ToolsTeaser() {
  return (
    <section id="tools" className="relative overflow-hidden border-t border-line bg-[var(--section-alt-bg)] py-14">
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface/60 px-6 py-5">
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Free quote calculators, invoice makers, QR codes, and more — no
              signup, nothing to wire up.
            </p>
            <a
              href="/marketplace#kit"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-ink"
            >
              Try the free tools
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
