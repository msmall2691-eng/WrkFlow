import Image from "next/image";
import Link from "next/link";
import { caseStudies, provingGround } from "@/lib/content";

/*
  The middle of the homepage.

  V2 compressed the page to a control panel and a contact form, and the only
  route to Meg's actual work became four one-line links inside a tile. For a
  site whose job is to win website and web-app projects, a visitor who wants
  to see what she has built was getting a list of names. This is the part
  that shows them.

  Three case studies, each led by its real screenshot, because the argument
  is the screen and not the sentence next to it. The copy is whatever
  lib/content.ts already holds: outcomes Meg wrote, nothing invented here.

  Kept deliberately calm, which is the note she gave on the first V2 cut.
  No loop, no scroll reveal, no stagger: one hover state per card, and the
  cards are plain links so the whole surface is the target. The only moving
  thing on this page stays the aurora.

  This section owns id="work", so it is where the hero's "See the work"
  button, the nav and footer Work links, and /#work from any inner page all
  land. It used to be the small "My work" tile inside the panel; see the
  comment on that tile in components/ControlPanel.tsx. Only one element may
  carry the id, and e2e/smoke.spec.ts asserts it is this one.
*/
export default function WorkBelow() {
  return (
    <section id="work" className="relative border-t border-[var(--cp-line)] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/*
          No "see all" link beside the heading, because there is nowhere for it
          to go: the repo has app/work/[slug] and no app/work index, so a /work
          link would 404. Every card is its own link to its own case study,
          which is the route a visitor actually wants from here. If an index
          page ever lands, that is the moment to add the link, not before.
        */}
        <h2 className="text-[1.75rem] font-semibold tracking-tight text-[var(--cp-ink)] sm:text-4xl">
          Things I built that are running right now.
        </h2>
        <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-[var(--cp-muted)]">
          Real businesses use each of these every day. Open one to see what it
          does and what it replaced.
        </p>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {caseStudies.map((cs) => (
            <li key={cs.slug}>
              <Link
                href={`/work/${cs.slug}`}
                className="cp-tile group flex h-full flex-col overflow-hidden"
              >
                {/*
                  object-top, not object-cover centred: these captures are full
                  pages, and the top is the part that says what the thing is.
                */}
                <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--cp-line)]">
                  <Image
                    src={cs.hero.src}
                    alt={cs.hero.alt}
                    fill
                    sizes="(min-width: 768px) 380px, 100vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold text-[var(--cp-ink)]">
                    {cs.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--cp-muted)]">
                    {cs.outcome}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-[var(--cp-violet-ink)]">
                    See how it works{" "}
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/*
          The operating numbers, which are Meg's own company's and are labelled
          as such in lib/content.ts. They sit under the work rather than above
          it: the screens earn the attention, these explain where the judgement
          came from.
        */}
        <div className="mt-12 border-t border-[var(--cp-line)] pt-8">
          <p className="text-xs uppercase tracking-wider text-[var(--cp-faint)]">
            {provingGround.label}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {provingGround.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-2xl font-semibold text-[var(--cp-ink)] md:text-3xl">
                    {s.value}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--cp-muted)]">
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
