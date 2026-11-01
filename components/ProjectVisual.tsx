/*
  ProjectVisual — clean, on-brand animated illustrations used in place of
  screenshots for disciplines we don't have a true matching capture of (CRM,
  automation, audit, cleanup). Each reads as the kind of system it represents
  and carries a little movement. Decorative (aria-hidden).

  The bars that stand in for data rows are `bg-ink/N`, never `bg-white/N`.
  They were white when this was written, which worked because the site was
  dark then. It defaults to light now, so white-on-cream rendered them
  invisible: /services showed three of its five rows as a blue dot or a
  "dup" label floating in an empty panel, which reads as an image that
  failed to load rather than as an illustration. `ink` is the right token
  because it inverts with the Frame's own background, so the bars stay
  legible in Daylight and in Harbor.
*/

export type VisualType = "database" | "automation" | "audit" | "cleanup";

/*
  The panel, and the measure its contents are drawn at.

  These sit in a 16:10 box that is ~620px wide on /services, and they were
  drawn as if that box were small: content pinned to the top-left with a
  fixed-width bar, and a trailing label pushed out by `ml-auto`. At 620px
  that put the bars in the left third and the label hard against the right
  edge, with the bottom half empty, so the row read as two unrelated things
  rather than one record. Capping the content and centring it keeps a label
  beside the bar it belongs to at any panel width, and the cap lives here so
  all four illustrations share one measure.
*/
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden bg-[radial-gradient(130%_130%_at_50%_-10%,var(--color-elevated)_0%,var(--color-base)_85%)]"
    >
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <div className="relative w-full max-w-[20rem]">{children}</div>
      </div>
    </div>
  );
}

export default function ProjectVisual({ type }: { type: VisualType }) {
  if (type === "database") {
    const rows: [string, string][] = [
      ["w-24", "w-8"], ["w-20", "w-10"], ["w-28", "w-6"], ["w-16", "w-9"], ["w-24", "w-7"],
    ];
    return (
      <Frame>
        <div className="scan-line absolute inset-x-0 top-8 h-7 rounded-lg bg-signal/10" />
        <div className="relative">
          <p className="mb-3 text-xs text-faint">customers · linked</p>
          <div className="space-y-2.5">
            {rows.map(([a, b], i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-signal/70" />
                <span className={`h-1.5 rounded-full bg-ink/35 ${a}`} />
                <span className={`ml-auto h-1.5 rounded-full bg-ink/18 ${b}`} />
              </div>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  if (type === "automation") {
    const nodes: [string, string][] = [["▷", "Trigger"], ["⚙", "Run"], ["✓", "Done"]];
    return (
      <Frame>
        <div className="flex items-center">
          <div className="relative flex w-full items-center justify-between">
            <span className="absolute inset-x-4 top-4 h-px bg-line" />
            <span className="travel-dot absolute top-4 h-2 w-2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_10px_var(--color-signal)]" />
            {nodes.map(([icon, label], i) => (
              <div key={label} className="relative z-10 flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-[12px] ${
                    i === 2 ? "border-signal/60 bg-signal/15 text-signal" : "border-line bg-base text-faint"
                  }`}
                >
                  {icon}
                </span>
                <span className="text-xs text-faint">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  if (type === "audit") {
    const rows: { sev: string; w: string }[] = [
      { sev: "#e5645a", w: "w-24" },
      { sev: "var(--color-gold)", w: "w-20" },
      { sev: "var(--color-signal)", w: "w-16" },
      { sev: "var(--color-signal)", w: "w-12" },
    ];
    return (
      <Frame>
        <div className="scan-line absolute inset-x-0 top-8 h-7 rounded-lg bg-gold/10" />
        <div className="relative">
          <p className="mb-3 text-xs text-faint">prioritized fixes</p>
          <div className="space-y-2.5">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="w-2 font-mono text-[9px] text-faint">{i + 1}</span>
                <span className="h-3 w-1 rounded-full" style={{ backgroundColor: r.sev }} />
                <span className={`h-1.5 rounded-full bg-ink/30 ${r.w}`} />
                <span className="ml-auto text-[10px] text-signal/70">✓</span>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  // cleanup — duplicates merging into one clean record
  return (
    <Frame>
      <div className="flex flex-col justify-center gap-2">
        <div className="space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex animate-pulse items-center gap-2 opacity-50 motion-reduce:animate-none"
              style={{ animationDelay: `${i * 0.25}s` }}
            >
              <span className="h-2 w-2 rounded-full bg-ink/30" />
              <span className="h-1.5 w-28 rounded-full bg-ink/20" />
              <span className="ml-auto text-xs text-faint">dup</span>
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-faint">↓</div>
        <div className="flex items-center gap-2 rounded-lg border border-signal/40 bg-signal/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-signal" />
          <span className="h-1.5 w-28 rounded-full bg-ink/45" />
          <span className="ml-auto text-xs text-signal">merged</span>
        </div>
      </div>
    </Frame>
  );
}
