import Image from "next/image";
import { deployments, type Deployment } from "@/lib/content";
import Reveal from "./Reveal";

export default function Deployments() {
  return (
    <section id="live" className="relative border-t border-line py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
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
              No theory. Every one of these—websites, web apps, dashboards, and
              automations—was designed, built, and shipped for a real operating
              company before anyone else.{" "}
              <span className="text-ink">This website is one of them.</span>
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deployments.map((d, i) => (
            <Reveal key={d.title} delay={i * 60}>
              <DeploymentCard d={d} n={i + 1} />
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
        <Image
          src={d.shot}
          alt={`${d.title} — preview`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute left-4 top-3 font-mono text-[11px] text-white/60">
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
        {/* Accent rule that draws in on hover */}
        <span className="mt-4 block h-px w-8 bg-signal/50 transition-all duration-500 group-hover:w-16" />
      </div>
    </article>
  );
}
