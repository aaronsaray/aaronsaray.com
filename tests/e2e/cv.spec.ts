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
  expect(await tables.count()).toBe(2);
  for (const table of await tables.all()) {
    await expect(table.locator('thead th[scope="col"]')).toHaveCount(2);
    const blankDates = await table
      .locator("tbody td:first-child")
      .evaluateAll((cells) => cells.filter((td) => !td.textContent?.trim()));
    expect(blankDates).toEqual([]);
  }
});

test("no horizontal scroll at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(320);
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

test("desktop gutter lines up across sections and dates share the title baseline", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const layout = await page.evaluate(() => {
    const left = (el: Element | null) =>
      el ? el.getBoundingClientRect().left : NaN;
    const baseline = (el: Element) => {
      const probe = document.createElement("span");
      probe.style.cssText = "display:inline-block;width:0;height:0";
      el.appendChild(probe);
      const bottom = probe.getBoundingClientRect().bottom;
      probe.remove();
      return bottom;
    };
    const role = document.querySelector(".cv h4");
    const date = role?.querySelector("em");
    if (!role || !date) throw new Error("no dated role on the page");
    return {
      roleLeft: left(role),
      talkLeft: left(document.querySelector(".cv table tbody td:nth-child(2)")),
      publicationLeft: left(document.querySelector("#publications ~ p")),
      headingLeft: left(document.querySelector("#publications")),
      baselineGap: baseline(role) - baseline(date),
    };
  });
  expect(layout.talkLeft).toBe(layout.roleLeft);
  expect(layout.publicationLeft).toBe(layout.headingLeft);
  expect(Math.abs(layout.baselineGap)).toBeLessThan(0.5);
});
