import { provingGround } from "@/lib/content";

/*
  ProofStrip — the operating history, directly under the hero.

  It answers the first question a visitor actually asks ("has this person
  done this before") before they have to go looking for it. The numbers were
  already in lib/content.ts as `provingGround` and were being hand-copied
  into a one-line string further down the page; this renders them from the
  source and that duplicate is gone.

  The attribution label is load-bearing, not decoration: these are The Maine
  Cleaning Co's operating numbers, not M Studio client KPIs, so the line
  naming the company renders wherever the tiles do. Do not tidy it away.
*/
export default function ProofStrip() {
  return (
    <section
      id="proof"
      className="border-y border-line bg-[var(--section-alt2-bg)] py-10 md:py-12"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm text-muted">{provingGround.label}</p>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
          {provingGround.stats.map((s) => (
            <div key={s.label}>
              <dt className="display text-2xl text-ink sm:text-3xl">{s.value}</dt>
              <dd className="mt-1.5 text-xs leading-snug text-faint">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
