import Reveal from "./Reveal";
import TideLevel from "./TideLevel";
import TideKey from "./TideKey";
import { founderNote, founderBio } from "@/lib/content";

/*
  FounderNote — three beats, each with its own visual register: Mission
  (M Studio lockup + stats + the "why this exists" story, no signature —
  reads as philosophy) → Person ("Meet Megan," a short conversational
  bio with its own kicker/heading so it visibly steps into the
  conversation instead of reading as a continuation of the mission).
  Copy lives in `lib/content.ts` (founderNote, founderBio) so voice edits
  are one file, not one component.

  Edit STATS + SOCIALS below to change the top row; edit lib/content.ts to
  change the story or bio copy.
*/

const STATS = ["Nearly 10 yrs in business", "1,000+ customers", "7,000+ visits", "$1M+ in sales"];

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
      {/* Live "harbor water" — fills to the real Portland tide level. Pinned
          to a fixed-height strip at the bottom (not a % of the whole
          section) so it stays clear of copy no matter how long the note
          and bio get. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 overflow-hidden md:h-56">
        <TideLevel />
      </div>
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-signal/[0.06] blur-[130px]"
      />
      <div className="relative z-10 mx-auto max-w-2xl px-6">
        <Reveal>
          <figure className="flex flex-col items-center text-center">
            <div className="relative inline-block">
              {/* Soft teal glow behind the lockup — replaces the old bracket
                  frame, which only made sense around a circular photo. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-[28px] bg-signal/[0.12] blur-2xl"
              />
              {/* Big M Studio lockup — the section's whole visual lead, no photo */}
              <div className="relative flex items-center gap-3 rounded-2xl border border-signal/20 bg-surface/70 px-9 py-7 shadow-[0_18px_44px_-22px_rgba(0,0,0,0.7)] sm:px-12 sm:py-9">
                <span className="font-display text-6xl font-bold leading-none text-signal [text-shadow:0_0_34px_rgba(45,212,191,0.6),0_0_14px_rgba(45,212,191,0.45)] sm:text-7xl">
                  M
                </span>
                <span className="shimmer-text-signal font-mono text-3xl font-semibold tracking-[0.04em] sm:text-4xl">
                  Studio
                </span>
              </div>
            </div>
            <figcaption className="mt-7 w-full">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint/80">
                Built from real business.
              </p>

              {/* Operating stats — the proof, not a CV — plain dot-separated
                  footnote so the wordmark stays the visual lead */}
              <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                {STATS.map((stat, i) => (
                  <li key={stat} className="flex items-center gap-2">
                    {i > 0 && (
                      <span aria-hidden="true" className="text-faint/40">
                        ·
                      </span>
                    )}
                    <span className="whitespace-nowrap font-mono text-[10px] leading-none text-faint/70">
                      {stat}
                    </span>
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

        {/* The mission — the "why this exists" story. No signature: this
            reads as a philosophy, not a personal letter. */}
        <Reveal delay={80}>
          <div className="mt-10 flex flex-col items-center text-center">
            <p className="display text-xl uppercase tracking-tight text-ink sm:text-2xl">
              {founderNote.headline}
            </p>
            <p className="mt-1 text-lg font-medium text-ink sm:text-xl">
              {founderNote.headlineFollow}
            </p>
            <div className="mt-6 space-y-5">
              {founderNote.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="[font-family:var(--font-serif)] text-base leading-relaxed text-ink md:text-lg"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        {/* The person — visually distinct from the mission above (its own
            kicker + headline weight) so it reads as stepping into the
            conversation, not a continuation of the pitch. */}
        <Reveal delay={140}>
          <div className="mt-16 flex flex-col items-center border-t border-line pt-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              {founderBio.kicker}
            </p>
            <p className="mt-3 display text-xl uppercase tracking-tight text-ink sm:text-2xl">
              {founderBio.heading}
            </p>
            <div className="mt-6 max-w-md space-y-4">
              {founderBio.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="[font-family:var(--font-serif)] text-base leading-relaxed text-ink md:text-lg"
                >
                  {para}
                </p>
              ))}
            </div>
            <p
              className="mt-6 text-4xl leading-none text-signal"
              style={{ fontFamily: "var(--font-hand)" }}
            >
              {founderBio.signature}
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
