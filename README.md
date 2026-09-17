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

`make verify` must pass before deploying. It clears the caches, type checks, builds, checks that every historical URL (`scripts/url-contract.txt`) still resolves, that no internal link or heading anchor is broken, that lint and formatting are clean, and that the browser tests pass.

New checks belong inside `verify` rather than alongside it: one command is the whole point. The GitHub Actions workflow runs `make ci` (a fresh install, then `verify`) and nothing else.

## Tooling

* **Makefile** is the entry point for every repeated command, for Aaron and for AI agents alike. The split is fixed: `package.json` scripts are leaves (one tool, one job, never chaining each other), every leaf has a make target of the same name with the colon turned into a hyphen, and the Makefile adds the groupings on top (`lint`, `lint-fix`, `verify`, `ci`). Anything repeated that is not an npm script (`clean`, `install`) is a target too; one-off commands are not, and a one-off that gets repeated becomes one. Recipes call `npm run`, never `node_modules/.bin`. The file is written for GNU Make 3.81, the `/usr/bin/make` that macOS ships, so it also runs on the newer make on the CI runner. After a change to `src/plugins/` or the `markdown` options in `astro.config.mjs`, run `make clean` before trusting a warm build or test run.
* **EditorConfig** (`.editorconfig`): the editor-side half of formatting, so PhpStorm and any other editor indent with two spaces, end lines with LF, and add a final newline without per-machine settings. Prettier reads the file too and turns `indent_style`, `indent_size`, and `end_of_line` into its own options, so the `[*]` values equal Prettier's defaults; change one and the whole tree reformats. Two exceptions: markdown keeps trailing whitespace (two spaces are a hard line break, and markdownlint MD009 polices the docs), and `public/` is left alone because it is served verbatim. `Makefile` gets tabs, which make requires.
* **`make lint`** is the umbrella: ESLint, then Prettier's check, then markdownlint. `make lint-fix` fixes all three (it rewrites this file and `CLAUDE.md`, since markdownlint owns the docs). One tool at a time is `make lint-js`, `make lint-format`, `make lint-md`, and `make format` (Prettier, writing). Prettier runs as its own step, not through `eslint-plugin-prettier`.
* **ESLint** (`eslint.config.js`): flat config, recommended rule sets only (`@eslint/js`, `typescript-eslint`, `eslint-plugin-astro`), with `eslint-config-prettier` last so no formatting rules fight Prettier. `no-console` allows `warn`/`error`; off entirely for the `scripts/` CLI scripts.
* **Prettier** (`.prettierrc`): no style overrides, plugin config only. Plugins: `prettier-plugin-astro` and `prettier-plugin-tailwindcss` (sorts Tailwind classes; must stay last in the plugin list). Markdown is excluded (`.prettierignore`): `markdownlint-cli2` owns markdown, and `src/content/` is never touched by tooling at all.
* **astro check** (`@astrojs/check`): TypeScript checking for `.astro` and `.ts`, strict preset. TypeScript is pinned to 5.x; the checker does not support TypeScript 7 yet.
* **npm hardening** (`.npmrc`, committed):
  * `min-release-age=7` refuses package versions published less than 7 days ago. Needs npm >= 11.10, which the Volta pin satisfies locally; older npm silently ignores the setting. It is a local-development control: it filters which version the resolver may pick during `npm install` or `npm update`, and `npm ci` resolves nothing, installing the exact versions already in `package-lock.json`. So CI never applies the cooldown and can never install anything newer than what was vetted here.
  * `ignore-scripts=true` blocks dependency lifecycle scripts; `npm run <script>` still works.
  * `save-exact=true` pins new deps to exact versions; all current deps are exact-pinned and `package-lock.json` is committed.
* **markdownlint** (`.markdownlint-cli2.jsonc`): `make lint-md`, also
  part of `verify`. `markdownlint-cli2` is a devDependency and the config
  (globs included) is in the repo, so no global install or home-directory
  config is involved. It lints the doc markdown (README, CLAUDE);
  `src/content/` is ignored, same policy as the other tooling.
