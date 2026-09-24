// axe at WCAG 2.2 AA, for pages/all.spec.ts and pages/post.spec.ts.
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export async function runAxe(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return {
    // One line per rule with its selectors: the default diff on an
    // object array truncates and hides which element broke.
    violations: results.violations.map(
      (v) =>
        `${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes
          .map((n) => n.target.join(" "))
          .slice(0, 5)
          .join(", ")}`,
    ),
    incomplete: [
      ...new Set(
        results.incomplete.flatMap((r) =>
          r.nodes.map((n) => n.target.join(" ")),
        ),
      ),
    ].sort(),
  };
}
