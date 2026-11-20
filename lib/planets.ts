import { work, type WorkItem } from "./content";

/*
  The five project planets.

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

  **Each planet needs somewhere to go**, so the list is filtered on
  having one: a case study, an internal page, or a live site. A planet a
  visitor can fly up to and then not open is a dead end dressed as a
  destination.
*/

export type Planet = {
  id: string;
  title: string;
  /** What it is, in her own words from the work list. */
  tag: string;
  /** A real capture, used as the overlay thumbnail. */
  shot?: string;
  /** Where "View case" goes. */
  href: string;
  /** True when the link leaves the site. */
  external: boolean;
};

function destination(w: WorkItem): { href: string; external: boolean } | null {
  if (w.caseStudy) return { href: `/work/${w.caseStudy}`, external: false };
  const internal = (w as { internal?: string }).internal;
  if (internal) return { href: internal, external: false };
  if (w.url) return { href: w.url, external: true };
  return null;
}

export const planets: Planet[] = work
  .map((w): Planet | null => {
    const dest = destination(w);
    if (!dest) return null;
    return {
      id: w.title,
      title: w.title,
      tag: w.tag,
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
