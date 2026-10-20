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
