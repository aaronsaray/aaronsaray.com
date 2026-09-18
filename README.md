# aaronsaray.com

Source for [AaronSaray.com](https://aaronsaray.com). [Astro](https://astro.build) static site, Tailwind CSS v4.

## Commands

Node is pinned via [Volta](https://volta.sh) (24.x). Package manager is npm. Every repeated command is a `make` target; `make` with no target prints the full list under headings.

```shell
make install                   # npm ci, then the Chromium download (.npmrc blocks install scripts)
make dev                       # dev server on port 4321
make build                     # static build to dist/
make preview                   # build, then serve dist/
make check                     # astro check (TypeScript)
make lint                      # eslint + prettier check + markdownlint
make lint-fix                  # all three, with autofix
make test                      # all browser tests, boots its own dev server
make test ARGS="--grep copy"   # any playwright flags pass through; test-e2e and test-a11y take ARGS too
make test-e2e                  # behavior subset
make test-a11y                 # axe sweep subset
make clean                     # dist/, both Astro content caches, Playwright output, the draft fixture, .DS_Store files
make verify                    # clean + check + build + URL contract + links + lint + tests
```

## Tooling

* **Makefile**: `package.json` scripts are single-tool leaves, each with a make target of the same name (colon turned into a hyphen); the Makefile adds the groupings on top (`lint`, `lint-fix`, `verify`, `ci`). After a change to `src/plugins/` or the `markdown` options in `astro.config.mjs`, run `make clean` before trusting a warm build or test run.
* **EditorConfig** (`.editorconfig`): Prettier reads it, so the `[*]` values equal Prettier's defaults; change one and the whole tree reformats.
* **Linting**: one tool at a time is `make lint-js`, `make lint-format`, `make lint-md`, and `make format` (Prettier, writing). `make lint-fix` rewrites this file and `CLAUDE.md` too. Nothing lints or formats `src/content/`.
* **astro check**: TypeScript is pinned to 5.x; the checker does not support TypeScript 7 yet.
* **npm hardening** (`.npmrc`):
  * `min-release-age=7` refuses package versions published less than 7 days ago. Needs npm >= 11.10, which the Volta pin satisfies; older npm silently ignores the setting.
  * `ignore-scripts=true` blocks dependency lifecycle scripts; `npm run <script>` still works.
  * `save-exact=true` pins new deps to exact versions.
* **Playwright**: the suite starts its own dev server on port 4321 and stops it afterward. If anything already answers on 4321 the run stops with a port error, so stop a stray dev server first. A new page gets a line in `tests/routes.ts`, which covers it in both the e2e and axe projects. The axe spec also fails on any `incomplete` result outside the known header items; a new one fails until someone measures it by hand.
* **GitHub Actions**: runs `make ci` on push. Actions are pinned to commit SHAs with the version in a trailing comment; bumping one means replacing both.
* **AI tooling**: `.mcp.json`, `.claude/settings.json`, and `.claude/skills/` are committed. Plugins are not auto-installed from a clone; Claude Code surfaces the one `claude plugin install` command to run. `.claude/settings.local.json` is gitignored: personal overrides only.

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
* At least one tag. A tag needs a matching file in `src/content/tags/` for its landing page. New tag: add `src/content/tags/<term>.md` with `anchorDepth: 0` frontmatter and a prose body, and a 1200x630 `public/images/tag/<term>.jpg` for the social card.
* `draft: true` keeps the post out of every build. Remove it to publish. `make dev` renders drafts at their real URL, in every list and feed, with a Draft badge next to the date.
* Posts older than ~18 months show a "technology changes" notice. `evergreen: true` frontmatter suppresses it. Tags have no bearing on this.
* Body headers start at H2. The post title is the H1. H2 and H3 get an anchor link.
* Optional `context:` (list of strings) renders the "Context:" pills under the meta line.
* Proofread with `/proofread <slug>` in Claude Code; with no argument it takes the post modified in git. It never edits the file. `.claude/skills/proofread/voice.md` lists the habits it must not flag, one bullet per rule; delete a bullet to drop the rule.
* Fact check with `/fact-check <slug>`, same lookup as `/proofread`. It asks before looking anything up and never edits the file.
* Find a post to link with `/related <what you remember writing about>`. It prints paste-ready `[Title](/YYYY/slug/)` links. With no argument it checks its index against the posts and prints the rows to change; nothing is written until you say so.

### Formatting

* `<!--more-->` splits the excerpt from the body. Without it, the first ~70 words are used.
* Code fence with a filename header:

  ````markdown
  ```php filename="app/Models/User.php"
  class User {}
  ```
  ````

* Terminal output uses the fence language `output`, not `txt`: a black
  ground, no highlighting, and no copy button, since the block is what
  a program printed rather than source to reuse. `txt` stays for plain
  text that is not output (a hash, a file tree, a format string).

  ````markdown
  ```output
  OK (3 tests, 5 assertions)
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
* Image `width`/`height` are never authored; `rehype-img-attrs` stamps the real dimensions at build.
* YouTube: `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/VIDEOID" title="YouTube video" loading="lazy" allowfullscreen></iframe></div>`

## Updating the CV

`src/content/pages/cv.md` is one markdown file. `src/pages/cv.astro` renders the frontmatter `title` as the H1 and `intro` as the lede, then a section index built from the H2s in file order; sections are reordered by moving H2 blocks. The frontmatter `sections: true` wraps each H2 and what follows it in a `<section>` (`src/plugins/rehype-sections.mjs`). `anchorDepth: 2` links the H2s only; 4 or more would wrap the H4 role headings and break the date gutter, which needs the date `em` as the H4's first child. On wide screens a section that holds a dated row gets the date gutter and a section of plain prose does not; a table carries its own date column, the same width as the gutter, and lives in a section by itself. The `.cv` rules in `src/styles/global.css` key on the shapes below, so each kind of entry is typed one way.

A role: an H3 per organization, then an H4 per role whose first thing is the date in italics, then the description as an ordinary paragraph. Consecutive roles at one organization share the H3.

```markdown
### Talimer, Milwaukee, WI

#### *Nov 2020 to Feb 2021* Advisory Chief Technology Officer

As the Advisory CTO at Talimer, I help review decisions ...
```

A talk or a credential: one pipe-table row, the date, then the title with the venue or issuer in italics.

```markdown
| Oct 2019 | The Freelance Economy Panel *FallX19 Fall Experiment, Milwaukee, WI* |
```

A community line: a paragraph whose first thing is the date in italics, then the organization in bold, then the rest.

```markdown
*2019 to 2020* **[i.c.Stars](https://milwaukee.icstars.org)** Community volunteer.
```

A publication: a paragraph whose first thing is the title in bold (linked or not), then the description.

Dates are `Mon YYYY`, a bare `YYYY`, or a range with the word "to" (`Oct 2018 to present`). Never a slash or a dash: the gutter sets them in tabular figures, and a slash reads as a fraction.

The footgun: any paragraph whose first inline element is italic or bold gets the row treatment, text before it or not (CSS cannot see leading text). Ordinary prose in this file starts with plain text.

## Adding a Book

Create `src/content/books/my-book.md`:

```markdown
---
title: My Book
href: https://nocompromises.gumroad.com/l/my-book
cover: ./my-book.jpg
order: 6
anchorDepth: 0
---
One paragraph about it.
```

* `order` sorts the list, lowest first.
* `href` is where the title leads, and a click anywhere on the row follows it. A link inside the paragraph still works as its own link.
* `cover` is the flat front cover, any size, sitting next to the markdown file. Astro resizes it at build (`src/pages/books.astro` asks for 224px wide, double the rendered width) and fails the build if the file is missing.
* `anchorDepth` is required (see Layout); a book body is one paragraph, so 0.

## Layout

* `src/content/blog/` is the posts, `src/content/tags/` is per-tag prose, `src/content/pages/` is the cv and colophon bodies, `src/content/books/` is one file per book on `/books/`.
* `src/pages/` is the routes, including hand-rolled RSS feeds (`/blog/index.xml`, per-tag), `sitemap.xml`, and `/logo.svg`.
* `src/plugins/` is the markdown pipeline (code chrome, callouts, figures, heading anchors, image attributes, Shiki theme). Every file in `src/content/pages/`, `src/content/tags/`, and `src/content/books/` declares `anchorDepth`, the deepest heading level that gets an anchor link, 0 for none; posts do not, and link H2 and H3.
* `src/icons/` is the Tabler icon set, one SVG per name, rendered with `<Icon name="arrow-right" class="size-4" strokeWidth={1.5} />`. Adding an icon is dropping the Tabler file into the folder.
* `src/assets/logo.svg` is the mark, the one file it lives in; `/logo.svg` is built from it. Updating the mark is replacing this file and putting the two `style` fills (`--logo-s`, `--logo-a`) back on the paths; the build fails without them.
* `src/konami/` is the Konami-code easter egg, described below.
* `public/` is static files served verbatim (`uploads/`, favicons, `_redirects`, `_headers`).
* `scripts/` is the verify checkers and their fixtures. `url-contract.txt` lists every page, feed, and document URL the site has ever served; it never shrinks.
* `tests/` is the Playwright suite: `e2e/` for behavior, `a11y/` for the axe sweep, `routes.ts` for the route table both read. A run writes one draft fixture post into the blog collection and removes it afterward; `make clean` removes a leftover.

## The Konami Code

Up, Up, Down, Down, Left, Right, Left, Right, B, A on any page. A desert drops in over the lower three quarters of the window, something runs across it, and it hoists back out. Escape ends it early. Keys typed into an editable field do not count.

## URL Contract

Blog permalinks are `/:year/:slug/`. Every page, feed, and document URL the Hugo site ever served must keep resolving; images are not part of the contract. `make verify` enforces this. If it fails, fix the site, not the fixture.

## To-Do for Launch

Remaining tail of the rewrite, roughly in order. Delete items as they finish.

* [ ] Full review of the generated site: every file, every page in the local browser. (did blog entries - need to look at few of the rest)
* [ ] understand the check links and potentially remove it
* [ ] full code review
* [ ] Deploy: Cloudflare static, handled alongside migrating hosting/DNS off the current setup. Last; no deploy tooling until then. At that point, build out `public/_headers` with the standard security set (nosniff, frame-ancestors, Referrer-Policy, Permissions-Policy, HSTS ramp-up); any CSP allows the inline scripts by sha256 hash, not `unsafe-inline`. Decide whether Cloudflare's Email Address Obfuscation stays on: it is on by default, injects its own script, and rewrites mailto links, and `/contact/` already entity-encodes its address.
* [ ] page speed - lighthouse stuff
