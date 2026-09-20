import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/books/");
});

test("each row's link is named by the title alone", async ({ page }) => {
  const rows = page.locator("article");
  expect(await rows.count()).toBeGreaterThan(0);
  for (const row of await rows.all()) {
    const title = (await row.locator("h2").textContent())?.trim() ?? "";
    expect(title).not.toBe("");
    await expect(row.getByRole("link")).toHaveAccessibleName(title);
  }
});

test("a click on the blurb follows the row's link", async ({ page }) => {
  // Only a row that links inside the site can be followed in a test.
  const row = page.locator("article", {
    has: page.locator('h2 a[href^="/"]'),
  });
  await expect(row.first()).toBeVisible();
  const href = await row.first().locator("h2 a").getAttribute("href");
  // A raw pointer click: the title link's overlay is what sits under
  // the pointer here, and Playwright's element click refuses that.
  const paragraph = row.first().locator(".book-blurb p");
  await paragraph.scrollIntoViewIfNeeded();
  const blurb = await paragraph.boundingBox();
  if (!blurb) {
    throw new Error("blurb has no box");
  }
  await page.mouse.click(blurb.x + blurb.width / 2, blurb.y + blurb.height / 2);
  await expect(page).toHaveURL(href ?? "");
});
