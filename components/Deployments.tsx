import Image from "next/image";
import { work, type WorkItem } from "@/lib/content";
import Reveal from "./Reveal";
import LivePreview from "./LivePreview";

/*
  Deployments — "Work". A featured LIVE preview of the linked sites/products
  (always current), with the private internal systems shown as small tiles
  below. Kept deliberately uncluttered.
*/
export default function Deployments() {
  const privates = work.filter((w) => w.tier === "private");

  return (
    <section id="work" className="relative overflow-hidden border-t border-line py-14 md:py-20">
      <div
        aria-hidden="true"
        className="floaty pointer-events-none absolute -left-24 bottom-8 h-72 w-72 rounded-full bg-gold/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-10 max-w-3xl">
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              Built for our own company first.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Live client sites, a SaaS platform, and the systems running behind
              them.
            </p>
          </Reveal>
        </div>

        {/* Featured live preview of the linked work */}
        <Reveal>
          <LivePreview />
        </Reveal>

        {/* Private internal systems */}
        <div className="mt-12">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-faint">
            Behind the scenes — internal ops software
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

function PrivateTile({ w }: { w: WorkItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-elevated">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={w.shot}
          alt={`${w.title} — preview`}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
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
