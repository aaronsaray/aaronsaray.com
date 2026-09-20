import { test, expect } from "@playwright/test";
import { runAxe } from "../axe";

// The widest table on the site: five columns, and the only one measured
// to overflow its column at a phone width. cv.spec.ts covers the
// scope="col" stamping on the CV's own tables.
const POST = "/2017/my-site-redesign-simpler-faster-but-less-user-friendly/";

// axe's scrollable-region-focusable ignores anything scrolling less
// than this, so a narrower case would prove nothing about the rule.
const AXE_SCROLL_MINIMUM = 13;

// The attributes are the assertion, not the behavior behind them.
// Chromium puts a scrollable container in the tab order and lets
// focus() land on it whether or not it carries a tabindex, so every
// keyboard test of this wrapper passes with the tabindex deleted.
// Firefox and Safari do not, which is what the attribute is for.
test("every table wrapper is a named focus stop", async ({ page }) => {
  await page.goto(POST);

  const wrappers = page.locator(".prose .table-wrap");
  const count = await wrappers.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const wrapper = wrappers.nth(i);
    await expect(wrapper).toHaveAttribute("tabindex", "0");
    await expect(wrapper).toHaveAttribute("role", "group");
    await expect(wrapper).toHaveAttribute("aria-label", "Table");
    await expect(wrapper.locator("table")).toHaveCount(1);
    // group on the table itself would replace its table role and take
    // the row and column semantics with it.
    await expect(wrapper.locator("table")).not.toHaveAttribute("role", /.*/);
  }
});

test("the wide table overflows far enough for axe to judge it, and passes", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "pins its own viewport");
  // The table fits at both project viewports.
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(POST, { waitUntil: "networkidle" });

  const wrapper = page.locator(".prose .table-wrap").first();
  const overflow = await wrapper.evaluate(
    (el) => el.scrollWidth - el.clientWidth,
  );
  expect(overflow).toBeGreaterThan(AXE_SCROLL_MINIMUM);
  expect((await runAxe(page)).violations).toEqual([]);

  // Styling that stopped the wrapper scrolling would leave the
  // attributes above on an element with nothing to scroll.
  await wrapper.evaluate((el) => {
    el.scrollLeft = 40;
  });
  expect(await wrapper.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
});
