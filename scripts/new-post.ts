// Creates a blog post from stubs/post.md. Run as: make post TITLE="..."

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

const title = process.argv[2]?.trim();
if (!title) {
  fail('usage: make post TITLE="My Post Title"');
}

const slug = title
  .toLowerCase()
  .replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
if (!slug) {
  fail(`no slug in "${title}"`);
}

const file = fileURLToPath(
  new URL(`../src/content/blog/${slug}.md`, import.meta.url),
);
if (existsSync(file)) {
  fail(`${file} exists`);
}

// en-CA: Canada writes dates as YYYY-MM-DD. Local time, not UTC.
const date = new Date().toLocaleDateString("en-CA");

// A replacement function inserts the title literally, $& and $1
// included.
const post = readFileSync(new URL("stubs/post.md", import.meta.url), "utf8")
  .replace("{{title}}", () => JSON.stringify(title))
  .replace("{{date}}", date);

writeFileSync(file, post);
process.stdout.write(`${file}\n`);
