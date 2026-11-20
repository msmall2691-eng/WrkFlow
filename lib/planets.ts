import { work, type WorkItem } from "./content";

/*
  The takes: the work, as the reel shows it.

  **Named `planets` for one more commit than it should be.** Meg asked for
  cards instead of globes, so `TakeReel` is what renders this now and the
  spheres are gone; the module keeps its name only until the rename is
  worth its own diff.

  Derived from `work`, never written here, for the reason every list on
  this site is derived: a second copy is a second thing to keep true.

  **The spec asks each planet to show "project title, year, and a 'View
  Case' link", and there is no year.** Three of nine work items carry a
  date; the rest were never recorded with one. Filling the gap would mean
  writing dates nobody confirmed onto the largest thing on the page,
  which is the first rule in CLAUDE.md with a timestamp on it. The planets
  carry the title, what the thing actually is, and the link. The year is
  dropped rather than guessed, and this note is here so the next reader
  knows it was a decision.

  **Each take needs somewhere to go**, so the list is filtered on having
  one: a case study, an internal page, or a live site. A take a visitor
  can open and then not open is a dead end dressed as a destination.

  **And each one needs a capture, which is a second filter rather than an
  optional field.** The reel is a browser window with the work inside it,
  so a take with no screenshot renders as a frame with a URL in its chrome
  and nothing behind it: the one thing this section exists to show,
  missing, on a card that still looks deliberate. The Keystone House was
  exactly that for one commit, which is why `shot` is required here and
  the filter is what enforces it rather than a `?`.

  **The filter is quiet, so the test is not.** Dropping a take for want of
  a capture is better than a blank window and still means the reel shrank
  without saying so, so `e2e/smoke.spec.ts` asserts that nothing with a
  destination was left out for that reason. That assertion is the one that
  failed on Keystone, and it is the one that stays able to fail.
*/

export type Planet = {
  id: string;
  title: string;
  /** What it is, in her own words from the work list. */
  tag: string;
  /** One line on what was built, from the work list. */
  blurb: string;
  /** A real capture of the real thing. Required: see below. */
  shot: string;
  /** Where "View case" goes. */
  href: string;
  /** True when the link leaves the site. */
  external: boolean;
};

export function destination(w: WorkItem): { href: string; external: boolean } | null {
  if (w.caseStudy) return { href: `/work/${w.caseStudy}`, external: false };
  const internal = (w as { internal?: string }).internal;
  if (internal) return { href: internal, external: false };
  if (w.url) return { href: w.url, external: true };
  return null;
}

export const planets: Planet[] = work
  .map((w): Planet | null => {
    const dest = destination(w);
    if (!dest || !w.shot) return null;
    return {
      id: w.title,
      title: w.title,
      tag: w.tag,
      blurb: w.blurb,
      shot: w.shot,
      href: dest.href,
      external: dest.external,
    };
  })
  .filter((p): p is Planet => p !== null)
  /* The spec's five. Taken from the front of the work list, which is
     already ordered with the strongest first. */
  .slice(0, 5);

/** The spec's scroll length, desktop and under 768px. */
export const SPLINE_VH = 600;
export const SPLINE_VH_MOBILE = 300;
