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

Current phase: **design**. We prototype in `.design/` before any Astro
code exists. The migration to Astro happens after the designs are settled.

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

## Tech Choices

* **Astro** — static output
* **Vue** — sparingly, islands only where needed
* **Tailwind CSS** — newest version (v4, CSS-first config)
* **npm** — package manager (possibly pinned via Volta or Docker; not
  settled, and not important until the Astro project starts)

## Design Phase Workflow

* `DESIGN.md` (root) — records design decisions as they're made. Read it
  before doing any design work.
* `.design/` — HTML prototypes. **No build step.** Plain HTML files using
  live CDN resources (e.g., Tailwind via CDN). How they get served/viewed
  during design sessions is not decided yet — don't add tooling for it.
  Do not scaffold a full prototype site/project here.
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
* **Aaron rewrites all AI-generated copy.** Migration will fill gaps
  with placeholders: subtitles get lorem ipsum, and any other new copy
  (home page text, etc.) is AI-generated stand-in only. Aaron will
  personally rewrite every piece of placeholder/AI-generated text —
  before launch, remind him and help inventory what's still
  placeholder.

## Current Hugo Site (reference only)

Only what's useful for the rewrite:

* Content: `content/blog/` (mix of `.md` and `.markdown`), `content/cv.md`,
  `content/contact.md`, tag pages under `content/tag/`
* Config: `config.toml` — permalinks, menu structure, site description
* Theme: `themes/aaronsaray/` — reference for what exists, not for what
  will be
* Don't document or improve the Hugo side; it's being replaced.
