// In-place transform for src/content/tags/*.md and src/content/pages/*.md.
// Tags: normalize frontmatter to {title, description} and strip the
//   formulaic `# Entries with the tag "<term>"` H1 (verified identical
//   across all 52 — the tag page layout regenerates it from the term,
//   so no prose is lost).
// Pages: normalize frontmatter to {title, description}; resolve the ref
//   shortcode in cv.md. Bodies untouched otherwise.
// Undo with: git restore src/content/tags src/content/pages

import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const ROOT = path.resolve(import.meta.dirname, '..');

function split(src, file) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) throw new Error(`${file}: no frontmatter`);
  return { data: YAML.parse(m[1]), body: src.slice(m[0].length) };
}

function frontmatter(data) {
  return `---\n${YAML.stringify({ title: data.title, description: data.description }).trimEnd()}\n---\n`;
}

// ---- tags ----------------------------------------------------------
const TAGS = path.join(ROOT, 'src/content/tags');
for (const f of fs.readdirSync(TAGS).filter((f) => f.endsWith('.md'))) {
  const term = f.replace(/\.md$/, '');
  const { data, body } = split(fs.readFileSync(path.join(TAGS, f), 'utf8'), f);
  const expected = `# Entries with the tag "${term}"`;
  const lines = body.split('\n');
  const h1 = lines.findIndex((l) => l.startsWith('# '));
  if (h1 === -1 || lines[h1] !== expected) {
    throw new Error(`${f}: H1 not the formulaic heading: ${lines[h1]}`);
  }
  lines.splice(h1, 1);
  fs.writeFileSync(
    path.join(TAGS, f),
    frontmatter(data) + lines.join('\n').replace(/^\n+/, ''),
  );
}
console.log('tags: 52 normalized, formulaic H1s stripped');

// ---- pages ---------------------------------------------------------
const PAGES = path.join(ROOT, 'src/content/pages');
const BLOG = path.join(ROOT, 'src/content/blog');

function permalinkFor(stem) {
  const src = fs.readFileSync(path.join(BLOG, `${stem}.md`), 'utf8');
  const { data } = split(src, stem);
  return `/${String(data.date).slice(0, 4)}/${stem}/`;
}

for (const f of fs.readdirSync(PAGES).filter((f) => f.endsWith('.md'))) {
  const { data, body } = split(fs.readFileSync(path.join(PAGES, f), 'utf8'), f);
  let newBody = body.replace(/\{\{<\s*ref\s+"([^"]+)"\s*>\}\}/g, (_, target) => {
    const stem = target
      .replace(/^\/blog\//, '')
      .replace(/^\//, '')
      .replace(/\.(md|markdown)$/, '');
    const permalink = permalinkFor(stem);
    console.log(`pages/${f}: ref "${target}" -> ${permalink}`);
    return permalink;
  });
  if (/\{\{[<%]/.test(newBody)) throw new Error(`${f}: shortcode remains`);
  fs.writeFileSync(path.join(PAGES, f), frontmatter(data) + newBody);
}
console.log('pages: cv + contact normalized');
