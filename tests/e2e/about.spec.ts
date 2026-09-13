import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/about/");
});

test("no horizontal scroll at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(320);
});

for (const width of [320, 768, 1280]) {
  test(`portrait sits beside the name at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.evaluate(() => {
      const rect = (selector: string) => {
        const el = document.querySelector(selector);
        if (!el) throw new Error(`missing ${selector}`);
        return el.getBoundingClientRect();
      };
      const portrait = rect("main img");
      const name = rect("main h1");
      return {
        portraitTop: portrait.top,
        portraitRight: portrait.right,
        nameTop: name.top,
        nameLeft: name.left,
      };
    });
    expect(layout.portraitTop).toBe(layout.nameTop);
    expect(layout.nameLeft).toBeGreaterThan(layout.portraitRight);
  });
}

test("every destination is named by a link", async ({ page }) => {
  const terms = page.locator("main dt");
  const count = await terms.count();
  expect(count).toBeGreaterThan(0);
  await expect(page.locator("main dt > a")).toHaveCount(count);
});

// The compiler drops the space at a line break between text and an
// inline tag, so a Prettier reflow can fuse words around a link.
test("inline tags keep the spaces around them", async ({ page }) => {
  const collapse = (text: string) => text.replace(/\s+/g, " ");
  const blog = await page.locator("main dd").first().innerText();
  expect(collapse(blog)).toContain(
    "interested in management or Laravel, business, or just random home automation.",
  );
  const struck = await page
    .locator("main s")
    .first()
    .evaluate((s) => (s.parentElement ? s.parentElement.innerText : ""));
  expect(collapse(struck)).toContain("limit my fucking potty mouth.");
});
