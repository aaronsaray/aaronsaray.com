# CLAUDE.md

## What This Project Is

aaronsaray.com: a static [Astro](https://astro.build) site styled with
Tailwind CSS v4, minimal JavaScript, npm, Node pinned via Volta. The
site was rewritten from Hugo in August 2026. The Hugo source now exists
only on `main`, which stays frozen until this branch (`astro-rewrite`)
replaces it.

Commands, authoring instructions, and the working to-do list live in
`README.md`. Read it. The to-dos are Aaron's list first, Claude's
second: help with them when asked, don't start them unprompted.

Current status: Aaron is reviewing the whole generated site (every
file, every page in the browser) and rewriting placeholder copy.
Expect him to rework code to his taste.

## Hard Rules

* **URLs never change. Ever.** Blog permalinks are `/:year/:slug/`
  (filename = slug, date's year = year). `scripts/url-contract.txt`
  lists every URL the old site served; `npm run verify` enforces that
  they all still resolve. If verify fails, fix the site, not the
  fixture. The fixture never shrinks.
* **No AI content, ever.** Claude never writes or edits Aaron's
  content (post prose, page copy). Mechanical transforms (frontmatter,
  markup) are fine. If generated text is unavoidable, it must be
  clearly marked as AI-generated (visible marker in the source plus a
  to-do entry in README.md) so Aaron knows to replace it.
* **No em dashes.** Strictly forbidden in any content Claude generates:
  docs, code comments, placeholder text, commit messages, everything.
  Use a period, comma, colon, or parentheses instead.
* **Comments earn their place.** A comment exists only for what the
  code cannot say: a non-obvious constraint, a foot-gun, a gotcha that
  looks deletable but is not (the `crossorigin` on the font preloads in
  `Base.astro` is the model). Never narrate the change, justify a
  decision, restate an adjacent line, or explain general web platform
  behavior. If a reader could learn it from the code or from MDN, cut
  it. Comments describe the code as it stands, never as a diff:
  anything that reads like a changelog ("now self-hosted", "was
  previously X") is wrong, and it rots the moment the surrounding code
  moves. Rationale that matters to a human belongs in `README.md`, not
  inline. Same bar in those docs: state what is true,
  not what changed.
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

* `npm run verify` (astro check + build + URL contract check +
  internal link check + lint + Playwright tests) must be green before
  declaring any change done. It is the only gate: a new check goes
  inside `verify`, never beside it as a command to remember.
  GitHub Actions runs `npm run verify` and nothing else.
* Formatting is owned by Prettier (pure defaults plus the astro and
  tailwindcss plugins), linting by ESLint flat config (recommended
  sets only, prettier-conflict rules disabled), markdown by
  markdownlint (repo-local `.markdownlint-cli2.jsonc`; do not use the
  home-directory config here). `npm run lint` runs all three and
  `npm run lint:fix` fixes all three. Never hand-format against
  Prettier. Prettier and ESLint never touch `src/content/`, `public/`,
  or any markdown. See README "Tooling".
* AI tooling is repo-declared: `.mcp.json` (Astro docs + Playwright MCP
  servers) and `.claude/settings.json` (server approvals, plugin
  declarations). Keep additions project-scoped in these files, not in
  user-level config.
* In `.astro` templates, use `{/* */}` comments inside `{...}`
  expressions; HTML comments there break Prettier's parser.
* `.npmrc` enforces supply-chain rules: 7-day package cooldown
  (`min-release-age`), no dependency install scripts
  (`ignore-scripts`), exact version pins (`save-exact`). Do not
  weaken these to make an install work; surface the problem to Aaron
  instead. Node and npm versions are pinned via Volta in
  `package.json`.
* **Content-layer cache gotcha:** Astro caches rendered markdown in
  `.astro/data-store.json`. After changing anything in the markdown
  pipeline (`src/plugins/`, the `markdown` options in
  `astro.config.mjs`), build with `npx astro build --force`. A plain
  build silently serves stale post HTML. The dev server reads the same
  cache, so the Playwright tests inherit this: a plugin change can be
  invisible to them until the cache is cleared. When a test result
  after a pipeline change looks impossible, delete
  `.astro/data-store.json` and re-run before believing it. CI is
  unaffected, since a fresh checkout has no cache.
* The `tests/` suite covers behavior against a dev server it starts
  itself. It is not a substitute for looking at the page: for
  user-facing changes, browse the built site with `npm run preview`
  and the Playwright MCP.

## How the Site Works

* `src/content/`: collections defined in `src/content.config.ts`.
  `blog` (post id = filename verbatim, via a custom `generateId`; do
  not remove it, Astro's default slugifier would corrupt the dotted
  slug), `tags` (per-tag prose), `pages` (cv, contact).
* **Dates are strings end-to-end.** Frontmatter dates are validated
  strings, never coerced to `Date`; timezone math could shift a post's
  URL year. Year is `date.slice(0, 4)`; sorting is lexicographic
  descending.
* `src/pages/`: routes, including hand-rolled RSS feeds (Hugo-parity
  shape: guid = permalink, 10 items) and a hand-rolled `sitemap.xml`.
* `src/plugins/`: the markdown pipeline. Shiki theme plus filename-meta
  transformer, code chrome, callouts (`:::callout`), table wrap,
  figures, heading anchors. The code-block DOM shapes and the inline
  copy script are a matched pair; the script's element lookups depend
  on the exact shapes the plugins emit. `tests/copy-button.spec.ts`
  enforces that pairing by comparing the copied text against the code
  block through both DOM shapes.
* `src/lib/`: excerpts (`<!--more-->` split, ~70-word fallback),
  reading time, date formatting, post sorting/pagination, OG image
  lookup, RSS rendering.
* `public/`: served verbatim (`uploads/`, favicons, `_redirects`,
  `_headers`).

## Design

* The built site is the design reference. Match the patterns already
  in the components and `src/styles/global.css` for anything visual.
* **Do not look AI-generated.** New visual work must avoid the default
  AI aesthetic: decorative gradients, the blue-purple palette,
  oversized rounded corners and pill shapes, icon-card grids ("4 of
  something" panels), glowing status dots, too-bright glowy headlines.

## Verify Scripts and Tests

* `scripts/`: `check-url-contract.mjs` and `check-links.mjs` with their
  fixtures `url-contract.txt` and `known-rot.txt`. Both read `dist/`,
  so a build has to precede them. Both carry a pinned count
  (`FIXTURE_FLOOR`, `EXPECTED_ROT`) that fails on drift in either
  direction: changing a pin is a deliberate decision, never a way to
  make a failing run pass.
* `tests/`: Playwright, Chromium only, against a dev server the config
  starts on port 4321 and stops afterward. Two projects: `e2e`
  (`tests/e2e/`, behavior) and `a11y` (`tests/a11y/`, the axe sweep).
  Both run in `verify`; `npm run test:e2e` and `npm run test:a11y` run
  one at a time while iterating. A new page means a new line in
  `tests/routes.ts`, which both projects read. Posts and tags are not
  enumerated there: the URL contract already proves every path
  resolves.
* **Contrast is enforced, so pick colors against the test, not by eye.**
  Every text token clears AA 4.5:1 on all three grounds the site
  composites: `--color-night`, `--color-surface`, and `bg-surface/40`
  over night (`#0c0e10`, the footer). `--color-ink-faint` is the sole
  exception, non-text strokes only at 3:1. Two things this catches that
  reading the CSS does not: an alpha background composites to a ground
  that is in no token, and an opacity utility multiplies against the
  token so a passing color can still fail where it renders. axe also
  truncates its ratio to two decimals, so a value computing to 4.499
  reports as 4.49 and fails; leave margin rather than landing on 4.50.
  `tests/a11y/axe.spec.ts` asserts on `incomplete` as well as
  `violations`, because text on a gradient lands in `incomplete` and
  would otherwise pass silently.
* `.npmrc`'s `ignore-scripts` blocks Playwright's browser download, so
  a fresh clone needs `npx playwright install chromium`.
