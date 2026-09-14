import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { TAGS } from "./tags";
import { typeCode } from "../konami";

// Violations only. The stage overlaps whatever body text sits under
// it, and axe reports overlapped text as an incomplete color-contrast
// result, so the exact incomplete set axe.spec.ts pins would vary here
// by page and viewport.
test("the scene has no axe violations while it runs", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await typeCode(page);
  await expect(page.locator(".konami-stage")).toHaveClass(/is-run/, {
    timeout: 5_000,
  });
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const summary = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes
        .map((n) => n.target.join(" "))
        .slice(0, 5)
        .join(", ")}`,
  );
  expect(summary, "axe violations during the scene").toEqual([]);
});
