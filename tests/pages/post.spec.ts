import { test, expect, type Locator } from "@playwright/test";
import { runAxe } from "../support/axe";

function stamps(images: Locator) {
  return images.evaluateAll((elements) =>
    elements.map(
      (el) =>
        `${el.getAttribute("src")} ${el.getAttribute("width")}x${el.getAttribute("height")}`,
    ),
  );
}

test.describe("copy button", () => {
  // The copy script finds its <pre> from a filename header
  // (nextElementSibling) or from the code-wrap (querySelector); the two
  // fixtures cover both.
  const FIXTURES = [
    {
      name: "filename headers and bare blocks",
      path: "/2007/ajax-security-research-and-findings-round-1/",
      blocks: 4,
    },
    {
      name: "bare blocks only",
      path: "/2007/a-better-understanding-of-error-reporting-in-php/",
      blocks: 3,
    },
  ];

  for (const { name, path, blocks } of FIXTURES) {
    test(`copies each code block: ${name}`, async ({ page }) => {
      await page.goto(path);
      const buttons = page.locator(".copy-btn");
      const pres = page.locator(".prose pre:not(.code-wrap.is-output pre)");
      await expect(buttons).toHaveCount(blocks);
      await expect(pres).toHaveCount(blocks);

      for (let i = 0; i < blocks; i++) {
        const button = buttons.nth(i);
        const expected = await pres.nth(i).innerText();
        // A failed copy leaves the previous block's text in place.
        await page.evaluate(() => navigator.clipboard.writeText(""));

        await button.click();
        // The class and label revert after 1500ms.
        await expect(button).toHaveClass(/copied/);
        await expect(button).toHaveAttribute("aria-label", "Copied");
        expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
          expected,
        );
      }
    });
  }
});

test.describe("output blocks", () => {
  // Three output blocks alternating with php ones.
  const POST = "/2017/use-the-fail-method-with-mockery-on/";

  // The `output: "plaintext"` alias in astro.config.ts keeps token
  // spans out. axe judges a scroll stop only where one overflows, and
  // never its name.
  test("output blocks are unhighlighted, uncopyable, named focus stops", async ({
    page,
  }) => {
    await page.goto(POST);
    const outputs = page.locator(".code-wrap.is-output");
    await expect(outputs).toHaveCount(3);
    await expect(
      page.locator(".code-wrap:not(.is-output) .copy-btn"),
    ).toHaveCount(3);

    await expect(outputs.locator(".code-lang")).toHaveText([
      "output",
      "output",
      "output",
    ]);
    await expect(outputs.locator(".copy-btn")).toHaveCount(0);
    await expect(
      outputs.locator(
        'pre[tabindex="0"][role="group"][aria-label="Terminal output"]',
      ),
    ).toHaveCount(3);
    await expect(outputs.locator("pre span[style]")).toHaveCount(0);
  });
});

test.describe("heading anchors", () => {
  // Three H2s and two H3s prove the anchor shape on both linked levels;
  // the other post carries seventeen H4s and proves the depth stops at
  // H3.
  const LINKED = "/2021/do-not-use-tinker-in-production/";
  const DEEPER = "/2016/are-all-american-ceos-psychopaths/";

  test("H2 and H3 wrap their text in a self-link with a hidden icon", async ({
    page,
  }) => {
    await page.goto(LINKED);
    const shape = await page
      .locator(".prose :is(h2, h3)")
      .evaluateAll((elements) =>
        elements.map((heading) => {
          const anchor = heading.querySelector(":scope > a.heading-anchor");
          const icon = anchor?.querySelector('svg[aria-hidden="true"]')
            ? " icon"
            : "";
          return `${heading.tagName} ${anchor?.getAttribute("href")} ${anchor?.textContent?.trim()}${icon}`;
        }),
      );
    expect(shape).toEqual([
      "H2 #why-not Why Not? icon",
      "H2 #but-what-about But What About…? icon",
      "H3 #tinker-to-update-some-data Tinker to Update Some Data icon",
      "H3 #i-need-weird-one-off-reports-for-the-boss I need weird one-off reports for the boss icon",
      "H2 #end-notes End Notes icon",
    ]);
  });

  test("depth 3 leaves H4 unlinked", async ({ page }) => {
    await page.goto(DEEPER);
    await expect(page.locator(".prose h4")).toHaveCount(17);

    await expect(page.locator(".prose h3 > a.heading-anchor")).toHaveCount(1);
    await expect(page.locator(".prose h4 a.heading-anchor")).toHaveCount(0);
  });
});

