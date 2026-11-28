import { homeFeature, homeHero, work } from "@/lib/content";
import WorkFrame, { proofOf } from "./WorkFrame";

/*
  01 — the hero, as proof rather than as a promise.

  **The argument of this page is "look what exists", so the first screen
  shows a finished thing.** The headline sits in the left column and the
  featured project sits in the right, at a size where the screen inside
  it can actually be read, over Meg's own reef clip. Under it, the four
  categories (see `StageRack`) — so a visitor who arrives wanting one of
  them finds it without scrolling, and learns the four by seeing the
  work filed under them rather than by being told.

  **It is no longer a full screen, and that is the one structural change
  here.** `.hero` was `min-height: 100svh`, which put the categories
  exactly one scroll below the only thing anybody reads. `.hero-proof`
  shortens it so the hero and the rack share the first screen at
  1440x900. The clip, the two scrims, the poster-on-the-wrapper and
  `StageMotion`'s hold over all of it are untouched.

  **The three hero doors are gone, and the rack replaced them rather
  than joining them.** They asked "which of these are you", which is the
  same question the four categories ask one element later; linx's
  landing page records what two switches asking one question costs, and
  the answer is that the visitor does the product's job. One page, one
  question, asked once. `homeHero.doors` stays in `lib/content.ts`.

  Nothing here is written: the headline, the sub and the location line
  are `homeHero`'s, and the capture, its alt text, the host in the
  chrome and the category label all resolve to `work[]`.
*/
export default function StageProofHero() {
  const feature = work.find((w) => w.title === homeFeature);

  return (
    <section className="hero hero-proof" id="top">
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
        <div className="scrim scrim-h" />
        <div className="scrim scrim-v" />
      </div>

      <div className="wrap">
        <div className="proof">
          <div className="proof-txt">
            <p className="eyebrow">
              <span className="tick">●</span> {homeHero.eyebrow}
            </p>
            <h1>{homeHero.headline}</h1>
            <p className="hero-sub">{homeHero.sub}</p>
            <p className="hero-meta">{homeHero.location}</p>
          </div>

          {feature && (
            <div className="proof-shot">
              <WorkFrame item={feature} eager />
              {/*
                The caption is a link down to this project's own shelf,
                which is the one place it is opened up with its two
                confirmed figures and its case study. The hero shows it
                and the shelf explains it, so the second look is the
                point rather than a repetition.
              */}
              <a className="proof-cap" href={`#proof-${feature.category}`}>
                <span className="card-cat">{proofOf(feature)}</span>
                <span className="proof-name">{feature.title}</span>
                <span className="arw" aria-hidden="true">
                  ↓
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
