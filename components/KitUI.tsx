"use client";

/* Shared control primitives for the Playground tools. */

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-faint">
      {children}
    </p>
  );
}

export function Slider({
  label, value, min, max, step = 1, suffix = "", onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-faint">{label}</span>
        <span className="font-mono text-[11px] text-muted">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line"
        style={{ accentColor: "var(--color-signal)" }}
      />
    </div>
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
