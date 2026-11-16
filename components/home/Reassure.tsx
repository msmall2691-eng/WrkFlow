import BookCall from "../BookCall";

/*
  The top objection, answered once, then the one call to action
  (founderos landing-page-copy, step 5). A small business owner's biggest
  hesitation is cost and being locked in, so this says plainly how pricing
  and ownership work. Every claim here is already true elsewhere on the
  site: fixed small-job prices, a written quote within a day, free scoping,
  code ownership.
*/
export default function Reassure() {
  return (
    <section aria-labelledby="reassure-heading" className="border-t border-[color:var(--cp-line)] py-14">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6">
        <div className="max-w-2xl">
          <h2 id="reassure-heading" className="m-0 text-[1.4rem] font-semibold text-[color:var(--cp-ink)]">
            Worried it costs a fortune or locks you in?
          </h2>
          <p className="m-0 mt-2 text-[15px] leading-relaxed text-[color:var(--cp-muted)]">
            Small jobs have fixed prices. Anything bigger gets a written quote within a day,
            free, before you commit. And you own what gets built.
          </p>
        </div>
        <BookCall
          where="reassure"
          className="cp-cta inline-flex min-h-12 items-center rounded-xl px-5 text-[15px] font-semibold text-white no-underline"
        >
          Book a free 15-min call
        </BookCall>
      </div>
    </section>
  );
}