* **Playwright** (`playwright.config.ts`): Chromium-only, two projects,
  both part of `verify`. `e2e` (`tests/e2e/`) is behavior; `a11y`
  (`tests/a11y/`) is the axe sweep. Either runs alone
  (`make test-e2e`, `make test-a11y`) for a faster loop while
  iterating.
  The `webServer` block starts its own dev server on port 4321 and stops
  it afterward, so no build is required and nothing needs to be running
  first. If anything already answers on 4321 the run stops with a port
  error instead of testing whatever is there, so stop a stray dev server
  before running the suite (`npx astro dev stop` if it daemonized
  itself).
  Coverage is layered: `pages.spec.ts` loads one page per route template
  and asserts a single `h1`, then `copy-button.spec.ts`, `header.spec.ts`,
  `feeds.spec.ts`, and `not-found.spec.ts` cover specific behavior. Both
  projects read the route table from `tests/routes.ts`, so adding a page
  there covers it in each. Because
  `.npmrc` blocks install scripts, browsers need an explicit download,
  which `make install` runs after `npm ci`. `make ci` adds
  `--only-shell` to that command, skipping the headed build the runner
  cannot use; locally the full browser is worth having for headed
  debugging.
* **axe-core** (`tests/a11y/axe.spec.ts`, via `@axe-core/playwright`):
  the WCAG 2.x A and AA rules against every route in the table. The spec
  fails on any `violations` and on any `incomplete` result outside the
  known header items (text over the header veil, measured by hand). A
  new incomplete result fails until someone measures it.
* **GitHub Actions** (`.github/workflows/ci.yml`): runs `make ci` on
  push, nothing more. Node comes from the `volta.node` pin via
  `node-version-file`, so the version is not duplicated (`volta.npm` is
  not read: `setup-node` looks only at `volta.node`, and Volta is not on
  the runner). `make ci` does the install and the browser download (the
  `ignore-scripts` reason above), so the workflow itself holds no
  commands; on a failed run it uploads the Playwright report along with
  the traces that make it diagnosable.
  Actions are pinned to commit SHAs with the version in a trailing
  comment; bumping one means replacing both.
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
  * `.claude/skills/proofread/` (committed): the `/proofread` skill and
    its `voice.md`, the catalog of Aaron's writing habits it reads
    before the post.
  * `.claude/skills/fact-check/` (committed): the `/fact-check` skill.
  * `.claude/skills/related/` (committed): the `/related` skill and its
    `index.md`, a table with one row per published post (URL, title,
    and a summary written to be grepped for the idea).
  * `.claude/settings.local.json` is gitignored: personal overrides only.

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
* `draft: true` keeps the post out of every build. Remove it to publish. `make dev` renders drafts at their real URL, in every list and feed, with a Draft badge next to the date.
* Posts older than ~18 months show a "technology changes" notice. `evergreen: true` frontmatter suppresses it. Tags have no bearing on this.
* Body headers start at H2. The post title is the H1. H2 and H3 get an anchor link.
* Optional `context:` (list of strings) renders the "Context:" pills under the meta line.
* Proofread with `/proofread <slug>` in Claude Code; with no argument it takes the post modified in git. It prints one list in chat, mechanical errors first, rewrites as blockquotes, and never edits the file. `.claude/skills/proofread/voice.md` lists the habits it must not flag, one bullet per rule; delete a bullet to drop the rule.
* Fact check with `/fact-check <slug>`, same lookup as `/proofread`. The first pass is closed-book: code against the prose around it, the post against itself, and what it would state flatly from memory. Anything it would rather verify (versions, support, quotes, numbers) goes in a numbered list, and it asks before looking any of it up. Opinions are never findings. Never edits the file.
* Find a post to link with `/related <what you remember writing about>`. It runs apart from the conversation, greps `.claude/skills/related/index.md` for the idea, confirms by reading the candidates, and prints one to three paste-ready `[Title](/YYYY/slug/)` links, each with the matching passage quoted, or `Nothing close.` with the terms it tried. With no argument it checks the index against the posts (new, changed, deleted, and drafts) and prints the rows to add, replace, or remove; nothing is written until you say so.

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

