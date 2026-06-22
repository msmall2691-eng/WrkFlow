// Generates data/buildlog.json from recent git history at build time.
// Privacy: only the commit SUBJECT (first line) is read via %s, so message
// bodies — including Co-Authored-By / Claude-Session trailers and author
// emails — are never included. Noise commits are filtered out. Runs as a
// `prebuild` step; on any failure it leaves the committed fallback in place.

import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data", "buildlog.json");
const MAX = 8;

// Subjects that read as noise rather than shipped work.
const NOISE = /^(wip\b|fixup!|squash!|merge\b|revert\b|typo\b|fix typo|minor\b|tweak\b|nit\b|cleanup\b|\W*$)/i;
// Defensive: never surface attribution/session trailers or emails, even if one
// somehow lands on a subject line.
const FORBIDDEN = /(co-authored-by|claude-session|signed-off-by|@)/i;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generate() {
  const raw = execSync("git log -n 50 --no-merges --pretty=format:%H%x1f%s%x1f%cI", {
    encoding: "utf8",
  });

  const items = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    const [hash, subject, iso] = line.split("\x1f");
    if (!hash || !subject || !iso) continue;
    const s = subject.trim();
    if (s.length < 8 || NOISE.test(s) || FORBIDDEN.test(s)) continue;
    const d = new Date(iso);
    items.push({
      sha: hash.slice(0, 7),
      subject: s,
      date: iso,
      label: `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`,
    });
    if (items.length >= MAX) break;
  }
  return items;
}

try {
  const items = generate();
  if (!items.length) throw new Error("no meaningful commits found");
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(items, null, 2) + "\n");
  console.log(`[buildlog] wrote ${items.length} entries`);
} catch (err) {
  console.warn(`[buildlog] skipped (${err.message}); keeping existing fallback`);
  if (!existsSync(OUT)) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, "[]\n");
  }
}
