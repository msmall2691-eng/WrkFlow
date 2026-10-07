import Reveal from "./Reveal";
import OfferLink from "./OfferLink";
import CountUp from "./CountUp";
import { appOffer, foundingOffer, studioStats, testimonial } from "@/lib/content";

/*
  NOT CURRENTLY MOUNTED. Pricing came off the site (Meg's call) — every number
  now arrives in a written scope instead of on a card, and the FAQ answers
  "what does it cost" without one. The section is kept intact rather than
  deleted because the decision is a reversible one: put <Pricing /> back into
  app/page.tsx, restore the "Pricing" link in Nav.tsx, and it returns exactly
  as it was. Two things left when it was unmounted and should NOT be put back
  by hand: <FAQ /> is now its own homepage section, and the studioStats tiles
  moved there with it.

  Pricing — the "harbor at night" pricing section. Three honest ways to work
  together (own a Starter site, keep it running on the Care Plan, or scope
  something custom) plus the founding offer. Collaborative you + we voice.
  CTAs route to contact — no live checkout.

  Founding pricing (foundingOffer.price, split deposit/balance) is a RISK-REVERSAL restructure of
  the same full-price site, not a discount stunt — `foundingOffer.spotsRemaining`
  in lib/content.ts is the one real number driving the banner, the Starter
  card, and the auto-revert to full price at 0 spots left.
*/

const STARTER_BULLETS = [
  "Free 15-min concept call — no obligation",
  "Up to 3 rounds of revisions on your homepage design before you commit",
  "Custom design — never a template",
  "Your core pages + a contact or booking form",
  "Set up, connected, and live",
  "You own it outright",
];

const CUSTOM_BULLETS = [
  "Custom features + integrations",
  "Automations and AI where they help",
  "One-time, monthly, or a hybrid",
  "Always yours to keep",
];

