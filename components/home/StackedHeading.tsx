/*
  A section heading in two lines, the second one stepped back.

  **This is the one move Like a King Inc. repeats everywhere**, at Meg's ask
  (Nov 20 2026): "Every / layer.", "Multi-cloud / by design.", "Questions, /
  answered.", "Secured / by default.". It is the cheapest thing on that site
  to borrow and the most of what makes it read as deliberate, because it
  turns a sentence into a composition without adding a single word.

  Three decisions worth keeping written down:

  **Large and light, not large and bold.** The reference runs these at 128px
  at weight 400 with the tracking pulled in. A heading gets its weight from
  its size here; `font-semibold` at this scale reads as shouting, which is
  the opposite of the effect. The site's existing h2s were 28px semibold, so
  this is a real jump, and the jump is the point.

  **The step-back is a colour, never an opacity.** `--cp-faint` is a token
  that follows the theme; `opacity-50` is a hole punched in whatever happens
  to be behind it, which over the aurora goes muddy rather than quiet. It is
  also the rule this repo keeps relearning, in #115 and #118 and again in the
  border cascade: a colour that must follow the theme is a token.

  **The space between the lines is real.** Two block spans concatenate in
  `textContent` with nothing between them, so `Everything,` + `with prices.`
  reads to a screen reader, and to anything scraping the page, as
  "Everything,with prices." The explicit `{" "}` is invisible on screen
  (whitespace between block elements collapses) and keeps the sentence whole
  everywhere else.
*/
export default function StackedHeading({
  id,
  lead,
  trail,
  className = "",
}: {
  id?: string;
  /** The first line, at full strength. */
  lead: string;
  /** The second line, stepped back. */
  trail: string;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={`m-0 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-[color:var(--cp-ink)] ${className}`}
    >
      <span className="block">{lead}</span>{" "}
      <span className="block text-[color:var(--cp-faint)]">{trail}</span>
    </h2>
  );
}
