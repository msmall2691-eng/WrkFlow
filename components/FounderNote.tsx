import { founderNote } from "@/lib/content";
import Reveal from "./Reveal";
import FounderAvatar from "./FounderAvatar";
import TideLevel from "./TideLevel";
import TideKey from "./TideKey";
import MoonPhase from "./MoonPhase";

/*
  FounderNote — a clean, neutral-dark "meet the founder" section that flows out
  of the hero and works under any accent (the only color is the accent itself,
  via the tide water + ring, so it re-tunes with the theme). Circular portrait,
  emphasized lead sentence, then supporting paragraphs.
*/

export default function FounderNote() {
  return (
    <section id="founder" className="relative overflow-hidden border-t border-line bg-base pt-16 pb-20 md:pt-24 md:pb-24">
      {/* Live "harbor water" — fills to the real Portland tide level (accent → re-tunes with theme) */}
      <TideLevel />
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-signal/[0.06] blur-[130px]"
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="grid items-start gap-10 md:grid-cols-12 md:gap-12">
          {/* Circular portrait + identity caption */}
          <div className="md:col-span-4 md:sticky md:top-24">
            <Reveal>
              <figure className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative inline-block">
                  {/*
                    Tonight's actual moon slowly orbits the portrait — one
                    revolution every 60s. The phase matches the footer moon
                    and the sky-tracking story of the site. Motion respects
                    prefers-reduced-motion (see .moon-orbit rule).
                  */}
                  <div
                    aria-hidden="true"
                    className="moon-orbit pointer-events-none absolute -inset-3"
                  >
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 opacity-70">
                      <MoonPhase size={18} />
                    </div>
                  </div>
                  <FounderAvatar className="aspect-square w-36 rounded-full shadow-[0_18px_44px_-22px_rgba(0,0,0,0.7)] ring-2 ring-signal/30 grayscale transition-[filter] duration-700 hover:grayscale-0 sm:w-40" />
                </div>
                <figcaption className="mt-6">
                  <p className="font-display text-lg text-ink">Meg</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-faint">
                    Founder · M Studio
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint/80">
                    Portland, Maine
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Note — eyebrow, emphasized lead, supporting paragraphs */}
          <div className="md:col-span-8">
            <Reveal delay={80}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                Meet the founder
              </p>
            </Reveal>
            <Reveal delay={120}>
              <blockquote className="mt-4 [font-family:var(--font-serif)] text-ink">
                <p className="text-balance text-xl leading-snug md:text-2xl">
                  {founderNote.lead}
                </p>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-muted md:text-lg">
                  {founderNote.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* Quiet key down by the water it labels */}
        <div className="mt-12 flex justify-center md:justify-start">
          <TideKey />
        </div>
      </div>
    </section>
  );
}