export default function Pricing() {
  const spotsLeft = foundingOffer.spotsRemaining;
  const foundingActive = spotsLeft > 0;
  const appFounding = appOffer.spotsRemaining > 0;

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-line bg-[var(--section-alt2-bg)] py-20 md:py-24"
    >
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-signal/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-8 max-w-3xl">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">Pricing</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 display text-2xl text-ink sm:text-3xl md:text-4xl">
              Pricing that fits where you&apos;re at.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-[1rem] leading-relaxed text-muted">
              Own it, keep it running, or scope something bigger.
            </p>
          </Reveal>
        </div>

        {/* Founding offer banner — hides once spotsRemaining hits 0 */}
        {foundingActive && (
          <Reveal delay={140}>
            <div
              id="founding"
              className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-gold/40 bg-gold/[0.08] px-5 py-3.5"
            >
              <span className="rounded-full bg-gold/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-gold">
                {spotsLeft} of {foundingOffer.totalSpots} founding spots left
              </span>
              <span className="text-sm text-ink">
                Get a full Starter site for{" "}
                <CountUp value={foundingOffer.price} prefix="$" className="font-semibold text-gold" />{" "}
                <span className="text-faint line-through">${foundingOffer.fullPrice.toLocaleString("en-US")}</span>.
              </span>
            </div>
          </Reveal>
        )}

        {/* Offer tiles — the risk-reversal numbers, beside the price where
            that question is actually asked (moved here from the hero band). */}
        <Reveal delay={150}>
          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {studioStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-line bg-surface/40 px-4 py-3.5"
              >
                <span className="display text-xl text-ink">{s.value}</span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-faint">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* items-stretch on ALL breakpoints — the three cards must align so
            the eye can compare offers across a horizontal line (survey M-04). */}
        <div className="grid items-stretch gap-5 md:grid-cols-3">
          {/* Starter site */}
          <Reveal delay={60}>
            <article className="group corner-accents flex h-full flex-col rounded-2xl border border-line bg-surface/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-signal/40 hover:bg-surface/80 hover:shadow-[0_28px_60px_-32px_rgba(22,163,148,0.4)] active:scale-[0.99]">
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">Starter site</p>
              {foundingActive ? (
                <>
                  <p className="mt-4 font-display text-3xl text-ink">
                    <CountUp value={foundingOffer.price} prefix="$" />
                    <span className="ml-2 align-middle text-[1rem] text-faint line-through">${foundingOffer.fullPrice.toLocaleString("en-US")}</span>
                  </p>
                  <p className="mt-1.5 text-sm text-muted">
                    ${foundingOffer.deposit} to start · ${foundingOffer.balance} at launch
                  </p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-gold">
                    Founding · {spotsLeft} of {foundingOffer.totalSpots} left
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-faint">
                    You approve the design before the second payment.
                  </p>
                </>
              ) : (
                <p className="mt-4 font-display text-3xl text-ink">
                  <CountUp value={foundingOffer.fullPrice} prefix="$" />
                </p>
              )}
              <p className="mt-4 text-sm leading-relaxed text-muted">
                A real, custom site — designed, built, and launched. Yours to own.
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {STARTER_BULLETS.map((b, i) => (
                  <Reveal key={b} delay={180 + i * 60} as="li" className="flex items-start gap-2.5 text-sm text-muted">
                    <Bullet>{b}</Bullet>
                  </Reveal>
                ))}
              </ul>
              {/* The card's one real button — the highest-intent element on
                  the page gets the strongest treatment (per site survey). */}
              {/* Every card ends on its button, so the three CTAs share one
                  baseline (survey O-06). The call and the founding fine print
                  moved to the strip under the whole row. */}
              <OfferLink
                offer="starter"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                {foundingActive ? "Claim a founding spot" : "Get a Starter site"}
                <span aria-hidden="true">→</span>
              </OfferLink>
            </article>
          </Reveal>

          {/* Care Plan — default, highlighted */}
          <Reveal delay={120}>
            <article className="group corner-accents flex h-full flex-col rounded-2xl border border-signal/60 bg-signal/[0.08] p-7 shadow-[0_28px_60px_-32px_rgba(22,163,148,0.75)] transition-all duration-300 hover:-translate-y-1.5 hover:border-signal/80 hover:shadow-[0_34px_70px_-30px_rgba(22,163,148,0.9)] active:scale-[0.99]">
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">Care Plan</p>
              <p className="mt-4 font-display text-3xl text-ink">
                <CountUp value={49} prefix="$" />
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
          </Reveal>

          {/* Custom build */}
          <Reveal delay={180}>
            <article className="group corner-accents flex h-full flex-col rounded-2xl border border-line bg-surface/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-signal/40 hover:bg-surface/80 hover:shadow-[0_28px_60px_-32px_rgba(22,163,148,0.4)] active:scale-[0.99]">
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">Custom build</p>
              {/* Was "Let's scope it" — the only tier with no number, which
                  meant every app enquiry anchored to the $749 website (brief
                  A6). Founding rate for the first ten, same as the Starter. */}
              {appFounding ? (
                <>
                  <p className="mt-4 font-display text-3xl text-ink">
                    <CountUp value={appOffer.price} prefix="$" />
                    <span className="ml-2 align-middle text-[1rem] text-faint line-through">
                      ${appOffer.fullPrice.toLocaleString("en-US")}
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm text-muted">Starting price · scoped before you commit</p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-gold">
                    Founding · {appOffer.spotsRemaining} of {appOffer.totalSpots} left
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-4 font-display text-3xl text-ink">
                    <CountUp value={appOffer.fullPrice} prefix="$" />
                  </p>
                  <p className="mt-1.5 text-sm text-muted">Starting price · scoped before you commit</p>
                </>
              )}
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-faint">
                One-time · monthly · hybrid
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Websites, apps, tools, and workflows — built around how you run.
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {CUSTOM_BULLETS.map((b, i) => (
                  <Reveal key={b} delay={240 + i * 60} as="li">
                    <Bullet>{b}</Bullet>
                  </Reveal>
                ))}
              </ul>
              <OfferLink
                offer="custom"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-signal/50 px-6 py-3 text-sm font-semibold text-signal transition-colors hover:bg-signal/10"
              >
                Tell me what you need
                <span aria-hidden="true">→</span>
              </OfferLink>
            </article>
          </Reveal>
        </div>

        {/* Under-row strip — the softer second option and the founding terms,
            lifted out of the Starter card so nothing sits below a button
            (survey O-06). */}
        <Reveal delay={220}>
          <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-line bg-surface/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <OfferLink
              offer="call"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              Not ready to commit? Book a free 15-min call
              <span aria-hidden="true">→</span>
            </OfferLink>
            {foundingActive && (
              <p className="max-w-sm text-xs leading-relaxed text-faint">
                Founding pricing includes a testimonial + permission to feature your site in our portfolio.
              </p>
            )}
          </div>
        </Reveal>

        {/* Client words — renders only when a REAL quote exists in
            lib/content.ts (testimonial.quote). Never ship a fabricated one. */}
        {testimonial.quote && (
          <Reveal delay={200}>
            <figure className="mt-8 rounded-2xl border border-gold/30 bg-gold/[0.05] p-6">
              <blockquote className="[font-family:var(--font-serif)] text-lg leading-relaxed text-ink">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-widest text-faint">
                — {testimonial.name}
                {testimonial.business ? ` · ${testimonial.business}` : ""}
              </figcaption>
            </figure>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  // No wrapping element here — the parent <Reveal as="li"> is already the
  // real <li>; this used to render its own nested <li>, which is invalid
  // HTML and was causing a hydration mismatch.
  return (
    <>
      <span aria-hidden="true" className="mt-0.5 text-signal">✓</span>
      <span>{children}</span>
    </>
  );
}
