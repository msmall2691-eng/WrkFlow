/*
  Follow the Cable — the two branches, in one place.

  **Both the 3D scene and the no-WebGL fallback read this.** That is the
  point of the module: the spec requires the branch examples to stay
  reachable "as normal HTML if WebGL is unavailable or reduced motion is
  enabled", and the fastest way to break that promise is to write the
  labels into the canvas and the fallback separately, then change one.
  There is one list, and every surface renders it.

  **The steps are a demo and say so.** Each branch shows a tiny worked
  sequence, and `demo: true` is not decoration: CLAUDE.md's first rule is
  that nothing on this site invents proof, and a panel reading "enquiry →
  lead" beside a real client's name would read as that client's result.
  The names here are invented and the panels label themselves as examples.

  **The destinations are real pages in this repository**, checked rather
  than assumed:

  · "Bring work in" goes to The Remote Admin, a marketing site whose whole
    job is turning a visitor into an enquiry. That is the branch's own
    sentence, built and live.
  · "Keep work moving" goes to BrightBase, the operations app for cleaning
    companies, which is where a booking actually becomes a scheduled crew
    job. The spec offered BrightBase or the Maine Cleaning Co. case study;
    the crew schedule is BrightBase's, so this is the closer match.
*/

export type CableBranch = {
  id: "bring" | "keep";
  /** The tappable label at the split. */
  label: string;
  /** One line under the label. */
  blurb: string;
  /** The worked example, start to finish. Invented, and labelled as such. */
  steps: readonly string[];
  /** Where the panel's link goes. A real page in this repo. */
  href: string;
  /** What the link says. */
  cta: string;
  /** Signal colour for the branch, from the .cp tokens. */
  tint: string;
};

export const CABLE_BRANCHES: readonly CableBranch[] = [
  {
    id: "bring",
    label: "Bring work in",
    blurb: "A website that turns a visitor into a job you can quote.",
    steps: [
      "A visitor lands on the site and asks about a 2,400 sq ft turnover",
      "The form writes a lead, with the property details already on it",
      "It lands in the inbox as a job to quote, not an email to re-type",
    ],
    href: "/work/the-remote-admin",
    cta: "See a site built to do this",
    tint: "#2dd4bf",
  },
  {
    id: "keep",
    label: "Keep work moving",
    blurb: "A booking that becomes a scheduled crew job on its own.",
    steps: [
      "A booking is accepted for Thursday at 11",
      "The job is built with the address, the scope and the access notes",
      "A crew is assigned and it shows on their day, no one re-typing it",
    ],
    href: "/brightbase",
    cta: "See the app that runs this",
    tint: "#b9a2ff",
  },
] as const;

/** Stages the hero can be in. `travel` is the move into `split`. */
export type CableStage = "rest" | "travel" | "split" | "bring" | "keep";
