import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/lib/content";

/*
  OneJob — the homepage's whole argument, told once, on one project.

  **This is what the three duplicate work blocks became.** The page used to
  name four projects three times and tell none of them: a rotating window of
  screenshots, a tile of project names, and three cards whose text was
  copied from the tile. A visitor left knowing four titles and nothing about
  what any of them changed for anybody. Meg's note was that nothing on the
  page made her want to hire whoever built it, which is the predictable
  result of showing four things and arguing none of them.

  So the page now spends its evidence on ONE job, in the four beats somebody
  actually asks about: what was wrong, what got built, what changed, and
  where to look next. The other work is a short list below (MoreWork), each
  item appearing exactly once on the page.

  **It is The Maine Cleaning Co. because that is the only project on this
  site with all four beats confirmed.** Everything here is read from
  `caseStudies`, which means:

    · the problem is Meg's own approved wording (Oct 2026), not written here;
    · the four build steps carry real captures of real screens;
    · the three results are the only confirmed outcome numbers in the repo
      (12 paid tools covered, verified against bank records; 4,028 automated
      checks counted in the BrightBase repo; daily use since 2026).

  `testimonial`, every `WorkItem.metric`, and the `results` on the other two
  case studies are all still empty, and CLAUDE.md is explicit that they
  render nothing until Meg fills them. So this section does not get a quote
  or a client outcome, because there is not one to show. It gets the one
  real story, which beats three thin ones.

  **The problem renders as an attributed quote rather than as the site's own
  prose, on purpose.** CLAUDE.md dropped first person from the site's voice
  on Nov 14; this text is first person because it is somebody's account of
  their own business, which is the one thing that rule explicitly still
  allows ("where attribution is genuinely needed, name her"). Rendered as
  unattributed body copy it would read as the site saying "I", which is the
  thing that was removed. With a name on it, it is the only real voice
  anywhere on the site.

  Honesty note: the tag is shown, so the fact that this is Meg's own company
  rather than an outside client is on screen in her own vocabulary and
  cannot be mistaken.
*/

const STUDY = caseStudies.find((c) => c.slug === "maine-cleaning-co");

export default function OneJob() {
  /* Keyed by slug, so a rename does not silently render an empty section. */
  if (!STUDY) return null;

  const built = STUDY.built.filter((b) => b.shot);

  return (
    <section id="work" className="relative border-t border-[color:var(--cp-line)] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="m-0 text-[12px] uppercase tracking-wider text-[color:var(--cp-faint)]">
          {STUDY.tag}
        </p>
        <h2 className="mt-3 text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-4xl">
          One job, start to finish.
        </h2>
        {/* Names the company and, below, the system. The first draft of this
            section named neither: it showed four screenshots of maineclean.co
            and a link reading "inside the system", so the one concrete,
            checkable business on the page was anonymous. A story about a real
            company that will not say which company is a story a visitor
            discounts. */}
        <p className="mt-3 max-w-2xl text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
          {STUDY.title} was paying for twelve tools that did not talk to each
          other. It runs on one system now, and the office and the field crews
          still open it every morning.
        </p>

        {/* Beat 1 — what was wrong, in the words of the person it was wrong for. */}
        {STUDY.problem ? (
          <figure className="mt-10 max-w-3xl border-l-2 border-[color:var(--cp-violet-line)] pl-5 sm:pl-7">
            <blockquote className="m-0 [font-family:var(--font-serif)] text-[1.0625rem] leading-relaxed text-[color:var(--cp-ink)] sm:text-[1.1875rem]">
              {STUDY.problem}
            </blockquote>
            <figcaption className="mt-3 text-[13px] text-[color:var(--cp-faint)]">
              Megan Small, who was running the company at the time
            </figcaption>
          </figure>
        ) : null}

        {/* Beat 2 — what got built. Real captures; the argument is the screen. */}
        {built.length > 0 ? (
          <div className="mt-14">
            <h3 className="text-[1.125rem] font-semibold text-[color:var(--cp-ink)]">
              What got built
            </h3>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {built.map((b) => (
                <li key={b.label} className="cp-tile flex flex-col overflow-hidden">
                  {/* object-top: these are full screens, and the top is the
                      part that says what the thing is. */}
                  <div className="relative aspect-[16/10] border-b border-[color:var(--cp-line)] bg-[color:var(--cp-well)]">
                    <Image
                      src={b.shot!.src}
                      alt={b.shot!.alt}
                      fill
                      sizes="(min-width: 640px) 560px, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h4 className="m-0 text-[15px] font-semibold text-[color:var(--cp-ink)]">
                      {b.label}
                    </h4>
                    <p className="m-0 mt-2 text-[14px] leading-relaxed text-[color:var(--cp-muted)]">
                      {b.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Beat 3 — what changed. REAL numbers only; [] renders nothing. */}
        {STUDY.results.length > 0 ? (
          <div className="mt-14 border-t border-[color:var(--cp-line)] pt-10">
            <h3 className="text-[1.125rem] font-semibold text-[color:var(--cp-ink)]">
              What changed
            </h3>
            <dl className="mt-6 grid gap-6 sm:grid-cols-3">
              {STUDY.results.map((r) => (
                <div key={r.label}>
                  <dt className="sr-only">{r.label}</dt>
                  <dd className="m-0">
                    <span className="block font-display text-3xl font-semibold text-[color:var(--cp-ink)] md:text-4xl">
                      {r.value}
                    </span>
                    <span className="mt-2 block text-[14px] leading-relaxed text-[color:var(--cp-muted)]">
                      {r.label}
                    </span>
                    {r.attribution ? (
                      <span className="mt-1 block text-[12.5px] text-[color:var(--cp-faint)]">
                        {r.attribution}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {/* Beat 4 — where to look next. Three different destinations, each
            genuinely different: the written story, the running site, and the
            system behind it. */}
        {/* `inline-flex` + `py-1` on each link, so the tap target clears the
            24x24 minimum (WCAG 2.5.8) on a phone. As text they rendered 23px
            tall, which looks identical to a correct one and is the exact
            failure the tap-target test was written for. */}
        <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-1 text-[15px] font-semibold">
          <Link
            href={`/work/${STUDY.slug}`}
            className="group inline-flex items-center py-1 text-[color:var(--cp-violet-ink)] no-underline transition-opacity duration-150 hover:opacity-80"
          >
            How it was built{" "}
            <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
              →
            </span>
          </Link>
          <Link
            href="/brightbase"
            className="group inline-flex items-center py-1 text-[color:var(--cp-violet-ink)] no-underline transition-opacity duration-150 hover:opacity-80"
          >
            Inside BrightBase{" "}
            <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
              →
            </span>
          </Link>
          {STUDY.url ? (
            <a
              href={STUDY.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center py-1 font-medium text-[color:var(--cp-muted)] no-underline transition-colors duration-150 hover:text-[color:var(--cp-ink)]"
            >
              Open the live site ↗
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
