"use client";

import { useEffect, useState } from "react";
import TurnstileWidget from "./TurnstileWidget";
import AuroraSwell from "./AuroraSwell";
import WhenNear from "./WhenNear";
import BookCall from "./BookCall";
import { trackLead } from "@/lib/track";
import { delay } from "./stage/reveal";
import { founderCta, homeBands, homeHero, resumeUrl } from "@/lib/content";
import {
  OFFER_EVENT,
  isOfferKey,
  prefillFor,
  takeStashedOffer,
  type OfferDetail,
  type OfferKey,
} from "@/lib/offer";

type Status = "idle" | "submitting" | "success" | "error";

/*
  **The form is one component with two shells, and the logic below is
  untouched.** The approved homepage design (Nov 25 2026) puts the start
  form over video in its own type and spacing; /services and /brightbase
  still render the panel shell this had before. Every behaviour is shared
  between them — the same state machine, the same five fields with the
  same names and ids, the same honeypot, the same offer hidden input, the
  same Turnstile widget, the same `fetch("/api/contact")`, the same
  challenge nonce bumped on a failed attempt, the same success panel.

  Two shells rather than one set of variant-driven class names because the
  two layouts share no structure at all: one is a twelve-column grid
  inside a washed section, the other is the design's two-column `.start`
  band over a clip. What may never be duplicated is the part that can
  silently break — the request and the states around it — and that is why
  it is above the branch rather than inside either arm.
*/
export default function Contact({
  variant = "panel",
}: {
  /** "stage" is the approved homepage; "panel" is every other page. */
  variant?: "panel" | "stage";
}) {
  const [status, setStatus] = useState<Status>("idle");
  /*
    Bumped on every failed submit so the Turnstile widget fetches a fresh
    token. The one already in the form has been spent by the attempt that
    just failed, and Cloudflare rejects a reused token, so without this a
    visitor who hits a transient 502 cannot send the form again without
    reloading the page.
  */
  const [challengeNonce, setChallengeNonce] = useState(0);
  const [error, setError] = useState<string | null>(null);
  /*
    Which offer sent them here, and the message the box opens with
    (site survey O-02). Two sources: a CTA click on this page, and
    ?offer= on the URL so a shared or bookmarked link works the same.
  */
  const [offer, setOffer] = useState<OfferKey | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const apply = ({ offer: key, text }: OfferDetail) => {
      setOffer(key);
      setMessage(prefillFor(key, text));
      setStatus("idle");
    };

    const param = new URLSearchParams(window.location.search).get("offer");
    if (isOfferKey(param)) apply({ offer: param, text: takeStashedOffer(param) });

    const onOffer = (e: Event) => apply((e as CustomEvent<OfferDetail>).detail);
    window.addEventListener(OFFER_EVENT, onOffer);
    return () => window.removeEventListener(OFFER_EVENT, onOffer);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? "Something went wrong.");
      }

      setStatus("success");
      // Recorded before the offer is cleared, so the event keeps the CTA
      // that produced the lead (lib/track.ts).
      trackLead("contact", offer ?? undefined);
      form.reset();
      setMessage("");
      setOffer(null);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      /*
        The submission consumed its Turnstile token whether or not the rest
        of the request worked, so the one left in the form is spent. Ask for
        a fresh one, or the retry this error message invites would fail on
        the challenge rather than on whatever actually went wrong.
      */
      setChallengeNonce((n) => n + 1);
    }
  }

  if (variant === "stage") {
    return (
      <section className="start" id="contact">
        {/*
          The design's second clip, and the only other motion on the page.
          `preload="none"`: a visitor who never reaches the bottom of the
          page pays nothing for it, and `StageMotion` is what starts it
          when they do. The poster sits on the wrapper as well as on the
          video, so the band reads correctly before it loads, if it never
          loads, and for anybody who asked for no motion.
        */}
        <div
          className="media"
          data-vid=""
          style={{ backgroundImage: "url('/ocean/moorings-band-poster.webp')" }}
        >
          {/*
            **No `autoPlay` here, and that is the difference between
            `preload="none"` meaning something and meaning nothing.**
            Chrome starts fetching an autoplaying video whatever the
            preload attribute says, so the mockup's markup put 1MB on the
            wire for every visitor who never scrolled this far — measured,
            and caught by the test that exists for it. `StageMotion`
            starts it on intersection instead, which is exactly what
            `MovingChapter` does and why that component has no `autoPlay`
            either. The hero keeps its own, because there the clip is on
            screen immediately and the attribute is what plays it for a
            visitor whose JavaScript never arrives.
          */}
          <video
            muted
            loop
            playsInline
            preload="none"
            poster="/ocean/moorings-band-poster.webp"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/ocean/moorings-band.mp4" type="video/mp4" />
          </video>
          <div className="scrim scrim-v" />
        </div>

        <div className="wrap">
          <div className="start-grid">
            <div>
              <p className="eyebrow" data-reveal="">
                {homeBands.start.eyebrow}
              </p>
              <h2 data-reveal="" style={delay(0.06)}>
                {founderCta.headline}
              </h2>
              <p className="lede" data-reveal="" style={delay(0.12)}>
                {founderCta.body}
              </p>
              <p className="hero-meta" data-reveal="" style={delay(0.16)}>
                {homeHero.location}
              </p>

              {/*
                The ways to reach her that were on this page before the
                redesign and still work. The mockup had no stand-in for
                them, and a phone number, an email, the questionnaire and
                the call CTA are not decoration: `BookCall` is the one
                tracked booking entry point on the homepage, and the
                questionnaire is the alternative for somebody who would
                rather be asked than face a blank box.
              */}
              <div className="reach" data-reveal="" style={delay(0.2)}>
                <a href="mailto:contact@mlinx.studio">contact@mlinx.studio</a>
                <a href="tel:+12074329492">(207) 432-9492</a>
                <a href="/intake">
                  Start the questionnaire{" "}
                  <span className="arw" aria-hidden="true">
                    →
                  </span>
                </a>
                <BookCall where="contact">
                  Book a free 15-min call{" "}
                  <span className="arw" aria-hidden="true">
                    →
                  </span>
                </BookCall>
                {/* Renders nothing until `resumeUrl` points at a real file,
                    so the link can never 404. */}
                {resumeUrl && (
                  <a href={resumeUrl}>
                    Download résumé (PDF){" "}
                    <span className="arw" aria-hidden="true">
                      ↓
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/*
              **The reveal gate is on this wrapper, never on the two things
              it swaps between.** A review bot caught it and a browser
              confirmed it: a successful submit replaced the form with a
              freshly mounted `data-reveal` element, and `StageMotion`
              observes only what exists when its effect runs, so nothing
              ever set `data-revealed` on it. Measured, the confirmation
              sat at `opacity: 0` translated 22px down, with "Got it." in
              the DOM and invisible. A visitor sent the form and watched it
              disappear, on the one interaction this page exists for.
              Pressing "Send another" would have remounted the form into
              the same hole.

              **The existing test passed through all of it**, because
              Playwright's visibility check ignores opacity. That is
              CLAUDE.md's rule almost word for word: prefer a test that
              asks whether the screen changed over one that asks whether
              the code ran. There is one below that reads the computed
              opacity now.

              A scroll reveal on either branch was wrong anyway. They
              appear in answer to a click, already on screen, and nothing
              scrolls to them.
            */}
            <div className="swap" data-reveal="" style={delay(0.1)}>
              {status === "success" ? (
                <div className="sent">
                  <div className="sent-tick" aria-hidden="true">
                    ✓
                  </div>
                  <h3>Got it.</h3>
                  <p>Every message is read personally, with a reply within a day.</p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="tlink"
                  >
                    Send another{" "}
                    <span className="arw" aria-hidden="true">
                      →
                    </span>
                  </button>
                </div>
              ) : (
                <form
                  className="form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Honeypot — hidden from humans, catches bots. */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="botField">Do not fill this field</label>
                    <input
                      id="botField"
                      name="botField"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Which CTA produced this enquiry — travels with the email
                      so an offer can be told from an idle click. */}
                  {offer && <input type="hidden" name="offer" value={offer} />}

                  <div className="field">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" required autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="company">Company · optional</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone · optional</label>
                    <input id="phone" name="phone" type="tel" autoComplete="tel" />
                  </div>
                  <div className="field">
                    <label htmlFor="message">
                      What you use now, and where it gets stuck
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What tools do you use? What are you entering by hand, tracking in spreadsheets, or wishing your website could do?"
                    />
                  </div>

                  {status === "error" && (
                    <p role="alert" className="form-alert">
                      {error}
                    </p>
                  )}

                  {/* Renders nothing until the Turnstile keys are set. It
                      writes its token into this form as a hidden input, which
                      the FormData payload above picks up unchanged. */}
                  <TurnstileWidget resetSignal={challengeNonce} />

                  <div className="form-foot">
                    <button
                      className="btn btn-solid"
                      type="submit"
                      disabled={status === "submitting"}
                    >
                      {status === "submitting" ? "Sending…" : founderCta.buttonLabel}
                      {status !== "submitting" && (
                        <span className="arw" aria-hidden="true">
                          →
                        </span>
                      )}
                    </button>
                    <span className="form-note">{homeBands.start.note}</span>
                  </div>

                  <p className="form-fine">
                    By sending this, you agree we can use your details to reply.
                    We never sell your information. See our{" "}
                    <a href="/privacy">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      /* Translucent rather than solid, so the dive is still behind the
         last section instead of the page going flat at the form. It keeps
         a local wash because this is the one block with inputs in it, and
         a form over moving water is where legibility stops being a matter
         of taste. */
      className="relative overflow-hidden border-t border-line bg-[var(--hero-bg)]/80 py-16 md:py-24"
    >
      {/*
        Aurora Swell closer. Mounted only once the visitor is near it: it is
        a WebGL shader behind a 72%-opaque overlay at the very bottom of the
        page, and compiling it during hydration delayed the hero's paint at
        the top. Unchanged once on screen.
      */}
      <WhenNear>
        <AuroraSwell intensity={0.85} speed={0.85} />
      </WhenNear>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[var(--hero-bg)]/72"
      />
      {/* Top fade — eases in from the section above */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-base)] to-transparent"
      />
      {/* Bottom fade — eases back out into the footer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--color-base)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-5">
                          <h2 className="display hero-heading text-2xl text-ink sm:text-3xl md:text-4xl">
                Let&apos;s start with what you&apos;re trying to solve.
              </h2>
                          <p className="mt-6 text-[1rem] leading-relaxed text-muted">
                Share what you use now, what you&apos;re tired of doing manually,
                and what you wish worked better. You don&apos;t need a technical
                plan to get started.
              </p>
                          <p className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-signal/30 bg-signal/[0.06] px-4 py-2 text-sm font-semibold text-signal">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
                Currently available for new projects
              </p>
                          <div className="mt-8 rounded-xl border border-line bg-surface/40 p-5">
                <p className="text-sm font-medium text-gold">
                  Rather be asked than face a blank box?
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  The questionnaire walks you through it in about ten minutes, saved as
                  you go, nothing binding.
                </p>
                {/* `py-1.5` makes a 14px line a 28px tap target. Without it
                    this renders 20px tall at 390px, under the 24px minimum
                    (WCAG 2.5.8), and it is one of the two primary ways
                    anybody starts a project. The homepage sweep missed it
                    for months because it ran against a hardcoded list of
                    sections that did not include this one. */}
                <a
                  href="/intake"
                  className="mt-3 inline-flex items-center gap-2 py-1.5 text-sm font-semibold text-signal transition-opacity hover:opacity-75"
                >
                  Start the questionnaire
                  <span aria-hidden="true">→</span>
                </a>
              </div>
                          <div className="mt-8 space-y-2.5 text-sm text-faint">
                <p>
                  Email ·{" "}
                  <a
                    href="mailto:contact@mlinx.studio"
                    className="text-ink/85 transition-colors hover:text-gold"
                  >
                    contact@mlinx.studio
                  </a>
                </p>
                <p>
                  Call or text ·{" "}
                  <a
                    href="tel:+12074329492"
                    className="text-ink/85 transition-colors hover:text-gold"
                  >
                    (207) 432-9492
                  </a>
                </p>
              </div>
                          {/* Résumé, for the other kind of visitor. Renders nothing
                  until `resumeUrl` points at a real file in /public, so the
                  link can never 404. */}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-signal transition-opacity hover:opacity-75"
                >
                  Download résumé (PDF)
                  <span aria-hidden="true">↓</span>
                </a>
              )}
              {/* Same 24px minimum, same reason. See the note above. */}
              <BookCall
                where="contact"
                className="mt-5 inline-flex items-center gap-2 py-1.5 text-sm font-semibold text-signal transition-opacity hover:opacity-75"
              >
                Book a free 15-min call
                <span aria-hidden="true">→</span>
              </BookCall>
          </div>

          <div className="md:col-span-7">
                          {status === "success" ? (
                <SuccessPanel onReset={() => setStatus("idle")} />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 rounded-2xl border border-[var(--panel-line)] bg-[var(--panel-bg)] p-8 backdrop-blur-md md:p-10"
                  noValidate
                >
                  {/* Honeypot — hidden from humans, catches bots. */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="botField">
                      Do not fill this field
                    </label>
                    <input
                      id="botField"
                      name="botField"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Which CTA produced this enquiry — travels with the email
                      so an offer can be told from an idle click (survey O-02). */}
                  {offer && <input type="hidden" name="offer" value={offer} />}

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                    />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      optional
                    />
                    <Field
                      label="Phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      optional
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="message" label="What are you trying to solve?" />
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What tools do you use? What are you entering by hand, tracking in spreadsheets, or wishing your website could do?"
                      className="w-full resize-y rounded-lg border border-[var(--panel-line)] bg-[var(--panel-input-bg)] px-4 py-3 text-sm text-[color:var(--panel-ink)] placeholder:text-[color:var(--panel-faint)] focus:border-signal/70 focus:outline-none"
                    />
                  </div>

                  {status === "error" && (
                    <p
                      role="alert"
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                      {error}
                    </p>
                  )}

                  {/* Renders nothing until the Turnstile keys are set. It
                      writes its token into this form as a hidden input, which
                      the FormData payload above picks up unchanged. */}
                  <TurnstileWidget resetSignal={challengeNonce} />

                  <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {status === "submitting" ? "Sending…" : "Send it over"}
                      {status !== "submitting" && (
                        <span aria-hidden="true">→</span>
                      )}
                  </button>

                  <p className="text-xs leading-relaxed text-[color:var(--panel-faint)]">
                    By sending this, you agree we can use your details to reply.
                    We never sell your information. See our{" "}
                    <a
                      href="/privacy"
                      className="text-[color:var(--panel-muted)] underline underline-offset-2 transition-colors hover:text-[color:var(--panel-ink)]"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-signal/30 bg-signal/[0.06] p-8 md:p-10">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-signal/40 text-signal">
        ✓
      </div>
      <h3 className="mt-5 display text-2xl text-ink">Got it.</h3>
      <p className="mt-3 text-[1rem] leading-relaxed text-muted">
        Every message is read personally, with a reply within a day.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-sm font-semibold text-signal transition-opacity hover:opacity-80"
      >
        Send another →
      </button>
    </div>
  );
}

function FieldLabel({ htmlFor, label, optional }: { htmlFor: string; label: string; optional?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-medium text-[color:var(--panel-muted)]"
    >
      {label}
      {/* Was text-faint/60 — 3.51:1 inside the form panel. Same class of
          miss as O-05: use the panel's own faint token, which clears AA. */}
      {optional && <span className="text-[color:var(--panel-faint)]"> · optional</span>}
    </label>
  );
}

function Field({
  label,
  name,
  type,
  required = false,
  optional = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={name} label={label} optional={optional} />
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-[var(--panel-line)] bg-[var(--panel-input-bg)] px-4 py-3 text-sm text-[color:var(--panel-ink)] placeholder:text-[color:var(--panel-faint)] focus:border-signal/70 focus:outline-none"
      />
    </div>
  );
}

