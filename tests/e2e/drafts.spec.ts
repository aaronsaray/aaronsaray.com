import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The dev server is the only place a draft renders, so this is the
// only place the draft code paths get exercised at all.
const BLOG = join(import.meta.dirname, "../../src/content/blog");

const drafts = readdirSync(BLOG)
  .filter((file) => file.endsWith(".md"))
  .flatMap((file) => {
    const frontmatter = readFileSync(join(BLOG, file), "utf8").split("---")[1];
    if (!/^draft: true$/m.test(frontmatter)) return [];
    const year = /^date: "(\d{4})/m.exec(frontmatter)?.[1];
    return [`/${year}/${file.replace(/\.md$/, "")}/`];
  });

test("a draft exists to exercise the dev-only paths", () => {
  expect(drafts.length).toBeGreaterThan(0);
});

for (const path of drafts) {
  test(`draft ${path} renders in dev with a badge`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
  });
}
