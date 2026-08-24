"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  questionnaireSteps,
  type Answers,
  type QuestionField,
  type QuestionStep,
} from "@/lib/questionnaire";

/*
  Questionnaire — the multi-step intake form behind intake.mlinx.studio.

  Renders entirely from lib/questionnaire.ts, so adding a question means
  editing that file and nothing here.

  Two behaviors worth calling out:

  - Answers are mirrored into localStorage on every keystroke. This form is
    a ten-minute sit-down and clients fill it out between other things; a
    closed tab or a dead phone battery shouldn't cost them the whole thing.
    Cleared on successful submit so a second client on a shared machine
    never inherits the first one's answers.
  - The review step is editable. "Change" jumps back to the step that owns
    the answer rather than making them click Back seven times, which is
    where long forms usually lose people.
*/

const STORAGE_KEY = "mstudio:questionnaire:v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "error";

export default function Questionnaire() {
  // Steps + a trailing review screen.
  const totalSteps = questionnaireSteps.length;
  const reviewIndex = totalSteps;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  // The step we resumed onto, if any — the restore notice is only relevant
  // there, not for the rest of the session.
  const [restoredAt, setRestoredAt] = useState<number | null>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);
  const botField = useRef<HTMLInputElement>(null);

  // Restore a part-finished questionnaire. Runs after mount so the server
  // and first client render agree.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { answers?: Answers; step?: number };
        if (saved.answers && Object.keys(saved.answers).length > 0) {
          const resumeAt = Math.min(saved.step ?? 0, reviewIndex);
          setAnswers(saved.answers);
          setStep(resumeAt);
          setRestoredAt(resumeAt);
        }
      }
    } catch {
      /* malformed or unavailable storage — start fresh */
    }
    hydrated.current = true;
  }, [reviewIndex]);

  // Persist after hydration, so we never clobber saved answers with the
  // empty initial state on first paint.
  useEffect(() => {
    if (!hydrated.current || done) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
    } catch {
      /* quota or private mode — saving is a nicety, not a requirement */
    }
  }, [answers, step, done]);

  // Warn before an accidental tab close mid-form.
  useEffect(() => {
    if (done || Object.keys(answers).length === 0) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [answers, done]);

  const setField = useCallback((id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const goTo = useCallback((next: number) => {
    setStep(next);
    setErrors({});
    // Move focus to the new step's heading rather than scrolling blind, so
    // screen readers announce where they landed.
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  function validateStep(i: number): boolean {
    const found: Record<string, string> = {};
    for (const field of questionnaireSteps[i].fields) {
      if (!("required" in field) || !field.required) continue;
      const value = (answers[field.id] as string | undefined)?.trim() ?? "";
      if (!value) {
        found[field.id] = "This one we need.";
      } else if ("type" in field && field.type === "email" && !EMAIL_RE.test(value)) {
        found[field.id] = "That email doesn't look right.";
      }
    }
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstId = Object.keys(found)[0];
      document.getElementById(firstId)?.focus();
      return false;
    }
    return true;
  }

  function next() {
    if (step < reviewIndex && !validateStep(step)) return;
    goTo(Math.min(step + 1, reviewIndex));
  }

  async function submit() {
    setStatus("submitting");
    setSubmitError(null);
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          botField: botField.current?.value ?? "",
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? "Something went wrong.");
      }
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setDone(true);
      setStatus("idle");
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    } catch (err) {
      setStatus("error");
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  const progress = done ? 100 : (step / reviewIndex) * 100;

  if (done) {
    return <ThankYou name={(answers.contactName as string) ?? ""} />;
  }

  const onReview = step === reviewIndex;
  const current: QuestionStep | undefined = onReview ? undefined : questionnaireSteps[step];

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24">
      {/* Progress */}
      <div className="sticky top-0 z-20 -mx-6 mb-10 bg-[var(--color-base)] px-6 pb-4 pt-5">
        <div className="h-px w-full bg-line">
          <div
            className="h-px bg-gold transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          {onReview ? "Review" : `Step ${step + 1} of ${totalSteps}`}
        </p>
      </div>

      {restoredAt !== null && restoredAt > 0 && step === restoredAt && (
        <p className="mb-8 rounded-lg border border-gold/25 bg-gold/[0.06] px-4 py-3 text-sm text-muted">
          Picked up where you left off. Your answers are saved on this device as
          you go.
        </p>
      )}

      {onReview ? (
        <ReviewStep
          answers={answers}
          onEdit={(i) => goTo(i)}
          headingRef={headingRef}
        />
      ) : (
        <section key={step} className="animate-[fadeUp_.35s_var(--ease-out-expo)_both]">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            {current!.index} — {current!.eyebrow}
          </p>
          <div
            ref={headingRef}
            tabIndex={-1}
            className="outline-none"
            aria-live="polite"
          >
            <h2 className="display-serif text-2xl text-ink sm:text-3xl">
              {current!.title}
            </h2>
          </div>
          {current!.intro && (
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{current!.intro}</p>
          )}

          <div className="mt-9 grid gap-7 sm:grid-cols-2">
            {current!.fields.map((field) => (
              <Field
                key={field.id}
                field={field}
                value={answers[field.id]}
                error={errors[field.id]}
                onChange={setField}
              />
            ))}
          </div>
        </section>
      )}

      {/* Honeypot — invisible to humans, irresistible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="botField">Do not fill this field</label>
        <input id="botField" ref={botField} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && submitError && (
        <p
          role="alert"
          className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {submitError}
        </p>
      )}

      <nav className="mt-11 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => goTo(Math.max(step - 1, 0))}
          disabled={step === 0}
          className="font-mono text-xs uppercase tracking-widest text-faint transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onReview ? submit : next}
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-[#0b1722] transition-all hover:-translate-y-0.5 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === "submitting"
            ? "Sending…"
            : onReview
              ? "Send it to M Studio"
              : step === totalSteps - 1
                ? "Review answers"
                : "Continue"}
          {status !== "submitting" && <span aria-hidden="true">→</span>}
        </button>
      </nav>

      {!onReview && (
        <p className="mt-6 text-[13px] leading-relaxed text-muted">
          Skip anything you&apos;re unsure about — none of it is required except
          an email address to reply to, and nothing here is binding.
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- fields */

/*
  Readability over styling flourish: this is a long form people read carefully,
  so inputs carry normal body text rather than the small UI text used elsewhere
  on the site.
*/
const inputClass =
  "w-full rounded-lg border border-line bg-[var(--panel-input-bg)] px-4 py-3.5 text-base leading-relaxed text-ink placeholder:text-faint focus:border-gold/70 focus:outline-none";

function Field({
  field,
  value,
  error,
  onChange,
}: {
  field: QuestionField;
  value: string | string[] | undefined;
  error?: string;
  onChange: (id: string, value: string | string[]) => void;
}) {
  const isHalf = "half" in field && field.half;
  const span = isHalf ? "sm:col-span-1" : "sm:col-span-2";
  const describedBy = field.hint ? `${field.id}-hint` : undefined;

  // A checkbox group's <legend> already names it for screen readers, and the
  // step heading asks the question on screen — a mono label above it would
  // just be the same words twice.
  const showLabel = field.kind !== "checkboxes";

  return (
    <div className={span}>
      {showLabel && (
        <label
          htmlFor={field.id}
          className="mb-1.5 block text-[15px] font-medium leading-snug text-ink"
        >
          {field.label}
          {"required" in field && field.required && (
            <span className="text-gold" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
      )}
      {field.hint && (
        <p id={describedBy} className="mb-2.5 text-[13px] leading-relaxed text-muted">
          {field.hint}
        </p>
      )}

      {field.kind === "text" && (
        <input
          id={field.id}
          type={field.type ?? "text"}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={`${inputClass} ${error ? "border-red-500/60" : ""}`}
        />
      )}

      {field.kind === "textarea" && (
        <textarea
          id={field.id}
          rows={4}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={`${inputClass} resize-y ${error ? "border-red-500/60" : ""}`}
        />
      )}

      {field.kind === "select" && (
        <select
          id={field.id}
          // Deliberately not defaulted to options[0]: a select that shows a
          // real answer before it's been touched puts words in the client's
          // mouth, and the untouched value was never recorded — so the brief
          // silently lost a question the client believed they'd answered.
          value={(value as string) ?? ""}
          aria-describedby={describedBy}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={inputClass}
        >
          <option value="" disabled className="bg-[var(--color-surface)]">
            Choose one…
          </option>
          {field.options.map((opt) => (
            <option key={opt} value={opt} className="bg-[var(--color-surface)]">
              {opt}
            </option>
          ))}
        </select>
      )}

      {field.kind === "checkboxes" && (
        <CheckboxGroup field={field} value={(value as string[]) ?? []} onChange={onChange} />
      )}

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function CheckboxGroup({
  field,
  value,
  onChange,
}: {
  field: Extract<QuestionField, { kind: "checkboxes" }>;
  value: string[];
  onChange: (id: string, value: string[]) => void;
}) {
  function toggle(opt: string) {
    onChange(
      field.id,
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt],
    );
  }

  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="sr-only">{field.label}</legend>
      {field.options.map((opt) => {
        const checked = value.includes(opt);
        return (
          <label
            key={opt}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-[15px] transition-colors ${
              checked
                ? "border-gold/60 bg-gold/[0.07] text-ink"
                : "border-line bg-[var(--panel-input-bg)] text-muted hover:border-gold/40"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(opt)}
              className="h-4 w-4 shrink-0 accent-[var(--color-gold)]"
            />
            {opt}
          </label>
        );
      })}
    </fieldset>
  );
}

/* ---------------------------------------------------------------- review */

function ReviewStep({
  answers,
  onEdit,
  headingRef,
}: {
  answers: Answers;
  onEdit: (step: number) => void;
  headingRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="animate-[fadeUp_.35s_var(--ease-out-expo)_both]">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
        Last look
      </p>
      <div ref={headingRef} tabIndex={-1} className="outline-none" aria-live="polite">
        <h2 className="display-serif text-2xl text-ink sm:text-3xl">
          Here&apos;s what you told us
        </h2>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Change anything that isn&apos;t right, then send it over. You&apos;ll get
        a copy in your inbox.
      </p>

      <div className="mt-9 space-y-8">
        {questionnaireSteps.map((step, i) => {
          const filled = step.fields.filter((f) => {
            const v = answers[f.id];
            return Array.isArray(v) ? v.length > 0 : Boolean((v as string)?.trim());
          });

          return (
            <div key={step.index} className="border-t border-line pt-5">
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                  {step.index} — {step.eyebrow}
                </p>
                <button
                  type="button"
                  onClick={() => onEdit(i)}
                  className="font-mono text-[10px] uppercase tracking-widest text-gold transition-opacity hover:opacity-75"
                >
                  Change
                </button>
              </div>

              {filled.length === 0 ? (
                <p className="text-[15px] italic text-faint">Skipped</p>
              ) : (
                <dl className="space-y-3.5">
                  {filled.map((f) => {
                    const v = answers[f.id];
                    return (
                      <div key={f.id}>
                        <dt className="text-[13px] text-muted">{f.label}</dt>
                        <dd className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
                          {Array.isArray(v) ? v.join(" · ") : v}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- thank you */

function ThankYou({ name }: { name: string }) {
  const first = name.trim().split(/\s+/)[0];
  return (
    <div className="mx-auto max-w-2xl px-6 pb-32 pt-8">
      <div className="rounded-2xl border border-gold/30 bg-gold/[0.06] p-8 md:p-11">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-lg text-gold">
          ✓
        </div>
        <h2 className="mt-6 display-serif text-3xl text-ink">
          {first ? `Thanks, ${first}.` : "Thanks — that's everything."}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Your answers are in. A copy is on its way to your inbox, and
          you&apos;ll hear back within a day — a real reply from a person who
          has read all of it, not an autoresponder.
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted">
          If anything comes to mind in the meantime, just reply to that email.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest text-faint">
          <a
            href="https://mlinx.studio"
            className="text-ink/85 transition-colors hover:text-gold"
          >
            mlinx.studio →
          </a>
          <a
            href="mailto:contact@mlinx.studio"
            className="text-ink/85 transition-colors hover:text-gold"
          >
            contact@mlinx.studio
          </a>
        </div>
      </div>
    </div>
  );
}
