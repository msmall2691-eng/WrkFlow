import Image from "next/image";
import { deployments, type Deployment } from "@/lib/content";
import Reveal from "./Reveal";

export default function Deployments() {
  return (
    <section id="live" className="relative border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-3xl">
          <Reveal>
            <p className="marker mb-6">// Selected work</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
              We built it for ourselves first.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg leading-relaxed text-muted">
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
              <DeploymentCard d={d} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeploymentCard({ d }: { d: Deployment }) {
  return (
    <article className="elevate group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-elevated transition-colors hover:border-signal/50">
      {/* Browser chrome (decorative — no URL, no link) */}
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
      </div>

      {/* Preview */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={d.shot}
          alt={`${d.title} — preview`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      {/* Caption */}
      <div className="flex flex-1 flex-col border-t border-line p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-signal">
          {d.kind}
        </p>
        <h3 className="mt-2 font-display text-lg font-medium text-ink">{d.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{d.blurb}</p>
      </div>
    </article>
  );
}
