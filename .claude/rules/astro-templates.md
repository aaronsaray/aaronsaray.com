---
paths:
  - "src/**/*.astro"
  - "src/assets/*.svg"
---

# Astro Templates

* Inside a `{...}` expression in an `.astro` template a comment is
  `{/* */}`; an HTML comment there breaks Prettier's parser.
* **Never `{" "}`.** ESLint fails on it. Prettier writes it when it
  wraps text beside an inline tag inside a `{cond && (...)}`
  expression. Delete it and keep the line break: `compressHTML: true`
  renders the break as a space, and Prettier leaves a break alone.
* **Never paste SVG markup into a template.** An icon is a Tabler file
  in `src/icons/` rendered by `Icon.astro`. The logo is Astro's SVG
  import of `src/assets/logo.svg`. That file ships to the page
  verbatim and renders twice, so it carries no comment and no `id`.
