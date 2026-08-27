# CLAUDE.md

> **This is a living document.** We are in the redesign phase of a full site
> rewrite. Expect this file to change often — sometimes multiple times per
> session. When guidance here conflicts with something decided in
> conversation, ask; then update this file to match.

## What This Project Is

aaronsaray.com — currently a Hugo site, being completely rewritten in
**Astro** with a **full redesign**. This is not a port of the current look;
the design is being built fresh. The Hugo site is the *content source and
reference*, not the target.

Current phase: **build — verification done, awaiting Aaron's full
review.** The Astro site is implemented at the repo root (Phases 0–6 of
the migration plan): all content migrated, markdown pipeline, all
routes, feeds, sitemap, and the verify suite (`npm run verify`) is
green — URL contract 1681/1681, zero broken internal links.

Remaining steps, in order:

1. **Hugo cleanup + docs restructure** (next Claude task, its own
   commit): delete the Hugo remnants (`content/`, `themes/`,
   `archetypes/`, `config.toml`, `netlify.toml`, `resources/` if
   present), then restructure the docs: move all to-dos out of
   CLAUDE.md into README.md (the to-do list is for humans first, AI
   second), and rewrite CLAUDE.md as **current state only** — how the
   site works and how Claude should behave in it, no migration
   narrative.
2. **Aaron's full review** (days, separate sessions): every generated
   file, every page in the local browser, rewriting placeholder copy.
   Expect him to rework code to his taste — that's the point.
3. **Deploy — explicitly deferred.** Target is still Cloudflare static,
   but Aaron will handle it later alongside migrating hosting/DNS off
   the current setup. Do not build deploy tooling until he asks.

Build caveats:

* Astro's content layer caches rendered markdown. After changing
  anything in the markdown pipeline (`src/plugins/`,
  `astro.config.mjs` markdown options), use `npx astro build --force`
  — a plain build will silently serve stale post HTML.
* The `.migration/migrate*.mjs` scripts are **retired**. They already
  ran against the content in place; running them again would corrupt
  it. They stay only as a record of what the transform did.
* `.migration/hugo-baseline/` (gitignored) is the Hugo build used by
  `diff-sample.mjs`. If it's ever lost, rebuild it from a temp
  worktree of frozen `main` — after cleanup, the Hugo source exists
  only on `main`.

Build caveat: Astro's content layer caches rendered markdown. After
changing anything in the markdown pipeline (`src/plugins/`,
`astro.config.mjs` markdown options), use `npx astro build --force` —
a plain build will silently serve stale post HTML.

## Hard Constraints

* **URLs never change. Ever.** Blog permalinks are `/:year/:filename/`
  (see `config.toml`). Every existing URL must resolve identically in the
  new site. This is non-negotiable.
* **All content migrates.** All 707 blog posts plus `cv.md` and
  `contact.md` come over. Content may be edited/altered *after* it's in
  the new design, but nothing gets dropped in the migration.
* **Minimal JavaScript.** Static generation. Vue components only when
  interactivity genuinely requires them — the default is zero JS on a page.
* **Deploy target:** Cloudflare, as static output. Details (Pages vs
  Workers) undecided and not important yet.
* **No search functionality.** The new site has no search of any kind —
  no search box, no ⌘K palette. Decided during the inspiration review.
* **`main` is frozen.** There will be no updates to `main` during this
  project — no new posts, no changes of any kind. All work happens on
  `astro-rewrite`; `main` exists only as the reference. Never plan for,
  hedge against, or write contingencies for `main` changing. It won't.
* **No AI content, ever.** Claude never writes or edits Aaron's content
  (post prose, page copy). Mechanical transforms (frontmatter,
  shortcode syntax) are fine. If generated text is unavoidable
  (placeholder pages, fallbacks), it must be clearly marked as
  AI-generated — visible marker plus an inventory entry — so Aaron
  knows to replace it.

## Tech Choices

* **Astro** — static output
* **Vue** — sparingly, islands only where needed
* **Tailwind CSS** — newest version (v4, CSS-first config)
* **npm** — package manager (possibly pinned via Volta or Docker; not
  settled, and not important until the Astro project starts)

## Design Reference (design phase complete)

* `DESIGN.md` (root) — the written design decisions. Read it before
  touching anything visual.
* `.design/` — HTML prototypes, now the *visual reference* for the
  built site (chrome and DOM shapes were lifted from them — the copy
  script depends on the code-block DOM matching `blog-single.html`).
  **No build step**; plain HTML on CDN resources. Two knowing drifts
  from the prototypes: subtitles were scrapped (see DESIGN.md
  reversals), and the copy shown in prototypes is placeholder.
