import Link from "next/link";
import { homeBands, services } from "@/lib/content";
import { delay } from "./reveal";

/*
  02 — the four things for sale, as four rows.

  Every word of every row comes from `services[]`, which CLAUDE.md names
  as the single definition of what the studio sells: the index, the title,
  the one-line tagline and the chips. A fifth service added there appears
  here with no edit, and a renamed one cannot disagree with /services.

  **The arrow is tied to the last word.** The design wraps the final word
  and the arrow in a `.nw` span so a line break can never leave the arrow
  stranded on a line of its own, which at 390px it otherwise does on three
  of the four titles. Split from the title rather than written out, so it
  survives a rename.
*/
export default function StageServices() {
  return (
    <section className="band" id="services">
      <div className="wrap">
        <div className="band-head">
          <p className="eyebrow" data-reveal="">
            {homeBands.services.eyebrow}
          </p>
          <h2 data-reveal="" style={delay(0.06)}>
            {homeBands.services.heading}
          </h2>
        </div>

        <div className="svc">
          {services.map((service) => {
            const words = service.title.split(" ");
            const last = words.pop() ?? service.title;
            const head = words.join(" ");

            return (
              <Link
                key={service.id}
                className="svc-row"
                href={`/services#${service.id}`}
                data-reveal=""
              >
                <div className="svc-grid">
                  <div className="svc-idx">{service.index}</div>
                  <h3 className="svc-title">
                    {head ? `${head} ` : ""}
                    <span className="nw">
                      {last}
                      <span className="arw" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </h3>
                  <p className="svc-tag">{service.tagline}</p>
                  <ul className="kinds">
                    {service.kinds.map((kind) => (
                      <li key={kind}>{kind}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
