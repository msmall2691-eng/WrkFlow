import { homeBands, smallProjects, studioStats } from "@/lib/content";
import { delay } from "./reveal";

/*
  05 — what it costs, before anybody has to ask.

  The four rows are `smallProjects`, which is where those prices have one
  author: the same four appear on the /services ladder, and a price that
  disagrees with itself across two pages is worse than no price at all.
  The note under them carries the Digital Welcome Book's real numbers from
  `welcomeBook`, interpolated in `lib/content.ts` rather than typed here.

  The four promises are `studioStats` verbatim — M Studio's own promises,
  not outcomes claimed on anybody's behalf.
*/
export default function StagePricing() {
  return (
    <section className="band pricing" id="pricing">
      <div className="wrap">
        <div className="band-head">
          <p className="eyebrow" data-reveal="">
            {homeBands.pricing.eyebrow}
          </p>
          <h2 data-reveal="" style={delay(0.06)}>
            {homeBands.pricing.heading}
          </h2>
          <p data-reveal="" style={delay(0.1)}>
            {homeBands.pricing.lede}
          </p>
        </div>

        <ul className="plist">
          {smallProjects.map((project, i) => (
            <li key={project.offer} data-reveal="" style={delay(i * 0.05)}>
              <span className="pname">{project.title}</span>
              <span className="pprice">{project.price}</span>
              <span className="pscope">{project.scope}</span>
            </li>
          ))}
        </ul>

        <p className="pnote" data-reveal="">
          {homeBands.pricing.note}
        </p>

        <div className="promises">
          {studioStats.map((stat, i) => (
            <div key={stat.label} data-reveal="" style={delay(i * 0.05)}>
              <div className="v">{stat.value}</div>
              <div className="l">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
