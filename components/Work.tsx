import { projects } from "@/lib/content";
import Reveal from "./Reveal";

export default function Work() {
  return (
    <section id="work" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal>
              <p className="marker mb-6">// Selected work</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
                Built and deployed for a real operating business.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={120}>
              <p className="text-sm leading-relaxed text-muted">
                A sense of range, not a résumé. These are real systems, shown in
                concept—the details stay with the businesses that own them.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 70}>
              <article className="group flex h-full flex-col bg-base p-8 transition-colors hover:bg-surface">
                <span className="font-mono text-[11px] uppercase tracking-widest text-signal">
                  {project.label}
                </span>
                <h3 className="mt-4 font-display text-xl font-medium text-ink">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {project.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
