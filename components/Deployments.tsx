import Image from "next/image";
import { work, type WorkItem } from "@/lib/content";
import Reveal from "./Reveal";
import Tilt from "./Tilt";

const domain = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export default function Deployments() {
  const sites = work.filter((w) => w.tier === "site");
  const products = work.filter((w) => w.tier === "product");
  const privates = work.filter((w) => w.tier === "private");

  return (
    <section id="work" className="relative overflow-hidden border-t border-line py-14 md:py-20">
      <div
        aria-hidden="true"
        className="floaty pointer-events-none absolute -left-24 bottom-8 h-72 w-72 rounded-full bg-gold/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-3xl">
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              I built it for my own company first.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Live client sites, a SaaS platform, and the systems running behind
              them.
            </p>
          </Reveal>
        </div>

        {/* Tier 1 — live websites (big, linked) */}
        <div className="grid gap-6 lg:grid-cols-2">
          {sites.map((w, i) => (
            <Reveal key={w.title} delay={i * 60}>
              <Tilt>
                <BigCard w={w} />
              </Tilt>
            </Reveal>
          ))}
        </div>

        {/* Tier 2 — product (medium, linked) */}
        {products.map((w) => (
          <Reveal key={w.title} delay={80}>
            <div className="mt-6 lg:max-w-[calc(50%-0.75rem)]">
              <Tilt>
                <BigCard w={w} />
              </Tilt>
            </div>
          </Reveal>
        ))}

        {/* Tier 3 — private systems (small tiles, no links) */}
        <div className="mt-10">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-faint">
            Behind the scenes — private, login-gated systems
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {privates.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <PrivateTile w={w} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BigCard({ w }: { w: WorkItem }) {
  const cta = w.tier === "product" ? "View the demo" : "Visit site";
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-elevated transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] ${
        w.client ? "border-gold/40 hover:border-gold/60" : "border-line hover:border-signal/50"
      }`}
    >
      {/* Browser frame */}
      <div className="bg-surface">
        <div className="flex items-center gap-1.5 border-b border-line bg-base/60 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          {w.url && (
            <span className="ml-2 truncate rounded bg-surface px-2 py-0.5 font-mono text-[10px] text-faint">
              {domain(w.url)}
            </span>
          )}
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={w.shot}
            alt={`${w.title} — preview`}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </div>
      </div>

      {/* Caption */}
      <div className="flex flex-1 flex-col p-6">
        <p className={`font-mono text-[10px] uppercase tracking-widest ${w.client ? "text-gold" : "text-signal"}`}>
          {w.tag}
        </p>
        <h3 className="display-serif mt-2 text-xl text-ink">{w.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{w.blurb}</p>

        {/* Real outcome metric only — see WorkItem.metric (never fabricated) */}
        {w.metric && (
          <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-signal">
            {w.metric}
          </p>
        )}

        {w.stack && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {w.stack.map((s) => (
              <span key={s} className="rounded-full border border-line bg-base px-2.5 py-1 font-mono text-[10px] text-muted">
                {s}
              </span>
            ))}
          </div>
        )}

        {w.url && (
          <a
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-ink"
          >
            {cta}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        )}
      </div>
    </article>
  );
}

function PrivateTile({ w }: { w: WorkItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-elevated">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={w.shot}
          alt={`${w.title} — preview`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top"
        />
        {/* Locked overlay — signals login-gated, no link */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute right-3 top-3 rounded-full border border-line bg-base/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-faint backdrop-blur">
          🔒 Private
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-faint">{w.tag}</p>
        <h3 className="display-serif mt-2 text-base text-ink">{w.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{w.blurb}</p>
      </div>
    </article>
  );
}
