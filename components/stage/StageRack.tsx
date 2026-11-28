import Link from "next/link";
import { services, work } from "@/lib/content";

/*
  02 — the four categories, on the first screen.

  **This is the one place the page asks a visitor what they came for**,
  and it sits inside the hero's own screen rather than a scroll below it:
  Meg's ask was that somebody "immediately see what theyve come here
  for", and a row of doors one swipe down is a row of doors most people
  never see.

  Every word comes from `services[]`, which CLAUDE.md names as the single
  definition of what the studio sells: the index, the title, the tagline
  and the chips. A fifth service added there appears here with no edit.

  **The count under each door is computed from `work`, never typed.** It
  is the whole argument of this page in miniature — the categories are
  shelves, and the number says how much is on each one. CLAUDE.md's rule
  about the old service router applies exactly: a count is a claim about
  evidence, and one written by hand is one that drifts.

  Each door goes to `/services#id` for the long version, and its count
  is also a link down the page to that category's work, which is the
  other half of "look what exists".
*/
export default function StageRack() {
  return (
    <section id="services" className="rack-band">
      <div className="wrap">
        <ul className="rack">
          {services.map((service) => {
            const built = work.filter((w) => w.category === service.id).length;

            return (
              <li key={service.id}>
                <Link className="rack-row" href={`/services#${service.id}`}>
                  <span className="rack-idx mono">{service.index}</span>
                  <span className="rack-title">
                    {service.title}
                    <span className="arw" aria-hidden="true">
                      {" "}
                      →
                    </span>
                  </span>
                  <span className="rack-tag">{service.tagline}</span>
                  <span className="rack-kinds">
                    {service.kinds.map((kind) => (
                      <span key={kind}>{kind}</span>
                    ))}
                  </span>
                </Link>
                <a className="rack-count mono" href={`#proof-${service.id}`}>
                  {built} {built === 1 ? "project" : "projects"} below
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
