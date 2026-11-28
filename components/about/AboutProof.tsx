import Link from "next/link";
import Reveal from "../Reveal";
import { aboutPage, work, type WorkItem } from "@/lib/content";

/*
  The proof, as a list of doors rather than a wall of pictures.

  **This is the section /about did not have.** The page argued, in four
  paragraphs, that somebody who ran a service business built this
  software, and then gave a reader who believed it nowhere to check. The
  homepage shows four of the nine builds as captures; this shows all nine
  as rows, and the point of a row is that it is clickable.

  **One destination per item, decided the way the work cards already
  decide it.** `WorkItem` carries up to three — a case study, an internal
  page and a live URL — and `lib/content.ts` records the rule for which
  wins: "Set it and the card links INWARD to the case study; the external
  'visit live site' link then lives on that page, not on the card. One
  card, one destination." So: case study, then internal page, then the
  live site. Writing a second rule here is how two parts of a site start
  disagreeing about where a project lives.

  **An item with no public destination is listed and not linked.** Three
  of the nine are private systems running inside businesses, and quietly
  dropping them would understate the work while quietly linking them
  would be a dead end. The row says which it is, and `status` says it is
  in use.

  **Nothing counts anything.** There is no "nine projects" sentence: the
  rows say how many there are by being that many, which is the decision
  already recorded on `homeBands.services` about the word "Four".
*/

type Door = { href: string; label: string; external: boolean } | null;

/** Where a row goes, or null when the system is private. */
function doorFor(item: WorkItem): Door {
  if (item.caseStudy)
    return {
      href: `/work/${item.caseStudy}`,
      label: aboutPage.proof.caseStudy,
      external: false,
    };
  if (item.page)
    return { href: item.page, label: aboutPage.proof.inside, external: false };
  if (item.url)
    return { href: item.url, label: aboutPage.proof.live, external: true };
  return null;
}

export default function AboutProof() {
  return (
    <section id="proof" className="relative border-b border-line py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-faint">
            {aboutPage.proof.eyebrow}
          </p>
          <h2 className="display mt-3 text-2xl text-ink sm:text-3xl md:text-4xl">
            {aboutPage.proof.heading}
          </h2>
          <p className="mt-4 text-[1rem] leading-relaxed text-muted">
            {aboutPage.proof.note}
          </p>
        </Reveal>

        <ul className="mt-10 border-t border-line">
          {work.map((item, i) => {
            const door = doorFor(item);

            const body = (
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5">
                <div>
                  <h3 className="display text-lg text-ink transition-colors group-hover:text-signal sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-faint">
                    {item.tag}
                  </p>
                </div>
                {door ? (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-signal">
                    {door.label}
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    >
                      {door.external ? "↗" : "→"}
                    </span>
                  </span>
                ) : (
                  <span className="text-sm text-faint">
                    {aboutPage.proof.locked}
                  </span>
                )}
              </div>
            );

            return (
              <li key={item.title} className="border-b border-line">
                <Reveal delay={Math.min(i, 4) * 40}>
                  {door ? (
                    door.external ? (
                      <a
                        href={door.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group block"
                      >
                        {body}
                      </a>
                    ) : (
                      <Link href={door.href} className="group block">
                        {body}
                      </Link>
                    )
                  ) : (
                    body
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>

        {/*
          **A link to `/catalog` closed this list and came out on Nov 28
          2026.** Its label is `homeBands.work.all`, which reads
          "Everything built, with prices", and Meg asked for prices off
          this page until the shape of the site is settled. Relabelling it
          here would have made this a second author for a string the
          homepage owns; the homepage still carries the link.
        */}
      </div>
    </section>
  );
}