* `.design/inspiration/` — screenshots we review together. Aaron says what
  he likes; extracted design choices land in notes and eventually
  `DESIGN.md`. The first review (images 1–8) is complete: notes live in
  `.design/INSPIRATION.md` (archived as of August 26, 2026) and its
  decisions are promoted to `DESIGN.md`. Future inspiration gets new
  dated sections there.

## Known Worries / Open Items

Things flagged as concerns for the migration — keep them in mind, no
solutions needed yet:

* **OG image generation** — how social/open-graph images get generated in
  Astro is an open question. The Hugo theme defaults to
  `images/og-image.png` and swaps in `images/tag/<first-tag>.jpg` for
  posts (and `images/tag/<term>.jpg` for tag pages). Aaron may want to
  change that approach later; undecided for now.

(Tags themselves are decided: they stay, with tag pages. See DESIGN.md.)

## Migration To-Dos

Things that must happen before/during the Astro migration. Don't let
Aaron forget these:

* **URL contract fixture — DONE** (August 27, 2026). Lives at
  `.migration/url-contract.txt`: every path the Hugo site serves (built
  from `main` @ a4c7ce0), one per line, `#` lines are comments. 707 post
  permalinks (the "~708" count included `_index.md`; 707 is the real
  number), `/blog/` + 71 pagination pages (`/blog/page/1/` is a
  meta-refresh alias to `/blog/` — a redirect satisfies it), `/tag/` +
  52 tag pages, 54 feeds (`/blog/index.xml` + per-tag; home RSS is
  disabled), 783 `/uploads/`+`/images/` assets, root files (favicons,
  `sitemap.xml`, `404.html`, `.well-known/*`, etc.). Cross-checked
  against Hugo's sitemap. `main` is frozen, so this fixture is final.
* **Aaron rewrites all AI-generated copy.** Current placeholder
  inventory (all marked with AI-GENERATED comments in source; subtitles
  no longer exist so no lorem ipsum anywhere):
  * `/books/` — entire page (`src/pages/books.astro`)
  * `/who-am-i/` — entire page (`src/pages/who-am-i.astro`)
  * Blog index intro line (`src/pages/blog/index.astro` and
    `blog/page/[num].astro`) — from the design prototype
  * Home page copy sections (`src/pages/index.astro`) — marked inline
  * Footer CTA box copy (`src/components/Footer.astro`)
  * 22 posts use the auto-generated 70-word excerpt fallback (no
    `<!--more-->` marker) — list in `.migration/report.json`
    `noMoreMarker`; Aaron decided to leave these auto for now.
* **Aaron reviews `.migration/known-rot.txt`.** 25 internal links in
  old posts that were already broken on the Hugo site (WordPress-era
  permalinks, dead assets, two schemeless URLs). The build treats them
  as non-fatal; Aaron decides which are worth fixing in the prose.
* **Consider generating `/images/tag/twitter.jpg`.** It's the one tag
  with no OG image, so posts whose first tag is `twitter` fall back to
  the default og-image (Hugo shipped a broken og:image for them).
  Creating the image would restore the simple Hugo rule everywhere.
  Not now — just don't let Aaron forget.
* **Fast link/image scanning as an ongoing build step.** The
  `.migration/` checkers were built for migration acceptance; Aaron
  wants a permanent, super-fast broken-link/broken-image scan as part
  of the regular build process going forward (possibly the existing
  scripts promoted/rewritten, possibly a dedicated tool — undecided).
* **Lighthouse and other quality checks.** Wire performance /
  accessibility / SEO auditing (Lighthouse or similar) into the
  workflow. Scope and tooling undecided — just don't lose the idea.
* **Integrate Astro's MCP server into the AI tooling.** Hook the Astro
  MCP up for this project (e.g. project `.mcp.json`) so Claude
  sessions have first-party Astro docs/context available. Not set up
  yet.
* **Verification status (August 27, 2026):** `npm run verify` green —
  contract 1681/1681, 24,437 internal links clean, plus the known-rot
  list above. Two fixture lines were commented out as junk, matching
  Aaron's rules: `/uploads/.DS_Store` (.DS_Store files are always
  mistakes) and `/images/search.svg` (old-theme-only asset nothing
  ever referenced — dropped with the theme). Content diff sample: no
  prose loss; accepted drift = code-highlighting tokenization, new
  lang labels, restored raw HTML (10 pages), and
  Goldmark-vs-smartypants single-quote edge cases.

## Current Hugo Site (reference only)

Only what's useful for the rewrite:

* Content: `content/blog/` (mix of `.md` and `.markdown`), `content/cv.md`,
  `content/contact.md`, tag pages under `content/tag/`
* Config: `config.toml` — permalinks, menu structure, site description
* Theme: `themes/aaronsaray/` — reference for what exists, not for what
  will be
* Don't document or improve the Hugo side; it's being replaced.
