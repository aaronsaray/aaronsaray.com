---
paths:
  - "src/**/*.astro"
  - "src/assets/*.svg"
---

# Astro Templates

* **A template comment is `{/* */}`, never `<!-- -->`.** An HTML
  comment ships in the page; `{/* */}`, the frontmatter, and a bundled
  `<script>` never reach the browser. `<script is:inline>` ships
  verbatim, comments included. The one comment that ships is
  `<!--more-->` in posts: it comes from the markdown, and Aaron keeps
  it.
* **Never `{" "}`.** ESLint fails on it. Prettier writes it when it
  wraps text beside an inline tag inside a `{cond && (...)}`
  expression. Delete it and keep the line break: `compressHTML: true`
  renders the break as a space, and Prettier leaves a break alone.
* **Never paste SVG markup into a template.** An icon is a Tabler file
  in `src/icons/` rendered by `Icon.astro`. The logo is Astro's SVG
  import of `src/assets/logo.svg`. That file ships to the page
  verbatim and renders twice, so it carries no comment and no `id`.
