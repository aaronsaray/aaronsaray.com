import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { ROUTES } from "../routes";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// axe cannot resolve a background it can only sample from a gradient, so
// text over the header veil comes back "incomplete" rather than pass or
// fail. Incomplete results are NOT failures and never appear in
// violations, so a suite that only asserts on violations would wave an
// unreadable element through. These three are measured by hand
// instead: the veil's top band composites to #101213, against which
// the nav's ink-dim renders 6.2:1. Asserting the exact set (rather
// than skipping the rule) means a gradient introduced anywhere else
// fails here until someone measures that one too.
// Matched on the identifying attribute rather than axe's full generated
// selector, which leads with Tailwind utility classes an unrelated
// spacing change would break.
const GRADIENT_EXEMPT = [
  '[href$="contact/"]',
  'button[aria-controls="nav-menu-about"]',
  'button[aria-controls="nav-menu-writing"]',
];

for (const { name, path } of ROUTES) {
  test(`${name} has no axe violations`, async ({ page }) => {
    // analyze() evaluates in the page, so it throws if anything is still
    // navigating. goto resolves on load, which the view-transition
    // swap and the font swap can both still be racing.
    await page.goto(path, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    // Report every violating selector; the default diff on an object
    // array truncates and hides which element broke.
    const summary = results.violations.map(
      (v) =>
        `${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes
          .map((n) => n.target.join(" "))
          .slice(0, 5)
          .join(", ")}`,
    );
    expect(summary, `axe violations on ${path}`).toEqual([]);

    const incomplete = [
      ...new Set(
        results.incomplete.flatMap((r) =>
          r.nodes.map((n) => n.target.join(" ")),
        ),
      ),
    ];
    const unexpected = incomplete
      .filter((t) => !GRADIENT_EXEMPT.some((e) => t.includes(e)))
      .sort();
    expect(unexpected, `unreviewed axe results on ${path}`).toEqual([]);
  });
}
