/*
  The one heading author.

  **A section heading in two lines, the second one stepped back**, which is
  the move Like a King Inc. repeats everywhere, at Meg's ask (Nov 20 2026):
  "Every / layer.", "Multi-cloud / by design.", "Questions, / answered.",
  "Secured / by default.". It is the cheapest thing on that site to borrow
  and the most of what makes it read as deliberate, because it turns a
  sentence into a composition without adding a single word.

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

  ---

  **Nov 24 2026: this is now every page's heading, and that is the whole
  point of the change.** It lived in `components/home/` and was imported by
  five homepage sections, while every other page hand-wrote its own `h1`
  inline. Measured, that produced three typefaces, three weights and five
  sizes across eight page titles: 74px Inter on the homepage, 48px Fraunces
  on `/services`, 36px Space Grotesk on `/catalog`, 64px on `/brightbase`.
  Three families on the one element that tells a visitor where they are.

  CLAUDE.md already forbids this everywhere else. `services[]` is the single
  definition of what the studio sells, `lib/content.ts` holds the real
  numbers, and a derived value has exactly one author and is never
  re-derived inline. The type scale is a derived value with eight authors,
  and the reason it got that way is that the one component that knew the
  answer was filed under `home/`. A component named for one page that every
  page needs is a trap for the next reader, so it is `components/` now.

  **`as` defaults to `h2` so the five homepage callers did not change.** A
  page title passes `as="h1"`; a section heading passes nothing. The element
  is the only difference, deliberately: a page title and a section heading
  are the same gesture at the same size here, and the hierarchy inside a
  page comes from the 36px `h2`s under it rather than from shrinking this.

  **`trail` is optional, because four of these titles are not ours to
  split.** A case study's title, a legal page's, the founder note's headline
  and the welcome book's all come from `lib/content.ts` or a route param, and
  a component cannot know where the line break belongs in a sentence it has
  never seen. Auto-splitting on a midpoint or a comma would be a guess that
  reads as a mistake exactly when the title is unusual. So a single string
  renders as one line, and the two-line composition stays something an author
  chooses. The static pages all pass both halves.

  **A single line gets a measure and a two-line one does not.** At this size
  an unconstrained sentence runs the full 6xl container and reads as a
  paragraph; `max-w-[24ch]` is in characters rather than rems so it holds at
  every step of the clamp. A hand-split heading needs no measure because the
  author already said where the lines end, and imposing one there would
  fight the split. Either can be overridden through `className`.

  **`face` exists so that unifying the scale did not quietly decide the
  typeface**, and that is a real distinction rather than a hedge.
  `app/services/page.tsx` carried a long comment arguing its `h1` must stay
  Fraunces, because every section heading under it is Fraunces and a Space
  Grotesk title would put two display faces on one page. That argument is
  still correct. The same comment also says the Fraunces question "should be
  made once for the whole site rather than page by page", and
  `app/layout.tsx` records that Fraunces was dropped once and put back
  because Meg asked for it kept. So it is her decision about her own brand,
  and converting six serif titles to Space Grotesk on the way past would
  have been making it for her, in a change she approved as a type *scale*
  fix.

  What this does retire is the third face, which was nobody's decision at
  all: the homepage hero measured **Inter**, because `font-display` and
  `font-serif` sat on its two child spans and the `h1` itself inherited the
  body face. So the site goes from three families by accident to two by
  choice, with one author for the size, weight, tracking and step-back. The
  remaining decision is now one prop in one place rather than a sweep.

  **It must not use the `.display` and `.display-serif` utility classes the
  old headings used.** Those are declared unlayered in `globals.css` (line
  595; `@layer base` closes at 405), and unlayered CSS beats anything in
  `@layer utilities` whatever its specificity, so `.display`'s
  `font-weight: 600` would silently win over `font-normal` and this would
  render bold at 72px: the exact shouting the treatment exists to avoid.
  Tailwind's `font-display` and `font-serif` come from the `@theme` block
  and sit in the same layer as the rest, so source order settles it. This is
  the border-colour cascade bug from the same stylesheet, one rule over.

  **Both colours carry a fallback, because `--cp-ink` does not exist
  everywhere this now renders.** It is declared under `.cp` (line 932) and
  re-declared for Daylight and for `.cp-night`, which is the whole point of
  the panel scoping. `app/not-found.tsx` has no `.cp` wrapper, so
  `var(--cp-ink)` there is an undefined custom property: the declaration is
  invalid at computed-value time and `color` falls back to **inherit**, which
  on that page is body text. A 72px heading quietly rendering in body grey,
  on the one page a visitor reaches by accident, and nothing in a build, a
  test or a Lighthouse run would say so. `var(--cp-ink, var(--color-ink))`
  resolves to the panel ink inside `.cp` and the site ink outside it, and
  both of those are theme-following tokens, so CLAUDE.md's rule is kept on
  either path rather than traded away for one.
*/
export default function StackedHeading({
  id,
  as = "h2",
  face = "display",
  lead,
  trail,
  className = "",
}: {
  id?: string;
  /** `h1` for a page title, `h2` for a section heading. */
  as?: "h1" | "h2";
  /**
   * `display` is Space Grotesk and the site default. `serif` is Fraunces,
   * for a page whose own section headings are Fraunces. Never the
   * `.display` / `.display-serif` classes: see the note above.
   */
  face?: "display" | "serif";
  /** The first line, at full strength. */
  lead: string;
  /** The second line, stepped back. Omit for a one-line heading. */
  trail?: string;
  className?: string;
}) {
  const Tag = as;
  const base = `m-0 ${
    face === "serif" ? "font-serif" : "font-display"
  } font-normal leading-[0.92] tracking-[-0.035em] text-[color:var(--cp-ink,var(--color-ink))] text-[clamp(2.5rem,6.6vw,6rem)]`;

  if (!trail) {
    return (
      <Tag id={id} className={`${base} max-w-[24ch] text-balance ${className}`}>
        {lead}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={`${base} ${className}`}>
      <span className="block text-balance">{lead}</span>{" "}
      <span className="block text-balance text-[color:var(--cp-faint,var(--color-faint))]">
        {trail}
      </span>
    </Tag>
  );
}
