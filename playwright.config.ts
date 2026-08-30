import { defineConfig, devices } from "@playwright/test";

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  forbidOnly: !!process.env.CI,
  // The github reporter writes annotations but no files. The html one is
  // what produces playwright-report/, which the workflow uploads on a
  // failed run.
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    // The copy button writes to the clipboard inside a try whose catch
    // is empty, so without this grant the write rejects silently and
    // the test reads as "copy is broken" rather than "no permission".
    permissions: ["clipboard-read", "clipboard-write"],
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: BASE_URL,
    // The guard against testing a server this config did not start:
    // Playwright refuses to run when anything already answers on the
    // port. astro dev alone would slide to the next free one.
    reuseExistingServer: false,
    timeout: 30_000,
    // astro dev daemonizes itself when it detects an AI agent shell,
    // which reads to Playwright as the server exiting on startup.
    env: { ASTRO_DEV_BACKGROUND: "0" },
  },
});
