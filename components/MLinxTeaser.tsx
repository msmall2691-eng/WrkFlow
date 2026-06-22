import Reveal from "./Reveal";
import LinxMark from "./LinxMark";

/*
  M Linx teaser — a single, quiet card pointing to the marketplace. The full
  free-tools kit and the live estimator live on /marketplace now; the homepage
  stays focused on the custom studio work. Keeps id="kit" so the page rail and
  command palette still land here.
*/
export default function MLinxTeaser() {
  return (
    <section id="kit" className="relative overflow-hidden border-t border-line py-14 md:py-20">
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <a
            href="/marketplace"
            className="group block rounded-2xl border border-line bg-surface/60 p-8 transition-colors hover:border-signal/50 md:flex md:items-center md:justify-between md:gap-8"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-ink">
                <LinxMark className="h-3.5 w-auto" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                  M Linx
                </span>
              </span>
              <h2 className="display-serif mt-3 text-xl text-ink md:text-2xl">
                Free tools for trades
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Quotes, invoices, a real site-speed check, and more — free to use,
                no signup.
              </p>
            </div>
            <span className="mt-5 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-signal md:mt-0">
              Explore M Linx
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
