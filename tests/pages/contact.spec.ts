import { test, expect } from "@playwright/test";

const ADDRESS = "aaron@aaronsaray.com";

// The page's one defense against harvesters is that the address never
// appears literally in the HTML they fetch.
test("the served HTML never carries the literal address", async ({
  request,
}) => {
  const html = await (await request.get("/contact/")).text();
  expect(html).not.toContain(ADDRESS);
  expect(html).not.toContain("mailto:");
  expect(html).toContain("&#109;&#97;&#105;&#108;&#116;&#111;&#58;");
});

test.describe("rendered", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact/");
  });

  test("the link decodes to the address for a person", async ({ page }) => {
    const link = page.locator('main a[href^="mailto:"]');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute("href", `mailto:${ADDRESS}`);
    // innerText leaves out display: none content, as copying does.
    expect(await link.innerText()).toBe(ADDRESS);
    await expect(link).toHaveAccessibleName(ADDRESS);
  });

  test("the invitation comes before the address in the DOM", async ({
    page,
  }) => {
    const follows = await page.evaluate(() => {
      const invitation = document.querySelector("main .prose p");
      const link = document.querySelector('main a[href^="mailto:"]');
      if (!invitation || !link) {
        throw new Error("missing invitation or link");
      }
      return Boolean(
        invitation.compareDocumentPosition(link) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
    expect(follows).toBe(true);
  });

  // The address cannot wrap, so it is the first thing to overflow.
  test("the address fits its column on one line", async ({ page }) => {
    const { linkRight, columnRight, tops } = await page.evaluate(() => {
      const link = document.querySelector('main a[href^="mailto:"]');
      const column = link?.closest(".prose");
      if (!link || !column) {
        throw new Error("missing link or column");
      }
      return {
        linkRight: link.getBoundingClientRect().right,
        columnRight: column.getBoundingClientRect().right,
        // One rect per text node: the hidden span splits the text.
        tops: [...link.getClientRects()].map((rect) => rect.top),
      };
    });
    expect(linkRight).toBeLessThanOrEqual(columnRight);
    expect(new Set(tops).size).toBe(1);
  });

  test("the address sits on the invitation's first baseline", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "the two columns start at md");
    const [invitation, address] = await page.evaluate(() => {
      const baseline = (el: Element | null) => {
        if (!el) {
          throw new Error("missing element");
        }
        const probe = document.createElement("span");
        probe.style.cssText =
          "display:inline-block;width:0;height:0;vertical-align:baseline";
        el.prepend(probe);
        const top = probe.getBoundingClientRect().top;
        probe.remove();
        return top;
      };
      return [
        baseline(document.querySelector("main .prose p")),
        baseline(document.querySelector('main a[href^="mailto:"]')),
      ];
    });
    expect(address).toBeCloseTo(invitation, 1);
  });
});
