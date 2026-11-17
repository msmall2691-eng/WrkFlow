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
    No custom timeout here, and that is a decision with a history that is
    now closed.

    **An intermittent hang on /work/maine-cleaning-co used to fail roughly
    half of all CI runs**, on `main` as well as on pull requests. Raising
    this to 90s was tried and reverted: at 90s the same four tests still
    failed, having burned 10.5 minutes instead of 5. A page that renders
    in 0.43s locally and does not finish in 90s is hanging, not running
    slowly, and no budget fixes a hang.

    **It was an upstream Next.js bug and it is now worked around in
    `e2e/warm-images.ts`**, which carries the full write-up. In short:
    `/_next/image` under a self-hosted `next start` builds its internal
    response on the requesting client's socket, so a client that goes away
    during a COLD transform leaves that cache key's generator unsettled
    for the life of the process, and every later request for that exact
    URL waits forever. vercel/next.js#96538, fixed upstream by #98168,
    not yet in the 15.5.x line we are on.

    Three guesses were recorded here before that, and all three were
    wrong, so it is worth saying what settled it: not reasoning, but
    reproducing it in three commands (abort a cold transform, request the
    same URL, watch it hang, then watch a different width of the same file
    answer in 283ms) and then reading the real CI trace, which showed every
    resource completing in under 150ms except four /_next/image requests
    that never completed at all.

    The old note's loose end is also explained rather than left hanging.
    It read: "the four images that page loads eagerly are the only PNGs
    the suite waits on, and every page whose captures are .webp has never
    failed. That is a correlation, not a cause." It is the cause one step
    removed: a PNG transform takes longer than a WebP one, so its window
    to be aborted is wider.
  */
  // A failing smoke test is a real failure, so don't paper over it locally.
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  /*
    Runs after webServer is up and before the first test, which is the only
    window where it can do its job. See the file for why it exists.
  */
  globalSetup: "./e2e/warm-images.ts",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
