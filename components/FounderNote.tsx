import Reveal from "./Reveal";
import FounderAvatar from "./FounderAvatar";
import TideLevel from "./TideLevel";
import TideKey from "./TideKey";
import { founderNote, founderStats, founderStatsCaption } from "@/lib/content";

/*
  FounderNote — portrait + chips + socials + Meg's written note. The note
  copy lives in `lib/content.ts` (founderNote.paragraphs) so voice edits
  are one file, not one component.

  Edit CHIPS + SOCIALS below to change the CV; edit lib/content.ts to
  change the paragraphs.
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
    href: "https://www.linkedin.com/in/megan-small-75b806410",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45C23.2 24 24 23.22 24 22.27V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1Ed66YjPjc/?mibextid=wwXIfr",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
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
      <div className="relative z-10 mx-auto max-w-2xl px-6">
        <Reveal>
          <figure className="flex flex-col items-center text-center">
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
                Founder · M Studio
              </p>

              {/* CV chips */}
              <ul className="mt-5 flex flex-wrap justify-center gap-1.5">
                {CHIPS.map((chip) => (
                  <li
                    key={chip}
                    className="whitespace-nowrap rounded-full border border-line bg-surface/60 px-2.5 py-1 font-mono text-[10px] leading-none text-muted"
                  >
                    {chip}
                  </li>
                ))}
              </ul>

              {/* Socials — swap the LinkedIn URL in SOCIALS above */}
              <div className="mt-4 flex items-center justify-center gap-3">
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

        {/* Stat strip — the real operating numbers behind the bio's claim */}
        <Reveal delay={40}>
          <div className="mt-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {founderStats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-mono text-lg text-ink sm:text-xl">{s.value}</p>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-faint">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-faint/70">
              {founderStatsCaption}
            </p>
          </div>
        </Reveal>

        {/* Meg's written note — one paragraph, then the signature. */}
        <Reveal delay={80}>
          <div className="mt-10 flex flex-col items-center text-center">
            {founderNote.paragraphs.map((para, i) => (
              <p
                key={i}
                className="[font-family:var(--font-serif)] text-lg leading-relaxed text-ink md:text-xl"
              >
                {para}
              </p>
            ))}
            <p
              className="mt-6 text-4xl leading-none text-signal"
              style={{ fontFamily: "var(--font-hand)" }}
            >
              {founderNote.signature}
            </p>
          </div>
        </Reveal>

        {/* Quiet key down by the water it labels */}
        <div className="mt-12 flex justify-center">
          <TideKey />
        </div>
      </div>
    </section>
  );
}
