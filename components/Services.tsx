import Image from "next/image";
import { services } from "@/lib/content";

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
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
            What I can help you with.
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
            For business owners, cleaning companies, and vacation rental hosts.
            I can improve what you already use, connect it, or build something
            new.
          </p>
        </div>

        <div className="flex flex-col gap-14 md:gap-20">
          {services.map((s, i) => (
            <article
              key={s.id}
              className="grid items-center gap-6 lg:grid-cols-12 lg:gap-12"
            >
              {/* The evidence. Alternates side at lg so three rows stay
                  scannable without needing dividers between them. */}
              <div
                className={`lg:col-span-7 ${i % 2 ? "lg:order-last" : ""}`}
              >
                <div className="overflow-hidden rounded-2xl border border-line bg-base shadow-[0_24px_60px_-34px_rgba(11,23,34,0.35)]">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={s.example.shot as string}
                      alt={`${s.example.client} — ${s.example.built}`}
                      fill
                      sizes="(min-width: 1024px) 660px, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-faint">{s.example.client}</p>
              </div>

              <div className="lg:col-span-5">
                <p className="font-mono text-xs text-faint">{s.index}</p>
                <h3 className="display mt-2 text-xl text-ink md:text-2xl">
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
                <a
                  href="#work"
                  className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-ink"
                >
                  See an example
                  <span aria-hidden="true">→</span>
                </a>
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
