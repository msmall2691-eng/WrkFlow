import FAQ from "./FAQ";
import OfferLink from "./OfferLink";
import BookCall from "./BookCall";
import { appOffer, studioStats, testimonial } from "@/lib/content";

/*
  Pricing — the "harbor at night" pricing section. Two ways to work together:
  a custom build (websites, web apps, tools) and the Care Plan that keeps it
  running. CTAs route to contact — no live checkout.

  The $749 Starter site tier was retired (Oct 2026) so nothing on the page
  anchors the studio as a budget website shop. Custom build is the entry
  point; `appOffer` in lib/content.ts drives its founding price and the
  auto-revert to full price at 0 spots left.
*/

const CUSTOM_BULLETS = [
  "Custom features + integrations",
  "Automations and AI where they help",
  "One-time, monthly, or a hybrid",
  "Always yours to keep",
];

export default function Pricing() {
  const appFounding = appOffer.spotsRemaining > 0;

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-line bg-[var(--section-alt2-bg)] py-20 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-signal/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-8 max-w-3xl">
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
            Pricing that fits where you&apos;re at.
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
            Build it, then keep it running.
          </p>
        </div>


        {/* Offer tiles — the risk-reversal numbers, beside the price where
            that question is actually asked (moved here from the hero band). */}
                  <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {studioStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-line bg-surface/40 px-4 py-3.5"
              >
                <span className="display text-xl text-ink">{s.value}</span>
                <span className="mt-0.5 block text-xs text-faint">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

        {/* items-stretch on ALL breakpoints — the cards must align so the eye
            can compare offers across a horizontal line (survey M-04). */}
        <div className="grid items-stretch gap-5 md:grid-cols-2">
          {/* Custom build — the primary offer, highlighted */}
                      <article className="group corner-accents flex h-full flex-col rounded-2xl border border-signal/60 bg-signal/[0.08] p-7 shadow-[0_28px_60px_-32px_rgba(22,163,148,0.75)] transition-all duration-300 hover:-translate-y-1.5 hover:border-signal/80 hover:shadow-[0_34px_70px_-30px_rgba(22,163,148,0.9)] active:scale-[0.99]">
              <p className="text-xs text-faint">Custom build</p>
              {/* Was "Let's scope it" — the only tier with no number (brief A6).
                  Founding rate for the first ten. */}
              {appFounding ? (
                <>
                  <p className="mt-4 font-display text-3xl text-ink">
                    ${appOffer.price.toLocaleString("en-US")}
                    <span className="ml-2 align-middle text-[1rem] text-faint line-through">
                      ${appOffer.fullPrice.toLocaleString("en-US")}
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm text-muted">Starting price · scoped before you commit</p>
                  <p className="mt-2 text-xs font-medium text-gold">
                    Founding · {appOffer.spotsRemaining} of {appOffer.totalSpots} left
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-4 font-display text-3xl text-ink">
                    ${appOffer.fullPrice.toLocaleString("en-US")}
                  </p>
                  <p className="mt-1.5 text-sm text-muted">Starting price · scoped before you commit</p>
                </>
              )}
              <p className="mt-1 text-xs text-faint">
                One-time · monthly · hybrid
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Websites, apps, tools, and workflows — built around how you run.
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {CUSTOM_BULLETS.map((b) => (
                  <li key={b}>
                    <Bullet>{b}</Bullet>
                  </li>
                ))}
              </ul>
              <OfferLink
                offer="custom"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Tell me what you need
                <span aria-hidden="true">→</span>
              </OfferLink>
            </article>

          {/* Care Plan */}
                      <article className="group corner-accents flex h-full flex-col rounded-2xl border border-line bg-surface/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-signal/40 hover:bg-surface/80 hover:shadow-[0_28px_60px_-32px_rgba(11,23,34,0.35)] active:scale-[0.99]">
              <p className="text-xs text-faint">Care Plan</p>
              <p className="mt-4 font-display text-3xl text-ink">
                $49
                <span className="text-[1rem] text-faint">/mo</span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-faint">
                Cancel anytime — your site keeps running, you just take over hosting.
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                Hosting, domain, security, and small edits — handled. The stuff
                that keeps a site running, off your plate.
              </p>
              <OfferLink
                offer="care"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-signal/50 px-6 py-3 text-sm font-semibold text-signal transition-colors hover:bg-signal/10"
              >
                Keep it running
                <span aria-hidden="true">→</span>
              </OfferLink>
            </article>
        </div>

        {/* Under-row strip — the softer second option and the founding terms,
            kept out of the cards so nothing sits below a button (survey O-06). */}
                  <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-line bg-surface/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <BookCall
              where="pricing"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              Not ready to commit? Book a free 15-min call
              <span aria-hidden="true">→</span>
            </BookCall>
            {appFounding && (
              <p className="max-w-sm text-xs leading-relaxed text-faint">
                Founding pricing includes a testimonial + permission to feature your site in our portfolio.
              </p>
            )}
          </div>

        {/* Client words — renders only when a REAL quote exists in
            lib/content.ts (testimonial.quote). Never ship a fabricated one. */}
        {testimonial.quote && (
                      <figure className="mt-8 rounded-2xl border border-gold/30 bg-gold/[0.05] p-6">
              <blockquote className="text-lg leading-relaxed text-ink">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-xs text-faint">
                — {testimonial.name}
                {testimonial.business ? ` · ${testimonial.business}` : ""}
              </figcaption>
            </figure>
        )}

        {/* The objections these answer are all about the numbers above. */}
        <FAQ />
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  // No wrapping element here — the parent <li> is already the
  // real <li>; this used to render its own nested <li>, which is invalid
  // HTML and was causing a hydration mismatch.
  return (
    <>
      <span aria-hidden="true" className="mt-0.5 text-signal">✓</span>
      <span>{children}</span>
    </>
  );
}
