"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  questionnaireSteps,
  type Answers,
  type QuestionField,
  type CardOption,
} from "@/lib/questionnaire";
import { trackLead, trackQuestionnaire } from "@/lib/track";

/*
  Questionnaire — the intake behind intake.mlinx.studio.

  Renders entirely from lib/questionnaire.ts: one linear flow of Meg's own
  questions (restored from her original prototype), an optional AI fast-fill
  on the first step, and an AI concept-preview screen before the final step.
  No qualification gate — every lead reaches the inbox.

  GOLD is action and progress; TEAL is proof and reassurance, as a fixed
  value rather than the user-tunable accent. Answers persist per device;
  cards and chips are native inputs styled as cards, so keyboard and
  screen-reader behavior comes from the platform.
*/

/* v4: Meg's original questions restored, gate removed — earlier drafts
   index into step lists that no longer exist. */
const STORAGE_KEY = "mstudio:questionnaire:v4";
const LEGACY_KEYS = [
  "mstudio:questionnaire:v1",
  "mstudio:questionnaire:v2",
  "mstudio:questionnaire:v3",
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TEAL = "#16a394";

const STEP_COUNT = questionnaireSteps.length;

type View =
  | { screen: "intro" }
  | { screen: "step"; index: number }
  | { screen: "preview" }
  | { screen: "success" };

type Status = "idle" | "submitting" | "error";

function progressFor(view: View): number {
  switch (view.screen) {
    case "intro":
      return 0;
    case "step":
      return (view.index / STEP_COUNT) * 94;
    case "preview":
      // Sits between the practical step and the final one.
      return ((STEP_COUNT - 1) / STEP_COUNT) * 94;
    case "success":
      return 100;
  }
}

export default function Questionnaire({
  previewEnabled = false,
}: {
  /* True when the server has an ANTHROPIC_API_KEY — gates the AI concept
     preview step. The page decides; the client never probes for the key. */
  previewEnabled?: boolean;
}) {
  const [view, setView] = useState<View>({ screen: "intro" });
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<Status>("idle");
  // Generated concepts, held outside the preview screen so they survive
  // navigating on to contact and ride along with the submission.
  const [concepts, setConcepts] = useState<Concept[]>([]);
  /*
    Concept generation is kicked off one step EARLY — the moment the pain
    step appears — so it runs while the visitor is still typing. By the time
    they reach the first-look screen the concepts are usually already there,
    which is the difference between "instant" and "watch a spinner". Lifted
    to the parent so an in-flight generation also survives skipping ahead:
    whatever finishes still rides along with the submission.
  */
  const [genState, setGenState] = useState<PreviewState | null>(null);
  const genStartedRef = useRef(false);

  const startGeneration = useCallback(
    async (snapshot: Answers) => {
      setGenState({ phase: "generating" });
      try {
        const res = await fetch("/api/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: snapshot, botField: botField.current?.value ?? "" }),
        });
        const payload = await res.json().catch(() => null);
        if (!res.ok || !payload?.ok || !payload.concepts?.length) {
          throw new Error(payload?.error ?? "Couldn't draft concepts this time.");
        }
        setGenState({ phase: "ready", concepts: payload.concepts });
        setConcepts(payload.concepts);
      } catch (err) {
        setGenState({
          phase: "error",
          message: err instanceof Error ? err.message : "Couldn't draft concepts this time.",
        });
      }
    },
    [],
  );

  // Prefetch trigger: entering the practical step (or landing directly on the
  // preview screen from a resumed session) starts generation exactly once.
  useEffect(() => {
    if (!previewEnabled || genStartedRef.current) return;
    const onPractical =
      view.screen === "step" && questionnaireSteps[view.index]?.id === "practical";
    const onPreview = view.screen === "preview";
    if (onPractical || onPreview) {
      genStartedRef.current = true;
      startGeneration(answers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, previewEnabled]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  const headingRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);
  const botField = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------- storage */
  useEffect(() => {
    try {
      for (const k of LEGACY_KEYS) window.localStorage.removeItem(k);
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { answers?: Answers; view?: View };
        if (saved.answers && Object.keys(saved.answers).length > 0) {
          setAnswers(saved.answers);
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
        JSON.stringify({ answers, view }),
      );
    } catch {
      /* saving is a nicety, not a requirement */
    }
  }, [answers, view]);

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

  /*
    Fast-fill merge: drafted answers land only in fields the visitor hasn't
    touched. Their own words always win over the model's reading of them.
  */
  const mergeDraft = useCallback((draft: Record<string, string | string[]>) => {
    setAnswers((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(draft)) {
        const existing = prev[k];
        const empty =
          existing === undefined ||
          (typeof existing === "string" && existing.trim() === "") ||
          (Array.isArray(existing) && existing.length === 0);
        if (empty) next[k] = v;
      }
      return next;
    });
  }, []);

  const setField = useCallback((id: string, value: string | string[]) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      /*
        Adaptive pre-select: goals imply features, and both now live on the
        same step — so the inference runs when goals change, not on step
        entry (where goals wouldn't exist yet). The seed keeps tracking the
        goals for as long as the feature chips hold exactly what seeding put
        there; the moment the visitor's own taps diverge from that, their
        picks win and seeding stops for good.
      */
      if (id === "goals") {
        const implied = (goals: string[]) => {
          const out: string[] = [];
          if (goals.includes("Let people book or schedule online"))
            out.push("Online booking / scheduling");
          if (goals.includes("Sell products online")) out.push("Online payments / store");
          return out;
        };
        const prevSeed = implied((prev.goals as string[]) ?? []);
        const current = (prev.features as string[]) ?? [];
        const untouched =
          prev.features === undefined ||
          (current.length === prevSeed.length && prevSeed.every((f) => current.includes(f)));
        if (untouched) {
          const seed = implied(value as string[]);
          if (seed.length) next.features = seed;
          else if (prev.features !== undefined) next.features = [];
        }
      }
      return next;
    });
  }, []);

  function advanceFrom(index: number) {
    if (index === questionnaireSteps.length - 1) {
      submit();
      return;
    }
    // The AI concept preview slots between the practical step and the final
    // one — only when the server can actually generate.
    if (previewEnabled && questionnaireSteps[index].id === "practical") {
      goTo({ screen: "preview" });
      return;
    }
    goTo({ screen: "step", index: index + 1 });
  }

  function backFrom(index: number) {
    if (index === 0) {
      goTo({ screen: "intro" });
      return;
    }
    if (previewEnabled && questionnaireSteps[index - 1]?.id === "practical") {
      goTo({ screen: "preview" });
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
        body: JSON.stringify({ answers, concepts, botField: botField.current?.value ?? "" }),
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
      trackQuestionnaire("completed");
      trackLead("questionnaire");
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
    view.screen === "success" ? "Done" : "Project questionnaire";

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24">
      {/* Sticky progress */}
      <div className="sticky top-0 z-20 -mx-6 mb-10 bg-[var(--color-base)] px-6 pb-4 pt-5">
        <div className="h-1 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full w-full origin-left bg-gold transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <p className="text-xs text-faint">
            <span className="text-ink">M Studio</span>
            {phaseLabel ? ` · ${phaseLabel}` : " · Project intake"}
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
        <Intro
          headingRef={headingRef}
          aiEnabled={previewEnabled}
          onStart={() => {
            trackQuestionnaire("started");
            goTo({ screen: "step", index: 0 });
          }}
        />
      )}

      {view.screen === "step" && (
        <StepScreen
          key={view.index}
          index={view.index}
          answers={answers}
          setField={setField}
          aiEnabled={previewEnabled}
          onDraft={mergeDraft}
          botField={botField}
          headingRef={headingRef}
          onBack={() => backFrom(view.index)}
          onContinue={() => advanceFrom(view.index)}
          disabled={continueDisabled(view.index)}
          submitting={status === "submitting"}
          submitError={submitError}
        />
      )}

      {view.screen === "preview" && (
        <PreviewScreen
          genState={genState ?? { phase: "generating" }}
          onRetry={() => startGeneration(answers)}
          bizName={(answers.bizName as string) ?? ""}
          choice={(answers.previewChoice as string) ?? ""}
          onChoose={(label) => setField("previewChoice", label)}
          headingRef={headingRef}
          onBack={() =>
            goTo({
              screen: "step",
              index: questionnaireSteps.findIndex((st) => st.id === "practical"),
            })
          }
          onContinue={() =>
            goTo({
              screen: "step",
              index: questionnaireSteps.findIndex((st) => st.id === "practical") + 1,
            })
          }
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
  aiEnabled,
  onStart,
}: {
  headingRef: React.RefObject<HTMLDivElement | null>;
  aiEnabled: boolean;
  onStart: () => void;
}) {
  return (
    <section className="animate-[fadeUp_.35s_var(--ease-out-expo)_both]">
      <div ref={headingRef} tabIndex={-1} className="outline-none">
        <h2 className="display-serif text-[2rem] leading-[1.12] text-balance text-ink sm:text-4xl">
          What you need, written down.
        </h2>
      </div>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
        {aiEnabled ? (
          <>
            A few questions about your business and goals before the first
            conversation. Then three visual concepts, drafted from your
            answers while you watch.
          </>
        ) : (
          <>
            A few questions about your business and goals before the first
            conversation.
          </>
        )}
      </p>
      <p className="mt-3 text-xs text-faint">
        About 10 minutes · answers save on this device · nothing is binding
      </p>

      <div className="mt-9">
        <ContinueButton onClick={onStart} label="Begin" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ steps */

function StepScreen({
  index,
  answers,
  setField,
  aiEnabled,
  onDraft,
  botField,
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
  aiEnabled: boolean;
  onDraft: (draft: Record<string, string | string[]>) => void;
  botField: React.RefObject<HTMLInputElement | null>;
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

      <p className="mb-3 text-xs font-medium text-gold">
        {step.kicker}
        <span className="ml-2 font-normal text-faint">· {step.timeHint}</span>
      </p>
      <div ref={headingRef} tabIndex={-1} className="outline-none" aria-live="polite">
        <h2 className="display-serif text-2xl text-ink sm:text-3xl md:text-4xl">{step.title}</h2>
      </div>
      {step.intro && (
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{step.intro}</p>
      )}

      {step.id === "basics" && aiEnabled && (
        <FastFill onDraft={onDraft} botField={botField} />
      )}

      <div className="mt-8 grid gap-7 sm:grid-cols-2">
        {step.fields.map((field) => (
          <Field key={field.id} field={field} value={answers[field.id]} onChange={setField} />
        ))}
      </div>

      {isLast && (
        <p className="mt-6 text-[12px] text-faint">
          <span className="text-gold">*</span> required · we never sell your
          information — see the{" "}
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
          className="text-sm font-medium text-faint transition-colors hover:text-ink"
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
  "w-full rounded-lg border border-line bg-[var(--panel-input-bg)] px-4 py-3.5 text-[1rem] leading-relaxed text-ink placeholder:text-faint focus:border-gold/70 focus:outline-none";

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
      {field.kind === "select" ? (
        <select
          id={field.id}
          value={(value as string) ?? ""}
          aria-describedby={describedBy}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Choose one…
          </option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.kind === "text" ? (
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
              className="rounded-full px-2 py-0.5 text-xs font-medium"
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

/* ---------------------------------------------------------------- success */

function SuccessScreen({ name }: { name: string }) {
  const first = name.trim().split(/\s+/)[0];
  const steps = [
    { title: "Answers received", detail: "Done.", done: true },
    {
      title: "Within 24 hours: your rough scope",
      detail: "Scope, features, price range, timeline.",
      done: false,
    },
    {
      title: "Optional free 15-minute call",
      detail: "Only if you want it. No pitch.",
      done: false,
    },
  ];

  return (
    <section className="animate-[fadeUp_.35s_var(--ease-out-expo)_both]">
      <h2 className="display-serif text-[2rem] text-balance text-ink sm:text-4xl">
        {first ? `Thanks, ${first}.` : "Thanks, that's everything."}
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

      <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-faint">
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

/* ---------------------------------------------------------------- fast fill */

type FastFillState =
  | { phase: "closed" }
  | { phase: "open" }
  | { phase: "working" }
  | { phase: "done"; count: number }
  | { phase: "error"; message: string };

/*
  Fast fill — the visitor describes the business and the project in their
  own words, once, and the answers are drafted onto the form's fields for
  them to review. Optional, never overwrites anything they typed, and every
  drafted answer stays fully editable on the steps that follow. Doubles as
  a live demo of the studio's actual work: messy input in, structure out.
*/
function FastFill({
  onDraft,
  botField,
}: {
  onDraft: (draft: Record<string, string | string[]>) => void;
  botField: React.RefObject<HTMLInputElement | null>;
}) {
  const [state, setState] = useState<FastFillState>({ phase: "closed" });
  const [text, setText] = useState("");

  async function run() {
    setState({ phase: "working" });
    try {
      const res = await fetch("/api/prefill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text, botField: botField.current?.value ?? "" }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error ?? "Couldn't read that this time.");
      }
      const draft = payload.answers as Record<string, string | string[]>;
      const count = Object.keys(draft).length;
      if (count === 0) {
        setState({
          phase: "error",
          message: "Not much came back from that. The questions are quick by hand.",
        });
        return;
      }
      onDraft(draft);
      setState({ phase: "done", count });
    } catch (err) {
      setState({
        phase: "error",
        message: err instanceof Error ? err.message : "Couldn't read that this time.",
      });
    }
  }

  if (state.phase === "closed") {
    return (
      <button
        type="button"
        onClick={() => setState({ phase: "open" })}
        className="mt-7 flex w-full items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-3.5 text-left transition-colors hover:bg-white/5"
        style={{ borderColor: "rgba(22, 163, 148, 0.4)" }}
      >
        <span className="text-[14px] text-ink">
          <span className="font-medium" style={{ color: TEAL }}>Skip the typing</span>
          {" "}. Describe it your way and the form fills itself in.
        </span>
        <span aria-hidden="true" className="text-faint">→</span>
      </button>
    );
  }

  if (state.phase === "done") {
    return (
      <p
        className="mt-7 rounded-xl px-4 py-3.5 text-[14px] font-medium"
        style={{ color: TEAL, backgroundColor: "rgba(22, 163, 148, 0.09)" }}
      >
        ✓ Drafted {state.count} answer{state.count === 1 ? "" : "s"} from your description —
        review them below and on the next steps. Everything stays editable, and
        nothing is sent until you say so.
      </p>
    );
  }

  return (
    <div
      className="mt-7 rounded-xl border p-4"
      style={{ borderColor: "rgba(22, 163, 148, 0.4)" }}
    >
      <label htmlFor="fastFill" className="block text-[15px] font-medium text-ink">
        Describe the business and what you want, in your own words
      </label>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        A few sentences is plenty. What you do, which tools you use, what needs
        to work better, and anything that bugs you today. The form&apos;s answers get
        drafted from it, and you review everything before it goes anywhere.
      </p>
      <textarea
        id="fastFill"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={state.phase === "working"}
        placeholder="e.g. We run a twelve-room inn in Rockland with a small restaurant. People still call to book — we want online booking, and the current site looks terrible on phones…"
        className="mt-3 w-full rounded-lg border border-line bg-[var(--panel-input-bg)] px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-faint focus:outline-none disabled:opacity-60"
        style={{ caretColor: TEAL }}
      />
      {state.phase === "error" && (
        <p className="mt-2 text-[13px] text-muted">{state.message}</p>
      )}
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setState({ phase: "closed" })}
          className="text-xs font-medium text-faint transition-colors hover:text-ink"
        >
          Never mind
        </button>
        <button
          type="button"
          onClick={run}
          disabled={state.phase === "working" || text.trim().length < 20}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition-all hover:-translate-y-0.5 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 motion-reduce:transition-none"
          style={{ backgroundColor: TEAL }}
        >
          {state.phase === "working" ? (
            <>
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Reading…
            </>
          ) : (
            <>Draft my answers</>
          )}
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- concept preview */

type Concept = { key: string; title: string; html: string };
type PreviewState =
  | { phase: "generating" }
  | { phase: "ready"; concepts: Concept[] }
  | { phase: "error"; message: string };

/*
  AI concept previews — three style-distinct homepage sketches drafted from
  the visitor's own answers, rendered in fully sandboxed iframes (no scripts,
  no navigation). Entirely optional: skipping costs nothing, generation
  failures degrade to a note, and the only thing that ever reaches the
  submission is the label of the direction they picked.
*/
function PreviewScreen({
  genState,
  onRetry,
  bizName,
  choice,
  onChoose,
  headingRef,
  onBack,
  onContinue,
}: {
  genState: PreviewState;
  onRetry: () => void;
  bizName: string;
  choice: string;
  onChoose: (label: string) => void;
  headingRef: React.RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onContinue: () => void;
}) {
  const state = genState;
  const [expanded, setExpanded] = useState<string | null>(null);


  return (
    <section className="animate-[fadeUp_.35s_var(--ease-out-expo)_both]">
      <p className="mb-3 text-xs font-medium text-gold">
        First look
        <span className="ml-2 font-normal text-faint">· about a minute</span>
      </p>
      <div ref={headingRef} tabIndex={-1} className="outline-none" aria-live="polite">
        <h2 className="display-serif text-2xl text-ink sm:text-3xl md:text-4xl">
          Your first look is building now.
        </h2>
      </div>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
        Three directions for your homepage, designed from your answers. Pick
        the one that feels closest — rough sketches, not final designs.
      </p>

      {state.phase === "generating" && (
        <div className="mt-8 rounded-2xl border border-line bg-[var(--panel-input-bg)] p-6" aria-live="polite">
          <p className="flex items-center gap-3 text-[15px] text-ink">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
            </span>
            Drafting three directions for {bizName || "your business"}…
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Feel free to skip ahead — whatever finishes still comes with your scope.
          </p>
        </div>
      )}

      {state.phase === "error" && (
        <div className="mt-8 rounded-lg border border-line bg-[var(--panel-input-bg)] px-4 py-3">
          <p className="text-[14px] text-muted">
          {state.message} You can try once more, or just continue — your
            scope will include visual directions either way.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-xs font-medium text-gold transition-opacity hover:opacity-75"
          >
            Try again →
          </button>
        </div>
      )}

      {state.phase === "ready" && (
        <div className="mt-8 space-y-5">
          <p className="text-[13px] text-muted">
            Tap to expand · pick your favorite. Nothing is binding.
          </p>
          {state.concepts.map((c) => {
            const selected = choice === c.title;
            const isOpen = expanded === c.key;
            return (
              <div
                key={c.key}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  selected ? "border-gold/60" : "border-line"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[var(--panel-input-bg)] px-4 py-3">
                  <p className="text-[15px] font-medium text-ink">{c.title}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : c.key)}
                      className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
                    >
                      {isOpen ? "Collapse" : "Expand"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onChoose(selected ? "" : c.title)}
                      aria-pressed={selected}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        selected
                          ? "bg-gold text-[#0b1722]"
                          : "border border-gold/40 text-gold hover:bg-gold/10"
                      }`}
                    >
                      {selected ? "✓ Your pick" : "This one"}
                    </button>
                  </div>
                </div>
                {/* sandbox with NO tokens: no scripts, no forms, no popups,
                    no top navigation. The concept is inert markup. */}
                <iframe
                  srcDoc={c.html}
                  sandbox=""
                  title={`Concept: ${c.title}`}
                  loading="lazy"
                  className={`w-full border-0 bg-white transition-all ${isOpen ? "h-[560px]" : "h-64"}`}
                />
              </div>
            );
          })}
        </div>
      )}

      <nav className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-faint transition-colors hover:text-ink"
        >
          ← Back
        </button>
        <ContinueButton
          onClick={onContinue}
          label={
            state.phase === "ready"
              ? choice
                ? "Continue with this direction"
                : "Continue"
              : "Skip this step"
          }
        />
      </nav>
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
