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
      const lede = document.querySelector("main h1 + p");
      if (!lede) throw new Error("missing lede");
      const portrait = rect("main img");
      const name = rect("main h1");
      return {
        portraitTop: portrait.top,
        portraitBottom: portrait.bottom,
        portraitRight: portrait.right,
        nameTop: name.top,
        nameLeft: name.left,
        ledeBottom: lede.getBoundingClientRect().bottom,
      };
    });
    expect(layout.nameLeft).toBeGreaterThan(layout.portraitRight);
    // Below sm the lede wraps tall enough that a bottom-aligned portrait
    // would drift away from the name, so the row tops align instead.
    if (width < 640) {
      expect(layout.portraitTop).toBe(layout.nameTop);
    } else {
      expect(layout.portraitBottom).toBe(layout.ledeBottom);
    }
  });
}

// The bottom-aligned portrait lands on the lede's last baseline only
// because the lede's box is trimmed there. Untrimmed, the line box keeps
// its half-leading and descender space and the portrait hangs below the
// text by that much.
test("the portrait's bottom edge lands on the lede's last baseline", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const { portraitBottom, baseline } = await page.evaluate(() => {
    const lede = document.querySelector("main h1 + p");
    const portrait = document.querySelector("main img");
    if (!lede || !portrait) throw new Error("missing portrait or lede");
    const probe = document.createElement("span");
    probe.style.cssText =
      "display:inline-block;width:0;height:0;vertical-align:baseline";
    lede.appendChild(probe);
    const baseline = probe.getBoundingClientRect().top;
    probe.remove();
    return {
      portraitBottom: portrait.getBoundingClientRect().bottom,
      baseline,
    };
  });
  expect(portraitBottom).toBeCloseTo(baseline, 1);
});

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
