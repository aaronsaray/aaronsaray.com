# aaronsaray.com

Source for [AaronSaray.com](https://aaronsaray.com). [Astro](https://astro.build) static site, Tailwind CSS v4.

## Commands

Node is pinned via [Volta](https://volta.sh) (24.x). Package manager is npm.

```shell
npm install
npm run dev           # local dev server
npm run build         # static build to dist/
npm run preview       # serve the built dist/
npm run check         # astro check (TypeScript)
npm run lint          # eslint
npm run lint:fix      # eslint with autofix
npm run format        # prettier, write
npm run format:check  # prettier, check only
npm run verify        # check + build + URL contract + links + lint + format:check
```

`npm run verify` must pass before deploying. It type checks, builds, checks that every historical URL (`.migration/url-contract.txt`) still resolves, that no internal link or heading anchor is broken, and that lint and formatting are clean.

## Tooling

* **ESLint** (`eslint.config.js`): flat config, recommended rule sets only (`@eslint/js`, `typescript-eslint`, `eslint-plugin-astro`), with `eslint-config-prettier` last so no formatting rules fight Prettier. `no-console` allows `warn`/`error`; off entirely for the `.migration/` CLI scripts.
* **Prettier** (`.prettierrc`): pure defaults. Plugins: `prettier-plugin-astro` and `prettier-plugin-tailwindcss` (sorts Tailwind classes; must stay last in the plugin list). Markdown is excluded (`.prettierignore`): `markdownlint-cli2` owns markdown, and `src/content/` is never touched by tooling at all.
* **astro check** (`@astrojs/check`): TypeScript checking for `.astro` and `.ts`, strict preset. TypeScript is pinned to 5.x; the checker does not support TypeScript 7 yet.
* Note for `.astro` templates: HTML comments (`<!-- -->`) are fine in plain markup but break Prettier's parser inside `{...}` expressions. Use `{/* */}` there (bonus: those are stripped from the built HTML).
* **npm hardening** (`.npmrc`, committed):
  * `min-release-age=7` refuses package versions published less than 7 days ago (most malicious releases are yanked within hours, so a cooldown skips the blast window). Needs npm >= 11.10; the Volta pin covers that. Older npm silently ignores it.
  * `ignore-scripts=true` blocks dependency lifecycle scripts (preinstall/postinstall), the main malware delivery mechanism. `npm run <script>` still works. If a future dep genuinely needs its install script, that is a deliberate decision, not a default.
  * `save-exact=true` pins new deps to exact versions; all current deps are exact-pinned and `package-lock.json` is committed.
* **markdownlint** (`.markdownlint-cli2.jsonc`): `npm run lint:md`, also
  part of `verify`. `markdownlint-cli2` is a devDependency and the config
  (globs included) is in the repo, so no global install or home-directory
  config is involved. It lints the doc markdown (README, CLAUDE);
  `src/content/` is ignored, same policy as the other tooling.
* **AI tooling** is declared in the repo so a fresh clone reconstructs it:
  * `.mcp.json` (committed): the official Astro Docs MCP server (remote
    HTTP, no auth) and the Playwright MCP for browser smoke passes. The
    Playwright entry's browser config is `.claude/playwright-mcp-config.json`.
  * `.claude/settings.json` (committed): pre-approves those MCP servers
    and declares the `modern-web-guidance` plugin (Google Chrome's
    marketplace). Plugins are not auto-installed from a clone; Claude Code
    surfaces the one `claude plugin install` command to run.
  * `.claude/settings.local.json` is gitignored: personal overrides only.
* Node and npm are pinned in `package.json` under `volta`.

## Writing a Blog Post

Create `src/content/blog/my-slug-here.md`:

```markdown
---
title: My Post Title
date: "2026-08-27T09:00:00-05:00"
tags:
  - php
draft: true
---
Intro paragraph. Everything above the marker is the excerpt shown on
lists, in feeds, and as the meta description.

<!--more-->

The rest of the post.
```

* The filename is the URL slug and the date's year is the URL path: `/2026/my-slug-here/`. Never change either after publishing.
* `date` stays a quoted string. Date-only (`"2026-08-27"`) works too.
* At least one tag. A tag needs a matching file in `src/content/tags/` for its landing page. New tag: add `src/content/tags/<term>.md` with `title`/`description` frontmatter and a prose body.
* `draft: true` keeps the post out of every build. Remove it to publish.
* Posts older than ~18 months show a "technology changes" notice, except evergreen essays: posts whose tags are all in the evergreen set (`management`, `business`, `ideas`; see `src/lib/evergreen.ts`). Optional `evergreen: true`/`false` frontmatter overrides the tag-based default either way.
* Body headers start at H2. The post title is the H1.
* Optional `context:` (list of strings) renders the "Context:" pills under the meta line.

### Formatting

* `<!--more-->` splits the excerpt from the body. Without it, the first ~70 words are used.
* Code fence with a filename header:

  ````markdown
  ```php filename="app/Models/User.php"
  class User {}
  ```
  ````

* Callout box:

  ```markdown
  :::callout
  Editorial note about this entry, not part of it.
  :::
  ```

* Link to another post by its final URL (`/2023/some-slug/`). The link checker in verify catches typos.
* Images are plain markdown: `![Alt Text](/uploads/2026/file.png)`. A lone image renders as a framed figure. Thumbnail linking to a full asset: `<a href="/uploads/2026/full.pdf"><img src="/uploads/2026/thumb.jpg" alt="Alt Text"></a>`.
* YouTube: `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/VIDEOID" title="YouTube video" loading="lazy" allowfullscreen></iframe></div>`

## Layout

* `src/content/blog/` is the posts, `src/content/tags/` is per-tag prose, `src/content/pages/` is the cv and contact bodies.
* `src/pages/` is the routes, including hand-rolled RSS feeds (`/blog/index.xml`, per-tag) and `sitemap.xml`.
* `src/plugins/` is the markdown pipeline (code chrome, callouts, figures, heading anchors, Shiki theme).
* `public/` is static files served verbatim (`uploads/`, favicons, `_redirects`, `_headers`).
* `.migration/` is the URL contract fixture and verify scripts. `url-contract.txt` lists every URL the old site served; it never shrinks.

## URL Contract

Blog permalinks are `/:year/:slug/`. Every URL the Hugo site ever served must keep resolving. `npm run verify` enforces this. If it fails, fix the site, not the fixture.

## To-Do

Remaining tail of the rewrite, roughly in order. Delete items as they finish.

* [ ] Stamp `width`/`height` attributes on content images (the remaining CLS gap; they currently reflow the article as they load). Mechanical rehype transform, but needs a build-time image dimension probe first: decide on the `image-size` npm package or similar.
* [ ] Home page concept ("productive tension"): replace the two middle sections (belief grid and "How I can help") with one connected editorial system instead of rewriting each in place. Rewriting them separately preserves their disconnect: slogans followed by a service menu. The replacement shows what Aaron thinks and how that thinking informs the work, since his distinctive value is operating between competing concerns (code and business, developers and managers, speed and durability, confidence and humility, conflict and cohesion).
  * Promising form: paired rows. Each row holds a real tension Aaron has written about, the existing essay that argues it, and the part of the practice it informs (programming, coaching, technical leadership, business advising). Two poles on either side of a thin accent seam (borrowing the blue and off-white relationship in the AS mark), stacking cleanly on small screens. Composition stays static: the interest comes from the connection, not motion. The seam is a candidate for the site-wide "selected/active" motif (see the active-nav item) and may extend to curated topic pages, but should not be forced into every component or explained literally in copy.
  * Build the first version from existing essays, no new writing required. Candidates to compare (pick roughly three or four): Solving the Problem, Not the Solution (2011); Developer Time vs Manager Time (2020); Engineering Managers Must Embrace Conflict (2021); Have Informed Opinions (2019); How Writing Good-Quality Code Reduces Expenses (2017); 3 Reasons to Stop Calling Your Dev Team a Family (2021); Self Reflection as a Manager (2023).
  * Process: sketch two or three low-fidelity structures using real titles and excerpts, review with Aaron before writing page copy or deeply refactoring components. The hero stays visually spare with room for one Aaron-written positioning sentence beneath the broad promise (never generated).
* [ ] Rewrite all AI-generated placeholder copy (each marked with an AI-GENERATED comment in source):
  * `/books/` (`src/pages/books.astro`)
  * `/who-am-i/` (`src/pages/who-am-i.astro`)
  * blog index intro line (`src/pages/blog/index.astro` and `src/pages/blog/page/[num].astro`)
  * home page copy sections (`src/pages/index.astro`); note the two middle sections are slated for wholesale replacement, see the home-page concept item above
  * footer CTA box (`src/components/Footer.astro`)
* [ ] Curated topic landings for the subjects that define the current direction, starting with `/tag/management/` and possibly `/tag/business/`. Keep the permanent URL and the complete chronological list, but lead with a direct topic title, Aaron's intro prose (already in `src/content/tags/`), and a small set of selected foundational essays, with the full list beneath and a pointer to an adjacent topic where useful. Decide the authoring model first: optional frontmatter on the tag file declaring a featured set (stable post IDs, fail loudly on a bad reference, understandable months later) versus a small explicit config in the template. Ordinary tags stay untouched; not every tag becomes a magazine.
* [ ] CV information design (`src/pages/cv.astro`): the page currently reads as one long prose column; the programmer-to-manager-to-business arc is hard to scan. Keep the single markdown source (`src/content/pages/cv.md`): adding a role, talk, or credential must never require duplicated data or a custom component tree. Investigate: frontmatter title as the page title with the descriptive opening as intro content (needs Aaron's approval), a build-time section index from Astro's rendered heading data, stronger section spacing and typographic hierarchy, a repeatable visual rhythm for work-history entries derived from the markdown structure already present, and on wide screens a quiet section rail or two-column layout (single column on narrow). CSS and mechanical markdown only, no client JS. If the markdown is too irregular, propose the smallest one-time cleanup and show the authoring convention before applying it.
* [ ] Footer colophon rework (`src/components/Footer.astro`): the current footer (two CTA boxes, repeated logo, four link columns) reads as a SaaS sitemap and competes with the editorial character above it. Aim for a signature at the end of a personal site: one clear path to contact or writing instead of two promotional panels, a much darker "stamped" logo treatment, licensing and RSS present but quiet. The link inventory now also lives on `/who-am-i/`; once the keep-list is confirmed, drop the duplicated columns here, retaining only the few professional projects that merit persistent visibility (Mastering Laravel and the No Compromises podcast are the candidates).
* [ ] Active-section state in the header nav: About active for its child pages, Writing for blog/books, Contact for itself. Subtle treatment fitting the system (full-opacity text + accent chevron, short accent underline, or a 1px accent stroke; consider making one 1px accent motif the site-wide "selected/active" language). Add `aria-current="page"` on the current page's link; derive state from `Astro.url.pathname` without duplicating route knowledge.
* [ ] Explore the cross-document page fade. The browser-default 250ms crossfade double-exposes pages (the home hero visibly ghosts behind the blog list). Prototype CSS-only variants: a quicker ~150ms crossfade, and a fade through `--color-night` (old page out ~100ms, new page in ~120ms), sequential vs. slightly overlapping. Judge home-to-blog and blog-to-post mid-transition, not from screenshots. Keep the reduced-motion suppression.
* [ ] Maybe generate `/images/tag/twitter.jpg`. It is the one tag without an OG image, so those posts fall back to the default og-image. Creating it restores the simple per-tag rule everywhere.
* [ ] Decide the long-term OG image approach. Current rule is Hugo's: per-first-tag jpg, else `/images/og-image.png`. Generated OG images are an option.
* [ ] Fast broken link/image scan as a permanent build step. The `.migration` checkers work but were built for migration acceptance; want something fast in the regular build (promote/rewrite the scripts, or a dedicated tool, undecided).
* [ ] Lighthouse and other quality checks (performance, accessibility, SEO). Scope and tooling undecided.
* [ ] Review `.migration/known-rot.txt`: 25 internal links in old posts that were already broken on the Hugo site. Non-fatal in verify; decide which are worth fixing in the prose.
* [ ] 22 posts have no `<!--more-->` marker and use the auto ~70-word excerpt. List in `.migration/report.json` under `noMoreMarker`. Leaving them auto for now; add markers later if it bothers.
* [ ] While browsing the full archive, flag mixed-tag essays that deserve `evergreen: true` frontmatter (suppresses the old-post technology notice; policy and tag set in `src/lib/evergreen.ts`, four example overrides already set). Roughly 36 remaining posts mix an evergreen tag with a technical one and default to showing the notice.
* [ ] Full review of the generated site: every file, every page in the local browser.
* [ ] Deploy: Cloudflare static, handled alongside migrating hosting/DNS off the current setup. Last; no deploy tooling until then. At that point, build out `public/_headers` with the standard security set (nosniff, frame-ancestors, Referrer-Policy, Permissions-Policy, HSTS ramp-up); any CSP must allow the inline copy script by sha256 hash, not `unsafe-inline`.
