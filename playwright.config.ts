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
    90s per test on CI, against Playwright's 30s default.

    **This is margin, not a fix, and the distinction is the point.** Twice now
    a run has failed with the same four tests — three navigations to
    /work/maine-cleaning-co and the homepage's first build capture — each
    timing out at exactly 30s. Both times on a diff that touches neither that
    route nor those images, and both times `main` was green.

    What the runs actually show is a slow runner rather than a slow page. The
    two failing runs took 4.3 and 5.0 minutes of test time; the three passing
    runs around 2. That is roughly 2.5x across the board, and the heaviest
    page is simply the first thing to cross a 30s cliff the suite had no
    margin for.

    What was ruled out, so nobody re-derives it: the page loads in 0.43s
    locally with an emptied .next/cache/images, at Playwright's own viewport,
    and requests four images. Cold-encoding every width of the largest source
    with the server pinned to two cores peaks at 0.6s. Next emits WebP only
    here, so the expensive AVIF path is not in play. No reproduction locally,
    cold or CPU-pinned.

    Raising the budget does not hide a failure: every assertion still runs,
    and a page that is genuinely broken, blank or erroring still fails on its
    own assertion rather than on the clock. What it stops is a green suite
    being reported red because somebody else's build was noisy for five
    minutes. Local stays at the default, where a 30s page load is a real
    signal worth seeing.
  */
  timeout: process.env.CI ? 90_000 : 30_000,
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
