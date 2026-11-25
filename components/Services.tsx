import Image from "next/image";
import Link from "next/link";
import ProjectVisual from "./ProjectVisual";
import ServiceRungs from "./Ladder";
import { services } from "@/lib/content";
import { castFor } from "@/lib/ocean";
import CastFrame from "./ocean/CastFrame";

/*
  Services — three wide rows, each led by a real screenshot.

  This was an accordion: a narrow list on the left with roughly 700px of
  empty space beside it at 1440px, and the screenshot — the only evidence in
  the whole section — hidden behind a click, then rendered at 400px wide on a
  1440px screen. One row open at a time meant at most one of the three
  services was ever visible.

  Now all three are open by default and the evidence leads. That costs
  vertical space and is worth it: the old collapsed state was shorter because
  it showed nothing. No `useState`, so this is a server component again.

  Order is deliberate — websites, then software, then integrations. It used
  to lead with integrations, which is the thing the fewest visitors arrive
  looking for.
*/
export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden border-t border-line py-20 md:py-24"
    >
      <div
        aria-hidden="true"
        className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-3xl">
          <h2 className="display-serif text-2xl text-ink sm:text-3xl md:text-4xl">
            What gets built here.
          </h2>
          {/* The broader audience line. No longer first person: CLAUDE.md
              reversed that on Nov 14, and the replacement is a change of
              subject rather than a different pronoun. */}
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
            For small businesses, independent professionals, and teams. A new
            website, a platform switch, or one process that needs to work
            better.
          </p>
          {/* Says up front that each block below carries three price points,
              because the rungs sit at the bottom of a tall row and somebody
              scanning headings would never reach one. */}
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">
            Each one has something free to try today, something with a fixed
            price, and a full build. Start wherever it makes sense.
          </p>
        </div>

        <div className="flex flex-col gap-14 md:gap-20">
          {services.map((s, i) => (
            <article
              key={s.id}
              /* Deep-linkable, because the homepage router sends people to a
                 specific one of the four rather than to the top of the page.
                 `scroll-mt` keeps the heading clear of the sticky header. */
              id={s.id}
              className="grid scroll-mt-24 items-center gap-6 lg:grid-cols-12 lg:gap-12"
            >
              {/* The evidence. Alternates side at lg so three rows stay
                  scannable without needing dividers between them. */}
              <div
                className={`lg:col-span-7 ${i % 2 ? "lg:order-last" : ""}`}
              >
                <div className="overflow-hidden rounded-2xl border border-line bg-base shadow-[0_24px_60px_-34px_rgba(11,23,34,0.35)]">
                  <div className="relative aspect-[16/10]">
                    {/* Not every service has a capture yet — CRM setup and
                        data migration are real work with nothing photogenic
                        to screenshot, so they fall back to the designed
                        panel rather than an empty frame. Never substitute
                        someone else's screen for a missing one. */}
                    {s.example.shot ? (
                      <Image
                        src={s.example.shot}
                        alt={`${s.example.client}: ${s.example.built}`}
                        fill
                        sizes="(min-width: 1024px) 660px, 100vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <ProjectVisual type={s.example.visual!} />
                    )}
                  </div>
                </div>
                <p className="mt-3 text-xs text-faint">{s.example.client}</p>
              </div>

              <div className="lg:col-span-5">
                {/*
                  **The creature leads the text column; the screenshot still
                  leads the row.** Seven columns of real capture against five
                  of art keeps CLAUDE.md's order intact — every section shows
                  something real she built — while giving the page the thing
                  it was missing, which measured as three images across 9.8
                  screens.

                  It is the homepage reef map's panel, made permanent. There
                  a visitor taps a pin and gets the creature and the analogy
                  for one service at a time; here each service carries its
                  own. Both read `lib/ocean.ts`, so the octopus cannot come
                  to mean integrations in one place and something else in
                  the other.
                */}
                {(() => {
                  const member = castFor(s.id);
                  /* The two fields the frame uses, named rather than
                     spread. Spreading the member is how it came to caption
                     itself with an analogy in the first place, and it
                     would quietly pick up the next field added to the
                     cast too. */
                  return member ? (
                    <CastFrame
                      art={member.art}
                      artAlt={member.artAlt}
                      className="mb-6"
                      sizes="(min-width: 1024px) 420px, 100vw"
                    />
                  ) : null;
                })()}
                <p className="font-mono text-xs text-faint">{s.index}</p>
                <h3 className="display-serif mt-2 text-xl text-ink md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-muted">
                  {s.tagline}
                </p>

                {/* Was two bordered, labeled boxes ("The problem" / "After") —
                    four extra lines of chrome for two sentences. Same two
                    sentences, a third of the vertical cost. */}
                <p className="mt-5 text-sm leading-relaxed text-muted">
                  {s.pain}
                </p>
                <p className="mt-3 border-l-2 border-signal/50 pl-4 text-sm leading-relaxed text-ink">
                  {s.outcome}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {s.kinds.map((k) => (
                    <span
                      key={k}
                      className="rounded-full border border-line bg-base px-2.5 py-1 text-xs text-faint"
                    >
                      {k}
                    </span>
                  ))}
                </div>

                <p className="mt-5 text-sm font-medium text-signal">
                  {s.example.result}
                </p>
                {/*
                  `/#work`, not `#work`. This component only ever renders on
                  /services and /marketplace, and neither page has a #work
                  anchor, so the relative version was a live-looking link
                  that scrolled nowhere on both. The anchor lives on the
                  homepage (components/home/OneJob.tsx), which is where "see
                  an example" is actually answered.
                */}
                <Link
                  href="/#work"
                  className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-ink"
                >
                  See an example
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/*
                The three price points for this service, full width under the
                row that just argued for it.

                `lg:col-span-12` and `lg:order-last`: the evidence column
                carries `lg:order-last` on alternating rows, and without an
                explicit order here the rungs would land above the image on
                every other service. `items-center` on the article centres the
                two columns against each other, which is right for a two-up
                row and wrong for a full-width band below it, hence
                `self-stretch`.
              */}
              <div className="lg:order-last lg:col-span-12 lg:self-stretch">
                <ServiceRungs service={s.id} />
              </div>
            </article>
          ))}
        </div>

        <p className="mt-16 text-sm text-muted">
          Or start from{" "}
          <a
            href="/marketplace"
            className="text-signal transition-opacity hover:opacity-80"
          >
            M Linx, the premade line →
          </a>
        </p>
      </div>
    </section>
  );
}
