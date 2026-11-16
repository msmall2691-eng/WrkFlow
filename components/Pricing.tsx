import FAQ from "./FAQ";
import OfferLink from "./OfferLink";
import BookCall from "./BookCall";
import { appOffer, studioStats, testimonial } from "@/lib/content";

/*
  Pricing — the "harbor at night" pricing section. Two ways to work together:
  a custom build (websites, web apps, tools) and the Care Plan that keeps it
  running. CTAs route to contact — no live checkout.

  Oct 2026: the $749 Starter tier was retired so nothing on the page
  anchored the studio as a budget website shop.

  Nov 2026 reverses that worry. Meg is about to start posting to find
  website work, and the risk she actually has is the opposite one: a small
  local business reading a four-figure number and never asking. So the
  custom build shows no price at all, and the affordable things elsewhere on
  the site (free tools, the $99 welcome book, the $250-$900 fixed-scope
  projects below) keep theirs. Looking reachable beats looking premium while
  she is trying to fill a calendar.

  `appOffer` in lib/content.ts still holds the numbers and still drives
  `appFounding`, so restoring a price is reverting one block rather than
  rebuilding the data.
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
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-8 max-w-3xl">
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
            How pricing works
          </h2>
          {/* main's newer framing, which now has to cover the small
              fixed-scope tier as well as the custom build. */}
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
            Small jobs have a fixed price. Bigger builds get a written quote
            first, and nothing starts until you agree to it.
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
                      <article className="cp-tile group flex h-full flex-col !rounded-2xl border-2 !border-[color:var(--cp-violet)] p-7">
              <p className="text-xs text-faint">Custom build</p>
              {/*
                Back to "Let's scope it", which is what this tier said
                originally (brief A6) before a founding rate was put on it.

                Nov 2026: Meg is about to start posting to find website work
                and the thing she least wants is somebody deciding she is out
                of reach before they ask. $1,500 struck through $2,500 was
                the largest number on the site and the first one a visitor
                met on this page.

                `appOffer` is still in lib/content.ts with its numbers, so
                putting the price back is reverting this block, not
                reconstructing the data. The cheap end of the site keeps its
                numbers on purpose; see the note on MarketItem.price.
              */}
              <p className="mt-4 font-display text-3xl text-ink">
                Let&apos;s scope it
              </p>
              <p className="mt-1.5 text-sm text-muted">
                Agreed in writing before you commit to anything
              </p>
              <p className="mt-1 text-xs text-faint">
                One-time · monthly · hybrid
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                A new custom website, CRM, dashboard, or business app, scoped around what you need.
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
                Talk through your project
                <span aria-hidden="true">→</span>
              </OfferLink>
            </article>

          {/* Care Plan */}
                      <article className="cp-tile group flex h-full flex-col !rounded-2xl p-7">
              <p className="text-xs text-faint">Care Plan</p>
              <p className="mt-4 font-display text-3xl text-ink">
                $49
                <span className="text-[1rem] text-faint">/mo</span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-faint">
                Cancel anytime. Your site keeps running; you just take over hosting.
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                Hosting, domain, security and small edits, handled. The stuff
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

        {/*
          The "Smaller projects" grid is gone, and this note is why.

          It listed all four `smallProjects` — website updates, CRM setup,
          data migration, one integration — as a block of their own, which
          was the only place on the site a visitor could see that a $300 job
          was even on offer. The ladder under each service on this same page
          now carries each of those four beside the problem it solves, which
          is both a better place for them and one copy instead of two. Four
          duplicated cards on one page is the thing the homepage rebuild was
          about.

          Nothing was lost in the move: `smallProjects` is still their one
          source, every `offer` key still routes to this page's contact form
          through the ladder's own OfferLink, and a test asserts all four are
          placed. The third-party-costs caveat moved into the strip below,
          since it qualifies the custom build too and was never only about
          the small tier.
        */}

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
                Early clients get a lower rate in exchange for a testimonial
                and permission to show the site as an example.
              </p>
            )}
          </div>

        {/* Moved here from the retired small-projects block: it qualifies
            every tier on the page, not just the cheapest one. */}
        <p className="mt-4 text-xs leading-relaxed text-faint">
          Platform subscriptions, paid plugins, and other third-party costs are
          quoted separately. The Care Plan covers website upkeep; software and
          integration support are scoped separately.
        </p>

        {/* Client words — renders only when a REAL quote exists in
            lib/content.ts (testimonial.quote). Never ship a fabricated one. */}
        {testimonial.quote && (
                      <figure className="mt-8 rounded-2xl border border-gold/30 bg-gold/[0.05] p-6">
              <blockquote className="[font-family:var(--font-serif)] text-lg leading-relaxed text-ink">
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
