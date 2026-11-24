import Image from "next/image";

/**
 * The frame itself, exported so `LivingFrame` wears the same one. A second
 * component drawing its own border and ground is how two things that should
 * look identical stop looking identical, which is the lesson the page titles
 * taught this repo a commit ago.
 */
export const FRAME_SHELL =
  "cp-night relative overflow-hidden rounded-xl border border-[var(--cp-hairline)] bg-[var(--color-base)]";

/*
  One cast still, framed the same way everywhere it appears.

  **This exists so that "ocean art everywhere" is one treatment rather than
  six**, which is the lesson from the page titles one change earlier: the
  way to end up with three typefaces and five sizes is to let each page
  draw its own version of the same thing. The frame, the aspect, the
  caption and the theme handling are decided here.

  **It is dark on purpose, in both themes.** Meg's stills are lit subjects
  on near-black, so the frame is a `.cp-night` island: on Harbor it melts
  into the page, and on Daylight it reads as a photograph on cream rather
  than as a grey smear where a picture should be.

  The ground is `--color-base` rather than `--cp-well`, which is the
  obvious choice and the wrong one. `--cp-well` is the token for a sunken
  panel and it *follows* the theme by design: `rgba(0,0,0,0.4)` on Harbor
  but `rgba(11,23,34,0.05)` on Daylight, which is a 5% wash over cream. In
  a `.cp-night` island that is a pale box behind a dark photograph, visible
  for as long as the image takes to arrive and permanently if it never
  does. `.cp-night` re-points `--color-base` to `#08070c` precisely so an
  island has a ground, and on Harbor `.cp` sets the same value, so one
  token is correct in both. This is CLAUDE.md's rule read properly rather
  than by reflex: the colour still comes from a token, it is just the token
  for the thing this actually is.

  **The caption is the analogy, not a claim.** `lib/ocean.ts` holds one
  sentence per creature about a reef, and the hard rule that nothing in it
  is measurable: no number, no outcome, no client. That is what lets this
  sit beside a price on /services without becoming the kind of invented
  proof CLAUDE.md's first rule forbids. A frame that ever renders a figure
  is a frame that has broken it.

  **The caption is what makes a picture a service's marker, and leaving it
  off is a real distinction rather than a style choice.** A captioned frame
  says "this creature stands for this service", which is a mapping
  `lib/ocean.ts` owns. An uncaptioned one is the world the site is set in
  and claims nothing. /services captions all four; /tools shows the surface
  and does not, because /tools is not one of the four and borrowing a
  service's creature as background would quietly make the mapping mean two
  things. So the props are the picture, with the caption optional, instead
  of a `CastMember` the signature would have forced every caller to invent.

  **`priority` is off by default and must stay a deliberate opt-in.** Four
  of these on /services plus the four screenshots they sit beside is eight
  large images on one page; eager-loading them would spend the whole
  connection before the first screen has painted. Only a frame genuinely
  above the fold passes it.
*/
export default function CastFrame({
  art,
  artAlt,
  creature,
  reef,
  priority = false,
  aspect = "aspect-[16/9]",
  sizes = "(min-width: 1024px) 460px, 100vw",
  className = "",
}: {
  /** The still to show. */
  art: string;
  /** What it shows, for anyone who cannot see it. */
  artAlt: string;
  /** With `reef`, captions the frame as a service's marker. */
  creature?: string;
  /** The analogy line. Never a number: see above. */
  reef?: string;
  /** Only for a frame above the fold. */
  priority?: boolean;
  /** Tailwind aspect class, so a banner can be wider than a panel. */
  aspect?: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={`m-0 ${className}`}>
      {/*
        **`cp-night` is on the picture and deliberately not on the figure.**
        Wrapping the whole figure was the first version and it failed the
        measurement: the caption then inherited the island's *dark* tokens
        while sitting on the cream page, so on Daylight the analogy line
        came out at **2.21:1** and the creature label at 3.01:1, against
        the 4.5:1 those sizes need. Both looked deliberate on screen, pale
        grey italic on cream, and both were the #115 / #118 failure a third
        time: a colour re-pointed per theme and then read against the wrong
        ground. The island is for the photograph, which is dark in both
        themes; the caption belongs to the page, and follows it.
      */}
      <div className={`${FRAME_SHELL} ${aspect}`}>
        <Image
          src={art}
          alt={artAlt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
        />
      </div>
      {creature && reef ? (
        <figcaption className="mt-3 flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--cp-faint,var(--color-faint))]">
            {creature}
          </span>
          <span className="text-[13.5px] italic leading-relaxed text-[color:var(--cp-muted,var(--color-muted))]">
            {reef}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