* `src/content/blog/` is the posts, `src/content/tags/` is per-tag prose, `src/content/pages/` is the cv, contact, and colophon bodies, `src/content/books/` is one file per book on `/books/`.
* `src/pages/` is the routes, including hand-rolled RSS feeds (`/blog/index.xml`, per-tag), `sitemap.xml`, and `/logo.svg`.
* `src/plugins/` is the markdown pipeline (code chrome, callouts, figures, heading anchors, image attributes, Shiki theme). Every file in `src/content/pages/`, `src/content/tags/`, and `src/content/books/` declares `anchorDepth`, the deepest heading level that gets an anchor link, 0 for none; posts do not, and link H2 and H3.
* `src/icons/` is the Tabler icon set, one SVG per name. Templates render one with `<Icon name="arrow-right" class="size-4" strokeWidth={1.5} />` (`src/components/Icon.astro`); the markdown plugins read the same files through `src/lib/icon.mjs`. Both emit inline `currentColor` SVG so icons take text color tokens and hover transitions. Adding an icon is dropping the Tabler file into the folder.
* `src/assets/logo.svg` is the mark, the one file it lives in. The header and footer render it inline; its two paths fill from `--logo-s` and `--logo-a` with the brand colors as fallbacks, so the header sets neither and the footer sets both to its greys. `/logo.svg`, the plain copy anyone outside the site links, is built from this file by `src/pages/logo.svg.ts` and the build fails if the two fills are missing. Updating the mark is replacing this file and putting the two `style` fills back on the paths.
* `src/konami/` is the Konami-code easter egg, described below.
* `public/` is static files served verbatim (`uploads/`, favicons, `_redirects`, `_headers`).
* `scripts/` is the verify checkers and their fixtures. `url-contract.txt` lists every page, feed, and document URL the site has ever served; it never shrinks.
* `tests/` is the Playwright suite: `e2e/` for behavior, `a11y/` for the axe sweep, `routes.ts` for the route table both read. `global-setup.ts` writes one `draft: true` post (`draft-fixture.ts`) into the blog collection for the length of a run and `global-teardown.ts` removes it, so the draft paths are tested without a draft living in the repo; the file is gitignored and `make clean` removes a leftover.

## The Konami Code

Up, Up, Down, Down, Left, Right, Left, Right, B, A on any page. A desert drops in over the lower three quarters of the window, something runs across it, and it hoists back out. Escape ends it early. Keys typed into an editable field do not count.

Every page carries the key listener, a small module script. The scene (art, stylesheet, sequencing) is a separate chunk fetched only when the code completes; the line that draws across the window is the loading indicator. Under `prefers-reduced-motion: reduce` the scene fades in with a single still frame, holds three seconds, and fades out.

## URL Contract

Blog permalinks are `/:year/:slug/`. Every page, feed, and document URL the Hugo site ever served must keep resolving; images are not part of the contract. `make verify` enforces this. If it fails, fix the site, not the fixture.

## To-Do for Launch

Remaining tail of the rewrite, roughly in order. Delete items as they finish.

* [ ] Confirm the evergreen flag on each post during the archive walk. 114 posts carry `evergreen: true` after the tag-policy backfill; the walker's green toggle sets and clears it.
* [ ] consider a cli output design (for most of the txt)
* [ ] updates to contact page
* [ ] updates to about page the google thing
* [ ] <http://localhost:4321/2017/33-things-book/> - needs to have a easier download of the book
* [ ] Performance and SEO checks. Lighthouse is the obvious candidate but Lighthouse CI is a poor bet: `@lhci/cli` has not shipped since June 2025, pins Lighthouse 12 against a current 13, and its Lighthouse 13 support issue has sat unanswered since April 2026. Running Lighthouse by hand from DevTools may be enough for a static site this size.
* [ ] Full review of the generated site: every file, every page in the local browser.
* [ ] Deploy: Cloudflare static, handled alongside migrating hosting/DNS off the current setup. Last; no deploy tooling until then. At that point, build out `public/_headers` with the standard security set (nosniff, frame-ancestors, Referrer-Policy, Permissions-Policy, HSTS ramp-up); any CSP allows the inline scripts by sha256 hash, not `unsafe-inline`.
