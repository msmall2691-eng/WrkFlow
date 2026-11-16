import Image from "next/image";
import Link from "next/link";
import { provingGround, founderNote, founderBio, founderPhilosophy, founderCta } from "@/lib/content";

/*
  FounderNote, the About page body. Rebuilt Nov 16 2026 for the "Clean pro"
  redesign (DESIGN.md).

  What went: the live tide-water strip and its key, the blurred glow behind
  the photo, the background blob, the centred stack, and Fraunces body
  copy. Each was decoration, and together they made this the one page that
  looked like a lifestyle brand rather than the rest of the site.

  What it is now: the same left edge and type as every other page. Who is
  behind the work and why that matters to a contractor, beside a plain
  photo; the operating numbers as tiles, attributed to the company they
  belong to; then Meg's own words. The About page is the one place the
  first person stays (CLAUDE.md, "Voice and copy").

  Stats come from `provingGround` so this page and the homepage cannot
  drift apart. Copy lives in lib/content.ts.
*/

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
    <section id="founder" className="border-b border-[var(--cp-line)] pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="m-0 text-[13px] font-medium text-[color:var(--cp-faint)]">About</p>
            <h1 className="display m-0 mt-2 max-w-[18ch] text-[2rem] text-balance text-[color:var(--cp-ink)] sm:text-[2.6rem]">
              {founderNote.headline}
            </h1>
            <p className="m-0 mt-4 max-w-[36em] text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
              {founderNote.headlineFollow}
            </p>

            <ul className="m-0 mt-8 grid max-w-xl list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
              {provingGround.stats.map((s) => (
                <li key={s.label} className="cp-tile !rounded-xl px-4 py-3">
                  <span className="block font-display text-xl font-semibold text-[color:var(--cp-ink)]">{s.value}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-[color:var(--cp-muted)]">{s.label}</span>
                </li>
              ))}
            </ul>
            <p className="m-0 mt-2 text-[12.5px] text-[color:var(--cp-faint)]">
              The Maine Cleaning Co.&apos;s own numbers, from its invoices and visit records.
            </p>
          </div>

          <figure className="m-0 w-full max-w-sm lg:justify-self-end">
            <div className="cp-tile overflow-hidden !rounded-2xl p-2">
              <Image
                src="/meg.webp"
                alt="Megan Small"
                width={1047}
                height={1290}
                priority
                sizes="(max-width: 1024px) 90vw, 420px"
                className="aspect-square w-full rounded-xl object-cover object-top"
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[14px] text-[color:var(--cp-soft)]">
                <span className="font-semibold text-[color:var(--cp-ink)]">Meg Small</span>, North Waterboro, Maine
              </span>
              <span className="flex gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={s.label}
                    title={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--cp-hairline)] text-[color:var(--cp-soft)] hover:border-[color:var(--cp-violet)] hover:text-[color:var(--cp-violet-ink)]"
                  >
                    {s.icon}
                  </a>
                ))}
              </span>
            </figcaption>
          </figure>
        </div>

        <div className="mt-16 grid gap-10 border-t border-[var(--cp-line)] pt-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="m-0 text-[13px] font-medium text-[color:var(--cp-faint)]">{founderBio.kicker}</p>
            <h2 className="display m-0 mt-2 text-2xl text-[color:var(--cp-ink)] sm:text-3xl">{founderBio.heading}</h2>
          </div>
          <div className="max-w-[64ch]">
            <div className="[&>p]:m-0 [&>p+p]:mt-4">
              {founderBio.paragraphs.map((para, i) => (
                <p key={i} className="text-[1.0625rem] leading-[1.7] text-[color:var(--cp-soft)]">
                  {para}
                </p>
              ))}
            </div>
            <p className="m-0 mt-5 font-semibold text-[color:var(--cp-ink)]">{founderBio.signature}</p>

            <div className="mt-8 border-l-2 border-[color:var(--cp-violet)] pl-4">
              {founderPhilosophy.lines.map((line) => (
                <p key={line} className="m-0 text-[1rem] leading-relaxed text-[color:var(--cp-ink)]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 rounded-2xl border border-[var(--cp-hairline)] bg-[color:var(--cp-fill)] p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div>
            <h2 className="display m-0 text-xl text-[color:var(--cp-ink)] sm:text-2xl">{founderCta.headline}</h2>
            <p className="m-0 mt-1.5 max-w-xl text-[15px] leading-relaxed text-[color:var(--cp-muted)]">{founderCta.body}</p>
          </div>
          <Link
            href="/#contact"
            className="cp-cta inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl px-5 text-[15px] font-semibold text-white no-underline"
          >
            {founderCta.buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
