import { test, expect } from "@playwright/test";
import { excerptText } from "../../src/lib/excerpt";

const content = (page: import("@playwright/test").Page, selector: string) =>
  page.locator(selector).getAttribute("content");

test("a post carries article metadata", async ({ page }) => {
  await page.goto("/2007/ajax-security-research-and-findings-round-1/");

  expect(await content(page, 'meta[name="twitter:card"]')).toBe(
    "summary_large_image",
  );
  expect(await content(page, 'meta[property="og:type"]')).toBe("article");
  expect(await content(page, 'meta[property="article:published_time"]')).toBe(
    "2007-06-28",
  );
  expect(await content(page, 'meta[property="og:url"]')).toBe(
    await page.locator("link[rel=canonical]").getAttribute("href"),
  );

  const description = await content(page, 'meta[name="description"]');
  expect(await content(page, 'meta[property="og:description"]')).toBe(
    description,
  );
  expect(description!.length).toBeLessThanOrEqual(200);
});

test("a long excerpt is capped cleanly", async ({ page }) => {
  await page.goto("/2007/website-monitoring-project/");

  const description = (await content(page, 'meta[name="description"]'))!;
  expect(description.length).toBeLessThanOrEqual(200);
  expect(description).toMatch(/…$/);
  expect(description).not.toMatch(/(?:\.|…)…$/);
});

test("a non-post is a website", async ({ page }) => {
  await page.goto("/about/");

  expect(await content(page, 'meta[property="og:type"]')).toBe("website");
  await expect(
    page.locator('meta[property="article:published_time"]'),
  ).toHaveCount(0);
});

test("a tag page advertises its own feed", async ({ page }) => {
  await page.goto("/tag/php/");

  const href = await page
    .locator('link[rel=alternate][type="application/rss+xml"]')
    .last()
    .getAttribute("href");
  expect(href).toMatch(/\/tag\/php\/index\.xml$/);

  expect(await content(page, 'meta[name="description"]')).not.toBe(
    await content(page, 'meta[property="og:title"]'),
  );
});

test("a pagination page names its position", async ({ page }) => {
  await page.goto("/blog/page/2/");

  expect(await content(page, 'meta[name="description"]')).toMatch(
    /^Blog entries, page 2 of \d+\.$/,
  );
});

test("the 404 page is noindex and uncanonical", async ({ page }) => {
  await page.goto("/no-such-page-exists/");

  expect(await content(page, 'meta[name="robots"]')).toBe("noindex");
  await expect(page.locator("link[rel=canonical]")).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
});

test("an excerpt with no space to break on still fits the cap", async () => {
  const description = await excerptText("x".repeat(250));
  expect(description).toBe(`${"x".repeat(199)}…`);
});
