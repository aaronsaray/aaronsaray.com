import { test, expect } from "@playwright/test";

test("nothing exists until the code is typed", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".konami-stage")).toHaveCount(0);
});
