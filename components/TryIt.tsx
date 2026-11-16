import Link from "next/link";
import QuoteCalc from "./QuoteCalc";

/*
  Try it — the one interactive block on the homepage.

  Everything else on the page asks the visitor to believe something. This
  hands them a working tool and lets them check. It is also the only motion
  on the page caused by the visitor rather than a timer: drag the slider, the
  price moves.

  QuoteCalc is the right pick because it already converts — `requestOffer`
  carries the quote the visitor just built into the contact form, and the
  message opens with "I built a quote on your calculator and I'd like to talk
  it through" (lib/offer.ts). That path existed and nothing on the homepage
  used it.

  Not an iframe: middleware.ts restricts `frame-src` to maineclean.co and
  the-remote-admin.com, so an embed of anything else is blocked by our own CSP.
*/
export default function TryIt() {
  return (
    <section id="try" className="border-t border-line py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
            This is the kind of thing that goes into a site.
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
            A live quote, worked out in the browser while the customer is still
            reading. Drag it around.
          </p>
        </div>
        <div className="mt-10">
          <QuoteCalc />
        </div>
        <p className="mt-8 text-sm text-muted">
          Seven more, free and no signup, on{" "}
          {/* Underlined, not just coloured: colour alone is the only thing
              distinguishing a link inside a paragraph here, which fails
              WCAG 1.4.1 and cost the homepage its accessibility score.
              `underline underline-offset-2` is what inline links already
              use in Contact, Questionnaire and ToolEmailCapture. */}
          <Link
            href="/tools"
            className="text-signal underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            the tools page
          </Link>
        </p>
      </div>
    </section>
  );
}
