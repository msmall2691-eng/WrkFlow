/*
  Re-capture the three demo apps that the homepage and /catalog show as
  proof, at a resolution and quality a buyer can actually read.

  **Why this script exists.** `scripts/shots.mjs` captures the live client
  sites at 2208px wide. The demo captures were never in it: they sat in
  `public/shots/catalog/` at 960x600 and 20-36KB, hand-made at some point
  and never regenerated. On a 1440px page each card is about 360px wide,
  which a 2x screen renders from 720px of real pixels, so 960 was already
  marginal before the compression — and 20KB across 576,000 pixels is
  where the muddiness came from.

  That mattered more than a number suggests. Those three cards are the
  part of the site that says "here is software I built that you can go
  and use right now", and they were the lowest-fidelity images on the
  page. Meg, looking at the live site: "if i was looking for any of
  these things, this shit wouldnt convience me."

  **These are real captures of real running systems**, which is the rule
  in CLAUDE.md and the reason this is a camera rather than an art
  department: the script starts the actual app and photographs the actual
  demo routes. Nothing here invents an interface. The businesses inside
  them are invented, which the cards say in their own chrome, and the
  demo pages carry their own test for that sentence.

  Run against a built app:
      npx next build && npx next start -p 4311
      node scripts/demo-shots.mjs 4311
*/
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/* 1920 wide is 2x the 960 the cards were built around, so a retina card
   has real pixels to draw from with headroom for the layout growing. */
const WIDTH = 1920;
const HEIGHT = 1200;

/* 90 rather than the 82 `shots.mjs` uses. These are screenshots of UI:
   flat fields and small text, which is exactly the content webp's lower
   quality settings smear. The files land around 100-200KB, against 20KB
   before, and they are lazy-loaded below the fold. */
const QUALITY = 90;

const TARGETS = {
  "demo-shop.webp": "/demo/shop",
  "demo-directory.webp": "/demo/directory",
  "demo-studio.webp": "/demo/studio",
};

const port = process.argv[2] || "4311";
const base = `http://localhost:${port}`;
const out = "public/shots/catalog";

const tmp = mkdtempSync(join(tmpdir(), "demo-shots-"));

const browser = await chromium.launch({ args: ["--no-sandbox"] });
let failed = 0;

for (const [file, path] of Object.entries(TARGETS)) {
  const page = await browser.newPage({
    /* Captured at the card's own aspect ratio so nothing is cropped to
       fit afterwards, and at deviceScaleFactor 2 so the source really is
       2x rather than an upscale of a 1x grab. */
    viewport: { width: WIDTH / 2, height: HEIGHT / 2 },
    deviceScaleFactor: 2,
    /* The demos animate on entry. A capture mid-fade is a capture of a
       half-drawn page, and this is the one script where that would ship
       as the proof itself. */
    reducedMotion: "reduce",
  });

  try {
    const res = await page.goto(base + path, { waitUntil: "networkidle", timeout: 60_000 });
    if (!res || res.status() >= 400) throw new Error(`${path} answered ${res?.status()}`);

    /* Fonts decide how a UI screenshot reads more than anything else
       here, so wait for them rather than racing them. */
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);

    const raw = join(tmp, file.replace(/\.webp$/, ".png"));
    await page.screenshot({ path: raw });

    const dest = join(out, file);
    const info = await sharp(raw).webp({ quality: QUALITY, effort: 6 }).toFile(dest);
    console.log(
      `${file.padEnd(22)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`,
    );
  } catch (err) {
    failed += 1;
    console.error(`FAILED ${file} (${path}): ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
rmSync(tmp, { recursive: true, force: true });

/*
  A capture that silently did not happen leaves the old muddy file in
  place and looks like success, which is the failure this whole script
  is fixing. Exit non-zero instead.
*/
if (failed) {
  console.error(`\n${failed} capture(s) failed; the previous files are untouched.`);
  process.exit(1);
}
