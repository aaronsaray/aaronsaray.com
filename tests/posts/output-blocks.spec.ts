import { test, expect } from "@playwright/test";

// Three output blocks alternating with php ones, so the same page
// proves what an output block does and what a code block next to it
// still does.
const POST = "/2017/use-the-fail-method-with-mockery-on/";

test("output blocks take the code-wrap shape with no copy button", async ({
  page,
}) => {
  await page.goto(POST);

  const outputs = page.locator(".code-wrap.is-output");
  await expect(outputs).toHaveCount(3);

  for (let i = 0; i < 3; i++) {
    const block = outputs.nth(i);
    // The wrapper is the bare shape plus a modifier: a copy script that
    // ever resolves a <pre> here must still find one.
    await expect(block.locator("pre")).toHaveCount(1);
    await expect(block.locator(".copy-btn")).toHaveCount(0);
    await expect(block.locator(".code-lang")).toHaveText("output");
  }
});

test("output blocks carry no highlighting and no inline theme colors", async ({
  page,
}) => {
  await page.goto(POST);

  const pres = page.locator(".code-wrap.is-output pre");
  const faults = await pres.evaluateAll((elements) =>
    elements.flatMap((pre, index) => {
      const problems: string[] = [];
      // Shiki writes the theme background inline, which no class can
      // override; the output transformer suppresses it.
      const style = pre.getAttribute("style") ?? "";
      if (/background-color|(^|;)\s*color\s*:/.test(style)) {
        problems.push(`${index}: inline theme color in "${style}"`);
      }
      // plaintext produces one span per line and none inside it. A
      // grammar would emit nested spans carrying colors.
      const colored = pre.querySelectorAll("span[style*='color']");
      if (colored.length > 0) {
        problems.push(`${index}: ${colored.length} highlighted spans`);
      }
      return problems;
    }),
  );
  expect(faults).toEqual([]);
});

test("an output block reads as output, not as code", async ({ page }) => {
  await page.goto(POST);

  // The pre stays focusable: an output block scrolls sideways like any
  // other, and a scroll stop with no name drops a screen reader onto
  // unlabeled content.
  const pre = page.locator(".code-wrap.is-output pre").first();
  await expect(pre).toHaveAttribute("tabindex", "0");
  await expect(pre).toHaveAttribute("role", "group");
  await expect(pre).toHaveAttribute("aria-label", "Terminal output");

  // The ground is the console black, not the code block's surface.
  const backgrounds = await page.evaluate(() => {
    const read = (selector: string) => {
      const element = document.querySelector(selector);
      return element ? getComputedStyle(element).backgroundColor : null;
    };
    return {
      output: read(".code-wrap.is-output pre"),
      code: read(".code-wrap:not(.is-output) pre"),
    };
  });
  expect(backgrounds.output).toBe("rgb(0, 0, 0)");
  expect(backgrounds.code).not.toBe(backgrounds.output);
});

test("code blocks on the same page keep their copy button", async ({
  page,
}) => {
  await page.goto(POST);

  const copyable = page.locator(".code-wrap:not(.is-output)");
  expect(await copyable.count()).toBeGreaterThan(0);
  for (let i = 0; i < (await copyable.count()); i++) {
    await expect(copyable.nth(i).locator(".copy-btn")).toHaveCount(1);
  }
});
