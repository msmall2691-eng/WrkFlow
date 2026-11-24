/*
  A chapter: one picture, full width, with real emptiness around it.

  **This is what replaced the scroll-scrubbed ocean, at Meg's call.** The
  page used to carry one video fixed behind everything, and the argument
  against it was arithmetic rather than taste: it downloaded 2.8MB and
  then suppressed what it bought twice over, once by fading the water to
  22% through the middle of the page and again with a 42% wash over every
  section below the hero. It could also only ever show **one** clip, out
  of the twenty-four Meg has, and phones and `prefers-reduced-motion`
  were excluded from it entirely — so the characters she cares about
  reached a phone visitor as a 37KB poster and nothing else.

  Every contrast failure measured on this page was text sitting on moving
  water. Three separate rounds of scrim tuning are recorded in the history
  of `app/page.tsx` for one violet link. A chapter puts the art where
  there is no text and the text where there is no art, which retires that
  whole class rather than tuning it a fourth time.

  **The emptiness is the mechanism, not the leftovers.** Measured on
  likeakinginc.com at 1440x900, the gap between two of their sections is
  several hundred pixels of nothing, and that is why a lit subject lands
  when one arrives. A picture with copy packed against it is a decorated
  section; a picture with a screen of black around it is a chapter. So
  the padding here is deliberately larger than anything else on the page
  and is not a knob to tighten later.

  **It says nothing.** No heading, no caption, no link, no count. It is
  `aria-hidden` and carries an empty `alt`, because a visitor using a
  screen reader should not be read a description of wallpaper, and
  because the first rule in CLAUDE.md is that nothing on this site claims
  anything it cannot back. A picture that announced itself would be
  making a claim.
*/
export default function Chapter({
  id,
  art,
  className = "",
}: {
  /** So a test can name this chapter rather than guessing at a selector. */
  id: string;
  /** A still whose own border is already near the page colour. See
      globals.css on why these need no mask: the best of them measure
      luma 8 at the edge against a `#08070c` page. */
  art: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      aria-hidden="true"
      className={`relative w-full py-[18vh] md:py-[26vh] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={art}
        alt=""
        loading="lazy"
        decoding="async"
        className="block h-[42vh] w-full object-cover md:h-[62vh]"
      />
    </div>
  );
}
