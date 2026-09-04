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
  lists every page, feed, and downloadable document URL the old site
  served (image files under `/uploads/` are not promised); `npm run
  verify` enforces that they all still resolve. If verify fails, fix
  the site, not the fixture. The fixture never shrinks.
* **No AI content, ever.** Claude never writes or edits Aaron's
  content (post prose, page copy). Mechanical transforms (frontmatter,
  markup) are fine. If generated text is unavoidable, it must be
  clearly marked as AI-generated (visible marker in the source plus a
  to-do entry in README.md) so Aaron knows to replace it. The marker
  is one exact phrase so every instance can be found:
  `AI-GENERATED PLACEHOLDER: <what it covers>` and nothing more.
* **No em dashes.** Strictly forbidden in any content Claude generates:
  docs, code comments, placeholder text, commit messages, everything.
  Use a period, comma, colon, or parentheses instead.
* **A comment answers a question the code raises and cannot answer.**
  There are four such questions. A comment exists to answer one of
  them and for no other reason:
  1. Can I delete or change this? No, and here is what breaks. The
     `crossorigin` on the font preloads in `Base.astro` is the model.
  2. Why is this shaped so strangely? Because of an external fact a
     reader would not guess: a third-party ordering, a platform quirk,
     a tool that misbehaves under one condition.
  3. What elsewhere depends on this? Coupling across files that
     nothing enforces: hexes that mirror tokens in another file, a
     script whose selectors depend on the DOM a plugin emits.
  4. Where does this number come from? The derivation or source of a
     value that is not self-evident.

  Everything else is cut: what the code does (read it), what it used
  to do (git has it), where it came from, that a choice was made,
  counts and dates, section banners, and pointers to README to-dos
  (they are deleted when done). A comment that rejects an alternative
  says what the alternative breaks; if it cannot, the choice is a
  preference, and preferences get no comment. "Deliberately", "on
  purpose", "by design", "now", "no longer", and "migrated" nearly
  always mark a comment that fails this bar.

  Hugo appears in a comment only when something outside the repo still
  depends on the old behavior: feed readers keyed on the RSS guid, the
  URL contract, a display format readers know. The Hugo setting a value
  was copied from is history, not a reason.

  Comments describe the code as it stands, never as a diff. Lead with
  the fact, in the fewest words that carry it. A file header states the
  mechanics that hold the file together, never what the file is; a
  reader who needs orienting reads the code. Rationale that matters to
  a human but answers none of the four questions belongs in
  `README.md`, held to the same bar: what is true, not what changed.

  A rule is written in one place. Where a rule bears on one block of
  code (the palette tokens in `global.css`), that block carries the
  lines a person needs at the point they would break it, and nothing
  else repeats them.
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
* **Never write `{" "}`.** Not to fix a missing space, not because
  Prettier inserted it, not anywhere. A line break between text and an
  inline tag loses its space in the compiled output; the fix is to
  author the text and the tag on the same line (`under <a` and
  `</a> has`), which Prettier preserves. Inside a `{cond && (...)}`
  expression the JSX rules collapse that whitespace no matter how it
  is written, so text that flows around an inline element never lives
  inside one: move that markup into its own component
  (`OldPostNotice.astro` and `LaravelCta.astro` are the pattern) and
  render the component from the expression instead.
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
* `src/icons/`: Tabler SVGs, one per name. `Icon.astro` inlines one
  (Vite `?raw` import); the markdown plugins read the same files from
  disk via `src/lib/icon.mjs`. Never paste SVG markup into a template.
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
* **Where a style lives.** Styles have exactly two homes: Tailwind
  utilities on the element, or `src/styles/global.css`. No `<style>`
  blocks in components. Pick by asking, in order:
  * Used in one place? Utilities on the element, including `hover:`,
    `group-*:`, and `motion-reduce:` variants. A rule with a class
    name that appears in one template is a global.css rule that
    should have been utilities.
  * The same utility stack in more than one template? One
    `@utility` in global.css (`page-title` is the model), never a
    copied class string. Keyframes go in `@theme` as `--animate-*`.
  * Styling markup the templates never author (the markdown
    pipeline's output: `.prose`, `.entry-excerpt`, the code chrome)?
    Element rules in global.css. Plugins emit the class hooks;
    global.css styles them.
  * Still in global.css for another reason (the header blur, whose
    four masks only read as one ramp side by side)? One line at the
    top of the block saying why. Without that line, the next audit
    inlines it.
* **Do not look AI-generated.** New visual work must avoid the default
  AI aesthetic: decorative gradients, the blue-purple palette,
  oversized rounded corners and pill shapes, icon-card grids ("4 of
  something" panels), glowing status dots, too-bright glowy headlines.

## Accessibility

Aaron holds this site to a higher bar than the field does, and he is
learning the subject as the site is built. Do not wait to be asked, and
do not assume he knows a rule already: say what the rule is, and why,
when it comes up.

`npm run verify` runs axe over every route template. **Treat a green
run as a floor, not a pass.** Automation covers a well-defined minority
of accessibility (roughly 17% of WCAG AA success criteria, though those
happen to include most of what people get wrong in practice). The rest
is judgment, and it is the part that has to be raised in conversation
rather than discovered by a test.

### Rules

* **Text color comes from the palette tokens in
  `src/styles/global.css`.** The comment on that block states the
  grounds, the exceptions, and the no-opacity rule; read it before
  touching a color. Animate hover with `transition-colors`. Opacity is
  for what it means: fading in or out, and decorative `aria-hidden`
  icons.
* **Leave contrast margin.** axe truncates to two decimals, so 4.499
  reports as 4.49 and fails. A value that lands on 4.50 is one rounding
  step from breaking. This is how the first bug here shipped.
* **A hover state must raise contrast, never lower it.** Emphasis that
  dims is backwards, and no test catches it.
* **Interactive targets stay at least 24x24px**, using padding with
  negative margin where the visual size is smaller.

### What the tests cannot see

These need a human pass whenever the relevant area changes, and Claude
should raise them rather than wait:

* **Whether alt text is meaningful.** axe checks that `alt` exists, not
  that it says anything. Images in `src/content/` are Aaron's, so
  flag a bad one, never rewrite it.
* **Whether focus order matches reading order**, and whether focus is
  visible at every step. Tab through anything new.
* **Whether a screen reader can operate it.** The known gap is
  `NavItem.astro`: a CSS-only menu has no live `aria-expanded` and
  no Escape-to-close, and axe passes it regardless. Any new
  interactive component needs this thought through before it ships.
* **Whether text on a gradient or image is readable.** axe returns
  these as `incomplete`, not as a pass. `tests/a11y/axe.spec.ts`
  asserts the incomplete set stays exactly the known header items, so a
  new one fails the run until someone measures it by hand.
* **Whether motion respects `prefers-reduced-motion`.** Every animation
  added needs the query.
* **Whether it works at 200% zoom and at 320px wide**, without
  horizontal scrolling.

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
* `.npmrc`'s `ignore-scripts` blocks Playwright's browser download, so
  a fresh clone needs `npx playwright install chromium`.
* **If port 4321 is in use, stop and tell Aaron.** Playwright refuses
  to run when anything already answers on the port, and the thing
  answering is almost always Aaron's own `npm run dev` in a PhpStorm
  terminal. Do not investigate the process, do not trace its
  ancestry, do not kill it, do not work around it with
  `reuseExistingServer`. Say that verify cannot finish because a dev
  server holds port 4321, and ask him to stop it if it is his. Then
  re-run verify once he says it is stopped.
