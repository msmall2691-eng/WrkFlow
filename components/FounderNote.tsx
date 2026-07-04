import { founderNote } from "@/lib/content";
import Reveal from "./Reveal";
import FounderAvatar from "./FounderAvatar";
import TideLevel from "./TideLevel";
import TideKey from "./TideKey";

/*
  FounderNote — freestyled "about me" instead of a corporate "meet the
  founder." Portrait + name + location + coordinates + a flat row of
  casual chips (no "EDUCATION / EXPERIENCE" labels, no "Founder /
  Founded" wording) + small social links + a serif note that closes
  with a handwritten signature.

  Edit CHIPS + SOCIALS below to change the CV. Note copy lives in
  lib/content.ts (founderNote).
*/

const CHIPS = [
  "USM · Business Analytics & AI",
  "Comp Sci · Minor",
  "The Maine Cleaning Co.",
  "M Studio · now",
];

const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45C23.2 24 24 23.22 24 22.27V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:contact@mlinx.studio",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function FounderNote() {
  return (
    <section id="founder" className="relative overflow-hidden border-t border-line bg-base pt-16 pb-20 md:pt-24 md:pb-24">
      {/* Live "harbor water" — fills to the real Portland tide level */}
      <TideLevel />
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-signal/[0.06] blur-[130px]"
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="grid items-start gap-10 md:grid-cols-12 md:gap-12">
          {/* Portrait + viewfinder frame + freestyle identity + chips */}
          <div className="md:col-span-4 md:sticky md:top-24">
            <Reveal>
              <figure className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative inline-block">
                  {/* Nautical viewfinder frame — four L-corner brackets */}
                  <div aria-hidden="true" className="pointer-events-none absolute -inset-4">
                    <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-signal/60" />
                    <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-signal/60" />
                    <span className="absolute left-0 bottom-0 h-4 w-4 border-l border-b border-signal/60" />
                    <span className="absolute right-0 bottom-0 h-4 w-4 border-r border-b border-signal/60" />
                  </div>
                  <FounderAvatar className="aspect-square w-36 rounded-full shadow-[0_18px_44px_-22px_rgba(0,0,0,0.7)] ring-2 ring-signal/30 sm:w-40" />
                </div>
                <figcaption className="mt-6 w-full">
                  <p className="font-display text-lg text-ink">Meg</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint/80">
                    Portland, Maine
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] tracking-[0.2em] text-faint/50">
                    43.6591°N · 70.2568°W
                  </p>

                  {/* Flat chip row — no cheesy labels, no "Founder" wording */}
                  <ul className="mt-5 flex flex-wrap justify-center gap-1.5 md:justify-start">
                    {CHIPS.map((chip) => (
                      <li
                        key={chip}
                        className="whitespace-nowrap rounded-full border border-line bg-surface/60 px-2.5 py-1 font-mono text-[10px] leading-none text-muted"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>

                  {/* Small social links — swap the LinkedIn URL in SOCIALS above. */}
                  <div className="mt-4 flex items-center justify-center gap-3 md:justify-start">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target={s.href.startsWith("http") ? "_blank" : undefined}
                        rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        aria-label={s.label}
                        title={s.label}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-signal/50 hover:text-signal active:scale-95"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Numbered origin story instead of template founder-page prose */}
          <div className="md:col-span-8">
            <Reveal delay={80}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                About me
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-4 text-ink">
                <p className="[font-family:var(--font-serif)] text-lg text-muted md:text-xl">
                  {founderNote.eyebrow}
                </p>
                <ol className="mt-4 space-y-3.5 md:mt-6 md:space-y-4">
                  {founderNote.steps.map((step, i) => (
                    <li key={i} className="flex items-baseline gap-4">
                      <span className="shrink-0 font-mono text-sm text-signal md:text-base">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="[font-family:var(--font-serif)] text-xl leading-snug text-ink md:text-2xl">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-8 [font-family:var(--font-serif)] text-base italic leading-relaxed text-muted md:text-lg">
                  {founderNote.aside}
                </p>
                <p className="mt-6 [font-family:var(--font-serif)] text-base leading-relaxed text-muted md:text-lg">
                  {founderNote.favorite}
                </p>
                <p
                  className="mt-8 text-4xl leading-none text-signal"
                  style={{ fontFamily: "var(--font-hand)" }}
                >
                  — Meg
                </p>
              </div>
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
