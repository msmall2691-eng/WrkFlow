import Link from "next/link";
import {
  caseStudies,
  homeBands,
  homeCards,
  homeFeature,
  services,
  work,
  type WorkItem,
} from "@/lib/content";
import { delay } from "./reveal";

/*
  03 — the work: one project opened up, three beside it, and the way into
  the rest.

  **Every picture here is a real capture of a running system**, which is
  the section's own claim and the first rule in CLAUDE.md. The captures,
  the two result figures, the stack and the alt text all resolve to
  `work[]` and `caseStudies[]`; nothing in this file writes a number or a
  client outcome, and the project count in the closing link is computed
  from `work` rather than typed.

  The four items shown are an editorial choice and are named in
  `lib/content.ts` (`homeFeature`, `homeCards`) rather than here, with a
  test that each one still resolves — a renamed project would otherwise
  silently render one card fewer.
*/

/** What the browser chrome reads: the real host, or what the thing is. */
function chromeLabel(item: WorkItem) {
  if (item.displayDomain) return item.displayDomain;
  if (item.url) {
    try {
      return new URL(item.url).host.replace(/^www\./, "");
    } catch {
      /* A malformed URL in the data should not take the page down. */
    }
  }
  /* A private system has no host to show, so it says what it is instead.
     `status` is the field that already means that ("In daily production",
     "Production, approval-gated"). */
  return item.status ?? item.tag;
}

/** The service this is proof of, which is what `category` is for. */
function proofOf(item: WorkItem) {
  const service = services.find((s) => s.id === item.category);
  const label = service?.short ?? item.tag;
  return item.client ? `${label} · client work` : label;
}

function Frame({ item, eager = false }: { item: WorkItem; eager?: boolean }) {
  const study = item.caseStudy
    ? caseStudies.find((c) => c.slug === item.caseStudy)
    : undefined;
  const shot = study?.hero.src ?? item.shot;
  if (!shot) return null;

  return (
    <figure className="frame">
      <div className="chrome" aria-hidden="true">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="host">{chromeLabel(item)}</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot}
        /* The case study's own description where there is one; otherwise
           the shape `TakeReel` already uses for a capture of real work. */
        alt={study?.hero.alt ?? `${item.title}, as it runs today`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </figure>
  );
}

export default function StageWork() {
  const feature = work.find((w) => w.title === homeFeature);
  const study = feature?.caseStudy
    ? caseStudies.find((c) => c.slug === feature.caseStudy)
    : undefined;
  const cards = homeCards
    .map((title) => work.find((w) => w.title === title))
    .filter((w): w is WorkItem => Boolean(w));

  return (
    <section className="band" id="work">
      <div className="wrap">
        <div className="band-head">
          <p className="eyebrow" data-reveal="">
            {homeBands.work.eyebrow}
          </p>
          <h2 data-reveal="" style={delay(0.06)}>
            {homeBands.work.heading}
          </h2>
        </div>

        {feature && (
          <div className="feature">
            <div data-reveal="">
              <Frame item={feature} eager />
            </div>
            <div className="feature-txt" data-reveal="" style={delay(0.1)}>
              <p className="card-cat">{proofOf(feature)}</p>
              <h3>{feature.title}</h3>
              <p className="lead">{feature.blurb}</p>
              {study && study.results.length > 0 && (
                <ul className="facts">
                  {study.results.map((r) => (
                    <li key={r.label}>
                      <span className="v">{r.value}</span>
                      <span className="l">{r.label}</span>
                    </li>
                  ))}
                </ul>
              )}
              {feature.stack && (
                <ul className="stack">
                  {feature.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
              {feature.caseStudy && (
                <Link className="tlink" href={`/work/${feature.caseStudy}`}>
                  {homeBands.work.caseStudy}{" "}
                  <span className="arw" aria-hidden="true">
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="cards">
          {cards.map((item, i) => (
            <article key={item.title} data-reveal="" style={delay(i * 0.08)}>
              <Frame item={item} />
              <div className="card-cap">
                <p className="card-cat">{proofOf(item)}</p>
                <h3>{item.title}</h3>
                <p>{item.blurb}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="work-foot" data-reveal="">
          <Link className="tlink" href={homeBands.work.allHref}>
            {homeBands.work.all}{" "}
            <span className="arw" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
