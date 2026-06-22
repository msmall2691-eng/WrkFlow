import Reveal from "./Reveal";
import RentedVsBuilt from "./RentedVsBuilt";

/*
  The Shift — the "why now" intro. One tight statement + one lead, the
  interactive rent-vs-build flip, and who it's for. No repetition.
*/
const AUDIENCES = [
  "Service companies",
  "Trades",
  "Property managers",
  "STR operators",
  "Founders",
];
export default function Shift() {
  return (
    <section id="why" className="relative overflow-hidden border-t border-line py-14 md:py-20">
      {/* Soft accent glow — drifts gently */}
      <div
        aria-hidden="true"
        className="floaty pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-signal/[0.05] blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              Rented software rents you.{" "}
              <span className="text-signal">M Studio builds the kind you own.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Off-the-shelf software makes you work its way and pay per seat
              forever. M Studio builds the opposite: shaped to how you run, owned
              outright, with no one to ask for permission.
            </p>
          </Reveal>
        </div>

        <RentedVsBuilt />

        {/* Who it's for — compact chip row */}
        <Reveal delay={120}>
          <div className="mt-12 border-t border-line pt-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
              Who it&apos;s for
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-muted"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
