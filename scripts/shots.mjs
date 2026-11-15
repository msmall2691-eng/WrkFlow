/*
  Re-captures the live project screenshots in public/shots.

  CLAUDE.md: "Screenshots in public/shots must be real captures of real sites
  or systems." Nothing enforced that they were CURRENT captures, and they
  decayed: by Nov 2026 the Remote Admin shot was three design revisions old
  and had a chip clipped across the logo, the Nash shot had the browser
  scrollbar baked into it, the linx shot showed bid prices and star ratings
  without the disclaimer the live product now carries, and the tools shot was
  the cream look the site left behind in V2. maineclean.png was re-captured on
  Nov 8 and had already drifted by Nov 10.

  Hand-capturing cannot keep up with five sites that are all under active
  work, so this is a script: run `npm run shots`, look at what it wrote, and
  commit the ones that changed.

  Capture settings and why:
    · 1440x900, deviceScaleFactor 2 — desktop layout, retina pixels.
    · reducedMotion "reduce" — entrance animations land on their end state
      instead of being caught mid-fade.
    · networkidle + 2.5s — fonts and hero images settle. Sites with a live
      data readout (Nash's weather, the Remote Admin's conditions panel) need
      the extra wait or they capture mid-fetch.
    · Resized to 2208px wide: twice the 1104px these render at on a case
      study (`sizes="(min-width: 1152px) 1104px, 100vw"`). Capturing wide and
      downscaling is sharper than capturing at 1104, which would trip some of
      these sites into a tablet layout.

  Needs the repo's Playwright Chromium. Usage:

      npm run shots            # every target
      npm run shots -- linx    # one
*/
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/*
  Output filename -> the live URL it is a capture of. The key is the file in
  public/shots that lib/content.ts points at, so adding a target here is the
  whole job of keeping a new shot current.

  Not here, and not capturable this way: instant-estimate.png and the
  brightbase/* screens. Those are private systems with no public URL; retake
  them against a seeded local copy, per the rules at the top of
  lib/brightbase.ts. keystonestay.maineclean.co has no file because it is
  embedded live rather than screenshotted.
*/
const TARGETS = {
  "maineclean.png": "https://maineclean.co",
  "remote-admin.png": "https://the-remote-admin.com",
  /* JPEG, not PNG: a full-bleed photographic hero costs ~3MB as PNG. */
  "nash.jpg": "https://nash-alpha.vercel.app/",
  "linx.png": "https://linx-production-6edf.up.railway.app",
  /* This site's own /tools page, which the marketplace sells as M Linx Tools. */
  "tools.png": "https://mlinx.studio/tools",
  /*
    The public marketing half of Arrowhead Explorers. Deliberately NOT the
    parent portal at portal.lacexplorers.online: that one is noindex, sits
    behind a family code, and its screens carry children's names, daily logs
    and photographs. A capture of it has no place in a public repository
    whatever it would prove, and nothing on the site needs it.
  */
  "arrowhead.png": "https://www.lacexplorers.online",
};

const WIDTH = 2208;
const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const staging = mkdtempSync(join(tmpdir(), "shots-"));

const browser = await chromium.launch();
let wrote = 0;

for (const [file, url] of Object.entries(TARGETS)) {
  const slug = file.replace(/\.(png|jpg)$/, "");
  if (only.length && !only.includes(slug) && !only.includes(file)) continue;

  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const raw = join(staging, `${slug}.png`);

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: raw });

    const img = sharp(raw).resize({ width: WIDTH });
    await (file.endsWith(".jpg")
      ? img.jpeg({ quality: 82, mozjpeg: true })
      /* palette: true quantizes to <=256 colours, which is what keeps these
         near the 200-600KB the repo had before. These are screenshots of
         flat UI with a few photographs in them, and it does not visibly band
         either; 24-bit PNG triples the file for nothing. */
      : img.png({ palette: true, quality: 90, effort: 10 })
    ).toFile(join("public/shots", file));

    process.stderr.write(`wrote public/shots/${file}  (${await page.title()})\n`);
    wrote++;
  } catch (e) {
    process.stderr.write(`FAILED ${file}: ${e.message.split("\n")[0]}\n`);
  }

  await ctx.close();
}

await browser.close();
process.stderr.write(
  `\n${wrote} shot(s) rewritten. Look at them before committing: a live site ` +
    `can capture mid-load, and a screenshot nobody looked at is how the last ` +
    `batch went stale.\n`,
);
