// In-place transform of src/content/blog/*.md from Hugo conventions to
// the Astro canonical schema. Run AFTER the git mv move step. Undo a
// bad run with: git restore src/content/blog
//
// Changes per file:
//   - frontmatter: one canonical YAML style; tag: -> tags:;
//     params.context -> context; slug: dropped (asserted == filename);
//     date kept as the original string (quoted so no parser ever
//     coerces it — the URL year is its first 4 characters)
//   - shortcodes converted (image, filename-header, ref,
//     header-call-out, link, html, youtube)
//   - <!--more--> markers left untouched
//   - one-off content fixes (broken 2012 upload path, .ini fence typo)
//
// Never commits. Writes .migration/report.json for review.

import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const ROOT = path.resolve(import.meta.dirname, "..");
const BLOG = path.join(ROOT, "src/content/blog");

const report = {
  posts: 0,
  missingAlt: [],
  noMoreMarker: [],
  refsResolved: {},
  linkFigures: [],
  thumbLinks: [],
  htmlUnwrapped: [],
  youtube: [],
  callouts: [],
  filenameHeaders: 0,
  oneOffFixes: [],
  errors: [],
};

const files = fs
  .readdirSync(BLOG)
  .filter((f) => f.endsWith(".md"))
  .sort();

// ---- pass 1: frontmatter index (stem -> permalink) ----------------

function splitFrontmatter(src, file) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) throw new Error(`${file}: no frontmatter`);
  return { fmRaw: m[1], body: src.slice(m[0].length) };
}

const parsed = new Map(); // stem -> {data, body}
const permalinks = new Map(); // stem -> /year/stem/

for (const f of files) {
  const stem = f.replace(/\.md$/, "");
  const src = fs.readFileSync(path.join(BLOG, f), "utf8");
  const { fmRaw, body } = splitFrontmatter(src, f);
  const data = YAML.parse(fmRaw);
  if (typeof data.date !== "string") {
    throw new Error(`${f}: date parsed as ${typeof data.date}`);
  }
  parsed.set(stem, { data, body });
  permalinks.set(stem, `/${data.date.slice(0, 4)}/${stem}/`);
}

// ---- shortcode helpers --------------------------------------------

function parseArgs(argString) {
  const args = {};
  for (const m of argString.matchAll(/(\w+)="([^"]*)"/g)) {
    args[m[1]] = m[2];
  }
  return args;
}

