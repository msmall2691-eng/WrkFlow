"use client";

/* Shared control primitives for the Playground tools. */

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-faint">
      {children}
    </p>
  );
}

/*
  Slider (site survey O-04) — the bare range input was 6px tall, which made
  the track the hit area and the control nearly impossible to use on a phone.
  Two changes: the input now carries a 44px box with the 6px bar drawn inside
  it (.slider-touch in globals.css), and there are -/+ steppers either side,
  which are easier to hit than any slider and let someone tap to "4 bedrooms"
  without dragging at all.
*/
export function Slider({
  label, value, min, max, step = 1, suffix = "", onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (v: number) => void;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Number(v.toFixed(4))));
  const nudge = (dir: 1 | -1) => onChange(clamp(value + dir * step));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-faint">{label}</span>
        <span className="font-mono text-[11px] text-muted">{value}{suffix}</span>
      </div>
      <div className="flex items-center gap-2">
        <Step label={`Decrease ${label}`} onClick={() => nudge(-1)} disabled={value <= min}>&minus;</Step>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={label}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-touch w-full cursor-pointer"
        />
        <Step label={`Increase ${label}`} onClick={() => nudge(1)} disabled={value >= max}>+</Step>
      </div>
    </div>
  );
}

function Step({
  label, onClick, disabled, children,
}: {
  label: string; onClick: () => void; disabled: boolean; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-base text-[1rem] leading-none text-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-muted"
    >
      {children}
    </button>
  );
}

export function Seg<T extends string>({
  label, value, options, onChange,
}: {
  label?: string; value: T; options: [T, string][]; onChange: (v: T) => void;
}) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="inline-flex flex-wrap rounded-lg border border-line bg-base p-0.5">
        {options.map(([val, lbl]) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              value === val ? "bg-signal text-white" : "text-muted hover:text-ink"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Toggle({
  label, checked, onChange,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 text-left"
    >
      <span className="text-sm text-muted">{label}</span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-signal" : "bg-line"}`}>
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
