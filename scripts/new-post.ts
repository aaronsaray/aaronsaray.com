import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const title = process.argv[2]?.trim();
if (!title) {
  process.stderr.write('usage: make post TITLE="My Post Title"\n');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
if (!slug) {
  process.stderr.write(`no slug in "${title}"\n`);
  process.exit(1);
}

const file = fileURLToPath(
  new URL(`../src/content/blog/${slug}.md`, import.meta.url),
);
if (existsSync(file)) {
  process.stderr.write(`${file} exists\n`);
  process.exit(1);
}

// en-CA formats as YYYY-MM-DD in local time.
const date = new Date().toLocaleDateString("en-CA");

// A replacement function inserts the title literally, $& and $1
// included.
const post = readFileSync(new URL("stubs/post.md", import.meta.url), "utf8")
  .replace("{{title}}", () => JSON.stringify(title))
  .replace("{{date}}", date);

writeFileSync(file, post);
process.stdout.write(`${file}\n`);
