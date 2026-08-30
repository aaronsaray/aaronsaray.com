import { test, expect } from "@playwright/test";
import { ROUTES } from "../routes";

for (const { name, path } of ROUTES) {
  test(`${name} renders`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  });
}

test("404 page renders", async ({ page }) => {
  const response = await page.goto("/no-such-page-exists/");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
});
