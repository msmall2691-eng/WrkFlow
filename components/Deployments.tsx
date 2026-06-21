import Image from "next/image";
import { deployments, type Deployment } from "@/lib/content";
import Reveal from "./Reveal";
import ProjectVisual from "./ProjectVisual";
import Tilt from "./Tilt";

export default function Deployments() {
  return (
    <section id="work" className="relative overflow-hidden border-t border-line py-14 md:py-20">
      <div
        aria-hidden="true"
        className="floaty pointer-events-none absolute -left-24 bottom-8 h-72 w-72 rounded-full bg-gold/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-3xl">
          <Reveal>
            <p className="marker mb-4">// Selected work</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              We built it for ourselves first.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-base leading-relaxed text-muted">
              No theory. Every build here shipped for a real, operating company
              before anyone else saw it—{" "}
              <span className="text-ink">this site included.</span>
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deployments.map((d, i) => (
            <Reveal key={d.title} delay={i * 60}>
              <Tilt>
                <DeploymentCard d={d} n={i + 1} />
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeploymentCard({ d, n }: { d: Deployment; n: number }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-elevated transition-all duration-500 hover:-translate-y-1 hover:border-signal/40 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]">
      {/* Preview */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {d.shot ? (
          <>
            <Image
              src={d.shot}
              alt={`${d.title} — preview`}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          d.visual && <ProjectVisual type={d.visual} />
        )}
        <span className="absolute left-4 top-3 z-10 font-mono text-[11px] text-white/60">
          {String(n).padStart(2, "0")}
        </span>
      </div>

      {/* Caption */}
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-signal">
          {d.kind}
        </p>
        <h3 className="display-serif mt-2 text-lg text-ink">{d.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{d.blurb}</p>
        {d.outcome && (
          <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-gold">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
            {d.outcome}
          </span>
        )}
        {/* Accent rule that draws in on hover */}
        <span className="mt-4 block h-px w-8 bg-signal/50 transition-all duration-500 group-hover:w-16" />
      </div>
    </article>
  );
}