test.describe("images", () => {
  // Three images in the prose.
  const PHOTOBOOTH =
    "/2013/html5-css3-javascript-only-photobooth-with-image-download/";

  test("content images are stamped with their file's size", async ({
    page,
  }) => {
    await page.goto(PHOTOBOOTH);
    expect(await stamps(page.locator(".prose img"))).toEqual([
      "/uploads/2013/1.png 1682x789",
      "/uploads/2013/photobooth-2.png 1645x801",
      "/uploads/2013/3.png 1650x746",
    ]);
  });

  test("only the first content image loads eagerly", async ({ page }) => {
    await page.goto("/2019/didnt-launch-my-startup/");
    const loading = await page
      .locator(".prose img")
      .evaluateAll((els) => els.map((el) => el.getAttribute("loading")));
    expect(loading).toEqual([null, "lazy", "lazy"]);
  });

  // A retina capture carries no density of its own; the plugin divides
  // the file's size by the suffix in its name, so both suffixes run.
  const RETINA = [
    {
      scale: 3,
      path: "/2022/one-tap-track-weight-daily-ios-no-app/",
      count: 20,
      // 1170x2532 files.
      known: [
        "/uploads/2022/weight-1@3x.png 390x844",
        "/uploads/2022/weight-20@3x.png 390x844",
      ],
    },
    {
      scale: 2,
      path: "/2018/host-site-github-pages-with-ssl/",
      count: 17,
      // 2028x826 and 1097x452 files: the odd width's half pixel rounds
      // up.
      known: [
        "/uploads/2018/host1@2x.png 1014x413",
        "/uploads/2018/host14@2x.png 549x226",
      ],
    },
  ];

  for (const { scale, path, count, known } of RETINA) {
    test(`@${scale}x captures are stamped at the divided size`, async ({
      page,
    }) => {
      await page.goto(path);
      const stamped = await stamps(
        page.locator(`.prose img[src*="@${scale}x."]`),
      );
      expect(stamped).toHaveLength(count);
      expect(stamped).toEqual(expect.arrayContaining(known));
    });
  }
});

test.describe("tables", () => {
  // The widest table on the site, five columns, and the only one that
  // overflows its column at a phone width.
  const POST = "/2017/my-site-redesign-simpler-faster-but-less-user-friendly/";

  // axe's scrollable-region-focusable ignores anything scrolling less
  // than this.
  const AXE_SCROLL_MINIMUM = 13;

  // Attributes, not behavior: Chromium tabs into a scrollable container
  // with no tabindex at all, so a keyboard test passes with it deleted.
  // Firefox and Safari are what the tabindex is for.
  test("the table sits in a named focus stop", async ({ page }) => {
    await page.goto(POST);
    const wrapper = page.locator(".prose .table-wrap");
    await expect(wrapper).toHaveCount(1);

    await expect(wrapper).toHaveAttribute("tabindex", "0");
    await expect(wrapper).toHaveAttribute("role", "group");
    await expect(wrapper).toHaveAttribute("aria-label", "Table");
    await expect(wrapper.locator("table")).toHaveCount(1);
    // A role on the table would replace its table semantics.
    await expect(wrapper.locator("table")).not.toHaveAttribute("role", /.*/);
  });

  test("the wide table overflows far enough for axe to judge it, and passes", async ({
    page,
  }) => {
    // The table fits at both project viewports.
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(POST, { waitUntil: "networkidle" });

    const wrapper = page.locator(".prose .table-wrap");
    const overflow = await wrapper.evaluate(
      (el) => el.scrollWidth - el.clientWidth,
    );
    expect(overflow).toBeGreaterThan(AXE_SCROLL_MINIMUM);
    expect((await runAxe(page)).violations).toEqual([]);

    // scrollWidth exceeds clientWidth under overflow: visible too, where
    // nothing scrolls.
    await wrapper.evaluate((el) => {
      el.scrollLeft = 40;
    });
    expect(await wrapper.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  });
});
