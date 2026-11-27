import Link from "next/link";
import { homeBands } from "@/lib/content";

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/*
  06 — the work, sorted by the kind of business it runs.

  Meg: "we also do customer portals and booking sites, and sites and
  workflows for different industries". Portals and booking were already
  on the page as chips under the service rows. Industry was the one thing
  she named that the site genuinely did not say anywhere: a grep for
  industry, vertical or niche returned one hero eyebrow and nothing else.

  **Five rows, and the number is the whole discipline here.** An industry
  section is honest when it says "here is the system a business in this
  sector is running, and here is the workflow it runs" — a real named
  build, a real capture, a real destination. It becomes a lie the moment
  it adds a sixth sector with nothing behind it, a logo wall or a client
  count. Every row below names work that shipped and a picture of it.

  Two sectors a reader might expect are deliberately absent, and the
  reason is written here so the next person does not quietly add them:
  **restaurants and medical have no work behind them.** Nothing in this
  repo backs either, so neither gets a row until something does.

  The `flow` line is the only genuinely new prose on this page, and each
  one is the stages of a job this build actually performs, drawn from
  that project's own record rather than written fresh.
*/
type Sector = {
  id: string;
  sector: string;
  /** A real, shipped build. */
  build: string;
  /** The stages of that sector's job, as this build runs them. */
  flow: string;
  href: string;
  shot: string;
  alt: string;
};

const SECTORS: Sector[] = [
  {
    id: "cleaning",
    sector: "Cleaning & home services",
    build: "The Maine Cleaning Co. · BrightBase",
    flow: "Request lands → quote drafted → job on the schedule → crew on their phone → invoice → paid.",
    href: "/work/maine-cleaning-co",
    shot: "/shots/maineclean.webp",
    alt: "The Maine Cleaning Co. website, the site the office system runs behind.",
  },
  {
    id: "rentals",
    sector: "Short-term rentals",
    build: "The Keystone House · Welcome Book · Turnover Planner",
    flow: "Booking lands → turnover scheduled → cleaner assigned → guest gets the book.",
    href: "/welcome-book",
    shot: "/shots/keystone.webp",
    alt: "The Keystone House welcome book, open on the check-in page.",
  },
  {
    id: "trades",
    sector: "Construction & trades",
    build: "Nash Construction",
    flow: "Project portfolio → consultation request → a quote in writing.",
    href: "/catalog",
    shot: "/shots/nash.webp",
    alt: "The Nash Construction website, with its project portfolio.",
  },
  {
    id: "admin",
    sector: "Admin & professional services",
    build: "The Remote Admin",
    flow: "Services explained → enquiry → a scoped proposal.",
    href: "/work/the-remote-admin",
    shot: "/shots/remote-admin.webp",
    alt: "The Remote Admin website, built end to end for a Southern-NH admin firm.",
  },
  {
    id: "programs",
    sector: "Childcare & programs",
    build: "Arrowhead Explorers · parent portal",
    flow: "Parents sign up → QR check-in on the day → the office sees who is here.",
    href: "/catalog",
    shot: "/shots/arrowhead.webp",
    alt: "Arrowhead Explorers, a childcare program site with a parent portal.",
  },
];

export default function StageIndustries() {
  return (
    <section className="band" id="industries">
      <div className="wrap">
        <div className="band-head">
          <p className="eyebrow" data-reveal="">
            {homeBands.industries.eyebrow}
          </p>
          <h2 data-reveal="" style={delay(0.06)}>
            {homeBands.industries.heading}
          </h2>
        </div>

        <div className="inds">
          {SECTORS.map((s, i) => (
            <Link
              key={s.id}
              href={s.href}
              className="ind-row"
              data-reveal=""
              style={delay(Math.min(i, 4) * 0.06)}
            >
              <figure className="frame ind-shot">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.shot} alt={s.alt} loading="lazy" decoding="async" />
              </figure>
              <div className="ind-txt">
                <h3>
                  {s.sector}
                  <span className="arw" aria-hidden="true">
                    {" "}
                    →
                  </span>
                </h3>
                <p className="ind-build">{s.build}</p>
                <p className="ind-flow">{s.flow}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
