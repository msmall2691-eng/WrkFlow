import { homeBands } from "@/lib/content";
import { integrations, provenIn } from "@/lib/integrations";

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/*
  05 — the tools a business already pays for, and where each one is
  already connected.

  **Meg names this first when asked what she sells** ("the web apps and
  integrations we can use with their current systems"), and the homepage
  said it in three words inside a service row's chips. The evidence had
  been written down for weeks: `lib/integrations.ts` holds eight tools,
  each naming the exact record elsewhere in the repo that backs it, with
  a passing test that resolves every one. It rendered nowhere.

  **It sits below #work on purpose.** An integration tile reads as
  evidence only once a visitor has seen the systems it runs in; above the
  work it is a logo wall, which is the single easiest thing on a
  portfolio to pad out and the first thing CLAUDE.md refuses.

  **The project names are deliberately not links**, which was
  `WhatConnects`' own call and is kept: the point of the band is the
  tool, and a link per tile turns eight answers into eight invitations to
  leave. `provenIn` resolves the proof records, so a tile can only name a
  project that exists — adding a tool here by typing it fails the test
  rather than rendering.
*/
export default function StageConnects() {
  return (
    <section className="band" id="connects">
      <div className="wrap">
        <div className="band-head">
          <p className="eyebrow" data-reveal="">
            {homeBands.connects.eyebrow}
          </p>
          <h2 data-reveal="" style={delay(0.06)}>
            {homeBands.connects.heading}
          </h2>
          <p className="svc-tag" data-reveal="" style={delay(0.1)}>
            {homeBands.connects.note}
          </p>
        </div>

        <ul className="conx">
          {integrations.map((i, n) => {
            const where = provenIn(i);
            return (
              <li key={i.name} data-reveal="" style={delay(Math.min(n, 5) * 0.05)}>
                <h3>{i.name}</h3>
                <p>{i.what}</p>
                {where.length > 0 && (
                  <p className="conx-in">
                    Running in {where.map((w) => w.title).join(" · ")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
