# aaronsaray.com

Source for [AaronSaray.com](https://aaronsaray.com) — an [Astro](https://astro.build) static site styled with Tailwind CSS v4.

## Commands

Node is pinned via Volta (24.x). Package manager is npm.

```shell
npm install      # once
npm run dev      # local dev server
npm run build    # static build to dist/
npm run preview  # serve the built dist/
npm run verify   # build + URL-contract check + internal link check
```

`npm run verify` must pass before deploying: it proves every historical URL (`.migration/url-contract.txt`) still resolves and that no internal link or heading anchor is broken.

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
Intro paragraph — everything above the marker is the excerpt shown on
lists, in feeds, and as the meta description.

<!--more-->

The rest of the post.
```

Rules that matter:

* **The filename is the URL slug and the date's year is the URL path** (`/2026/my-slug-here/`). Never change either after publishing — URLs never change on this site.
* `date` stays a quoted string. Date-only (`"2026-08-27"`) is fine too.
* At least one tag is required. Tags must match a file in `src/content/tags/` to have a landing page (new tag = add `src/content/tags/<term>.md` with `title`/`description` frontmatter and prose body).
* `draft: true` keeps the post out of every build. Remove it to publish.
* Highest header level in the body is H2 (H1 is the post headline).
* Optional `context:` (list of strings) renders the "Context:" pills under the meta line.

### Formatting extras

* `<!--more-->` splits the excerpt from the body. Without it, the first ~70 words are used automatically.
* Code fence with a filename header:

  ````markdown
  ```php filename="app/Models/User.php"
  class User {}
  ```
  ````

* Callout box (the old header-call-out):

  ```markdown
  :::callout
  Editorial note about this entry, not part of it.
  :::
  ```

* Link to another post by its final URL (`/2023/some-slug/`). The build's link checker fails on typos, so no ref helper is needed.
* Images are plain markdown: `![Alt Text](/uploads/2026/file.png)`. A lone image renders as a framed figure. For a thumbnail linking to a full asset: `<a href="/uploads/2026/full.pdf"><img src="/uploads/2026/thumb.jpg" alt="Alt Text"></a>`.
* YouTube: `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/VIDEOID" title="YouTube video" loading="lazy" allowfullscreen></iframe></div>`

## Layout of Things

* `src/content/blog/` — the 707+ posts. `src/content/tags/` — per-tag prose. `src/content/pages/` — cv and contact bodies.
* `src/pages/` — routes, including hand-rolled RSS feeds (`/blog/index.xml`, per-tag) and `sitemap.xml`.
* `src/plugins/` — the markdown pipeline (code chrome, callouts, figures, heading anchors, Shiki theme).
* `public/` — static files served verbatim (`uploads/`, favicons, `_redirects`, `_headers`).
* `.design/` — the HTML design prototypes (visual reference).
* `.migration/` — the URL contract fixture and verify scripts. `url-contract.txt` is the acceptance list of every URL the old site served; it never shrinks.

## URL Contract

Blog permalinks are `/:year/:slug/` and every URL the Hugo site ever served must keep resolving. `npm run verify` enforces this — if it fails, fix the site, not the fixture.

## To-Do

The remaining tail of the rewrite, roughly in order. Delete items as they finish.

* [ ] **Full review of the generated site** — every file, every page in the local browser; rework anything to taste.
* [ ] **Rewrite all AI-generated placeholder copy** (each marked with an AI-GENERATED comment in source):
  * `/books/` — entire page (`src/pages/books.astro`)
  * `/who-am-i/` — entire page (`src/pages/who-am-i.astro`)
  * Blog index intro line (`src/pages/blog/index.astro` and `src/pages/blog/page/[num].astro`)
  * Home page copy sections (`src/pages/index.astro`, marked inline)
  * Footer CTA box copy (`src/components/Footer.astro`)
* [ ] **Review `.migration/known-rot.txt`** — 25 internal links in old posts that were already broken on the Hugo site. The build treats them as non-fatal; decide which are worth fixing in the prose.
* [ ] **22 posts use the auto ~70-word excerpt** (no `<!--more-->` marker) — list in `.migration/report.json` under `noMoreMarker`. Decided to leave them auto for now; add markers later if it bothers.
* [ ] **Consider generating `/images/tag/twitter.jpg`** — the one tag with no OG image, so posts whose first tag is `twitter` fall back to the default og-image. Creating it restores the simple per-tag rule everywhere.
* [ ] **Decide the long-term OG image approach** — current rule is Hugo's (per-first-tag jpg, else `/images/og-image.png`); generated OG images are an option.
* [ ] **Fast broken-link/image scan as a permanent build step** — the `.migration` checkers work but were built for migration acceptance; want a super-fast scan in the regular build (promote/rewrite the scripts, or a dedicated tool — undecided).
* [ ] **Lighthouse and other quality checks** — wire performance / accessibility / SEO auditing into the workflow; scope and tooling undecided.
* [ ] **Integrate Astro's MCP server** into the AI tooling (e.g. project `.mcp.json`) so Claude sessions get first-party Astro docs/context.
* [ ] **Deploy** — Cloudflare static, handled alongside migrating hosting/DNS off the current setup. Explicitly last; no deploy tooling until then.
