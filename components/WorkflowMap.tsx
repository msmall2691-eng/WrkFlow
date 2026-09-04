import Reveal from "./Reveal";
import WorkflowDemo from "./WorkflowDemo";
import IntegrationMapper from "./IntegrationMapper";

/*
  WorkflowMap — a dedicated "here's what a workflow looks like" section.
  Small always-flowing node illustration on top says "this is the shape of
  it"; the interactive IntegrationMapper below lets a visitor pick their
  own tools and see what unlocks. Lives at the top of the M Linx page
  (moved off the homepage, which now hosts the free-tools kit instead).
*/
export default function WorkflowMap() {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden border-t border-line py-20 md:py-24"
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-3xl">
          <Reveal>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              Workflow
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              Your tools, wired into one workflow.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-[1rem] leading-relaxed text-muted">
              Pick the tools you use, see what could connect to what.
            </p>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <WorkflowDemo />
        </Reveal>

        <div className="mt-6">
          <Reveal delay={200}>
            <IntegrationMapper />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
