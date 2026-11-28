import Reveal from "../Reveal";
import {
  aboutPage,
  founderBio,
  founderPhilosophy,
  siteSocials,
} from "@/lib/content";

/*
  The story, and the one place on this site written in the first person.

  **Every word below is `founderBio` and `founderPhilosophy`, unchanged.**
  CLAUDE.md's voice rule is "write about the reader and the work, not the
  maker", and it names this page as the single exception worth
  questioning: "the About page is the one place a human voice may still be
  worth keeping; raise it rather than assume." So the rebuild moved this
  copy and did not touch it. The question is raised in the handover rather
  than settled by a rewrite nobody asked for.

  The philosophy used to sit centered under the signature as two italic
  lines. It is a pull quote beside the story now, which is the same two
  sentences doing more work: a reader skimming the right-hand column gets
  the argument without reading four paragraphs for it.

  The social row moved here from the top of the page. Above the headline
  it was three unlabelled icons competing with the title; beside the story
  it is the corroboration a reader goes looking for once they have read
  who this is.
*/
export default function AboutStory() {
  return (
    <section
      id="story"
      className="relative border-b border-line bg-[var(--section-alt-bg)] py-14 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-12 md:gap-14">
          <Reveal className="md:col-span-7">
            <p className="text-xs font-medium text-signal">
              {founderBio.kicker}
            </p>
            <h2 className="display mt-2 text-2xl text-ink sm:text-3xl">
              {founderBio.heading}
            </h2>
            <div className="mt-6 max-w-[62ch] space-y-4">
              {founderBio.paragraphs.map((para) => (
                <p
                  key={para.slice(0, 24)}
                  className="[font-family:var(--font-serif)] text-[1.0625rem] leading-[1.7] text-ink"
                >
                  {para}
                </p>
              ))}
            </div>
            {/*
              Set as a sign-off rather than drawn. An approximated
              signature reads as a scribble, which is worse than none.

              TODO(Meg): if you want your real signature here, scan it,
              trace it to a single-path SVG, drop it in /public, and swap
              this <p> for an <Image> with aria-label="Megan".
            */}
            <p className="display mt-6 text-2xl italic text-signal">
              {founderBio.signature}
            </p>
          </Reveal>

          <Reveal className="md:col-span-5" delay={80}>
            <div className="rounded-2xl border border-line bg-[color:var(--cp-fill)] p-6 sm:p-7">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-faint">
                {aboutPage.story.quoteLabel}
              </p>
              <p className="mt-4 text-xs font-medium text-signal">
                {founderPhilosophy.heading}
              </p>
              <div className="mt-2 space-y-2">
                {founderPhilosophy.lines.map((line) => (
                  <p
                    key={line}
                    className="[font-family:var(--font-serif)] text-lg leading-snug text-ink sm:text-xl"
                  >
                    {line}
                  </p>
                ))}
              </div>

              <div className="mt-7 border-t border-line pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-faint">
                  {aboutPage.story.links}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {siteSocials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target={s.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          s.href.startsWith("http") ? "noreferrer" : undefined
                        }
                        className="group inline-flex items-center gap-2 py-1 text-sm text-muted transition-colors hover:text-signal"
                      >
                        {s.label}
                        <span
                          aria-hidden="true"
                          className="text-faint transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                        >
                          {s.href.startsWith("http") ? "↗" : "→"}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
