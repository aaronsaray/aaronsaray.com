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
  testDir: "./tests",
  fullyParallel: true,
  // Every test runs once per project.
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run preview -- --port ${PORT}`,
    url: BASE_URL,
    // false: Playwright refuses to run when the port already answers.
    reuseExistingServer: false,
    // astro preview daemonizes itself when it detects an AI agent
    // shell, which reads to Playwright as the server exiting on startup.
    env: { ASTRO_PREVIEW_BACKGROUND: "0" },
  },
});
