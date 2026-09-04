# aaronsaray.com

Source for [AaronSaray.com](https://aaronsaray.com). [Astro](https://astro.build) static site, Tailwind CSS v4.

## Commands

Node is pinned via [Volta](https://volta.sh) (24.x). Package manager is npm.

```shell
npm install
npx playwright install chromium   # browsers; .npmrc blocks install scripts
npm run dev           # local dev server
npm run build         # static build to dist/
npm run preview       # serve the built dist/
npm run check         # astro check (TypeScript)
npm run lint          # eslint + prettier check + markdownlint
npm run lint:fix      # all three, with autofix
npm run format        # prettier, write
npm run test          # both playwright projects, boots its own dev server
npm run test:e2e      # behavior only
npm run test:a11y     # axe sweep only
npm run verify        # check + build + URL contract + links + lint + tests
```

`npm run verify` must pass before deploying. It type checks, builds, checks that every historical URL (`scripts/url-contract.txt`) still resolves, that no internal link or heading anchor is broken, that lint and formatting are clean, and that the browser tests pass. It runs in about 13 seconds.

New checks belong inside `verify` rather than alongside it: one command is the whole point. The GitHub Actions workflow runs `npm run verify` and nothing else.

## Tooling

* **`npm run lint`** is the umbrella: ESLint, then Prettier's check, then markdownlint. `npm run lint:fix` fixes all three (it rewrites this file and `CLAUDE.md`, since markdownlint owns the docs). The individual steps stay available as `lint:js`, `lint:format`, and `lint:md`. Prettier deliberately runs as its own step rather than through `eslint-plugin-prettier`, which is slow, reports every formatting difference as a lint error, and muddles the two kinds of autofix; `eslint-config-prettier` plus a separate run is the arrangement Prettier itself recommends.
* **ESLint** (`eslint.config.js`): flat config, recommended rule sets only (`@eslint/js`, `typescript-eslint`, `eslint-plugin-astro`), with `eslint-config-prettier` last so no formatting rules fight Prettier. `no-console` allows `warn`/`error`; off entirely for the `scripts/` CLI scripts.
* **Prettier** (`.prettierrc`): no style overrides, plugin config only. Plugins: `prettier-plugin-astro` and `prettier-plugin-tailwindcss` (sorts Tailwind classes; must stay last in the plugin list). Markdown is excluded (`.prettierignore`): `markdownlint-cli2` owns markdown, and `src/content/` is never touched by tooling at all.
* **astro check** (`@astrojs/check`): TypeScript checking for `.astro` and `.ts`, strict preset. TypeScript is pinned to 5.x; the checker does not support TypeScript 7 yet.
* Note for `.astro` templates: HTML comments (`<!-- -->`) are fine in plain markup but break Prettier's parser inside `{...}` expressions. Use `{/* */}` there (bonus: those are stripped from the built HTML).
* **npm hardening** (`.npmrc`, committed):
  * `min-release-age=7` refuses package versions published less than 7 days ago (most malicious releases are yanked within hours, so a cooldown skips the blast window). Needs npm >= 11.10, which the Volta pin satisfies locally; older npm silently ignores the setting. It is a local-development control: it filters which version the resolver may pick during `npm install` or `npm update`, and `npm ci` resolves nothing, installing the exact versions already in `package-lock.json`. So CI never applies the cooldown and can never install anything newer than what was vetted here. CI also does not read the `volta.npm` pin (`setup-node` reads `volta.node` only, and Volta is not on the runner), so its npm is whatever ships with that Node release.
  * `ignore-scripts=true` blocks dependency lifecycle scripts (preinstall/postinstall), the main malware delivery mechanism. `npm run <script>` still works. If a future dep genuinely needs its install script, that is a deliberate decision, not a default.
  * `save-exact=true` pins new deps to exact versions; all current deps are exact-pinned and `package-lock.json` is committed.
* **markdownlint** (`.markdownlint-cli2.jsonc`): `npm run lint:md`, also
  part of `verify`. `markdownlint-cli2` is a devDependency and the config
  (globs included) is in the repo, so no global install or home-directory
  config is involved. It lints the doc markdown (README, CLAUDE);
  `src/content/` is ignored, same policy as the other tooling.
* **Playwright** (`playwright.config.ts`): Chromium-only, two projects,
  both part of `verify`. `e2e` (`tests/e2e/`) is behavior; `a11y`
  (`tests/a11y/`) is the axe sweep. Either runs alone
  (`npm run test:e2e`, `npm run test:a11y`) for a faster loop while
  iterating, but both gate a commit: the contrast bugs this suite first
  caught came from a component change, not a redesign, so running a11y
  only when the design changes would have missed them.
  The `webServer` block starts its own dev server on port 4321 and stops
  it afterward, so no build is required and nothing needs to be running
  first. If anything already answers on 4321 the run stops with a port
  error instead of testing whatever is there, so stop a stray dev server
  before running the suite (`npx astro dev stop` if it daemonized
  itself).
  Coverage is layered: `pages.spec.ts` loads one page per route template
  and asserts a single `h1`, then `copy-button.spec.ts`, `header.spec.ts`,
  and `feeds.spec.ts` cover specific behavior. Both projects read the
  route table from `tests/routes.ts`, so adding a page there covers it in
  each. The 707 posts and 52 tags are
  deliberately not enumerated: the URL contract check already proves all
  1681 paths resolve, so these prove each template renders. Because
  `.npmrc` blocks install scripts, browsers need an explicit
  `npx playwright install chromium`. CI adds `--only-shell` to that
  command, skipping the headed build it cannot use; locally the full
  browser is worth having for headed debugging.
* **axe-core** (`tests/a11y/axe.spec.ts`, via `@axe-core/playwright`):
  runs the WCAG 2.0/2.1/2.2 A and AA rules against every route in the
  table. It catches a well-defined minority of accessibility problems,
  weighted toward the mechanical ones: contrast, accessible names, ARIA
  validity, heading order, duplicate ids. It cannot judge whether alt
  text is meaningful, whether focus order makes sense, or whether a
  screen reader narrates a widget coherently, so a green run is a floor
  and not a clean bill of health. The known gap is in
  `NavItem.astro`: a CSS-only menu has no live `aria-expanded` and no
  Escape-to-close, and axe passes it regardless.
  The spec asserts on `violations` and on `incomplete` separately.
  Incomplete means axe could not decide, most often because text sits on
  a gradient it cannot sample; those never appear in `violations`, so
  asserting only on violations would pass an unreadable element
  silently. The three header items over the veil are the known set,
  measured by hand at 6.09:1 against the veil's `#101213` top band.
  Anything else landing in incomplete fails the run until someone
  measures it too.
* **GitHub Actions** (`.github/workflows/ci.yml`): runs `npm run verify` on
  push, nothing more. Node comes from the `volta.node` pin via
  `node-version-file`, so the version is not duplicated (`volta.npm` is
  not read: `setup-node` looks only at `volta.node`, and Volta is not on
  the runner). It installs the browser explicitly for the
  `ignore-scripts` reason above, and on a failed run uploads the
  Playwright report along with the traces that make it diagnosable.
  Actions are pinned to full commit SHAs with the version in a trailing
  comment, because a git tag is a mutable pointer that an attacker who
  compromises an action's repo can repoint; bumping one means replacing
  both the SHA and the comment.
* **AI tooling** is declared in the repo so a fresh clone reconstructs it:
  * `.mcp.json` (committed): the official Astro Docs MCP server (remote
    HTTP, no auth) and the Playwright MCP for interactive browsing. That
    MCP server is unrelated to the `@playwright/test` devDependency that
    powers `verify`. The Playwright entry's browser config is
    `.claude/playwright-mcp-config.json`.
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
* At least one tag. A tag needs a matching file in `src/content/tags/` for its landing page. New tag: add `src/content/tags/<term>.md` with `title`/`description` frontmatter and a prose body, and a 1200x630 `public/images/tag/<term>.jpg` for the social card.
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
* Images are plain markdown: `![Alt Text](/uploads/2026/file.png)`. A lone image renders as a framed figure. Click-to-open: `[![Alt Text](/uploads/2026/file.png)](/uploads/2026/file.png)`, where the target can also be a document. A caption is its own paragraph below the image.
* Image `width`/`height` are never authored. `rehype-img-attrs` reads every local image at build (through Astro's own `imageMetadata` helper, so no extra dependency) and stamps its real dimensions, so a new image needs nothing beyond the markdown above. Reserving the box is what stops the article reflowing as images load.
* YouTube: `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/VIDEOID" title="YouTube video" loading="lazy" allowfullscreen></iframe></div>`

## Layout

* `src/content/blog/` is the posts, `src/content/tags/` is per-tag prose, `src/content/pages/` is the cv and contact bodies.
* `src/pages/` is the routes, including hand-rolled RSS feeds (`/blog/index.xml`, per-tag) and `sitemap.xml`.
* `src/plugins/` is the markdown pipeline (code chrome, callouts, figures, heading anchors, image attributes, Shiki theme).
* `src/icons/` is the Tabler icon set, one SVG per name. Templates render one with `<Icon name="arrow-right" class="size-4" strokeWidth={1.5} />` (`src/components/Icon.astro`); the markdown plugins read the same files through `src/lib/icon.mjs`. Both emit inline `currentColor` SVG so icons take text color tokens and hover transitions. Adding an icon is dropping the Tabler file into the folder.
* `public/` is static files served verbatim (`uploads/`, favicons, `_redirects`, `_headers`).
* `scripts/` is the verify checkers and their fixtures. `url-contract.txt` lists every page, feed, and document URL the site has ever served; it never shrinks.
* `tests/` is the Playwright suite: `e2e/` for behavior, `a11y/` for the axe sweep, `routes.ts` for the route table both read.

## URL Contract

Blog permalinks are `/:year/:slug/`. Every page, feed, and document URL the Hugo site ever served must keep resolving; images are not part of the contract. `npm run verify` enforces this. If it fails, fix the site, not the fixture.

## To-Do

Remaining tail of the rewrite, roughly in order. Delete items as they finish.

### Design

* [ ] Curated topic landings for the subjects that define the current direction, starting with `/tag/management/` and possibly `/tag/business/`. (archived projects maybe too) Keep the permanent URL and the complete chronological list, but lead with a direct topic title, Aaron's intro prose (already in `src/content/tags/`), and a small set of selected foundational essays, with the full list beneath and a pointer to an adjacent topic where useful. Decide the authoring model first: optional frontmatter on the tag file declaring a featured set (stable post IDs, fail loudly on a bad reference, understandable months later) versus a small explicit config in the template. Ordinary tags stay untouched; not every tag becomes a magazine.
* [ ] CV information design (`src/pages/cv.astro`): the page currently reads as one long prose column; the programmer-to-manager-to-business arc is hard to scan. Keep the single markdown source (`src/content/pages/cv.md`): adding a role, talk, or credential must never require duplicated data or a custom component tree. Investigate: frontmatter title as the page title with the descriptive opening as intro content (needs Aaron's approval), a build-time section index from Astro's rendered heading data, stronger section spacing and typographic hierarchy, a repeatable visual rhythm for work-history entries derived from the markdown structure already present, and on wide screens a quiet section rail or two-column layout (single column on narrow). CSS and mechanical markdown only, no client JS. If the markdown is too irregular, propose the smallest one-time cleanup and show the authoring convention before applying it.
* [ ] Footer colophon rework (`src/components/Footer.astro`): the current footer (two CTA boxes, repeated logo, four link columns) reads as a SaaS sitemap and competes with the editorial character above it. Aim for a signature at the end of a personal site: one clear path to contact or writing instead of two promotional panels, a much darker "stamped" logo treatment, licensing and RSS present but quiet. The link inventory now also lives on `/who-am-i/`; once the keep-list is confirmed, drop the duplicated columns here, retaining only the few professional projects that merit persistent visibility (Mastering Laravel and the No Compromises podcast are the candidates).

### Writing

* [ ] Rewrite all AI-generated placeholder copy (each marked with an AI-GENERATED comment in source):
  * `/books/` (`src/pages/books.astro`)
  * `/who-am-i/` (`src/pages/who-am-i.astro`)
  * blog index intro line (`src/pages/blog/index.astro` and `src/pages/blog/page/[num].astro`)
  * home page title, description, and the three role rows (`src/pages/index.astro`)
  * the CTO draft post (`src/content/blog/the-cto-is-a-communicator-first.md`), written from Aaron's outline and linked from the home page
  * the reinventing-the-wheel draft post (`src/content/blog/reinventing-the-wheel-is-how-you-learn.md`), written from Aaron's notes
  * footer CTA box (`src/components/Footer.astro`)
* [ ] blog entry about why i'm starting to love parallel test - and yes i'm behind but it's not for just no reason - i just want to have a reason - and before I didn't - but that was a specific tpe of confidence

### Review

* [ ] While browsing the full archive, flag mixed-tag essays that deserve `evergreen: true` frontmatter (suppresses the old-post technology notice; policy and tag set in `src/lib/evergreen.ts`, four example overrides already set). Roughly 33 remaining posts mix an evergreen tag with a technical one and default to showing the notice.
* [ ] Review `scripts/known-rot.txt`: 25 internal links in old posts that were already broken on the Hugo site. Non-fatal in verify; decide which are worth fixing in the prose.
* [ ] Performance and SEO checks. Accessibility is covered by the axe project in `tests/a11y/`; these two are not. Lighthouse is the obvious candidate but Lighthouse CI is a poor bet: `@lhci/cli` has not shipped since June 2025, pins Lighthouse 12 against a current 13, and its Lighthouse 13 support issue has sat unanswered since April 2026. Running Lighthouse by hand from DevTools may be enough for a static site this size.
* [ ] Full review of the generated site: every file, every page in the local browser.
* [ ] Deploy: Cloudflare static, handled alongside migrating hosting/DNS off the current setup. Last; no deploy tooling until then. At that point, build out `public/_headers` with the standard security set (nosniff, frame-ancestors, Referrer-Policy, Permissions-Policy, HSTS ramp-up); any CSP must allow the inline copy script by sha256 hash, not `unsafe-inline`.
