import { test, expect } from "@playwright/test";

// One post proves the anchor shape on both linked levels; the other
// carries H4s and proves the depth stops at H3.
const LINKED = "/2021/do-not-use-tinker-in-production/";
const DEEPER = "/2016/are-all-american-ceos-psychopaths/";

test("H2 and H3 wrap their text in a self-link with a hidden icon", async ({
  page,
}) => {
  await page.goto(LINKED);
  const headings = page.locator(".prose :is(h2, h3)");
  expect(await headings.count()).toBeGreaterThan(0);
  const faults = await headings.evaluateAll((elements) =>
    elements.flatMap((heading) => {
      const anchors = heading.querySelectorAll(":scope > a.heading-anchor");
      const anchor = anchors[0];
      const problems: string[] = [];
      if (anchors.length !== 1) {
        problems.push(`${heading.id}: ${anchors.length} anchors`);
      }
      if (anchor?.getAttribute("href") !== `#${heading.id}`) {
        problems.push(`${heading.id}: href`);
      }
      if (!anchor?.textContent?.trim()) {
        problems.push(`${heading.id}: empty`);
      }
      if (!anchor?.querySelector('svg[aria-hidden="true"]')) {
        problems.push(`${heading.id}: icon`);
      }
      return problems;
    }),
  );
  expect(faults).toEqual([]);
});

test("depth 3 leaves H4 unlinked", async ({ page }) => {
  await page.goto(DEEPER);
  expect(await page.locator(".prose h4").count()).toBeGreaterThan(0);
  await expect(
    page.locator(".prose h3 > a.heading-anchor").first(),
  ).toBeVisible();
  await expect(page.locator(".prose h4 a.heading-anchor")).toHaveCount(0);
});
