import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/cv/");
});

// The nav's slugs come from Astro's headings export, the ids from
// rehype-slug.
test("every section link lands on a heading", async ({ page }) => {
  const links = page.locator('nav[aria-label="Sections"] a');
  expect(await links.count()).toBeGreaterThan(0);

  for (const link of await links.all()) {
    const href = await link.getAttribute("href");
    await expect(page.locator(`[id="${href!.slice(1)}"]`)).toHaveCount(1);
  }
});

// The .cv rules in global.css key on these shapes; README "Updating
// the CV" is the convention.
test("every role heading and table row leads with its date", async ({
  page,
}) => {
  const roles = page.locator(".cv h4");
  const rows = page.locator(".cv tr");
  expect(await roles.count()).toBeGreaterThan(0);
  expect(await rows.count()).toBeGreaterThan(0);

  for (const role of await roles.all()) {
    expect(await role.evaluate((h) => h.firstChild?.nodeName)).toBe("EM");
  }
  for (const row of await rows.all()) {
    const cells = row.locator("th, td");
    await expect(cells).toHaveCount(2);
    await expect(cells.first()).toHaveText(/\S/);
  }
});

// anchorDepth: 2 in cv.md.
test("each H2 opens its own section and is the only linked heading", async ({
  page,
}) => {
  const count = await page.locator(".cv h2").count();
  expect(count).toBeGreaterThan(0);

  await expect(page.locator(".cv > section")).toHaveCount(count);
  await expect(page.locator(".cv > section > h2:first-child")).toHaveCount(
    count,
  );
  await expect(page.locator(".cv h2 > a.heading-anchor")).toHaveCount(count);
  await expect(page.locator(".cv :is(h3, h4) a.heading-anchor")).toHaveCount(0);
});
