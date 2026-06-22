import buildlog from "@/data/buildlog.json";

/*
  BuildLog — a quiet "shipped lately" feed, generated from git at build time by
  scripts/gen-buildlog.mjs (subjects only; trailers, emails and session links
  are stripped at generation). A flourish near the footer, not a section that
  competes with Work.
*/
type Entry = { sha: string; subject: string; date: string; label: string };

export default function BuildLog() {
  const entries = (buildlog as Entry[]).slice(0, 8);
  if (!entries.length) return null;

  return (
    <section aria-label="Recent shipped work" className="border-t border-line py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
          Shipped lately
        </p>
        <ul className="mt-4 divide-y divide-line/60">
          {entries.map((e) => (
            <li
              key={e.sha}
              className="flex items-baseline gap-3 py-2 font-mono text-xs text-muted"
            >
              <span className="w-12 shrink-0 text-faint">{e.label}</span>
              <span className="truncate text-ink/80">{e.subject}</span>
              <span className="ml-auto shrink-0 text-faint">{e.sha}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
