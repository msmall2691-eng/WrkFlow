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
  Output filename -> the live URL it is a capture of, or a { url, ... } spec
  when the capture needs more than a URL. The key is the file in public/shots
  that lib/content.ts points at, so adding a target here is the whole job of
  keeping a new shot current.

  Not here, and not capturable this way: instant-estimate.webp and the
  brightbase/* screens. Those are private systems with no public URL; retake
  them against a seeded local copy, per the rules at the top of
  lib/brightbase.ts.
*/
const TARGETS = {
  "maineclean.webp": "https://maineclean.co",
  "remote-admin.webp": "https://the-remote-admin.com",
  /* A full-bleed photographic hero, which is why this one was the JPEG
     while the rest were PNG. WebP carries both cases, so the split is gone. */
  "nash.webp": "https://nash-alpha.vercel.app/",
  "linx.webp": "https://linx-production-6edf.up.railway.app",
  /* This site's own /tools page, which the marketplace sells as M Linx Tools. */
  "tools.webp": "https://mlinx.studio/tools",
  /*
    **This file existed and this script did not refresh it**, which is the
    "refreshes nothing" failure the WebP note below describes, arriving the
    other way round: not a target writing a file nobody reads, but a file
    being read with no target behind it. The comment here used to say the
    welcome book "has no file because it is embedded live rather than
    screenshotted" — true until Nov 20, when `work[]` gained
    `shot: "/shots/keystone.webp"` because the reel renders a browser window
    with a URL in its chrome and nothing inside it. The capture was taken by
    hand that day and would have aged exactly as the six below did.

    Safe to capture in full, and that is the live page's own doing rather
    than a crop like arrowhead's: the welcome book withholds the street
    address and the door code by design, saying they arrive in the guest's
    Airbnb messages before check-in. The photographs on it are Meg's own
    house and lake, published by her on a page she wrote. If that page ever
    starts printing the address on the landing screen, this target needs the
    arrowhead treatment or needs removing.
  */
  "keystone.webp": "https://keystonestay.maineclean.co",
  /*
    The public marketing half of Arrowhead Explorers. Deliberately NOT the
    parent portal at portal.lacexplorers.online: that one is noindex, sits
    behind a family code, and its screens carry children's names, daily logs
    and photographs. A capture of it has no place in a public repository
    whatever it would prove, and nothing on the site needs it.

    `cropHeight` is the second half of that boundary and it is the half that
    was nearly lost. The public page's hero carries a photograph of two
    children, which was cropped out by hand before committing: it sits on
    Meg's own childcare site with whatever permission she has for that, and
    reusing it on a portfolio is her decision rather than one to take by
    default. Cropped by hand, that decision lived in the committed pixels and
    nowhere in this script, so the very next `npm run shots` would have
    silently put the photograph back. A refresh path is exactly where a rule
    honored once by hand goes missing.

    Two things worth knowing before changing it. The number is in output
    pixels, the same units as the committed file, so it is checkable: every
    other shot here is 2208x1380 and this one is 2208x1030. And it is a
    guarantee about a fixed rectangle rather than about the photograph, so if
    the live page's layout ever moves that hero upward the crop stops
    protecting anything. That is a judgement for Meg rather than something
    this script can make, which is also why it is a fixed height and not a
    selector: a selector that stopped matching would fail open and capture
    everything, where a height that no longer fits throws and leaves the
    previous file in place.
  */
  "arrowhead.webp": {
    url: "https://www.lacexplorers.online",
    cropHeight: 1030,
  },
};

const WIDTH = 2208;
const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const staging = mkdtempSync(join(tmpdir(), "shots-"));

const browser = await chromium.launch();
let wrote = 0;

for (const [file, target] of Object.entries(TARGETS)) {
  const { url, cropHeight } = typeof target === "string" ? { url: target } : target;
  const slug = file.replace(/\.webp$/, "");
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

    /* Resize first, then crop, so cropHeight is in the output's own pixels
       rather than the capture's. An over-tall crop throws here and the
       catch below leaves the committed file untouched, which is the safe
       direction for a boundary this one is protecting. */
    const resized = sharp(raw).resize({ width: WIDTH });
    const img = cropHeight
      ? resized.extract({ left: 0, top: 0, width: WIDTH, height: cropHeight })
      : resized;
    /* WebP, because that is what lib/content.ts points at. This used to
       branch on the extension and write PNG or JPEG, and when the committed
       captures moved to WebP the branch was left behind: `npm run shots`
       would have written six files the site does not read and left the six
       it does read untouched. A refresh path that silently refreshes nothing
       is worse than one that errors, and nothing would have failed, which is
       the same shape as the cropHeight note above.

       One format for both cases now. Photographic heroes (nash) and flat UI
       (the rest) both survive q82 here, where PNG needed `palette: true` to
       stay small and JPEG was the exception for the photograph. The
       committed files land between 47KB and 136KB, down from 144-625KB, so
       a re-capture that comes out wildly outside that range is worth a
       look before committing. */
    await img
      .webp({ quality: 82, effort: 6 })
      .toFile(join("public/shots", file));

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
