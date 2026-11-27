import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import StageHome from "@/components/stage/StageHome";
import type { HeroVariant } from "@/components/stage/StageHero";

/*
  Three homepages, differing only in their first screen, so Meg can pick
  one by scrolling it on her phone.

  **This is the method rather than a convenience.** CLAUDE.md records that
  six rounds of editing the old homepage one section at a time took her
  from "jumbled and chaotic" to "I don't like any of it", and that what
  broke the deadlock was three complete pages she could open and look at.
  The lesson written down there is *build the thing before asking which
  thing*, so the question "does the octopus answer what this person does
  for me" gets three real answers instead of a paragraph describing them.

  Everything below the hero is the same page in all three — the same
  component the live route renders, not a copy of it. See StageHome.

  These are noindex and absent from the sitemap. They are a fitting room,
  not a route.
*/

/*
  The button labels are bare letters and the names live in the one-line
  description, which is not tidiness: the first cut used "B · Words
  higher" on each button, those wrapped to two lines at 390px, and the
  bar grew tall enough to sit over the BrightBase screen in option C.
  Scaffolding covering the thing being judged makes the comparison worse
  than no comparison.
*/
const VARIANTS: {
  id: HeroVariant;
  name: string;
  what: string;
}[] = [
  {
    id: "a",
    name: "As it is",
    what: "The reef clip, words at the floor of the screen.",
  },
  {
    id: "b",
    name: "Words higher",
    what: "Same clip, words raised to the middle on a phone. Desktop unchanged.",
  },
  {
    id: "c",
    name: "The work",
    what: "No clip. A real BrightBase screen beside the words.",
  },
];

export function generateStaticParams() {
  return VARIANTS.map((v) => ({ variant: v.id }));
}

export const metadata: Metadata = {
  title: "Hero options",
  /* A fitting room should never turn up in a search result. */
  robots: { index: false, follow: false },
};

export default async function HeroLab({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  const current = VARIANTS.find((v) => v.id === variant);
  /* An unknown variant 404s rather than silently falling back to A, which
     would show the live hero under a URL claiming to be something else. */
  if (!current) notFound();

  return (
    <>
      <StageHome variant={current.id} />

      {/*
        The switcher. Deliberately not in the site's own design language:
        it is scaffolding, and it must not be mistaken for part of what is
        being judged. Fixed to the bottom so it survives the scroll, and
        the description of the current option is on it so Meg does not
        have to hold three explanations in her head while looking.
      */}
      <nav
        aria-label="Hero options"
        style={{
          position: "fixed",
          left: "50%",
          bottom: "max(12px, env(safe-area-inset-bottom))",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "min(460px, calc(100vw - 20px))",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.22)",
          background: "rgba(10,10,14,0.92)",
          backdropFilter: "blur(10px)",
          padding: "7px 9px 8px",
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ display: "flex", gap: 7 }}>
          {VARIANTS.map((v) => {
            const on = v.id === current.id;
            return (
              <Link
                key={v.id}
                href={`/lab/hero/${v.id}`}
                aria-current={on ? "page" : undefined}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "7px 6px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  background: on ? "#f4f1ea" : "rgba(255,255,255,0.08)",
                  color: on ? "#0b0a0f" : "#fff",
                }}
              >
                {v.id.toUpperCase()}
              </Link>
            );
          })}
        </div>
        <p
          style={{
            margin: "7px 2px 0",
            fontSize: 12,
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          <strong style={{ color: "#fff" }}>
            {current.id.toUpperCase()} · {current.name}.
          </strong>{" "}
          {current.what}
        </p>
      </nav>
    </>
  );
}
