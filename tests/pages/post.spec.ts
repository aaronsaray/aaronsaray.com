import { test, expect } from "@playwright/test";
import { runAxe } from "../support/axe";

test.describe("copy button", () => {
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
      const blocks = page.locator(".prose pre:not(.code-wrap.is-output pre)");
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

        const copied = await page.evaluate(() =>
          navigator.clipboard.readText(),
        );
        expect(copied).toBe(expected);
      }
    });
  }
});

test.describe("output blocks", () => {
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
});

test.describe("heading anchors", () => {
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
});

test.describe("images", () => {
  test("content images carry intrinsic dimensions", async ({ page }) => {
    await page.goto(
      "/2013/html5-css3-javascript-only-photobooth-with-image-download/",
    );
    const images = page.locator(".prose img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute("src");
      const width = Number(await img.getAttribute("width"));
      const height = Number(await img.getAttribute("height"));
      expect(width, `width on ${src}`).toBeGreaterThan(0);
      expect(height, `height on ${src}`).toBeGreaterThan(0);

      // The attributes are only worth anything if they match the file:
      // a wrong ratio reserves the wrong box and shifts worse than
      // stamping nothing would. Lazy images below the fold decode
      // late, so wait for the real bitmap before comparing.
      await img.scrollIntoViewIfNeeded();
      const natural = await img.evaluate(async (el: HTMLImageElement) => {
        if (!el.complete) {
          await el.decode().catch(() => {});
        }
        return { width: el.naturalWidth, height: el.naturalHeight };
      });
      expect(natural, `natural size of ${src}`).toEqual({ width, height });
    }
  });

  test("images inside code samples are left alone", async ({ page }) => {
    await page.goto(
      "/2013/html5-css3-javascript-only-photobooth-with-image-download/",
    );
    const code = await page.locator("pre").allTextContents();
    const samples = code.join("\n");
    expect(samples).toContain("<img");
    expect(samples).not.toMatch(/<img[^>]*\bwidth="\d+"/);
  });

  test("only the first content image loads eagerly", async ({ page }) => {
    await page.goto("/2019/didnt-launch-my-startup/");
    const loading = await page
      .locator(".prose img")
      .evaluateAll((els) => els.map((el) => el.getAttribute("loading")));
    expect(loading.length).toBeGreaterThan(1);
    expect(loading[0]).toBeNull();
    expect(loading.slice(1)).toEqual(loading.slice(1).map(() => "lazy"));
  });

  // A retina capture carries no density of its own, so the stamped size
  // is the file divided by the suffix in its name. Both densities run
  // because the divisor is read from the filename.
  const RETINA = [
    { path: "/2022/one-tap-track-weight-daily-ios-no-app/", scale: 3 },
    { path: "/2018/host-site-github-pages-with-ssl/", scale: 2 },
  ];

  for (const { path, scale } of RETINA) {
    test(`@${scale}x captures are stamped at the divided size`, async ({
      page,
    }) => {
      await page.goto(path);
      const images = page.locator(`.prose img[src*="@${scale}x."]`);
      const count = await images.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const src = await img.getAttribute("src");
        const width = Number(await img.getAttribute("width"));
        const height = Number(await img.getAttribute("height"));

        await img.scrollIntoViewIfNeeded();
        const natural = await img.evaluate(async (el: HTMLImageElement) => {
          if (!el.complete) {
            await el.decode().catch(() => {});
          }
          return { width: el.naturalWidth, height: el.naturalHeight };
        });

        // Repeating the plugin's own rounding, not multiplying back: an
        // odd file dimension divides to a half pixel, and host14@2x.png
        // and two others land there.
        expect(width, `width on ${src}`).toBe(
          Math.round(natural.width / scale),
        );
        expect(height, `height on ${src}`).toBe(
          Math.round(natural.height / scale),
        );

        // A plugin that stopped dividing would still satisfy the rounding
        // above if the file were small enough to match; this cannot pass
        // unless the stamp is genuinely smaller than the file.
        expect(natural.width, `divided width on ${src}`).toBeGreaterThan(width);
      }
    });
  }
});

test.describe("tables", () => {
  // The widest table on the site: five columns, and the only one measured
  // to overflow its column at a phone width. cv.spec.ts covers the
  // scope="col" stamping on the CV's own tables.
  const POST = "/2017/my-site-redesign-simpler-faster-but-less-user-friendly/";

  // axe's scrollable-region-focusable ignores anything scrolling less
  // than this, so a narrower case would prove nothing about the rule.
  const AXE_SCROLL_MINIMUM = 13;

  // The attributes are the assertion, not the behavior behind them.
  // Chromium puts a scrollable container in the tab order and lets
  // focus() land on it whether or not it carries a tabindex, so every
  // keyboard test of this wrapper passes with the tabindex deleted.
  // Firefox and Safari do not, which is what the attribute is for.
  test("every table wrapper is a named focus stop", async ({ page }) => {
    await page.goto(POST);

    const wrappers = page.locator(".prose .table-wrap");
    const count = await wrappers.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const wrapper = wrappers.nth(i);
      await expect(wrapper).toHaveAttribute("tabindex", "0");
      await expect(wrapper).toHaveAttribute("role", "group");
      await expect(wrapper).toHaveAttribute("aria-label", "Table");
      await expect(wrapper.locator("table")).toHaveCount(1);
      // group on the table itself would replace its table role and take
      // the row and column semantics with it.
      await expect(wrapper.locator("table")).not.toHaveAttribute("role", /.*/);
    }
  });

  test("the wide table overflows far enough for axe to judge it, and passes", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "pins its own viewport");
    // The table fits at both project viewports.
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(POST, { waitUntil: "networkidle" });

    const wrapper = page.locator(".prose .table-wrap").first();
    const overflow = await wrapper.evaluate(
      (el) => el.scrollWidth - el.clientWidth,
    );
    expect(overflow).toBeGreaterThan(AXE_SCROLL_MINIMUM);
    expect((await runAxe(page)).violations).toEqual([]);

    // Styling that stopped the wrapper scrolling would leave the
    // attributes above on an element with nothing to scroll.
    await wrapper.evaluate((el) => {
      el.scrollLeft = 40;
    });
    expect(await wrapper.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  });
});

test.describe("33 things", () => {
  test("both formats download the file the post promises", async ({
    page,
    request,
  }) => {
    await page.goto("/2017/33-things-book/");
    for (const name of ["Download PDF", "Download ePub"]) {
      const href = await page.getByRole("link", { name }).getAttribute("href");
      expect(href, `${name} href`).toBeTruthy();

      // The hrefs are written out in the component, so nothing but a
      // fetch proves they still name the files that ship.
      const res = await request.get(href!);
      expect(res.status(), `${name} -> ${href}`).toBe(200);
    }
  });
});