function resolveRef(target, stem) {
  let t = target.trim();
  t = t.replace(/^\/blog\//, "").replace(/^\//, "");
  t = t.replace(/\.(md|markdown)$/, "");
  const permalink = permalinks.get(t);
  if (!permalink) {
    report.errors.push(`${stem}: unresolved ref "${target}"`);
    return target;
  }
  report.refsResolved[`${stem}: ${target}`] = permalink;
  return permalink;
}

function transformBody(body, stem) {
  let out = body;

  // paired: header-call-out -> :::callout directive (inner markdown
  // keeps rendering through remark-directive)
  out = out.replace(
    /\{\{<\s*header-call-out\s*>\}\}\r?\n?([\s\S]*?)\r?\n?\{\{<\s*\/header-call-out\s*>\}\}/g,
    (_, inner) => {
      report.callouts.push(stem);
      return `:::callout\n${inner.trim()}\n:::`;
    },
  );

  // paired: link -> figure with linked image + caption
  out = out.replace(
    /\{\{<\s*link\s+([^>]*?)\s*>\}\}\r?\n?([\s\S]*?)\r?\n?\{\{<\s*\/link\s*>\}\}/g,
    (_, argString, inner) => {
      const a = parseArgs(argString);
      const caption = inner.trim();
      report.linkFigures.push({ post: stem, href: a.href, caption });
      const href = encodeURI(a.href ?? "");
      return `<figure><a href="${href}"><img src="${encodeURI(a.img ?? "")}" alt="${a.alt ?? ""}"></a><figcaption>${caption}</figcaption></figure>`;
    },
  );

  // paired: html -> raw passthrough
  out = out.replace(
    /\{\{<\s*html\s*>\}\}\r?\n?([\s\S]*?)\r?\n?\{\{<\s*\/html\s*>\}\}/g,
    (_, inner) => {
      report.htmlUnwrapped.push(stem);
      return inner.trim();
    },
  );

  // image: plain markdown image, or linked thumbnail when thumb differs
  out = out.replace(/\{\{<\s*image\s+([^>]*?)\s*>\}\}/g, (_, argString) => {
    const a = parseArgs(argString);
    if (a.alt === undefined) report.missingAlt.push({ post: stem, src: a.src });
    const alt = a.alt ?? "";
    if (a.thumb && a.thumb !== a.src) {
      report.thumbLinks.push({ post: stem, src: a.src, thumb: a.thumb });
      return `<a href="${encodeURI(a.src)}"><img src="${encodeURI(a.thumb)}" alt="${alt}"></a>`;
    }
    return `![${alt}](${a.src})`;
  });

  // filename-header: merge into the following fence's meta
  out = out.replace(
    /\{\{<\s*filename-header\s+"([^"]+)"\s*>\}\}\s*\n```(\S*)/g,
    (_, filename, lang) => {
      report.filenameHeaders++;
      return `\`\`\`${lang} filename="${filename}"`;
    },
  );

  // ref: resolve to the final absolute permalink
  out = out.replace(/\{\{<\s*ref\s+"([^"]+)"\s*>\}\}/g, (_, target) =>
    resolveRef(target, stem),
  );

  // youtube: privacy-enhanced embed
  out = out.replace(/\{\{<\s*youtube\s+"?([\w-]+)"?\s*>\}\}/g, (_, id) => {
    report.youtube.push(stem);
    return `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" loading="lazy" allowfullscreen></iframe></div>`;
  });

  // one-off content fixes
  if (stem === "site-profile-thebetterbachelor-com") {
    out = out.replace("/uploads/201221.png", "/uploads/2012/2.png");
    report.oneOffFixes.push(
      `${stem}: /uploads/201221.png -> /uploads/2012/2.png`,
    );
  }
  if (stem === "xdebug-and-eclipse-pdt-on-windows-from-start-to-finish") {
    out = out.replace(/^```\.ini$/m, "```ini");
    report.oneOffFixes.push(`${stem}: \`\`\`.ini -> \`\`\`ini`);
  }

  // nothing Hugo-shaped may survive
  if (/\{\{[<%]/.test(out)) {
    report.errors.push(`${stem}: unconverted shortcode remains`);
  }

  return out;
}

// ---- pass 2: rewrite files ----------------------------------------

function buildFrontmatter(data, stem) {
  if (data.slug !== undefined && data.slug !== stem) {
    throw new Error(`${stem}: slug "${data.slug}" differs from filename`);
  }
  const lines = [];
  lines.push(YAML.stringify({ title: data.title }).trimEnd());
  lines.push(`date: "${data.date}"`);
  lines.push(YAML.stringify({ tags: data.tag }).trimEnd());
  if (data.params?.context) {
    lines.push(YAML.stringify({ context: data.params.context }).trimEnd());
  }
  return `---\n${lines.join("\n")}\n---\n`;
}

for (const f of files) {
  const stem = f.replace(/\.md$/, "");
  const { data, body } = parsed.get(stem);

  const known = new Set(["title", "date", "tag", "params", "slug"]);
  for (const key of Object.keys(data)) {
    if (!known.has(key)) report.errors.push(`${stem}: unexpected key "${key}"`);
  }

  if (!body.includes("<!--more-->")) report.noMoreMarker.push(stem);

  const newBody = transformBody(body, stem);
  fs.writeFileSync(path.join(BLOG, f), buildFrontmatter(data, stem) + newBody);
  report.posts++;
}

fs.writeFileSync(
  path.join(ROOT, ".migration/report.json"),
  JSON.stringify(report, null, 2) + "\n",
);

const counts = Object.fromEntries(
  Object.entries(report).map(([k, v]) => [
    k,
    Array.isArray(v)
      ? v.length
      : typeof v === "object"
        ? Object.keys(v).length
        : v,
  ]),
);
console.log(counts);
if (report.errors.length) {
  console.error("ERRORS:", report.errors);
  process.exitCode = 1;
}
