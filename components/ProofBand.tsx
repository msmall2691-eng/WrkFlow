import ProofReel from "./ProofReel";

/*
  The proof reel, directly under the hero, as its own full-width band.

  It used to live in the hero's right column. #110 moved it here so the live
  conditions panel could have that slot back, which also gives the reel
  something it never had there: the full page width and a line of its own
  saying what the visitor is looking at. In the hero it was a picture beside
  a headline; here it is the page's first argument.

  The frame is capped rather than stretched. The screenshots are 1280px
  captures, and a browser frame blown across a 1440px viewport shows every
  soft pixel in them, so the band is wide and the screen inside it is not.
*/
export default function ProofBand() {
  return (
    <section
      aria-labelledby="proof-reel-heading"
      className="border-b border-line bg-[var(--color-base)] py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="proof-reel-heading"
          className="display-serif text-xl text-ink md:text-2xl"
        >
          Shipped and running
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Real screens from work that is live right now. Every caption and
          address below is read from the same source the case studies use.
        </p>

        <div className="mx-auto mt-8 max-w-3xl">
          <ProofReel />
        </div>
      </div>
    </section>
  );
}
