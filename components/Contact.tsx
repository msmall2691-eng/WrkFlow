"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import AuroraSwell from "./AuroraSwell";
import Magnetic from "./Magnetic";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

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
      form.reset();
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
      className="relative overflow-hidden border-t border-white/10 bg-[#08131d] py-16 md:py-24"
    >
      {/* Aurora Swell closer — same swell as the hero, bookending the page */}
      <AuroraSwell intensity={0.85} speed={0.85} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#08131d]/72"
      />
      {/* Top fade — eases in from the light section above */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-base)] to-transparent"
      />
      {/* Bottom fade — eases back out into the light footer below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--color-base)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-5">
            <Reveal delay={60}>
              <h2 className="display text-2xl text-white sm:text-3xl md:text-4xl [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
                Let&apos;s start with what you&apos;re trying to solve.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-base leading-relaxed text-white/75">
                No pitch deck required. A few sentences about what you want to
                build — or just the idea you&apos;re dreaming up. Every message
                gets read personally and answered within a day, a real reply, not
                a sales sequence.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-signal/30 bg-signal/[0.06] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-signal">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
                Currently available for new projects
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 space-y-2.5 font-mono text-xs uppercase tracking-widest text-white/55">
                <p>
                  Email ·{" "}
                  <a
                    href="mailto:contact@mlinx.studio"
                    className="text-white/85 transition-colors hover:text-[#e6b964]"
                  >
                    contact@mlinx.studio
                  </a>
                </p>
                <p>
                  Call or text ·{" "}
                  <a
                    href="tel:+12074329492"
                    className="text-white/85 transition-colors hover:text-[#e6b964]"
                  >
                    (207) 432-9492
                  </a>
                </p>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal delay={100}>
              {status === "success" ? (
                <SuccessPanel onReset={() => setStatus("idle")} />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 rounded-2xl border border-white/15 bg-white/[0.06] p-8 backdrop-blur-md md:p-10"
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
                      placeholder="The site you want, the plugin you need, the busywork eating your week…"
                      className="w-full resize-y rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-signal/70 focus:outline-none"
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

                  <Magnetic strength={0.3}>
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
                  </Magnetic>

                  <p className="text-xs leading-relaxed text-white/45">
                    By sending this, you agree we can use your details to reply.
                    We never sell your information. See our{" "}
                    <a
                      href="/privacy"
                      className="text-white/70 underline underline-offset-2 transition-colors hover:text-white"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              )}
            </Reveal>
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
      <h3 className="mt-5 font-display text-2xl text-white">Got it.</h3>
      <p className="mt-3 text-base leading-relaxed text-white/75">
        Every message is read personally, with a reply within a day.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 font-mono text-xs uppercase tracking-widest text-signal transition-opacity hover:opacity-80"
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
      className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-white/55"
    >
      {label}
      {optional && <span className="text-faint/60"> · optional</span>}
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
        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-signal/70 focus:outline-none"
      />
    </div>
  );
}
