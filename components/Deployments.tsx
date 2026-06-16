import Image from "next/image";
import { deployments, type Deployment } from "@/lib/content";
import Reveal from "./Reveal";

export default function Deployments() {
  return (
    <section
      id="live"
      className="relative border-t border-line py-28 md:py-36"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-3xl">
          <Reveal>
            <p className="marker mb-6">// Shipped &amp; live</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
              Deployed and in the wild.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              A few of the things we&apos;ve designed, built, and shipped—live on
              Vercel and Railway, owned by the people who run on them.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {deployments.map((d, i) => (
            <Reveal key={d.url} delay={i * 70}>
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
    <a
      href={d.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-base transition-colors hover:border-signal/50"
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
        <span className="ml-auto font-mono text-[11px] uppercase tracking-widest text-faint opacity-0 transition-opacity group-hover:text-signal group-hover:opacity-100">
          Visit ↗
        </span>
      </div>

      {/* Preview */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {d.shot ? (
          <Image
            src={d.shot}
            alt={`${d.title} — live preview`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-widest text-faint">
            Preview coming soon
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-medium text-ink transition-colors group-hover:text-signal">
            {d.title}
          </h3>
          <HostBadge host={d.host} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{d.blurb}</p>
        <div className="mt-4 flex flex-wrap gap-2 pt-1">
          {d.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-faint"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

function HostBadge({ host }: { host: Deployment["host"] }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted">
      {host === "Vercel" ? (
        <svg width="11" height="10" viewBox="0 0 24 22" aria-hidden="true">
          <path d="M12 0 L24 22 L0 22 Z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
        </svg>
      )}
      {host}
    </span>
  );
}
