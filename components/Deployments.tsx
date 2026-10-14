import Image from "next/image";
import { work, type WorkItem } from "@/lib/content";
import Reveal from "./Reveal";

const domain = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/*
  Work — six real screenshots, big.

  This section used to open with a live-iframe rail (two sites embedded and
  auto-scrolling) and then drop into a three-column grid of small cards, each
  wearing fake browser chrome, a tilt-on-hover effect, a metric chip and a
  three-row definition list of stack / replaced / status. The screenshots —
  the only actual evidence on the page — were the smallest thing in it.

  Now it is one grid, two columns, and the image is the card. The first item
  runs full width because it is the flagship and it earns the room. Everything
  that was competing with the pictures is gone: no iframes, no chrome, no tilt,
  no metric chips, no spec table. What a buyer needs from this section is
  "these are real and they shipped", and a large screenshot says that faster
  than a caption can.

  The stack/replaced/status detail did not move to another page; it is cut. It
  was written for a reader who had already decided, and that reader is on
  /about reading the approach.
*/

/* One line of proof under the heading, folded in from the old founder band. */
const PROOF = "The Maine Cleaning Co. · 10 yrs · 1,000+ customers · 7,000+ service visits · $1M+ managed";

export default function Deployments() {
  const items = work.filter((w) => w.shot);

  return (
    <section id="work" className="relative border-t border-line py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <Reveal>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              Work
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              Websites, products & systems.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Work for other businesses, products I have built, and the tools I use in my own company.
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              {PROOF}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((w, i) => (
            /* The span lives on Reveal, not on Card: Reveal renders the
               element that is actually the grid item, so a col-span on the
               card inside it does nothing. */
            <Reveal
              key={w.title}
              delay={Math.min(i, 3) * 60}
              className={i === 0 ? "md:col-span-2" : ""}
            >
              <Card w={w} feature={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ w, feature }: { w: WorkItem; feature?: boolean }) {
  const live = !!w.url;
  const Wrapper = live ? "a" : "div";

  return (
    <Wrapper
      {...(live
        ? { href: w.url, target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={`group block overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-500 ${
        live ? "hover:-translate-y-1 hover:border-signal/50 hover:shadow-[0_24px_60px_-34px_rgba(11,23,34,0.35)]" : ""
      }`}
    >
      <div className={`relative overflow-hidden bg-base ${feature ? "aspect-[2/1]" : "aspect-[16/10]"}`}>
        <Image
          src={w.shot as string}
          alt={`${w.title} — screenshot`}
          fill
          /* The feature card is full-bleed across a 1152px container; the rest
             are half of it. Getting these wrong is what makes a big screenshot
             look soft, which would defeat the point of enlarging them. */
          sizes={feature ? "(min-width: 1152px) 1104px, 100vw" : "(min-width: 768px) 540px, 100vw"}
          priority={feature}
          className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
        />
        {w.tier === "private" && (
          <span className="absolute right-3 top-3 rounded-full border border-line bg-surface/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-faint backdrop-blur">
            In production
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-4 p-5">
        <div className="min-w-0">
          <h3 className="display-serif text-[1.05rem] text-ink">{w.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{w.blurb}</p>
          <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-widest text-faint">
            {live ? domain(w.url as string) : w.tag}
          </p>
        </div>
        {live && (
          <span
            aria-hidden="true"
            className="shrink-0 text-sm font-semibold text-signal transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        )}
      </div>
    </Wrapper>
  );
}

