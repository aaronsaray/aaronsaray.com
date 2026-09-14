import { test, expect } from "@playwright/test";
import { CODE, typeCode } from "../konami";

const STAGE = ".konami-stage";

// Timeouts: the whole motion run at this viewport is about 8 s (floor,
// drop, a 3.6 s run, puff, hoist), so waiting for the stage to leave
// needs more than Playwright's 5 s default.

test("nothing exists until the code is typed", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(STAGE)).toHaveCount(0);
});

test("the code raises a decorative stage that leaves on its own and can run again", async ({
  page,
}) => {
  await page.goto("/");
  await typeCode(page);
  const stage = page.locator(STAGE);
  await expect(stage).toHaveCount(1);
  await expect(stage).toHaveAttribute("aria-hidden", "true");
  await expect(stage.locator("img")).toHaveAttribute("alt", "");
  await expect(stage.locator("a, button, [tabindex]")).toHaveCount(0);
  expect(
    await page.evaluate(() => document.activeElement === document.body),
  ).toBe(true);
  await expect(stage).toHaveCount(0, { timeout: 20_000 });
  await typeCode(page);
  await expect(stage).toHaveCount(1);
});

test("Escape ends it early", async ({ page }) => {
  await page.goto("/");
  await typeCode(page);
  const stage = page.locator(STAGE);
  await expect(stage).toHaveClass(/is-run/, { timeout: 5_000 });
  await page.keyboard.press("Escape");
  // The exit alone takes about 2 s; the untouched run would take 6 s more.
  await expect(stage).toHaveCount(0, { timeout: 4_000 });
});

test("a wrong key resets the sequence", async ({ page }) => {
  await page.goto("/");
  for (const key of CODE.slice(0, 9)) await page.keyboard.press(key);
  await page.keyboard.press("x");
  await page.keyboard.press("a");
  await expect(page.locator(STAGE)).toHaveCount(0);
  await typeCode(page);
  await expect(page.locator(STAGE)).toHaveCount(1);
});

// No page has an editable field, so the test supplies one.
test("keys typed into an editable field do not count", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const field = document.createElement("div");
    field.id = "field";
    field.contentEditable = "true";
    document.getElementById("main")?.append(field);
    field.focus();
  });
  await typeCode(page);
  await expect(page.locator(STAGE)).toHaveCount(0);
  await page.evaluate(() => document.getElementById("field")?.blur());
  await typeCode(page);
  await expect(page.locator(STAGE)).toHaveCount(1);
});

test("the code is ignored while the scene runs", async ({ page }) => {
  await page.goto("/");
  await typeCode(page);
  await typeCode(page);
  await expect(page.locator(STAGE)).toHaveCount(1);
});

// emulateMedia per page: the reducedMotion context option (test.use)
// leaves matchMedia reporting no-preference under this config.
test.describe("with reduced motion", () => {
  test("a still frame fades in, holds, and fades out", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await typeCode(page);
    const stage = page.locator(STAGE);
    await expect(stage).toHaveClass(/is-on/);
    await expect(stage.locator("canvas")).toHaveCount(1);
    await expect(stage.locator("img")).toHaveCount(0);
    await expect(stage).toHaveCount(0, { timeout: 8_000 });
  });

  test("Escape shortens the hold", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await typeCode(page);
    const stage = page.locator(STAGE);
    await expect(stage).toHaveClass(/is-on/);
    await page.keyboard.press("Escape");
    await expect(stage).toHaveCount(0, { timeout: 2_000 });
  });
});
