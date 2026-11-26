import Link from "next/link";
import { approachSteps, founderPhilosophy, homeBands } from "@/lib/content";
import { delay } from "./reveal";

/*
  04 — the breath: the statement, and one of Meg's pieces floating beside
  it.

  The statement is `founderPhilosophy` verbatim, both lines, with the
  second one in the design's own quieter grey. The note under it is the
  first two `approachSteps` — the real copy for discovery and design,
  which is what the mockup was paraphrasing.

  **The art claims nothing.** It is `aria-hidden`, it has an empty alt, and
  there is no caption, no heading and no number anywhere near it, which is
  the rule `lib/ocean.ts` and the chapters on the old page were held to:
  a picture beside a service reads as evidence the moment it is given
  words. The drift it does is a 13-second loop on `transform` alone, and
  `StageMotion` lets it run only while it is on screen.
*/
export default function StageApproach() {
  const [first, second] = founderPhilosophy.lines;

  return (
    <section className="band approach">
      <div className="wrap">
        <div>
          <p className="eyebrow" data-reveal="">
            {founderPhilosophy.heading}
          </p>
          <h2 className="statement" data-reveal="" style={delay(0.06)}>
            {first}
            <span>{second}</span>
          </h2>
          <p className="approach-note" data-reveal="" style={delay(0.12)}>
            {approachSteps[0].body} {approachSteps[1].body}
          </p>
          <Link
            className="tlink"
            data-reveal=""
            style={delay(0.18)}
            href="/about"
          >
            {homeBands.approach.link}{" "}
            <span className="arw" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
        <div className="art" data-reveal="" style={delay(0.1)} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="float"
            src="/ocean/creature-cutout.webp"
            width={1200}
            height={911}
            loading="lazy"
            decoding="async"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
