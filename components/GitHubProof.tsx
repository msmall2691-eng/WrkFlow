import Image from "next/image";
import { githubProof } from "@/lib/content";

/*
  The public GitHub profile, shown rather than linked.

  **Meg asked for GitHub "as proof on the site" (Nov 27 2026), and the word
  that matters is proof.** A link in a footer is an assertion that an account
  exists; the site's own first rule is that every section either shows
  something real, lets the visitor use it, or asks them to start a project.
  So this shows the account, captured from the live page by `npm run shots`
  like every other screenshot here, and the capture is itself the link.

  **It sits under `Stack` on /about on purpose.** That strip lists the
  technologies and promises they are "nothing you'll struggle to hire for
  later", which is a claim; this is where a reader who wants to check it can.
  The two are one argument, which is why this carries no heading weight above
  Stack's and no border of its own above the shot.

  **Nothing here counts anything.** The profile's followers, repository count
  and stars are whatever they are on the day somebody clicks, and copying one
  into `githubProof` would be a hand-written claim about evidence, which is
  the failure `ServiceRouter`'s computed project count exists to avoid. The
  capture shows them because the real page does; this component asserts none
  of them.

  `priority` is deliberately absent: /about opens on `FounderNote`, so this
  image is well below the fold and preloading it would cost the hero's own
  bytes for something nobody has scrolled to.
*/
export default function GitHubProof() {
  return (
    <section
      id="github"
      className="relative border-t border-line py-12 md:py-14"
    >
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <h2 className="display text-lg text-ink sm:text-xl">
            {githubProof.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {githubProof.body}
          </p>
        </div>

        {/*
          The whole capture is the link, with the label underneath rather
          than only an icon: an image that navigates and does not say where
          is the affordance problem the site's own link rules already name.
          `rel="noreferrer"` with `target="_blank"`, as everywhere else that
          leaves the site.
        */}
        <a
          href={githubProof.url}
          target="_blank"
          rel="noreferrer"
          className="group mt-7 block max-w-3xl no-underline"
        >
          {/* **Capped at `max-w-3xl` on Nov 28 2026.** Full width this was
              934px of /about on a 1440 screen, the tallest thing on a page
              Meg asked to make shorter, and nothing in it needs to be read
              at that size: it is a photograph of an account, and the link
              under it is how anybody who wants the detail gets the real
              one. */}
          <span className="block overflow-hidden rounded-xl border border-line bg-[color:var(--cp-well)] transition-transform duration-150 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
            <Image
              src={githubProof.shot}
              alt={githubProof.alt}
              width={2208}
              height={1533}
              sizes="(min-width: 768px) 768px, 100vw"
              className="block h-auto w-full"
            />
          </span>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--cp-signal)] underline underline-offset-4">
            {githubProof.linkLabel}
            <span aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </section>
  );
}
