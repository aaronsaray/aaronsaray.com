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
    permissions: ["clipboard-read", "clipboard-write"],
    trace: "retain-on-failure",
  },
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
    // false: Playwright refuses to run when the port already answers.
    reuseExistingServer: false,
    // astro dev daemonizes itself when it detects an AI agent shell,
    // which reads to Playwright as the server exiting on startup.
    env: { ASTRO_DEV_BACKGROUND: "0" },
  },
});
