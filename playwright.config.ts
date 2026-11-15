import { defineConfig, devices } from "@playwright/test";

/*
  Smoke tests. Deliberately small: this is a marketing site with no test
  suite at all, and the thing worth catching is "a page 500s" or "the contact
  form stopped submitting" — not component-level regressions.

  The server is BUILT, not just started. A `next start` against a stale
  `.next` serves old chunks that fail to execute, which looks exactly like a
  broken app and wastes an afternoon. Building every run costs ~20s and
  removes that whole class of false signal.
*/
const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  /*
    No custom timeout here, and that is a decision with a history.

    **An intermittent hang on /work/maine-cleaning-co fails roughly half of
    all CI runs**, and it is not any one branch's: run 79 hit it on `main`
    itself, immediately after #137 merged, with the same four tests —
    three navigations to that route plus the homepage's first build capture.

    Raising this to 90s was tried and reverted, because the diagnosis behind
    it was wrong. The theory was a slow runner with no margin; the evidence
    killed it. At 90s the same four tests still failed, having burned 10.5
    minutes instead of 5. A page that renders in 0.43s locally and does not
    finish in 90s on CI is hanging, not running slowly, and no budget fixes
    a hang. It only makes each failure cost more.

    What has been ruled out, so nobody re-derives it: the page loads in
    0.43s locally against an emptied .next/cache/images at Playwright's own
    viewport, requesting four images. Cold-encoding every width of the
    largest source with the server pinned to two cores peaks at 0.6s. Next
    emits WebP only here, so the expensive AVIF path is not in play. No
    reproduction locally, cold or CPU-pinned, in a browser or over curl.

    What is still unexplained, and is the thread to pull next: the four
    images that page loads eagerly are the only PNGs the suite waits on, and
    every page whose captures are .webp has never failed. That is a
    correlation, not a cause, and it is written here rather than acted on
    because three confident guesses have already been wrong.
  */
  // A failing smoke test is a real failure, so don't paper over it locally.
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
