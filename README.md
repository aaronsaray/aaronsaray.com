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
* `.design/` is the HTML design prototypes (visual reference).
* `.migration/` is the URL contract fixture and verify scripts. `url-contract.txt` lists every URL the old site served; it never shrinks.

## URL Contract

Blog permalinks are `/:year/:slug/`. Every URL the Hugo site ever served must keep resolving. `npm run verify` enforces this. If it fails, fix the site, not the fixture.

## To-Do

Remaining tail of the rewrite, roughly in order. Delete items as they finish.

* [ ] Full review of the generated site: every file, every page in the local browser.
* [ ] Rewrite all AI-generated placeholder copy (each marked with an AI-GENERATED comment in source):
  * `/books/` (`src/pages/books.astro`)
  * `/who-am-i/` (`src/pages/who-am-i.astro`)
  * blog index intro line (`src/pages/blog/index.astro` and `src/pages/blog/page/[num].astro`)
  * home page copy sections (`src/pages/index.astro`)
  * footer CTA box (`src/components/Footer.astro`)
* [ ] Review `.migration/known-rot.txt`: 25 internal links in old posts that were already broken on the Hugo site. Non-fatal in verify; decide which are worth fixing in the prose.
* [ ] 22 posts have no `<!--more-->` marker and use the auto ~70-word excerpt. List in `.migration/report.json` under `noMoreMarker`. Leaving them auto for now; add markers later if it bothers.
* [ ] Maybe generate `/images/tag/twitter.jpg`. It is the one tag without an OG image, so those posts fall back to the default og-image. Creating it restores the simple per-tag rule everywhere.
* [ ] Decide the long-term OG image approach. Current rule is Hugo's: per-first-tag jpg, else `/images/og-image.png`. Generated OG images are an option.
* [ ] Self-host the Google Fonts: Inter + Fraunces woff2 files in `public/fonts/`, `@font-face` + preload in the head, drop the third-party stylesheet and preconnects. Add size-adjusted fallback font metrics in the same pass (kills the swap layout shift). Wins: biggest perf lever on the site (render-blocking cross-origin CSS in front of a text LCP), removes the only third-party request (privacy).
* [ ] Contrast pass on `ink-faint` (#5d646d) used as a text color: fails WCAG AA (3.3:1 on night) on post meta lines, pagination, footer labels, code-block chrome, and the Shiki comment token (`src/plugins/shiki-theme.mjs`). Also the scrollbar thumb (1.5:1 against its track). Keep ink-faint for decorative strokes; pick a brighter token for text roles during the design rework (a starting point: `#727a84`, about 4.6:1 on night).
* [ ] Explore the cross-document page fade. The browser-default 250ms crossfade double-exposes pages (the home hero visibly ghosts behind the blog list). Prototype CSS-only variants: a quicker ~150ms crossfade, and a fade through `--color-night` (old page out ~100ms, new page in ~120ms), sequential vs. slightly overlapping. Judge home-to-blog and blog-to-post mid-transition, not from screenshots. Keep the reduced-motion suppression.
* [ ] Active-section state in the header nav: About active for its child pages, Writing for blog/books, Contact for itself. Subtle treatment fitting the system (full-opacity text + accent chevron, short accent underline, or a 1px accent stroke; consider making one 1px accent motif the site-wide "selected/active" language). Add `aria-current="page"` on the current page's link; derive state from `Astro.url.pathname` without duplicating route knowledge.
* [ ] Stamp `width`/`height` attributes on content images (the remaining CLS gap; they currently reflow the article as they load). Mechanical rehype transform, but needs a build-time image dimension probe first: decide on the `image-size` npm package or similar.
* [ ] Fast broken link/image scan as a permanent build step. The `.migration` checkers work but were built for migration acceptance; want something fast in the regular build (promote/rewrite the scripts, or a dedicated tool, undecided).
* [ ] Lighthouse and other quality checks (performance, accessibility, SEO). Scope and tooling undecided.
* [ ] Integrate Astro's MCP server into the AI tooling (project `.mcp.json`) so Claude sessions get first-party Astro docs.
* [ ] Deploy: Cloudflare static, handled alongside migrating hosting/DNS off the current setup. Last; no deploy tooling until then. At that point, build out `public/_headers` with the standard security set (nosniff, frame-ancestors, Referrer-Policy, Permissions-Policy, HSTS ramp-up); any CSP must allow the inline copy script by sha256 hash, not `unsafe-inline`.
