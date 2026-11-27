import Link from "next/link";
import { demos, forRentals, homeBands, marketItems } from "@/lib/content";
import { TOOL_COUNT } from "@/components/Playground";

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/*
  03 — the things somebody can use before talking to anybody.

  **The band exists because the homepage linked none of them.** Meg: "love
  the free tools etc.. but id like them to see them sooner". Counted before
  this, the approved six sections carried nine outbound links and not one
  went to a free tool, a demo, the turnover planner or the welcome book.
  `e2e/smoke.spec.ts` had already said in writing that those routes were
  "one hop further away than they were, and that is worth saying out loud
  rather than discovering later". This is that later.

  **Order inside the band is the one compromise in it.** `TryItNow`, the
  component this reuses the data of, argued that invented demo businesses
  above the one confirmed outcome "would trade the argument for the
  novelty" — and it is right. So the two real, free, Meg's-own things lead
  (the tools and the planner), and the three demos follow, each saying on
  its face that the business is invented. The band still sits above #work,
  which is what "sooner" asked for.

  **Nothing here is new.** Every string is lifted from a record that
  already shipped: `forRentals.extra` for the planner, `demos[]` for the
  three, `marketItems` for the welcome book's price. Every picture is a
  capture already on disk. The tool count is read from `Playground`'s own
  list, never typed — the rule CLAUDE.md sets for the project count under
  each service door, for the same reason: a count is a claim about
  evidence.
*/
export default function StageTry() {
  const book = marketItems.find((m) => m.id === "welcome-book");

  /* The two real things first. */
  const real = [
    {
      key: "tools",
      cat: "Free · no signup",
      title: `${TOOL_COUNT} free business tools`,
      body: "Quote, rate and site checks. They run in the page, and nothing is saved or emailed.",
      href: "/tools",
      shot: "/shots/tools.webp",
      alt: "The free tools page on this site, with the quote calculator open.",
      host: "mlinx.studio/tools",
    },
    {
      key: "turnover",
      cat: forRentals.extra.price,
      title: forRentals.extra.title,
      body: forRentals.extra.body,
      href: forRentals.extra.href,
      shot: "/shots/catalog/turnover.webp",
      alt: "The turnover planner, showing a month of cleanings built from a booking calendar.",
      host: "mlinx.studio/turnover",
    },
    ...(book
      ? [
          {
            key: "welcome-book",
            /* Straight from `marketItems`, so the price has one author. */
            cat: book.price,
            title: book.name,
            body: book.tagline,
            href: "/welcome-book",
            shot: "/shots/catalog/welcome-book.webp",
            alt: "A digital welcome book open on a phone, showing check-in and WiFi.",
            host: "mlinx.studio/welcome-book",
          },
        ]
      : []),
  ];

  return (
    <section className="band" id="try">
      <div className="wrap">
        <div className="band-head">
          <p className="eyebrow" data-reveal="">
            {homeBands.try.eyebrow}
          </p>
          <h2 data-reveal="" style={delay(0.06)}>
            {homeBands.try.heading}
          </h2>
        </div>

        <div className="cards">
          {real.map((item, i) => (
            <article key={item.key} data-reveal="" style={delay(i * 0.08)}>
              <Link href={item.href} className="try-link">
                <figure className="frame">
                  <div className="chrome" aria-hidden="true">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                    <span className="host">{item.host}</span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.shot} alt={item.alt} loading="lazy" decoding="async" />
                </figure>
                <div className="card-cap">
                  <p className="card-cat">{item.cat}</p>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/*
          The three demos, below the real things and labelled.

          **The label is not decoration.** These are invented businesses,
          and a card previewing one without saying so is the claim about
          supply that CLAUDE.md's first rule refuses — the same rule the
          demo pages themselves already carry a test for.
        */}
        <div className="cards try-demos">
          {demos.map((d, i) => (
            <article key={d.href} data-reveal="" style={delay(i * 0.08)}>
              <Link href={d.href} className="try-link">
                <figure className="frame">
                  <div className="chrome" aria-hidden="true">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                    <span className="host host-note">Demo · invented business</span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/shots/catalog/demo-${d.href.split("/").pop()}.webp`}
                    alt={`${d.name}, a ${d.kind.toLowerCase()} demo you can use.`}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className="card-cap">
                  <p className="card-cat">{d.kind} · demo</p>
                  <h3>{d.name}</h3>
                  <p>{d.what}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="work-foot">
          <Link className="tlink" href={homeBands.try.allHref}>
            {homeBands.try.all}{" "}
            <span className="arw" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
