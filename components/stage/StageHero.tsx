import { homeHero } from "@/lib/content";

/*
  01 — the hero. One screen, Meg's own reef footage behind it, the
  headline sitting on the floor of it.

  The clip is `shot-one`, which the design names: of the nine she sent it
  is the darkest, which is what lets near-white type sit on it. WebM
  first and H.264 second, as everywhere else here — some Linux builds
  (including the browser the suite drives) ship without H.264, and Safari
  will autoplay nothing else.

  **The poster is on the wrapper as well as on the video**, which is the
  design's own trick and does real work: it is the frame a visitor sees
  while the clip loads, if it never loads, and under
  `prefers-reduced-motion`, where CSS hides the video and leaves the
  picture. Nothing about the hero's composition depends on the video
  playing.

  `autoPlay` stays on the element so a visitor with no JavaScript still
  gets the loop; `StageMotion` only ever takes playback away and gives it
  back. This stays a server component for that reason.

  No reveal on anything in here, which is the design's own call: the hero
  is the first thing on screen, so it is simply there. The mockup marks
  its lines `.rv.in`, which resolves to the end state at first paint.
*/
export default function StageHero() {
  return (
    <section className="hero" id="top">
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
        <div className="hero-inner">
          <p className="eyebrow">
            <span className="tick">●</span> {homeHero.eyebrow}
          </p>
          <h1>{homeHero.headline}</h1>
          <p className="hero-sub">{homeHero.sub}</p>
          <p className="hero-meta">{homeHero.location}</p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-solid">
              {homeHero.primary} <span className="arw">→</span>
            </a>
            <a href="#work" className="btn btn-ghost">
              {homeHero.secondary}
            </a>
          </div>
        </div>
      </div>
      <div className="scrollcue" aria-hidden="true" />
    </section>
  );
}
