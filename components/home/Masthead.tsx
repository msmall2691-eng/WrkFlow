import DepthPlate from "./DepthPlate";
import BookCall from "../BookCall";
import PanelHeader from "../panel/PanelHeader";
import { provingGround, work } from "@/lib/content";

/*
  The masthead, rebuilt in the register Meg actually chose.

  **This replaces the storefront-and-engine hero, which she hated, and the
  reason it was wrong is worth writing down so it is not rebuilt.** That
  one put glowing violet geometry on a near-black-feeling scene and asked
  a visitor to hover blocks. The sites she picked out, shown one after
  another, agree with each other completely and disagree with that:

    · a cream ground and a very large serif headline, second line italic;
    · ONE real photograph doing the work, large, with depth that answers
      the cursor;
    · a short supporting paragraph set small, in a column to the right;
    · tiny uppercase mono metadata under and around it — a caption on the
      picture, a strip of facts along the foot;
    · nothing else on the screen.

  The craft is the typography and the picture. The motion exists to make
  the picture feel like a place, and stops there.

  **Everything on it is already hers and already true.** The headline and
  the supporting line are the ones that were on the page. The picture is
  `work[0].shot`, a real capture of the real site. The foot strip is
  `provingGround`, The Maine Cleaning Co's own operating history, which is
  the only confirmed hard evidence on this site and which the reference
  layout happens to have the perfect slot for: Brume runs
  "BRUME ARCHITECTS · ASPEN / DENVER · EST. 2009 · VIEW 18 PROJECTS" along
  exactly that line.

  Fraunces, JetBrains Mono and the cream ground were all already loaded
  and set. Nothing new was added to the page to do this.
*/

/* The hero picture is the flagship's own capture, read rather than named
   here, so it cannot drift from what the work list says is real. */
const FLAGSHIP = work.find((w) => w.shot === "/shots/maineclean.png");

export default function Masthead() {
  return (
    <section className="relative" aria-labelledby="masthead-heading">
      {/*
        The site nav. It lived inside the old hero, so replacing that hero
        took the whole header off the homepage with it, which no build,
        test or type error reported: the page rendered perfectly with no
        way to reach Work, Demos, Services, the Catalog or About. Caught
        by looking at a screenshot. Every other page that wears the panel
        renders it this same way.
      */}
      <PanelHeader />

      <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-12 lg:pt-16">
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--cp-faint)]">
          Custom software · Southern Maine · clients anywhere
        </p>

        {/*
          Headline left, supporting line right, which is the reference
          layout rather than a preference: the eye lands on the big serif,
          then falls to the picture, and the paragraph is there for the
          one visitor in ten who wants prose before proof.
        */}
        <div className="mt-7 grid items-end gap-6 lg:grid-cols-[minmax(0,1.95fr)_minmax(0,1fr)] lg:gap-10">
          <h1
            id="masthead-heading"
            className="m-0 font-serif text-[clamp(2.6rem,5.9vw,4.9rem)] font-normal leading-[0.94] tracking-[-0.02em] text-[color:var(--cp-ink)]"
          >
            Software that
            <br />
            <em className="font-normal italic">runs real businesses.</em>
          </h1>

          <p className="m-0 max-w-[34ch] text-[1rem] leading-relaxed text-[color:var(--cp-muted)] lg:pb-3">
            Websites, web apps and custom tools for small businesses. Built to
            bring work in, and to cut the manual parts out.
          </p>
        </div>

        {/* The picture. Real capture, real depth, one of them. */}
        <div className="mt-10">
          {FLAGSHIP?.shot ? (
            <DepthPlate
              src={FLAGSHIP.shot}
              alt={`${FLAGSHIP.title}, the site and booking system as it runs today`}
            />
          ) : null}

          <p className="m-0 mt-3 text-right font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--cp-faint)]">
            {FLAGSHIP?.title ?? ""} · built and running
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <BookCall
            where="hero"
            className="cp-cta inline-flex items-center gap-2.5 rounded-xl px-5 py-3.5 text-[15px] font-semibold text-white no-underline transition-transform duration-150 hover:-translate-y-0.5"
          >
            Book a free 15-min call <span aria-hidden="true">→</span>
          </BookCall>
          <a
            href="#shelf"
            className="inline-flex items-center rounded-xl border border-[color:var(--cp-hairline-strong)] px-5 py-3.5 text-[15px] font-medium text-[color:var(--cp-ink)] no-underline transition-colors duration-150 hover:border-[color:var(--cp-violet-line)]"
          >
            See everything, with prices
          </a>
        </div>
      </div>

      {/*
        The foot strip: her four real numbers, set as metadata rather than
        as a stat block. Same facts, same attribution, in the idiom the
        reference sites use for exactly this line.
      */}
      <div className="border-t border-[color:var(--cp-line)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-5">
          <p className="m-0 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--cp-faint)]">
            {provingGround.label}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            {provingGround.stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="sr-only">{s.label}</dt>
                <dd className="m-0 flex flex-wrap items-baseline gap-x-2">
                  <span className="font-serif text-[1.45rem] leading-none text-[color:var(--cp-ink)]">
                    {s.value}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--cp-muted)]">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
