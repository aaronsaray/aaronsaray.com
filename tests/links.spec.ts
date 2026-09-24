import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect } from "@playwright/test";

// The host serves a page only at its slashed URL and answers the bare
// form with a 301. Read from dist/ because the posts hold most of the
// links and the route sweep visits a dozen pages.
test("internal links land without a redirect", () => {
  // The bare paths in public/_redirects exist to redirect: /book is
  // the site's own stable URL for the Amazon page.
  const intended = readFileSync("public/_redirects", "utf8")
    .split("\n")
    .filter((line) => line.startsWith("/"))
    .map((line) => line.split(/\s+/)[0]);
  const faults: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(path);
      } else if (entry.name.endsWith(".html")) {
        check(path);
      }
    }
  };
  const check = (file: string) => {
    const html = readFileSync(file, "utf8");
    for (const [, href] of html.matchAll(/href="(\/[^"/][^"]*)"/g)) {
      const path = href.split(/[#?]/)[0];
      if (
        !path.endsWith("/") &&
        !/\.[a-z0-9]+$/i.test(path) &&
        !intended.includes(path)
      ) {
        faults.push(`${file}: ${href}`);
      }
    }
  };
  walk("dist");
  expect(faults).toEqual([]);
});
