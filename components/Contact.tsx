"use client";

import { useEffect, useState } from "react";
import AuroraSwell from "./AuroraSwell";
import BookCall from "./BookCall";
import { trackLead } from "@/lib/track";
import { resumeUrl } from "@/lib/content";
import {
  OFFER_EVENT,
  isOfferKey,
  prefillFor,
  takeStashedOffer,
  type OfferDetail,
  type OfferKey,
} from "@/lib/offer";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
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
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-line bg-[var(--hero-bg)] py-16 md:py-24"
    >
      {/* Aurora Swell closer — same swell as the hero, bookending the page */}
      <AuroraSwell intensity={0.85} speed={0.85} />
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
                  The questionnaire walks you through it — ten minutes, saved as
                  you go, nothing binding.
                </p>
                <a
                  href="/intake"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-signal transition-opacity hover:opacity-75"
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
              <BookCall
                where="contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-signal transition-opacity hover:opacity-75"
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

