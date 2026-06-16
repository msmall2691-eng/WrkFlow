import Image from "next/image";
import { deployments, type Deployment } from "@/lib/content";
import Reveal from "./Reveal";

export default function Deployments() {
  // Duplicate the set so the marquee loops seamlessly at -50%.
  const strip = [...deployments, ...deployments];

  return (
    <section id="live" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-3xl">
          <Reveal>
            <p className="marker mb-6">// Shipped &amp; live</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
              We built it for ourselves first.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              No theory. Every one of these was designed, built, and shipped for
              a real operating company—ours—before anyone else. Real systems,
              live and running.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed sliding strip */}
      <div className="group/marquee relative overflow-hidden">
        <div className="flex w-max gap-6 px-6 animate-[marquee_46s_linear_infinite] group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none">
          {strip.map((d, i) => (
            <DeploymentCard key={`${d.url}-${i}`} d={d} />
          ))}
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-base to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-base to-transparent sm:w-28" />
      </div>
    </section>
  );
}

function DeploymentCard({ d }: { d: Deployment }) {
  return (
    <a
      href={d.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${d.title} — open live site`}
      className="group/card w-[300px] shrink-0 overflow-hidden rounded-xl border border-line bg-base transition-colors hover:border-signal/50 sm:w-[440px]"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </span>
        <span className="ml-2 truncate font-mono text-[11px] text-faint">
          {d.domain}
        </span>
        <span className="ml-auto font-mono text-[11px] uppercase tracking-widest text-faint opacity-0 transition-opacity group-hover/card:text-signal group-hover/card:opacity-100">
          ↗
        </span>
      </div>

      {/* Preview */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={d.shot}
          alt={`${d.title} — live preview`}
          fill
          sizes="(min-width: 640px) 440px, 300px"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
        />
      </div>
    </a>
  );
}
