"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { foundingOffer, trustStats } from "@/lib/content";
import {
  questionnaireSteps,
  questionnaireFields,
  qualifiedTestimonial,
  shouldRedirect,
  type Answers,
  type QuestionField,
  type CardOption,
} from "@/lib/questionnaire";

/*
  Questionnaire — the two-phase intake behind intake.mlinx.studio.

  Renders entirely from lib/questionnaire.ts. The flow:

    intro → phase 1 "fit check" (4 card taps) → routing gate
      ├─ redirect  → M Linx suggestion, with a "continue anyway" escape hatch
      └─ qualified → "good news" promise screen
    → phase 2 "project details" (5 steps, contact LAST) → success roadmap

  Color roles are deliberate and never mixed: GOLD is action and progress
  (CTA, progress bar, selected answers, required markers); TEAL is proof and
  reassurance (trust stats, badges, milestone banner). Teal is a fixed value
  rather than the user-tunable --color-signal accent, because a proof color
  that visitors can re-theme isn't playing its role.

  Answers persist to localStorage per device (v2 key — the legacy 10-step
  form's v1 answers don't map onto this flow, so they're discarded rather
  than migrated into the wrong questions). Cards and chips are native radio /
  checkbox inputs visually styled as cards, so keyboard and screen-reader
  behavior comes from the platform, not from re-implemented div roles.
*/

