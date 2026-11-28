import Link from "next/link";
import {
  caseStudies,
  homeBands,
  services,
  work,
  type Service,
  type WorkItem,
} from "@/lib/content";
import { delay } from "./reveal";
import WorkFrame, { proofOf } from "./WorkFrame";

/*
  03 — the work, on the four shelves the rack above names.

  **The categories are the structure, not a filter.** A visitor who came
  for a website reads the websites shelf and never has to decide what
  "tier" means; somebody who came for nothing in particular learns the
  four by seeing what is filed under each. That is the whole direction:
  the argument is "look what exists", and the categories are the shelves
  it sits on.

  **Every picture is a real capture of a running system**, which is this
  section's own claim and the first rule in CLAUDE.md. The captures, the
  two result figures, the stack and the alt text all resolve to `work[]`
  and `caseStudies[]`. Nothing here writes a number, a client name or an
  outcome, and the per-shelf count is `work`'s own length.

  **Scale is the thing that keeps nine captures from being a wall.** Each
  shelf opens one project at a size where the screen inside it reads, and
  the rest sit beside it as cards; a shelf with one project on it gets
  that project large with the category's own `pain` and `outcome` in the
  space, rather than a lonely card in a three-column grid. The shelves
  are separated by a rule and a full band of space, so the eye is handed
  four groups rather than one list of nine.

  `homeFeature` still names the project that opens the first shelf, and
  `homeCards` is no longer read here: with every project on a shelf there
  is nothing left to choose. Both stay in `lib/content.ts`.
*/

function Card({ item, i }: { item: WorkItem; i: number }) {
  return (
    <article data-reveal="" style={delay(i * 0.06)}>
      <WorkFrame item={item} />
      <div className="card-cap">
        <p className="card-cat">{proofOf(item)}</p>
        <h4>{item.title}</h4>
        <p>{item.blurb}</p>
      </div>
    </article>
  );
}

function Lead({ item, service }: { item: WorkItem; service: Service }) {
  const study = item.caseStudy
    ? caseStudies.find((c) => c.slug === item.caseStudy)
    : undefined;
  /* Only the first shelf's lead is above the fold on a tall screen, and
     only it is worth the eager fetch; the hero's own capture is the one
     that has to be there at first paint. */
  const eager = service.id === services[0].id;

  return (
    <div className="lead-work">
      <div data-reveal="">
        <WorkFrame item={item} eager={eager} />
      </div>
      <div className="lead-txt" data-reveal="" style={delay(0.08)}>
        <p className="card-cat">{proofOf(item)}</p>
        <h4>{item.title}</h4>
        <p className="lead">{item.blurb}</p>

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

        {item.stack && (
          <ul className="stack">
            {item.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}

        {item.caseStudy ? (
          <Link className="tlink" href={`/work/${item.caseStudy}`}>
            {homeBands.work.caseStudy}{" "}
            <span className="arw" aria-hidden="true">
              →
            </span>
          </Link>
        ) : (
          item.page && (
            <Link className="tlink" href={item.page}>
              Open {item.title}{" "}
              <span className="arw" aria-hidden="true">
                →
              </span>
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export default function StageShelves() {
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

        {services.map((service) => {
          const items = work.filter((w) => w.category === service.id);
          if (items.length === 0) return null;
          const [first, ...rest] = items;
          /* A shelf of one or two gets the category's own sentences in the
             space a third card would have filled, which is better copy
             than a stretched card and better design than a gap. */
          const roomy = items.length < 3;

          return (
            <section
              className="shelf"
              key={service.id}
              id={`proof-${service.id}`}
              aria-labelledby={`shelf-${service.id}`}
            >
              <div className="shelf-head" data-reveal="">
                <span className="shelf-idx mono">{service.index}</span>
                <h3 id={`shelf-${service.id}`}>{service.short}</h3>
                <span className="shelf-rule" aria-hidden="true" />
                <span className="shelf-n mono">
                  {items.length === 1 ? "1 project" : `${items.length} projects`}
                </span>
              </div>

              <Lead item={first} service={service} />

              {rest.length > 0 && (
                <div className={roomy ? "cards cards-wide" : "cards"}>
                  {rest.map((item, i) => (
                    <Card key={item.title} item={item} i={i} />
                  ))}
                </div>
              )}

              {roomy && (
                <div className="shelf-say" data-reveal="">
                  <p className="shelf-pain">{service.pain}</p>
                  <p className="shelf-out">{service.outcome}</p>
                </div>
              )}
            </section>
          );
        })}

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
