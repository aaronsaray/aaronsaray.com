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
  // The first row whose link stays on the site.
  const row = page
    .locator("article", { has: page.locator('h2 a[href^="/"]') })
    .first();
  const href = await row.locator("h2 a").getAttribute("href");

  // A raw pointer click: Playwright's element click refuses the title
  // link's overlay sitting under the pointer.
  const paragraph = row.locator(".book-blurb p");
  await paragraph.scrollIntoViewIfNeeded();
  const blurb = (await paragraph.boundingBox())!;
  await page.mouse.click(blurb.x + blurb.width / 2, blurb.y + blurb.height / 2);

  await expect(page).toHaveURL(href!);
});
