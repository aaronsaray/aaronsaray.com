import { test, expect } from "@playwright/test";

test("every destination is named by a link", async ({ page }) => {
  await page.goto("/about/");
  const terms = page.locator("main dt");
  const count = await terms.count();
  expect(count).toBeGreaterThan(0);
  await expect(page.locator("main dt > a")).toHaveCount(count);
});
