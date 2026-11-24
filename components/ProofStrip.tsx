import { provingGround } from "@/lib/content";

/*
  ProofStrip — the operating history, at the foot of the hero.

  It answers the first question a visitor actually asks ("has this person
  done this before") before they have to go looking for it. The numbers were
  already in lib/content.ts as `provingGround` and were being hand-copied
  into a one-line string further down the page; this renders them from the
  source and that duplicate is gone.

  The attribution label is load-bearing, not decoration: these are The Maine
  Cleaning Co's operating numbers, not M Studio client KPIs, so the line
  naming the company renders wherever the tiles do. Do not tidy it away.

  **Nov 20 2026: this was written, then mounted on nothing.** It sat as a
  complete, honest component that no page imported, while /about went on
  rendering the same four numbers as a sentence in `FounderNote`. Meg asked
  for KPIs twice, and the KPI component already existed; it just was not on
  a page. So it is now at the foot of the homepage hero, which costs no extra
  scroll, rather than as a band of its own between the hero and the reel,
  which would have cost about half a screen on the one page that was
  rebuilt to stop burying the shop.

  **The treatment is Like a King Inc's, at Meg's ask, and the honesty is
  not.** That site runs the same shape under its hero, 99.99% / Aligned /
  24/7 over small captions, and nothing on the page says where any of those
  came from. These four were verified in Oct 2026 against Jobber invoices
  and visit exports, the provenance is in a comment beside them in
  lib/content.ts, and the label says whose numbers they are. The shape is
  worth borrowing. The claim underneath it is the whole difference.

  Mono on the captions is deliberate and narrow: CLAUDE.md allows JetBrains
  Mono for real code or data, and a figure traced to an invoice export is
  the second one.
*/
export default function ProofStrip() {
  return (
    <section aria-labelledby="proof-heading" className="border-t border-white/10 pt-8">
      <h2 id="proof-heading" className="sr-only">
        Operating history
      </h2>

      <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
        {provingGround.label}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        {provingGround.stats.map((s) => (
          <div key={s.label}>
            {/* Light weight at a large size with the tracking pulled in, which
                is the single biggest thing the reference does: the numbers
                are big because they are the point, not bold because they are
                shouting. */}
            <dt className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-normal leading-none tracking-[-0.03em] text-[#EDEBE6]">
              {s.value}
            </dt>
            <dd className="mt-2 font-mono text-[11px] leading-snug text-white/45">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
