# CLAUDE.md

## What This Project Is

aaronsaray.com — a static [Astro](https://astro.build) site styled with
Tailwind CSS v4, minimal JavaScript, npm, Node pinned via Volta. The
site was rewritten from Hugo in August 2026; the Hugo source now exists
only on `main`, which stays frozen until this branch (`astro-rewrite`)
replaces it.

Commands, authoring instructions, and the working to-do list live in
`README.md` — read it. The to-dos are Aaron's list first, Claude's
second: help with them when asked, don't start them unprompted.

Current status: Aaron is reviewing the whole generated site — every
file, every page in the browser — and rewriting placeholder copy.
Expect him to rework code to his taste.

## Hard Rules

* **URLs never change. Ever.** Blog permalinks are `/:year/:slug/`
  (filename = slug, date's year = year). `.migration/url-contract.txt`
  lists every URL the old site served; `npm run verify` enforces that
  they all still resolve. If verify fails, fix the site, not the
  fixture. The fixture never shrinks.
* **No AI content, ever.** Claude never writes or edits Aaron's
  content (post prose, page copy). Mechanical transforms (frontmatter,
  markup) are fine. If generated text is unavoidable, it must be
  clearly marked as AI-generated — visible marker in the source plus a
  to-do entry in README.md — so Aaron knows to replace it.
* **Minimal JavaScript.** Static output; the default is zero JS on a
  page. Vue islands only when interactivity genuinely requires them.
  Currently the only JS on the site is the inline copy-button script.
* **No search functionality.** No search box, no ⌘K palette.
* **Deploy is deferred.** Target is Cloudflare static output; Aaron
  handles deploy and DNS himself. Do not build deploy tooling until he
  asks.
* **`.DS_Store` files are always mistakes.** If one shows up anywhere
  (disk or index), delete it.

## Building and Verifying

* `npm run verify` (build + URL-contract check + internal link check)
  must be green before declaring any change done.
* **Content-layer cache gotcha:** Astro caches rendered markdown. After
  changing anything in the markdown pipeline (`src/plugins/`, the
  `markdown` options in `astro.config.mjs`), build with
  `npx astro build --force` — a plain build silently serves stale post
  HTML.
* Verify user-facing changes by actually using the site: `npm run
  preview` plus a Playwright smoke pass, not just a green build.

## How the Site Works

* `src/content/` — collections defined in `src/content.config.ts`:
  `blog` (post id = filename verbatim, via a custom `generateId` — do
  not remove it, Astro's default slugifier would corrupt the dotted
  slug), `tags` (per-tag prose), `pages` (cv, contact).
* **Dates are strings end-to-end.** Frontmatter dates are validated
  strings, never coerced to `Date` — timezone math could shift a
  post's URL year. Year is `date.slice(0, 4)`; sorting is
  lexicographic descending.
* `src/pages/` — routes, including hand-rolled RSS feeds (Hugo-parity
  shape: guid = permalink, 10 items) and a hand-rolled `sitemap.xml`.
* `src/plugins/` — the markdown pipeline: Shiki theme + filename-meta
  transformer, code chrome, callouts (`:::callout`), table wrap,
  figures, heading anchors. The code-block DOM shapes must match
  `.design/blog-single.html` exactly — the inline copy script's element
  lookups depend on them.
* `src/lib/` — excerpts (`<!--more-->` split, ~70-word fallback),
  reading time, date formatting, post sorting/pagination, OG image
  lookup, RSS rendering.
* `public/` — served verbatim: `uploads/`, favicons, `_redirects`,
  `_headers`.

## Design Reference

* `DESIGN.md` — the written design decisions. Read it before touching
  anything visual.
* `.design/` — plain-HTML prototypes, the visual reference for the
  built site. Two knowing drifts: subtitles were scrapped (see
  DESIGN.md reversals), and prototype copy is placeholder.

## The `.migration/` Directory

* `url-contract.txt` + `check-url-contract.mjs` + `check-links.mjs` —
  the permanent verify suite (see Hard Rules).
* `migrate*.mjs` are **retired**. They already ran against the content
  in place; running them again would corrupt it. They stay only as a
  record of what the transform did.
* `diff-sample.mjs` compares sample pages against
  `.migration/hugo-baseline/` (gitignored). If the baseline is ever
  lost, rebuild it from a temp worktree of `main` — the Hugo source
  exists only there.
* `report.json` — migration review artifact (missing alts, the
  no-`<!--more-->` post list, restored raw HTML pages).
