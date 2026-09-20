import { existsSync, readdirSync } from "node:fs";
import { test, expect, type Page } from "@playwright/test";
import { runAxe } from "./axe";

const scrollWidth = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth);

// One entry per route template, then the posts whose markdown emits
// DOM the plain post lacks. axe judges only what it is shown.
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
    name: "post with heading anchors",
    path: "/2021/do-not-use-tinker-in-production/",
  },
  // The one post whose code block overflows at 1280px, so the only one
  // where axe's scrollable-region-focusable rule has a region to judge
  // and the overflow mask renders.
  {
    name: "post with a scrolling code block",
    path: "/2019/expression-1-not-in-group-by/",
  },
  // A <pre> whose colors come from global.css rather than from Shiki.
  {
    name: "post with output blocks",
    path: "/2017/use-the-fail-method-with-mockery-on/",
  },
  {
    name: "post with retina images",
    path: "/2022/one-tap-track-weight-daily-ios-no-app/",
  },
];

// axe cannot resolve a background it can only sample from a gradient, so
// text over the header veil comes back "incomplete" rather than pass or
// fail. Incomplete results never appear in violations, so asserting on
// violations alone would wave an unreadable element through. These
// three are measured by hand instead: the veil's top band composites to
// #101213, against which the nav's ink-dim renders 6.2:1. Asserting the
// exact set means a gradient introduced anywhere else fails here until
// someone measures that one too.
// Matched on the identifying attribute: axe's generated selector leads
// with Tailwind utility classes an unrelated spacing change would break.
const GRADIENT_EXEMPT = [
  '[href$="contact/"]',
  'button[aria-controls="nav-menu-about"]',
  'button[aria-controls="nav-menu-writing"]',
];

for (const { name, path, status } of ROUTES) {
  test.describe(name, () => {
    test("renders", async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(status ?? 200);
      await expect(page.locator("h1")).toHaveCount(1);
    });

    test("has no axe violations", async ({ page }) => {
      // analyze() evaluates in the page, so it throws if anything is
      // still navigating. goto resolves on load, which the
      // view-transition swap and the font swap can both still be racing.
      await page.goto(path, { waitUntil: "networkidle" });
      const { violations, incomplete } = await runAxe(page);
      expect(violations, `axe violations on ${path}`).toEqual([]);
      const unreviewed = incomplete.filter(
        (target) => !GRADIENT_EXEMPT.some((e) => target.includes(e)),
      );
      expect(unreviewed, `unreviewed axe results on ${path}`).toEqual([]);
    });

    test("has no sideways scroll", async ({ page }) => {
      await page.goto(path);
      expect(await scrollWidth(page)).toBeLessThanOrEqual(
        page.viewportSize()!.width,
      );
    });

    // The Astro compiler drops the space at a line break between text
    // and an inline tag, so a Prettier reflow of a template can fuse
    // the words around one. Posts are markdown, where that cannot
    // happen and `Closure`s is legitimate.
    if (/^\/\d{4}\//.test(path)) {
      return;
    }
    test("keeps the spaces around inline tags", async ({ page }) => {
      await page.goto(path);
      const fused = await page.evaluate(() => {
        const word = /[\p{L}\p{N}]/u;
        const textOf = (node: Node | null) =>
          node?.nodeType === Node.TEXT_NODE ? (node.textContent ?? "") : "";
        return [...document.querySelectorAll("a, strong, em, s")].flatMap(
          (el) => {
            const inside = el.textContent ?? "";
            const before = textOf(el.previousSibling);
            const after = textOf(el.nextSibling);
            const faults: string[] = [];
            if (word.test(before.slice(-1)) && word.test(inside.slice(0, 1))) {
              faults.push(`${before.slice(-20)}|${inside.slice(0, 20)}`);
            }
            if (word.test(inside.slice(-1)) && word.test(after.slice(0, 1))) {
              faults.push(`${inside.slice(-20)}|${after.slice(0, 20)}`);
            }
            return faults;
          },
        );
      });
      expect(fused).toEqual([]);
    });
  });
}

// WCAG 1.4.10: 320 CSS px is a 1280px window at 400% zoom.
test.describe("at 320px", () => {
  test.skip(({ isMobile }) => isMobile, "pins its own viewport");
  test.use({ viewport: { width: 320, height: 800 } });

  for (const { name, path } of ROUTES) {
    test(`${name} has no sideways scroll`, async ({ page }) => {
      await page.goto(path);
      expect(await scrollWidth(page)).toBeLessThanOrEqual(320);
    });
  }
});

// ROUTES is a hand list. This covers its static pages; a new dynamic
// template has nothing to catch it.
test("every page directory in dist/ is a route above", () => {
  const built = readdirSync("dist", { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !/^\d{4}$/.test(entry.name) &&
        existsSync(`dist/${entry.name}/index.html`),
    )
    .map((entry) => `/${entry.name}/`);
  const listed = ROUTES.map((route) => route.path);
  expect(built.filter((path) => !listed.includes(path))).toEqual([]);
});
