import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/cv/");
});

test("section index links resolve to ids on the page", async ({ page }) => {
  const links = page.locator('nav[aria-label="Sections"] a');
  expect(await links.count()).toBeGreaterThan(0);
  const hrefs = await links.evaluateAll((anchors) =>
    anchors.map((a) => a.getAttribute("href") ?? ""),
  );
  for (const href of hrefs) {
    expect(href).toMatch(/^#./);
    await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
  }
});

test("every role heading leads with a date", async ({ page }) => {
  const roles = page.locator(".cv h4");
  expect(await roles.count()).toBeGreaterThan(0);
  const withoutDate = await roles.evaluateAll((headings) =>
    headings
      .filter((h) => h.firstChild?.nodeName !== "EM")
      .map((h) => h.textContent),
  );
  expect(withoutDate).toEqual([]);
});

test("record tables carry column headers and a date in every row", async ({
  page,
}) => {
  const tables = page.locator(".cv table");
  expect(await tables.count()).toBeGreaterThan(0);
  for (const table of await tables.all()) {
    await expect(table.locator('thead th[scope="col"]')).toHaveCount(2);
    const blankDates = await table
      .locator("tbody td:first-child")
      .evaluateAll((cells) => cells.filter((td) => !td.textContent?.trim()));
    expect(blankDates).toEqual([]);
  }
});

test("every H2 opens its own section", async ({ page }) => {
  const headings = page.locator(".cv h2");
  const count = await headings.count();
  expect(count).toBeGreaterThan(0);
  await expect(page.locator(".cv > section")).toHaveCount(count);
  const orphans = await headings.evaluateAll((elements) =>
    elements
      .filter((h) => h.parentElement?.tagName !== "SECTION")
      .map((h) => h.textContent),
  );
  expect(orphans).toEqual([]);
});

test("H2s carry an anchor link and deeper headings do not", async ({
  page,
}) => {
  const count = await page.locator(".cv h2").count();
  expect(count).toBeGreaterThan(0);
  await expect(page.locator(".cv h2 > a.heading-anchor")).toHaveCount(count);
  await expect(page.locator(".cv :is(h3, h4) a.heading-anchor")).toHaveCount(0);
});
