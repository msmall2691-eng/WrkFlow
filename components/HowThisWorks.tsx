import WorkflowDiagram from "./WorkflowDiagram";

/*
  "How this site works" — roadmap task 2.1f.

  The hero caption claims this page is reading live Maine weather and
  daylight right now, and that the same pattern can put a client's own data
  on their site. That is a claim, and until this section existed there was
  nowhere to go and check it. This is the check: the actual chain, named,
  with the real station and the real endpoint.

  Deliberately only four boxes and three sentences. It is a footnote to the
  hero, not a case study; the case studies are the case studies.

  What is NOT claimed here: tide. The feed carries it and it drives the
  TideLevel graphic on /about, but nothing in the hero reads it, so it would
  be a fifth box that does not do what the diagram says it does.

  The diagram is `still`: no travelling pulse. CLAUDE.md allows two looping
  animations on the site and both are already spent, on the proof reel and
  the live hero sky. It renders WorkflowDiagram rather than WorkflowDemo so
  the homepage ships no JavaScript for a picture that does nothing.
*/

/* The real chain. KPWM is the Portland Jetport station app/api/maine polls;
   the sun times are computed in lib/daylight for the same coordinates. */
const CHAIN = [
  { icon: "🌤️", label: "NWS KPWM" },
  { icon: "☀️", label: "Sun times" },
  { icon: "⚙️", label: "/api/maine" },
  { icon: "🎨", label: "Page theme" },
];

export default function HowThisWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="border-t border-line py-14 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="how-it-works-heading"
          className="display-serif text-2xl text-ink sm:text-3xl md:text-4xl"
        >
          How this site works
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-[1rem]">
          The color of this page is not a picture of the weather. Current
          conditions come from the National Weather Service station at the
          Portland Jetport, today&rsquo;s sunrise and sunset are computed for
          the same spot, and both arrive through one cached endpoint that the
          page reads to set its own light.
        </p>

        {/* WorkflowDiagram, not WorkflowDemo: the same markup without the
            client boundary, since nothing here animates or responds. The
            wrapper carries the card styling WorkflowDemo would have added. */}
        <div className="corner-accents mt-8 max-w-3xl rounded-2xl border border-line bg-surface/60 p-6 md:p-8">
          <WorkflowDiagram stages={CHAIN} live="still" />
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted md:text-[1rem]">
          The same pattern puts your bookings, stock levels or job statuses on
          your site in real time. It is three pieces every time: a source you
          already have, one endpoint that caches it so you are not hammering
          anyone, and a page that reads it.
        </p>
      </div>
    </section>
  );
}
