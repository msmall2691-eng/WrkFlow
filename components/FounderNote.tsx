import Image from "next/image";
import Link from "next/link";
import TideLevel from "./TideLevel";
import TideKey from "./TideKey";
import {
  founderNote,
  founderBio,
  founderPhilosophy,
  founderCta,
} from "@/lib/content";

/*
  FounderNote — belief, then the person, then the ask.

  Photograph + operating stats → the belief ("why the software is any good")
  → the bio, which is now where the real content is: what she ran, what she
  is studying, what she builds, and what she does when she is not building.
  Philosophy rides under the signature as two quiet lines → CTA.

  Two blocks came out on the way: a "What we build" chip row that repeated
  the homepage's Services section, and the philosophy's own kicker + border
  + heading, which was a lot of furniture around one and a half sentences.
  Copy lives in `lib/content.ts` so voice edits are one file, not one
  component.

  Edit STATS + SOCIALS below to change the top row; edit lib/content.ts to
  change any of the arc's copy.
*/

const STATS = ["10 yrs building systems", "1,000+ customers", "7,000+ service visits", "$1M+ operations managed"];

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
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-signal/[0.06] blur-[130px]"
      />
      <div className="relative z-10 mx-auto max-w-2xl px-6">
                  <figure className="flex flex-col items-center text-center">
            {/* The real photograph, not the wordmark.

                This slot held a big "M Studio" lockup with a note explaining
                there was deliberately no photo. On a page whose whole argument
                is "a person who ran a service business built this", a logo was
                the one thing that could not make that argument. A face can.

                Sized well above its display box so it stays sharp on a 3x
                screen, and `priority` because it is the first thing on /about
                and lazy-loading it just means a grey hole on arrival. */}
            <div className="relative inline-block">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 rounded-full opacity-70 blur-2xl"
                style={{
                  background:
                    "radial-gradient(closest-side, color-mix(in srgb, var(--color-signal) 22%, transparent), transparent)",
                }}
              />
              <Image
                src="/meg.webp"
                alt="Meg, founder of M Studio"
                width={1047}
                height={1290}
                priority
                sizes="(max-width: 640px) 10rem, 12rem"
                className="relative h-40 w-40 rounded-full object-cover object-top ring-1 ring-line sm:h-48 sm:w-48"
              />
            </div>
            <figcaption className="mt-7 w-full">
              {/* --color-faint is tuned to land just over 4.5:1 at full
                  strength, so any alpha modifier on it fails — these were
                  3.53:1 on cream. Same fix already applied in Footer and
                  Contact; /about was never in the audit's page list. */}
              <p className="text-sm text-muted">
                Built from real business — The Maine Cleaning Co.
              </p>

              {/* Operating stats — the proof, not a CV — plain dot-separated
                  footnote so the wordmark stays the visual lead */}
              <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                {STATS.map((stat, i) => (
                  <li key={stat} className="flex items-center gap-2">
                    {i > 0 && (
                      <span aria-hidden="true" className="text-faint">
                        ·
                      </span>
                    )}
                    <span className="whitespace-nowrap text-xs leading-none text-faint">
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

        {/* The mission — the "why this exists" story. No signature: this
            reads as a philosophy, not a personal letter. */}
                  <div className="mt-10 flex flex-col items-start text-left">
            <h1 className="display text-[2rem] text-balance text-ink sm:text-4xl">
              {founderNote.headline}
            </h1>
            <p className="mt-1 text-lg font-medium text-ink sm:text-xl">
              {founderNote.headlineFollow}
            </p>
            <div className="mt-6 max-w-[62ch] space-y-5">
              {founderNote.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="[font-family:var(--font-serif)] text-[1.0625rem] leading-[1.7] text-ink"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

        {/* A "What we build" row of six chips sat here — AI Workflows,
            Custom Software, Internal Tools, Automation, Dashboards,
            Operations Systems. Services on the homepage already says all of
            it, in more detail, and this is the page about the person. */}

        {/* The proof — visually distinct from the belief above (its own
            kicker + headline weight) so it reads as stepping into the
            conversation, not a continuation of the pitch. Company name is
            a footnote detail, not the headline. */}
                  <div className="mt-16 flex flex-col items-start border-t border-line pt-10 text-left">
            <p className="text-xs font-medium text-signal">
              {founderBio.kicker}
            </p>
            <h2 className="display text-2xl text-ink sm:text-3xl">
              {founderBio.heading}
            </h2>
            <div className="mt-6 max-w-[62ch] space-y-4">
              {founderBio.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="[font-family:var(--font-serif)] text-[1.0625rem] leading-[1.7] text-ink"
                >
                  {para}
                </p>
              ))}
            </div>
            <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-muted">
              {founderBio.detail}
            </p>
            {/*
              This was the only use of Caveat — a whole webfont for one line.
              Dropped rather than kept, since the type system is now two
              families plus mono for data.

              It is deliberately NOT a hand-drawn SVG path: an approximated
              signature reads as a scribble, which is worse than no signature
              at all. Set as a sign-off instead, honestly.

              TODO(Meg): if you want your real signature here, scan it, trace
              it to a single-path SVG, drop it in /public, and swap this <p>
              for an <Image> or inline <svg> with aria-label="Megan".
            */}
            <p className="display mt-6 text-2xl italic text-signal">
              {founderBio.signature}
            </p>
          </div>

        {/* Philosophy — two lines. It used to get its own kicker, its own
            border-top and its own block, which is a lot of furniture for one
            sentence and a half. It rides quietly under the signature now. */}
                  <div className="mt-12 flex flex-col items-center gap-1.5 text-center">
            {founderPhilosophy.lines.map((line) => (
              <p
                key={line}
                className="[font-family:var(--font-serif)] text-[1rem] italic leading-relaxed text-muted"
              >
                {line}
              </p>
            ))}
          </div>

        {/* CTA — closes the arc before handing off into Services below. */}
                  <div className="mt-14 flex flex-col items-center text-center">
            <h2 className="display text-2xl text-ink sm:text-3xl">
              {founderCta.headline}
            </h2>
            <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-muted">
              {founderCta.body}
            </p>
            <Link
                href="/#contact"
                className="group mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
              >
                {founderCta.buttonLabel}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
          </div>

        {/* Quiet key down by the water it labels */}
        <div className="mt-12 flex justify-center">
          <TideKey />
        </div>
      </div>
    </section>
  );
}

