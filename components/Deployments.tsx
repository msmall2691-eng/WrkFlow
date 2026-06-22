import Image from "next/image";
import { work, type WorkItem } from "@/lib/content";
import Reveal from "./Reveal";

const domain = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/*
  Deployments — "Work". A single horizontal, snap-scrolling rail of project
  cards (client sites → product → private internal systems) so the samples stay
  compact and invite a swipe instead of a long vertical stack.
*/
export default function Deployments() {
  const sites = work.filter((w) => w.tier === "site");
  const products = work.filter((w) => w.tier === "product");
  const privates = work.filter((w) => w.tier === "private");
  const all = [...sites, ...products, ...privates];

  return (
    <section id="work" className="relative overflow-hidden border-t border-line py-14 md:py-20">
      <div
        aria-hidden="true"
        className="floaty pointer-events-none absolute -left-24 bottom-8 h-72 w-72 rounded-full bg-gold/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <Reveal delay={60}>
              <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
                Built for our own company first.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 text-base leading-relaxed text-muted">
                Live client sites, a SaaS platform, and the internal systems
                running behind them.
              </p>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="hidden font-mono text-[10px] uppercase tracking-widest text-faint sm:flex sm:items-center sm:gap-2">
              Drag or scroll
              <span aria-hidden="true">→</span>
            </p>
          </Reveal>
        </div>
      </div>

      {/* Horizontal snap rail — bleeds to the viewport edges */}
      <Reveal>
        <div className="relative">
          {/* Edge fades hint there's more to scroll */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--color-base)] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--color-base)] to-transparent"
          />
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="shrink-0" aria-hidden="true" />
            {all.map((w) => (
              <WorkCard key={w.title} w={w} />
            ))}
            <div className="shrink-0 pr-1" aria-hidden="true" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function WorkCard({ w }: { w: WorkItem }) {
  const linked = !!w.url;
  const cta = w.tier === "product" ? "View demo" : "Visit site";
  return (
    <article
      className={`group flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-elevated transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] sm:w-[360px] ${
        w.client ? "border-gold/40 hover:border-gold/60" : "border-line hover:border-signal/50"
      }`}
    >
      {/* Browser frame */}
      <div className="bg-surface">
        <div className="flex items-center gap-1.5 border-b border-line bg-base/60 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          {linked ? (
            <span className="ml-2 truncate rounded bg-surface px-2 py-0.5 font-mono text-[10px] text-faint">
              {domain(w.url!)}
            </span>
          ) : (
            <span className="ml-auto rounded-full border border-line bg-base/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-faint">
              🔒 Private
            </span>
          )}
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={w.shot}
            alt={`${w.title} — preview`}
            fill
            sizes="(min-width: 640px) 360px, 82vw"
            className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          {!linked && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          )}
        </div>
      </div>

      {/* Caption */}
      <div className="flex flex-1 flex-col p-5">
        <p className={`font-mono text-[10px] uppercase tracking-widest ${w.client ? "text-gold" : linked ? "text-signal" : "text-faint"}`}>
          {w.tag}
        </p>
        <h3 className="display-serif mt-2 text-lg text-ink">{w.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{w.blurb}</p>

        {w.metric && (
          <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-signal">
            {w.metric}
          </p>
        )}

        {linked && (
          <a
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-ink"
          >
            {cta}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        )}
      </div>
    </article>
  );
}
