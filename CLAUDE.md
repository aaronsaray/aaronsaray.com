# CLAUDE.md

aaronsaray.com: a static Astro site styled with Tailwind CSS v4, npm,
Node pinned via Volta. `make` lists the commands. `README.md` is
Aaron's authoring how-to: posts, the CV, books, icons. Look Astro
behavior up through the `astro-docs` MCP server before stating it or
relying on it.

## Hard Rules

* **URLs never change.** Blog permalinks are `/:year/:slug/`
  (filename = slug, date's year = year). Every page and feed URL
  keeps resolving.
* **Aaron's prose is his.** That is `src/content/` and the page copy
  in `src/pages/`, punctuation and style included. Claude never edits
  it unasked, and never inside a mechanical change. Mechanical
  transforms (frontmatter, markup) and whitespace a linter flags need
  no asking. His habits, the spaced hyphen ` - ` first among them, are
  never flagged or converted, in the content or in feedback on a
  draft; `.claude/skills/proofread/voice.md` lists them. When he asks
  for a draft, Claude writes it into the file, unmarked, under the em
  dash rule below; adding his habits is his edit. "Give me some
  options" gets several in chat, in his register.
* **No em dashes in what Claude writes**: docs, comments, drafted
  copy, commit messages. That covers the en dash used as one and the
  ASCII stand-ins ` - ` and ` -- `. Use a period, comma, colon, or
  parentheses.
* **A comment answers a question the code raises and cannot answer.**
  There are four, and a comment that answers none is cut:
  1. Can I delete or change this? No, and here is what breaks. The
     `crossorigin` on the font preloads in `Base.astro` is the model.
  2. Why is this shaped so strangely? An external fact a reader would
     not guess: a third-party ordering, a platform quirk, a tool that
     misbehaves under one condition.
  3. What elsewhere depends on this? Coupling across files: hexes that
     mirror tokens in another file, a script whose selectors depend on
     the DOM a plugin emits.
  4. Where does this number come from? The derivation or source of a
     value that is not self-evident.

  Comments describe the code as it stands, never as a diff. Lead with
  the fact, in the fewest words that carry it. Rationale that answers
  none of the four is written down nowhere.

  A file header sits on line 1 and says what the filename leaves out:
  what runs the file and how to run it, what it reads and writes, what
  it emits that other files depend on. A header that restates the
  filename ("the book component") is cut.
* **A guard stays only when, without it, the build or page carries on
  wrong.** One that rewords an error the platform already throws is
  cut, and so is one for a state the types rule out.
* **`README.md` is Aaron's how-to, not a description of the site.** A
  line belongs there when he would open the file to find out how to do
  something, so a new feature earns one only when it changes what he
  types. The Tech list is one bullet per high-level tool, its name
  linked, saying what it does here.
* **A rule is written in one place.** Where it bears on one block of
  code (the palette tokens in `global.css`), that block carries the
  lines a person needs at the point they would break it, and nothing
  else repeats them.
* **`.DS_Store` files are always mistakes.** Delete one wherever it
  shows up, disk or index.

## Building and Verifying

* `make verify` is the only gate: a new check goes inside it, never
  beside it, and CI runs nothing else. It is slow, so it runs when
  Aaron asks for it or once at the end of a feature, never after each
  small edit. A small change gets the narrowest target that would
  notice it (`make check`, `make lint`,
  `make test ARGS="--grep copy"`), and the reply says which target ran
  and that verify did not.
* Every repeated command is a make target. `package.json` scripts are
  single-tool leaves, each with a same-named target; the Makefile
  composes them.
* `make lint-fix` formats and fixes. Never hand-format against
  Prettier. Every linter skips `src/content/`. Linters run through
  their make targets, never invoked directly.
* AI tooling is project-scoped: `.mcp.json`, `.claude/settings.json`,
  `.claude/skills/`, `.claude/rules/`. Never user-level config.
* `.npmrc` sets the supply-chain rules: a 7-day release cooldown, no
  install scripts, exact pins. Never weaken one to make an install
  work; tell Aaron.
* **Tests live by `.claude/skills/testing/SKILL.md`**: what gets
  tested, where a test goes, the stale cache, and port 4321. Read it
  before running, adding, or changing one.

## How the Site Works

* **Dates are strings end to end**, never coerced to `Date`: timezone
  math could shift a post's URL year. Year is `date.slice(0, 4)`;
  sorting is lexicographic.

## Rules That Load by Path

`.claude/rules/` holds the rest of this file: rules that load when
the Read tool opens a file matching their `paths:` frontmatter. Before
editing such a file reached any other way (`cat`, `grep`, a new file),
read its rule. They carry the same weight as this file. When a change makes one untrue, or
a new rule matters only to those files, the edit goes there, and a new
rule file gets a line here.

* `astro-templates.md`: template comments, `{" "}`, SVG and the logo.
* `design-and-accessibility.md`: where a style lives, the palette and
  contrast rules, what axe cannot judge.
