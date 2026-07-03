import { founderNote } from "@/lib/content";
import Reveal from "./Reveal";
import FounderAvatar from "./FounderAvatar";
import TideLevel from "./TideLevel";
import TideKey from "./TideKey";

/*
  FounderNote — editorial "meet the founder": portrait framed by
  viewfinder-style corner brackets, name / location / coordinates
  underneath, and LinkedIn-style Education + Experience chip groups.
  Note on the right opens with a big serif quote glyph and closes with
  a handwritten "— Meg" signature.
*/

const CV_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Education",
    items: ["USM · Business Analytics & AI", "Comp Sci · Minor"],
  },
  {
    label: "Experience",
    items: ["M Studio · Founder", "Founded The Maine Cleaning Co."],
  },
];

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
          {/* Portrait + viewfinder frame + identity + CV chips */}
          <div className="md:col-span-4 md:sticky md:top-24">
            <Reveal>
              <figure className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative inline-block">
                  {/*
                    Nautical viewfinder frame — four L-shape corner
                    brackets in signal-teal, offset outside the portrait.
                    Static, unique, on-brand: reads as a camera crosshair
                    or chart bracket, not a floating blob.
                  */}
                  <div aria-hidden="true" className="pointer-events-none absolute -inset-4">
                    <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-signal/60" />
                    <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-signal/60" />
                    <span className="absolute left-0 bottom-0 h-4 w-4 border-l border-b border-signal/60" />
                    <span className="absolute right-0 bottom-0 h-4 w-4 border-r border-b border-signal/60" />
                  </div>
                  <FounderAvatar className="aspect-square w-36 rounded-full shadow-[0_18px_44px_-22px_rgba(0,0,0,0.7)] ring-2 ring-signal/30 grayscale transition-[filter] duration-700 hover:grayscale-0 sm:w-40" />
                </div>
                <figcaption className="mt-6 w-full">
                  <p className="font-display text-lg text-ink">Meg</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-faint">
                    Founder · M Studio
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint/80">
                    Portland, Maine
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] tracking-[0.2em] text-faint/50">
                    43.6591°N · 70.2568°W
                  </p>

                  {/* LinkedIn-style CV chip groups */}
                  <div className="mt-6 space-y-3">
                    {CV_GROUPS.map((group) => (
                      <div key={group.label}>
                        <p className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-faint/80">
                          {group.label}
                        </p>
                        <ul className="flex flex-wrap justify-center gap-1.5 md:justify-start">
                          {group.items.map((item) => (
                            <li
                              key={item}
                              className="whitespace-nowrap rounded-full border border-line bg-surface/60 px-2.5 py-1 font-mono text-[10px] leading-none text-muted"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Note — eyebrow, open-quote glyph, lead, trimmed paragraphs, signature */}
          <div className="md:col-span-8">
            <Reveal delay={80}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                Meet the founder
              </p>
            </Reveal>
            <Reveal delay={120}>
              <blockquote className="relative mt-4 [font-family:var(--font-serif)] text-ink">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-8 left-0 select-none text-[6rem] leading-none text-signal/25 md:-left-4 md:-top-10"
                >
                  &ldquo;
                </span>
                <p className="relative text-balance text-xl leading-snug md:text-2xl">
                  {founderNote.lead}
                </p>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-muted md:text-lg">
                  {founderNote.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                <p
                  className="mt-6 text-4xl leading-none text-signal"
                  style={{ fontFamily: "var(--font-hand)" }}
                >
                  — Meg
                </p>
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
