import { test, expect } from "@playwright/test";

// The copy script resolves its <pre> two ways: from a filename header
// via nextElementSibling, or from the code-wrap via querySelector.
// Both fixtures are permanent URLs, and between them they cover both
// branches. Comparing the copied text (not just the button's state
// class) is what catches a traversal that resolves the wrong <pre>.
const FIXTURES = [
  {
    name: "filename headers and bare blocks",
    path: "/2007/ajax-security-research-and-findings-round-1/",
  },
  {
    name: "bare blocks only",
    path: "/2007/a-better-understanding-of-error-reporting-in-php/",
  },
];

for (const { name, path } of FIXTURES) {
  test(`copies each code block: ${name}`, async ({ page }) => {
    await page.goto(path);

    const buttons = page.locator(".copy-btn");
    const blocks = page.locator("pre");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    expect(await blocks.count()).toBe(count);

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const expected = await blocks.nth(i).innerText();

      // A failed traversal returns before writing, leaving the previous
      // block's text in place. Clearing first means a stale value can
      // never be mistaken for a successful copy.
      await page.evaluate(() => navigator.clipboard.writeText(""));

      await button.click();
      // The class and label revert after 1500ms, so assert promptly.
      await expect(button).toHaveClass(/copied/);
      await expect(button).toHaveAttribute("aria-label", "Copied");

      const copied = await page.evaluate(() => navigator.clipboard.readText());
      expect(copied).toBe(expected);
    }
  });
}
