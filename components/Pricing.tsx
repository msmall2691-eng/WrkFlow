import Reveal from "./Reveal";
import CountUp from "./CountUp";
import { foundingOffer } from "@/lib/content";

/*
  Pricing — the "harbor at night" pricing section. Three honest ways to work
  together (own a Starter site, keep it running on the Care Plan, or scope
  something custom) plus the founding offer. Collaborative you + we voice.
  CTAs route to contact — no live checkout.

  Founding pricing ($399, split $199/$200) is a RISK-REVERSAL restructure of
  the same $750 site, not a discount stunt — `foundingOffer.spotsRemaining`
  in lib/content.ts is the one real number driving the banner, the Starter
  card, and the auto-revert to full price at 0 spots left.
*/

const STARTER_BULLETS = [
  "See your homepage design before you commit",
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
            <p className="mt-4 text-base leading-relaxed text-muted">
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
                <span className="text-faint line-through">${foundingOffer.fullPrice}</span>.
              </span>
            </div>
          </Reveal>
        )}

        <div className="grid items-stretch gap-5 md:grid-cols-3 md:items-center">
          {/* Starter site */}
          <Reveal delay={60}>
            <article className="group corner-accents flex h-full flex-col rounded-2xl border border-line bg-surface/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-signal/40 hover:bg-surface/80 hover:shadow-[0_28px_60px_-32px_rgba(22,163,148,0.4)] active:scale-[0.99]">
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">Starter site</p>
              {foundingActive ? (
                <>
                  <p className="mt-4 font-display text-3xl text-ink">
                    <CountUp value={foundingOffer.price} prefix="$" />
                    <span className="ml-2 align-middle text-base text-faint line-through">${foundingOffer.fullPrice}</span>
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
                  <Reveal key={b} delay={180 + i * 60} as="li">
                    <Bullet>{b}</Bullet>
                  </Reveal>
                ))}
              </ul>
              <a href="#contact" className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-ink">
                {foundingActive ? "Claim a founding spot" : "Get a Starter site"}
                <span aria-hidden="true">→</span>
              </a>
              {foundingActive && (
                <p className="mt-3 text-xs leading-relaxed text-faint">
                  Founding pricing includes a testimonial + permission to feature your site in our portfolio.
                </p>
              )}
            </article>
          </Reveal>

          {/* Care Plan — default, highlighted */}
          <Reveal delay={120}>
            <article className="group corner-accents flex h-full flex-col rounded-2xl border border-signal/60 bg-signal/[0.08] p-7 shadow-[0_28px_60px_-32px_rgba(22,163,148,0.75)] transition-all duration-300 hover:-translate-y-1.5 hover:border-signal/80 hover:shadow-[0_34px_70px_-30px_rgba(22,163,148,0.9)] active:scale-[0.99] md:scale-[1.03]">
              <span className="absolute right-5 top-5 rounded-full border border-signal/40 bg-signal/25 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-signal shadow-[0_0_20px_-4px_rgba(22,163,148,0.6)]">
                Most keep this
              </span>
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">Care Plan</p>
              <p className="mt-4 font-display text-3xl text-ink">
                <CountUp value={49} prefix="$" />
                <span className="text-base text-faint">/mo</span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-faint">
                Cancel anytime — your site keeps running, you just take over hosting.
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                Hosting, domain, security, and small edits — handled. The stuff
                that keeps a site running, off your plate.
              </p>
              <a href="#contact" className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-ink">
                Keep it running
                <span aria-hidden="true">→</span>
              </a>
            </article>
          </Reveal>

          {/* Custom build */}
          <Reveal delay={180}>
            <article className="group corner-accents flex h-full flex-col rounded-2xl border border-line bg-surface/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-signal/40 hover:bg-surface/80 hover:shadow-[0_28px_60px_-32px_rgba(22,163,148,0.4)] active:scale-[0.99]">
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">Custom build</p>
              <p className="mt-4 font-display text-3xl text-ink">Let&apos;s scope it</p>
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
              <a href="#contact" className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-ink">
                Tell me what you need
                <span aria-hidden="true">→</span>
              </a>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-muted">
      <span aria-hidden="true" className="mt-0.5 text-signal">✓</span>
      <span>{children}</span>
    </li>
  );
}
