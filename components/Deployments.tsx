import Image from "next/image";
import Link from "next/link";
import { work, type WorkItem } from "@/lib/content";
import Reveal from "./Reveal";

/*
  Work — the proof, and now a way into it.

  The cards used to link straight out to the live site, which meant the best
  thing on the page sent people away from it. The three projects that have a
  case study now link INWARD to /work/[slug]; the "visit live site" link
  lives on that page. One card, one destination.

  The caption had to change with it. A card linking to /work/maine-cleaning-co
  while printing "maineclean.co" underneath is the chrome lying about where
  the click goes, which is the thing lib/content.ts `displayDomain` exists to
  forbid.

  The three private systems keep their old behaviour — no link, screenshot
  only — but sit in a smaller second row. They are real production software
  and worth showing; they are just not the first click.

  `Reveal` survives here and on the marketplace cards only. It was on 83
  elements across 18 files, which is the generic template default and reads
  as one. These cards are the one place on the page where content arriving as
  you reach it is the point.
*/

export default function Deployments() {
  const featured = work.filter((w) => w.shot && w.caseStudy);
  const alsoRunning = work.filter((w) => w.shot && !w.caseStudy);

  return (
    <section id="work" className="relative border-t border-line py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
            Built and shipped.
          </h2>
          {/* The proof numbers that used to be hand-copied into a mono
              micro-label here now render from `provingGround` in ProofStrip,
              one section up. Repeating them two sections apart is the kind of
              thing a visitor notices. */}
        </div>

        <div className="grid gap-8">
          {featured.map((w, i) => (
            <Reveal key={w.title} delay={Math.min(i, 3) * 60}>
              <FeatureCard w={w} />
            </Reveal>
          ))}
        </div>

        {alsoRunning.length > 0 && (
          <>
            <h3 className="mt-16 text-sm font-semibold text-ink">
              Also running in production
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {alsoRunning.map((w) => (
                <article
                  key={w.title}
                  className="overflow-hidden rounded-2xl border border-line bg-surface"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-base">
                    <Image
                      src={w.shot as string}
                      alt={`${w.title} — ${w.blurb}`}
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top"
                    />
                    <span className="absolute right-3 top-3 rounded-full border border-line bg-surface/90 px-2.5 py-1 text-xs text-faint backdrop-blur">
                      In production
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 className="display text-lg text-ink">{w.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {w.blurb}
                    </p>
                    {w.replaced && (
                      <p className="mt-2.5 text-xs text-faint">
                        {/* The `replaced` values are written as standalone
                            phrases ("A shared Google Calendar and text
                            threads"), so they need lowering to read as a
                            clause here. */}
                        Replaced{" "}
                        {w.replaced.charAt(0).toLowerCase() + w.replaced.slice(1)}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function FeatureCard({ w }: { w: WorkItem }) {
  return (
    <Link
      href={`/work/${w.caseStudy}`}
      className="group grid overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-500 hover:-translate-y-1 hover:border-signal/50 hover:shadow-[0_24px_60px_-34px_rgba(11,23,34,0.35)] lg:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-base lg:aspect-auto lg:min-h-[320px]">
        <Image
          src={w.shot as string}
          alt={`${w.title} — ${w.blurb}`}
          fill
          sizes="(min-width: 1024px) 576px, 100vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
        <p className="text-xs text-faint">{w.tag}</p>
        <h3 className="display text-xl text-ink md:text-2xl">{w.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{w.blurb}</p>
        {w.stack && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {w.stack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line bg-base px-2.5 py-1 text-xs text-faint"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-signal">
          Read the case study
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
