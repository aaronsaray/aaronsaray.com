import { test, expect } from "@playwright/test";
import { DRAFT_FIXTURE } from "../draft-fixture";

test("a draft renders in dev at its real URL with a badge", async ({
  page,
}) => {
  const response = await page.goto(DRAFT_FIXTURE.path);
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText(DRAFT_FIXTURE.title);
  await expect(page.locator(".draft-badge")).toBeVisible();
});

test("a draft is listed in dev with a badge", async ({ page }) => {
  await page.goto(`/tag/${DRAFT_FIXTURE.tag}/`);
  const entry = page.locator("article", { hasText: DRAFT_FIXTURE.title });
  await expect(entry).toHaveCount(1);
  await expect(entry.locator(".draft-badge")).toBeVisible();
});
