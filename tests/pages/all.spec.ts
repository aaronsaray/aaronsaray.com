import { existsSync, readdirSync } from "node:fs";
import { test, expect, type Page } from "@playwright/test";
import { runAxe } from "../support/axe";

function scrollWidth(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth);
}

function content(page: Page, selector: string) {
  return page.locator(selector).getAttribute("content");
}

// One entry per template, plus the posts whose markdown emits DOM the
// plain post lacks: axe judges only what it is shown.
const ROUTES: { name: string; path: string; status?: number }[] = [
  { name: "home", path: "/" },
  { name: "contact", path: "/contact/" },
  { name: "cv", path: "/cv/" },
  { name: "books", path: "/books/" },
  { name: "about", path: "/about/" },
  { name: "colophon", path: "/colophon/" },
  { name: "blog index", path: "/blog/" },
  { name: "blog pagination", path: "/blog/page/2/" },
  { name: "tag index", path: "/tag/" },
  { name: "tag landing", path: "/tag/php/" },
  { name: "not found", path: "/no-such-page-exists/", status: 404 },
  { name: "post", path: "/2007/ajax-security-research-and-findings-round-1/" },
  {
    name: "post with images and heading anchors",
    path: "/2021/do-not-use-tinker-in-production/",
  },
  // The only post whose code block overflows at 1280px, so the only
  // one where axe's scrollable-region-focusable rule has a region.
  {
    name: "post with a scrolling code block",
    path: "/2019/expression-1-not-in-group-by/",
  },
  // A <pre> whose colors come from global.css rather than from Shiki.
  {
    name: "post with output blocks",
    path: "/2017/use-the-fail-method-with-mockery-on/",
  },
];

// axe reports text over the header gradient as "incomplete", which
// never reaches violations, so incomplete is asserted empty and these
// three are measured by hand: the veil's top band composites to
// #101213, 6.2:1 against the nav's ink-dim. Matched on an attribute
// because axe's selector leads with Tailwind classes.
const GRADIENT_EXEMPT = [
  '[href$="contact/"]',
  'button[popovertarget="nav-menu-about"]',
  'button[popovertarget="nav-menu-writing"]',
];

for (const { name, path, status } of ROUTES) {
  test(`${name} renders cleanly`, async ({ page }) => {
    // networkidle: axe throws if the page is still loading as it runs.
    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response!.status()).toBe(status ?? 200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main"), "skip link target").toHaveCount(1);

    const { violations, incomplete } = await runAxe(page);
    expect(violations, `axe violations on ${path}`).toEqual([]);
    const unreviewed = incomplete.filter(
      (target) => !GRADIENT_EXEMPT.some((e) => target.includes(e)),
    );
    expect(unreviewed, `unreviewed axe results on ${path}`).toEqual([]);

    // Last: the resize changes the page every check above reads.
    // WCAG 1.4.10: 320 CSS px is a 1280px window at 400% zoom.
    expect(await scrollWidth(page)).toBeLessThanOrEqual(
      page.viewportSize()!.width,
    );
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await scrollWidth(page)).toBeLessThanOrEqual(320);
  });
}

test("every page directory in dist/ is a route above", () => {
  const built = readdirSync("dist", { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() && existsSync(`dist/${entry.name}/index.html`),
    )
    .map((entry) => `/${entry.name}/`);
  const listed = ROUTES.map((route) => route.path);
  expect(built.filter((path) => !listed.includes(path))).toEqual([]);
});

test.describe("head", () => {
  test("a post carries article metadata", async ({ page }) => {
    const path = "/2007/ajax-security-research-and-findings-round-1/";
    const url = `https://aaronsaray.com${path}`;
    const description =
      "(“the triangle”) wants to keep implementing more and more AJAX based systems - but no one ever took time to research into the security issues with this.";
    await page.goto(path);

    expect(await content(page, 'meta[name="twitter:card"]')).toBe(
      "summary_large_image",
    );
    expect(await content(page, 'meta[property="og:type"]')).toBe("article");
    expect(await content(page, 'meta[property="article:published_time"]')).toBe(
      "2007-06-28",
    );
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      url,
    );
    expect(await content(page, 'meta[property="og:url"]')).toBe(url);
    expect(await content(page, 'meta[name="description"]')).toBe(description);
    expect(await content(page, 'meta[property="og:description"]')).toBe(
      description,
    );
    // Its first tag, ajax, has an image.
    expect(await content(page, 'meta[property="og:image"]')).toBe(
      "https://aaronsaray.com/images/tag/ajax.jpg",
    );
  });

  // Its excerpt runs past the 200-character cap.
  test("a long excerpt is capped cleanly", async ({ page }) => {
    await page.goto("/2007/website-monitoring-project/");

    expect(await content(page, 'meta[name="description"]')).toBe(
      "Recently, while working at (“the triangle”), I came across a project that I had to research. This project’s definition included finding an up-time monitoring system for our websites as well as a…",
    );
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

    await expect(
      page.locator(
        'link[rel=alternate][type="application/rss+xml"][href="https://aaronsaray.com/tag/php/index.xml"]',
      ),
    ).toHaveCount(1);
    expect(await content(page, 'meta[name="description"]')).toBe(
      'Blog entries by Aaron Saray that have the tag "php".',
    );
  });

  // The page count moves with every post.
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
});