const STORAGE_KEY = "mstudio:questionnaire:v2";
const LEGACY_KEYS = ["mstudio:questionnaire:v1"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TEAL = "#16a394";

/* Phase weighting: the four fit-check taps carry 0→40%, the five detail
   steps 40→100% — early steps feel fast because they are. */
const PHASE1_STEPS = questionnaireSteps.filter((s) => s.phase === 1).length;
const PHASE2_STEPS = questionnaireSteps.length - PHASE1_STEPS;

type View =
  | { screen: "intro" }
  | { screen: "step"; index: number }
  | { screen: "route"; variant: "redirect" | "qualified" }
  | { screen: "success" };

type Status = "idle" | "submitting" | "error";

function progressFor(view: View): number {
  switch (view.screen) {
    case "intro":
      return 0;
    case "step": {
      const step = questionnaireSteps[view.index];
      if (step.phase === 1) return (view.index / PHASE1_STEPS) * 40;
      const detailIndex = view.index - PHASE1_STEPS;
      return 40 + (detailIndex / PHASE2_STEPS) * 60;
    }
    case "route":
      return 40;
    case "success":
      return 100;
  }
}

export default function Questionnaire() {
  const [view, setView] = useState<View>({ screen: "intro" });
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  /* True once the visitor took the redirect's escape hatch — phase 2's Back
     from its first step should return them to the redirect screen, not the
     qualified one. */
  const [cameViaRedirect, setCameViaRedirect] = useState(false);

  const headingRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);
  const botField = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------- storage */
  useEffect(() => {
    try {
      for (const k of LEGACY_KEYS) window.localStorage.removeItem(k);
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          answers?: Answers;
          view?: View;
          cameViaRedirect?: boolean;
        };
        if (saved.answers && Object.keys(saved.answers).length > 0) {
          setAnswers(saved.answers);
          setCameViaRedirect(Boolean(saved.cameViaRedirect));
          if (
            saved.view &&
            (saved.view.screen !== "step" ||
              questionnaireSteps[saved.view.index])
          ) {
            setView(saved.view.screen === "success" ? { screen: "intro" } : saved.view);
          }
          setRestored(true);
        }
      }
    } catch {
      /* malformed or unavailable storage — start fresh */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current || view.screen === "success") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, view, cameViaRedirect }),
      );
    } catch {
      /* saving is a nicety, not a requirement */
    }
  }, [answers, view, cameViaRedirect]);

  useEffect(() => {
    if (view.screen === "success" || Object.keys(answers).length === 0) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [answers, view]);

  /* ---------------------------------------------------------- navigation */
  const goTo = useCallback((next: View) => {
    setView(next);
    setSubmitError(null);
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  const setField = useCallback((id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  function advanceFrom(index: number) {
    const lastPhase1 = PHASE1_STEPS - 1;
    if (index === lastPhase1) {
      goTo({
        screen: "route",
        variant: shouldRedirect(answers) ? "redirect" : "qualified",
      });
      return;
    }
    if (index === questionnaireSteps.length - 1) {
      submit();
      return;
    }
    const next = index + 1;
    /* Adaptive pre-select: goals imply features. Only seeds an untouched
       chip set — a visitor's own picks are never overwritten. */
    if (questionnaireSteps[next].id === "scope" && answers.features === undefined) {
      const goals = (answers.goals as string[]) ?? [];
      const seed: string[] = [];
      if (goals.includes("Let people book or schedule online")) seed.push("Online booking");
      if (goals.includes("Sell products or take payments")) seed.push("Payments / store");
      if (seed.length) setAnswers((prev) => ({ ...prev, features: seed }));
    }
    goTo({ screen: "step", index: next });
  }

  function backFrom(index: number) {
    if (index === 0) {
      goTo({ screen: "intro" });
      return;
    }
    if (index === PHASE1_STEPS) {
      goTo({
        screen: "route",
        variant: cameViaRedirect ? "redirect" : "qualified",
      });
      return;
    }
    goTo({ screen: "step", index: index - 1 });
  }

  /* -------------------------------------------------------------- submit */
  async function submit() {
    setStatus("submitting");
    setSubmitError(null);
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, botField: botField.current?.value ?? "" }),
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
      setStatus("idle");
      goTo({ screen: "success" });
    } catch (err) {
      setStatus("error");
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  /* --------------------------------------------------------------- gates */
  function continueDisabled(index: number): boolean {
    const step = questionnaireSteps[index];
    for (const f of step.fields) {
      if (!("required" in f) || !f.required) continue;
      const v = answers[f.id];
      if (f.kind === "cards" && !f.multi) {
        if (typeof v !== "string" || !v) return true;
      } else if (f.kind === "text") {
        const t = ((v as string) ?? "").trim();
        if (!t) return true;
        if (f.type === "email" && !EMAIL_RE.test(t)) return true;
      }
    }
    return false;
  }

  const progress = progressFor(view);
  const phaseLabel =
    view.screen === "step"
      ? questionnaireSteps[view.index].phase === 1
        ? "Quick fit check"
        : "Project details"
      : view.screen === "route"
        ? "Quick fit check"
        : view.screen === "success"
          ? "Done"
          : "";

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24">
      {/* Sticky progress */}
      <div className="sticky top-0 z-20 -mx-6 mb-10 bg-[var(--color-base)] px-6 pb-4 pt-5">
        <div className="h-1 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-300 ease-out motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            {phaseLabel || "Project intake"}
          </p>
          <p className="font-mono text-[10px] tabular-nums text-faint">
            {Math.round(progress)}%
          </p>
        </div>
      </div>

      {restored && view.screen !== "success" && (
        <p className="mb-8 rounded-lg border border-gold/25 bg-gold/[0.06] px-4 py-3 text-[15px] text-muted">
          Picked up where you left off — your answers save on this device as you go.
        </p>
      )}

      {view.screen === "intro" && (
        <Intro headingRef={headingRef} onStart={() => goTo({ screen: "step", index: 0 })} />
      )}

      {view.screen === "step" && (
        <StepScreen
          key={view.index}
          index={view.index}
          answers={answers}
          setField={setField}
          headingRef={headingRef}
          onBack={() => backFrom(view.index)}
          onContinue={() => advanceFrom(view.index)}
          disabled={continueDisabled(view.index)}
          submitting={status === "submitting"}
          submitError={submitError}
        />
      )}

      {view.screen === "route" && view.variant === "redirect" && (
        <RedirectScreen
          headingRef={headingRef}
          onBack={() => goTo({ screen: "step", index: PHASE1_STEPS - 1 })}
          onContinue={() => {
            setCameViaRedirect(true);
            goTo({ screen: "step", index: PHASE1_STEPS });
          }}
        />
      )}
      {view.screen === "route" && view.variant === "qualified" && (
        <QualifiedScreen
          headingRef={headingRef}
          onBack={() => goTo({ screen: "step", index: PHASE1_STEPS - 1 })}
          onContinue={() => goTo({ screen: "step", index: PHASE1_STEPS })}
        />
      )}

      {view.screen === "success" && <SuccessScreen name={(answers.contactName as string) ?? ""} />}

      {/* Honeypot — invisible to humans, irresistible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="botField">Do not fill this field</label>
        <input id="botField" ref={botField} type="text" tabIndex={-1} autoComplete="off" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ intro */

function Intro({
  headingRef,
  onStart,
}: {
  headingRef: React.RefObject<HTMLDivElement | null>;
  onStart: () => void;
}) {
  return (
    <section className="animate-[fadeUp_.35s_var(--ease-out-expo)_both]">
      <div ref={headingRef} tabIndex={-1} className="outline-none">
        <h2 className="display-serif text-3xl leading-[1.12] text-ink sm:text-4xl">
          Let&apos;s see if we&apos;re a fit — in about 60 seconds.
        </h2>
      </div>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
        Four quick taps tell us whether a custom build makes sense for you. If
        it does, a few more minutes gets you a real scope — pages, features,
        price range — within 24 hours. Nothing here is binding, and your
        answers save on this device as you go.
      </p>

      {/* Time expectations */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        {[
          { big: "~1 min", small: "fit check" },
          { big: "~5 min", small: "project details" },
          { big: "24 hrs", small: "to a real scope" },
        ].map((t) => (
          <div key={t.small} className="rounded-xl border border-line bg-[var(--panel-input-bg)] px-3 py-4 text-center">
            <p className="display-serif text-xl text-ink">{t.big}</p>
            <p className="mt-1 text-[12px] text-muted">{t.small}</p>
          </div>
        ))}
      </div>

      {/* Trust strip — proof lives in teal */}
      <div className="mt-8 rounded-xl border border-line px-5 py-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          {trustStats.map((s) => (
            <div key={s.label}>
              <p className="display-serif text-lg leading-none" style={{ color: TEAL }}>
                {s.value}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-faint">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-9">
        <ContinueButton onClick={onStart} label="Start the fit check" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ steps */

function StepScreen({
  index,
  answers,
  setField,
  headingRef,
  onBack,
  onContinue,
  disabled,
  submitting,
  submitError,
}: {
  index: number;
  answers: Answers;
  setField: (id: string, value: string | string[]) => void;
  headingRef: React.RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onContinue: () => void;
  disabled: boolean;
  submitting: boolean;
  submitError: string | null;
}) {
  const step = questionnaireSteps[index];
  const isLast = index === questionnaireSteps.length - 1;
  const hasRequired = step.fields.some((f) => "required" in f && f.required);

  return (
    <section className="animate-[fadeUp_.35s_var(--ease-out-expo)_both]">
      {step.milestone && (
        <p
          className="mb-6 rounded-lg px-4 py-3 text-[14px] font-medium"
          style={{ color: TEAL, backgroundColor: "rgba(22, 163, 148, 0.09)" }}
        >
          {step.milestone}
        </p>
      )}

      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
        {step.kicker}
        <span className="ml-2 normal-case tracking-normal text-faint">· {step.timeHint}</span>
      </p>
      <div ref={headingRef} tabIndex={-1} className="outline-none" aria-live="polite">
        <h2 className="display-serif text-2xl text-ink sm:text-3xl">{step.title}</h2>
      </div>
      {step.intro && (
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{step.intro}</p>
      )}

      <div className="mt-8 grid gap-7 sm:grid-cols-2">
        {step.fields.map((field) => (
          <Field key={field.id} field={field} value={answers[field.id]} onChange={setField} />
        ))}
      </div>

      {isLast && (
        <p className="mt-6 text-[12px] text-faint">
          <span className="text-gold">*</span> = required. Everything else on
          this form was optional — thanks for whatever you shared. We never
          sell your information; see the{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
            privacy policy
          </a>
          .
        </p>
      )}

      {submitError && (
        <p role="alert" className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {submitError}
        </p>
      )}

      <nav className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="font-mono text-xs uppercase tracking-widest text-faint transition-colors hover:text-ink"
        >
          ← Back
        </button>
        <ContinueButton
          onClick={onContinue}
          disabled={disabled || submitting}
          label={submitting ? "Sending…" : isLast ? "Send it to M Studio" : "Continue"}
        />
      </nav>
      {disabled && hasRequired && !isLast && (
        <p className="mt-3 text-right text-[12px] text-faint">Pick one to continue.</p>
      )}
    </section>
  );
}

function ContinueButton({
  onClick,
  disabled = false,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-[15px] font-semibold text-[#0b1722] transition-all hover:-translate-y-0.5 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {label}
      <span
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
      >
        →
      </span>
    </button>
  );
}

/* ----------------------------------------------------------------- fields */

const inputClass =
  "w-full rounded-lg border border-line bg-[var(--panel-input-bg)] px-4 py-3.5 text-base leading-relaxed text-ink placeholder:text-faint focus:border-gold/70 focus:outline-none";

function Field({
  field,
  value,
  onChange,
}: {
  field: QuestionField;
  value: string | string[] | undefined;
  onChange: (id: string, value: string | string[]) => void;
}) {
  const isHalf = "half" in field && field.half;
  const span = isHalf ? "sm:col-span-1" : "sm:col-span-2";
  const describedBy = field.hint ? `${field.id}-hint` : undefined;

  if (field.kind === "cards") {
    return (
      <div className={span}>
        {field.hint && (
          <p id={describedBy} className="mb-2.5 text-[13px] leading-relaxed text-muted">
            {field.hint}
          </p>
        )}
        <CardGroup field={field} value={value} onChange={onChange} />
      </div>
    );
  }

  if (field.kind === "chips") {
    return (
      <div className={span}>
        {field.hint && (
          <p id={describedBy} className="mb-2.5 text-[13px] leading-relaxed text-muted">
            {field.hint}
          </p>
        )}
        <ChipGroup field={field} value={(value as string[]) ?? []} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className={span}>
      <label htmlFor={field.id} className="mb-1.5 block text-[15px] font-medium leading-snug text-ink">
        {field.label}
        {"required" in field && field.required && (
          <span className="text-gold" aria-hidden="true"> *</span>
        )}
      </label>
      {field.hint && (
        <p id={describedBy} className="mb-2.5 text-[13px] leading-relaxed text-muted">
          {field.hint}
        </p>
      )}
      {field.kind === "text" ? (
        <input
          id={field.id}
          type={field.type ?? "text"}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          aria-describedby={describedBy}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={inputClass}
        />
      ) : (
        <textarea
          id={field.id}
          rows={4}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          aria-describedby={describedBy}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={`${inputClass} resize-y`}
        />
      )}
    </div>
  );
}

/*
  Option cards — native <input type="radio|checkbox"> styled as cards. The
  input is visually hidden but stays in the tab/arrow-key order, so keyboard
  and assistive behavior is the platform's own rather than a re-implemented
  div with ARIA bolted on. Space toggles natively; Enter is added because
  people expect it on card-shaped controls.
*/
function CardGroup({
  field,
  value,
  onChange,
}: {
  field: Extract<QuestionField, { kind: "cards" }>;
  value: string | string[] | undefined;
  onChange: (id: string, value: string | string[]) => void;
}) {
  const multi = Boolean(field.multi);
  const selectedList = multi ? ((value as string[]) ?? []) : [];

  function toggle(opt: string) {
    if (multi) {
      onChange(
        field.id,
        selectedList.includes(opt)
          ? selectedList.filter((v) => v !== opt)
          : [...selectedList, opt],
      );
    } else {
      onChange(field.id, opt);
    }
  }

  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="sr-only">{field.label}</legend>
      {field.options.map((opt) => {
        const checked = multi ? selectedList.includes(opt.value) : value === opt.value;
        return (
          <OptionCard
            key={opt.value}
            name={field.id}
            option={opt}
            checked={checked}
            multi={multi}
            onToggle={() => toggle(opt.value)}
          />
        );
      })}
    </fieldset>
  );
}

function OptionCard({
  name,
  option,
  checked,
  multi,
  onToggle,
}: {
  name: string;
  option: CardOption;
  checked: boolean;
  multi: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`group/card relative flex cursor-pointer items-center gap-3.5 rounded-xl border px-4 py-3.5 transition-all hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        checked
          ? "border-gold/60 bg-gold/[0.07]"
          : "border-line bg-[var(--panel-input-bg)] hover:border-gold/35"
      }`}
    >
      <input
        type={multi ? "checkbox" : "radio"}
        name={name}
        value={option.value}
        checked={checked}
        onChange={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="peer sr-only"
      />
      {/* Focus ring lives on the card, driven by the hidden input's focus. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl ring-gold/70 peer-focus-visible:ring-2"
      />

      {option.icon && (
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
            checked ? "bg-gold/15 text-gold" : "bg-signal/10 text-signal"
          }`}
        >
          <OptionIcon name={option.icon} />
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={`text-[15px] leading-snug ${checked ? "text-ink" : "text-ink/90"}`}>
            {option.value}
          </span>
          {option.badge && (
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
              style={{ color: TEAL, backgroundColor: "rgba(22, 163, 148, 0.12)" }}
            >
              {option.badge}
            </span>
          )}
        </span>
        {option.hint && (
          <span className="mt-0.5 block text-[13px] leading-snug text-faint">{option.hint}</span>
        )}
      </span>

      {/* Check mark — pops on select. */}
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${
          checked ? "check-pop border-gold bg-gold text-[#0b1722]" : "border-line text-transparent"
        }`}
      >
        ✓
      </span>
    </label>
  );
}

/* Chips — compact multi-select for features and tools. */
function ChipGroup({
  field,
  value,
  onChange,
}: {
  field: Extract<QuestionField, { kind: "chips" }>;
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
    <fieldset>
      <legend className="sr-only">{field.label}</legend>
      <div className="flex flex-wrap gap-2">
        {field.options.map((opt) => {
          const checked = value.includes(opt);
          return (
            <label
              key={opt}
              className={`relative inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-[14px] transition-all hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                checked
                  ? "border-gold/60 bg-gold/[0.08] text-ink"
                  : "border-line bg-[var(--panel-input-bg)] text-muted hover:border-gold/35"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    toggle(opt);
                  }
                }}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full ring-gold/70 peer-focus-visible:ring-2"
              />
              {checked && (
                <span aria-hidden="true" className="check-pop text-gold">
                  ✓
                </span>
              )}
              {opt}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ------------------------------------------------------------ route gates */

function RedirectScreen({
  headingRef,
  onBack,
  onContinue,
}: {
  headingRef: React.RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="animate-[fadeUp_.35s_var(--ease-out-expo)_both]">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
        Honest answer
      </p>
      <div ref={headingRef} tabIndex={-1} className="outline-none" aria-live="polite">
        <h2 className="display-serif text-2xl leading-[1.15] text-ink sm:text-3xl">
          A custom build might be overkill — here&apos;s the faster path.
        </h2>
      </div>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
        Based on your budget or timeline, a premade M&nbsp;Linx kit will get you
        live sooner and for less. They&apos;re built by the same studio, tuned
        for small businesses, and yours to keep — no subscription.
      </p>

      <a
        href="/marketplace#kit"
        className="mt-8 block rounded-2xl border border-line bg-[var(--panel-input-bg)] p-6 transition-all hover:-translate-y-0.5 hover:border-gold/40 motion-reduce:transition-none"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: TEAL }}>
          M Linx marketplace
        </p>
        <p className="mt-2 display-serif text-xl text-ink">
          Premade sites &amp; tools, ready this week →
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          Templates and small tools you can launch now, with the option to grow
          into a custom build later.
        </p>
      </a>

      <div className="mt-9 flex flex-col items-start gap-4">
        <button
          type="button"
          onClick={onContinue}
          className="font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-ink"
        >
          I still want to scope a custom build →
        </button>
        <button
          type="button"
          onClick={onBack}
          className="font-mono text-xs uppercase tracking-widest text-faint transition-colors hover:text-ink"
        >
          ← Back
        </button>
      </div>
    </section>
  );
}

function QualifiedScreen({
  headingRef,
  onBack,
  onContinue,
}: {
  headingRef: React.RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="animate-[fadeUp_.35s_var(--ease-out-expo)_both]">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: TEAL }}>
        Fit check passed
      </p>
      <div ref={headingRef} tabIndex={-1} className="outline-none" aria-live="polite">
        <h2 className="display-serif text-2xl leading-[1.15] text-ink sm:text-3xl">
          Good news — this looks like a real fit.
        </h2>
      </div>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
        Here&apos;s the deal: answer the next five steps properly — about five
        minutes — and within 24 hours you&apos;ll get a real scope back. Pages,
        features, a price range, and a timeline. Not a discovery call to find
        out; the actual plan.
      </p>

      {qualifiedTestimonial && (
        <figure
          className="mt-8 rounded-2xl border-l-2 bg-[var(--panel-input-bg)] p-6"
          style={{ borderLeftColor: TEAL }}
        >
          <blockquote className="text-[15px] leading-relaxed text-ink">
            &ldquo;{qualifiedTestimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-[11px]"
              style={{ color: TEAL, backgroundColor: "rgba(22, 163, 148, 0.12)" }}
            >
              {qualifiedTestimonial.initials}
            </span>
            <span className="text-[13px] text-muted">
              {qualifiedTestimonial.name} · {qualifiedTestimonial.business}
            </span>
          </figcaption>
        </figure>
      )}

      <nav className="mt-9 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="font-mono text-xs uppercase tracking-widest text-faint transition-colors hover:text-ink"
        >
          ← Back
        </button>
        <ContinueButton onClick={onContinue} label="Let's scope it" />
      </nav>
    </section>
  );
}

/* ---------------------------------------------------------------- success */

function SuccessScreen({ name }: { name: string }) {
  const first = name.trim().split(/\s+/)[0];
  const steps = [
    { title: "Answers received", detail: "Done — they're in Meg's inbox now.", done: true },
    {
      title: "Within 24 hours: your rough scope",
      detail: "Pages, features, a price range, and a timeline — written for your answers.",
      done: false,
    },
    {
      title: "Optional free 15-minute call",
      detail: "Only if you want to talk it through. No pitch, no pressure.",
      done: false,
    },
  ];

  return (
    <section className="animate-[fadeUp_.35s_var(--ease-out-expo)_both]">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: TEAL }}>
        All set
      </p>
      <h2 className="display-serif text-3xl text-ink">
        {first ? `Thanks, ${first}.` : "Thanks — that's everything."}
      </h2>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
        A copy is on its way to your inbox. Here&apos;s exactly what happens next:
      </p>

      <ol className="mt-8 space-y-0">
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex gap-4 pb-8 last:pb-0">
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="absolute left-[15px] top-8 h-full w-px bg-line" />
            )}
            <span
              aria-hidden="true"
              className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[12px] ${
                s.done ? "border-transparent text-[#0b1722]" : "border-line text-muted"
              }`}
              style={s.done ? { backgroundColor: TEAL } : undefined}
            >
              {s.done ? "✓" : i + 1}
            </span>
            <span className="pt-1">
              <span className="block text-[15px] font-medium text-ink">{s.title}</span>
              <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">{s.detail}</span>
            </span>
          </li>
        ))}
      </ol>

      {foundingOffer.spotsRemaining > 0 && (
        <div className="mt-10 rounded-2xl border border-gold/30 bg-gold/[0.06] p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
            {foundingOffer.spotsRemaining} of {foundingOffer.totalSpots} founding spots left
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink">
            Founding Starter sites are{" "}
            <span className="font-semibold text-gold">${foundingOffer.price.toLocaleString("en-US")}</span>{" "}
            <span className="text-faint line-through">${foundingOffer.fullPrice.toLocaleString("en-US")}</span> in
            exchange for a testimonial — ${foundingOffer.deposit} to start,
            ${foundingOffer.balance} at launch.
          </p>
        </div>
      )}

      <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest text-faint">
        <a href="https://mlinx.studio" className="text-ink/85 transition-colors hover:text-gold">
          mlinx.studio →
        </a>
        <a href="mailto:contact@mlinx.studio" className="text-ink/85 transition-colors hover:text-gold">
          contact@mlinx.studio
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ icons */

function OptionIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "wrench":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 0 0 5.6-6l-3 3-2.8-.7-.7-2.8 3.5-3.5z" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common}>
          <circle cx="9" cy="20" r="1.4" />
          <circle cx="17" cy="20" r="1.4" />
          <path d="M2.5 3.5h3l2.4 12h10.3l2.3-8.5H6.2" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
        </svg>
      );
    default:
      return null;
  }
}
