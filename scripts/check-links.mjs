// srcset and content= attributes (og:image) are not checked.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");

function* htmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

const idCache = new Map();
function idsOf(file) {
  let ids = idCache.get(file);
  if (!ids) {
    ids = new Set(
      [...fs.readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map(
        (m) => m[1],
      ),
    );
    idCache.set(file, ids);
  }
  return ids;
}

function targetFile(urlPath) {
  const clean = decodeURIComponent(urlPath);
  return clean.endsWith("/")
    ? path.join(DIST, clean, "index.html")
    : path.join(DIST, clean);
}

// Paths served by Cloudflare redirects rather than files in dist.
const redirected = new Set(
  fs
    .readFileSync(path.join(ROOT, "public/_redirects"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split(/\s+/)[0]),
);

const broken = [];
let checked = 0;

for (const file of htmlFiles(DIST)) {
  // Skip code samples: highlighted code text contains literal,
  // unescaped href="..." sequences that aren't links.
  const html = fs
    .readFileSync(file, "utf8")
    .replace(/<pre[\s\S]*?<\/pre>/g, "");
  const page = "/" + path.relative(DIST, file).replace(/index\.html$/, "");
  // Both quote styles: restored raw HTML in old posts may use single
  // quotes, and a single-quoted broken link should not slip through.
  for (const m of html.matchAll(/\s(?:href|src)=(?:"([^"]+)"|'([^']+)')/g)) {
    // A browser resolves character references before it reads the URL,
    // and /contact/ writes its whole mailto href as them. Undecoded, the
    // "#" in each one also reads as a fragment below.
    const url = (m[1] ?? m[2]).replace(/&#(x[0-9a-f]+|\d+);/gi, (_, ref) =>
      String.fromCodePoint(
        /^x/i.test(ref) ? parseInt(ref.slice(1), 16) : Number(ref),
      ),
    );
    if (/^(https?:|mailto:|javascript:|tel:|data:|#$)/.test(url)) continue;

    let [target, fragment] = url.split("#");
    if (target === "") {
      if (fragment && !idsOf(file).has(fragment)) {
        broken.push(`${page} -> #${fragment} (no such id)`);
      }
      continue;
    }
    if (!target.startsWith("/")) {
      broken.push(`${page} -> ${url} (relative URL)`);
      continue;
    }
    checked++;
    if (redirected.has(target)) continue;
    const dest = targetFile(target);
    if (!fs.existsSync(dest)) {
      broken.push(`${page} -> ${url} (missing)`);
      continue;
    }
    if (fragment && dest.endsWith(".html") && !idsOf(dest).has(fragment)) {
      broken.push(`${page} -> ${url} (no id "${fragment}")`);
    }
  }
}

console.log(`links: ${checked} internal references checked`);

if (broken.length) {
  console.error(`BROKEN (${broken.length}):`);
  for (const b of broken) console.error(`  ${b}`);
  process.exitCode = 1;
}
