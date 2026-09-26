import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect } from "@playwright/test";

function htmlFiles(): string[] {
  return readdirSync("dist", { recursive: true, encoding: "utf8" })
    .filter((path) => path.endsWith(".html"))
    .map((path) => join("dist", path));
}

// Code samples in posts carry hrefs too; they sit inside <pre>.
function internalHrefs(file: string): string[] {
  const html = readFileSync(file, "utf8").replace(/<pre[\s\S]*?<\/pre>/g, "");

  return [...html.matchAll(/href="(\/[^"/][^"]*)"/g)].map(([, href]) => href);
}

// The paths in public/_redirects redirect on purpose.
const intended = readFileSync("public/_redirects", "utf8")
  .split("\n")
  .filter((line) => line.startsWith("/"))
  .map((line) => line.split(/\s+/)[0]);

// The host serves a page only at its slashed URL and answers the bare
// form with a 307.
function fault(href: string): string | null {
  const path = decodeURIComponent(href.split(/[#?]/)[0]);

  if (intended.includes(path)) {
    return null;
  }
  if (path.endsWith("/")) {
    return existsSync(join("dist", path, "index.html")) ? null : "has no page";
  }
  if (/\.[a-z0-9]+$/i.test(path)) {
    return existsSync(join("dist", path)) ? null : "has no file";
  }
  return "redirects";
}

// Read from dist/ rather than visiting pages: the posts hold most of
// the links and the route sweep opens a dozen pages.
test("internal links land on a built page without a redirect", () => {
  const faults = htmlFiles().flatMap((file) =>
    internalHrefs(file)
      .filter((href) => fault(href))
      .map((href) => `${file}: ${href} ${fault(href)}`),
  );

  expect(faults).toEqual([]);
});
