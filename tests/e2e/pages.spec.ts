import { test, expect } from "@playwright/test";
import { ROUTES } from "../routes";

for (const { name, path, status } of ROUTES) {
  test(`${name} renders`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(status ?? 200);
    await expect(page.locator("h1")).toHaveCount(1);
  });
}
