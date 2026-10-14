import { stackColumns } from "@/lib/content";

/*
  Stack — a quiet strip below pricing, not a section above it.

  The list is the same and it is accurate; what changed is who it is talking
  to and when. Sitting mid-page at full section weight it was the most
  intimidating thing on the site, landing on a non-technical visitor right
  before the price. Below pricing it does the job it is actually good at:
  reassuring the buyer who came looking for it, and the one worrying about
  being locked in. Hence the heading — a promise about hiring, not a
  credential.
*/
export default function Stack() {
  return (
    <section id="stack" className="relative border-t border-line py-12 md:py-14">
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
                      <h2 className="display text-lg text-ink sm:text-xl">
              Boring, proven tools. Nothing you&apos;ll struggle to hire for later.
            </h2>
        </div>

        <div className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {stackColumns.map((col) => (
            <div key={col.heading}>
                <h3 className="text-sm font-semibold text-ink">
                  {col.heading}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {col.items.join(" · ")}
                </p>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
