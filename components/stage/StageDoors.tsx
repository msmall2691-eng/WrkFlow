import Link from "next/link";
import { homeHero, services, work } from "@/lib/content";
import { delay } from "./reveal";

/*
  01 — the first screen, and it is the four categories.

  **This replaces the hero-then-services pair, and the reason is the one
  Meg gave about the live site:** "this landing page should show the
  different catagories for peoplel and so they immediately see what
  theyve come here for", and "idk if im even in the right place". A hero
  that says what the studio does, with the four things it sells one
  scroll below it, answers that question second. So the four doors are
  the first screen: the wordmark is in the bar, one line of positioning
  sits above them, and every narrative band moves below.

  **`components/stage/StageServices.tsx` is therefore off this page** and
  left in place rather than deleted, the same way the nine components the
  approved design orphaned were. Every word it rendered is here — the
  index, the title, the tagline and the chips, all still straight out of
  `services[]`, which CLAUDE.md names as the single definition of what
  the studio sells. Keeping both would have been the page asking "what
  did you come for" twice in two visual idioms, which is the failure the
  repo has already paid for once.

  **The count under each door is computed, never typed.** CLAUDE.md:
  "The project count under each door is computed from `work`, never
  written by hand ... a count is a claim about evidence." It reads
  `work[].category`, which exists for exactly this question — what is
  this proof of — rather than `tier`, which only answers whether there is
  a URL to share. A category with one project says one, because that is
  what is true.

  The impression is meant to come from the grid: one type scale, one
  rhythm, four equal cells, and a hover that moves the row rather than
  decorating it. No picture does the work, which is why the clip behind
  it is scrimmed down to a texture.

  Server component. The clip's `autoPlay` stays on the element so a
  visitor with no JavaScript still gets the loop, and `StageMotion` only
  ever takes playback away and gives it back.
*/
export default function StageDoors() {
  /* One pass over `work`, so four doors cost one walk rather than four. */
  const counts = work.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="hero doors-screen" id="top">
      {/*
        The same clip the approved hero carried, kept and turned down.
        It is the darkest of the nine Meg sent, which is what lets
        near-white type sit on it, and the poster is on the wrapper as
        well as the element so the screen reads the same when the video
        never loads and under `prefers-reduced-motion`, where CSS hides
        the video and leaves the frame. Nothing in the grid's
        composition depends on it playing.
      */}
      <div
        className="media"
        data-vid=""
        style={{ backgroundImage: "url('/ocean/video/shot-one-poster.webp')" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/ocean/video/shot-one-poster.webp"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/ocean/video/shot-one.webm" type="video/webm" />
          <source src="/ocean/video/shot-one.mp4" type="video/mp4" />
        </video>
        <div className="scrim scrim-v" />
        <div className="scrim scrim-doors" />
      </div>

      <div className="wrap">
        {/*
          No reveal on this block: it is the first thing on screen, so it
          is simply there. The doors below carry one, which resolves to
          the end state at first paint for anyone who asked for no
          motion and for print.
        */}
        <div className="doors-head">
          <p className="eyebrow">
            <span className="tick">●</span> {homeHero.eyebrow}
          </p>
          <h1>{homeHero.headline}</h1>
          <p className="doors-meta">
            {homeHero.sub} <span className="sep">·</span> {homeHero.location}
          </p>
        </div>

        <div className="doors" id="doors">
          {services.map((service, i) => {
            const n = counts[service.id] ?? 0;
            return (
              <Link
                key={service.id}
                className="door"
                href={`/services#${service.id}`}
                data-reveal=""
                style={delay(0.04 * i)}
              >
                <span className="door-top">
                  <span className="door-idx mono">{service.index}</span>
                  {/*
                    Mono here is the one place on this screen it is
                    allowed: CLAUDE.md permits it for "real code or
                    data", and this is a count read off `work`.
                  */}
                  <span className="door-count mono">
                    {n} {n === 1 ? "project" : "projects"}
                  </span>
                </span>

                <h2 className="door-title">{service.title}</h2>
                <p className="door-tag">{service.tagline}</p>

                <ul className="kinds">
                  {service.kinds.map((kind) => (
                    <li key={kind}>{kind}</li>
                  ))}
                </ul>

                <span className="door-go" aria-hidden="true">
                  <span className="door-go-label">{service.short}</span>
                  <span className="arw">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
