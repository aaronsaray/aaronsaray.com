import { defineConfig, devices } from "@playwright/test";

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  forbidOnly: !!process.env.CI,
  // The github reporter writes no files. The html one produces
  // playwright-report/, which the workflow uploads on a failed run.
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    // The copy button writes to the clipboard inside a try whose catch
    // is empty, so without this grant the write rejects silently and
    // the test reads as "copy is broken" rather than "no permission".
    permissions: ["clipboard-read", "clipboard-write"],
    trace: "retain-on-failure",
  },
  globalSetup: "./tests/global-setup.ts",
  globalTeardown: "./tests/global-teardown.ts",
  projects: [
    {
      name: "e2e",
      testDir: "./tests/e2e",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "a11y",
      testDir: "./tests/a11y",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
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
    // NODE_ENV=test is Astro's switch for Vite server.hmr=false
    // (astro/dist/core/create-vite.js). With HMR on, the content sync
    // that global-setup's fixture write triggers emits a full-reload;
    // Vite holds that message while no page is connected and delivers
    // it to the first page that connects, which is a test's.
    env: { ASTRO_DEV_BACKGROUND: "0", NODE_ENV: "test" },
  },
});
