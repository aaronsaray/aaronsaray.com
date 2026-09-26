import { test, expect } from "@playwright/test";

const FEEDS = [
  { name: "blog feed", path: "/blog/index.xml", title: "Aaron Saray" },
  {
    name: "per-tag feed",
    path: "/tag/php/index.xml",
    title: '"php" entries | Aaron Saray',
  },
  { name: "sitemap", path: "/sitemap.xml", title: null },
];

for (const { name, path, title } of FEEDS) {
  test(`${name} is served as well-formed XML under its title`, async ({
    page,
    request,
  }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");

    // Node has no XML parser, so the blank page's is borrowed.
    const parsed = await page.evaluate(
      (xml) => {
        const doc = new DOMParser().parseFromString(xml, "application/xml");
        const text = (selector: string) =>
          doc.querySelector(selector)?.textContent ?? null;
        return { error: text("parsererror"), title: text("channel > title") };
      },
      await response.text(),
    );
    expect(parsed.error).toBeNull();
    expect(parsed.title).toBe(title);
  });
}
