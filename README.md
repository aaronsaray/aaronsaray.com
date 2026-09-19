# aaronsaray.com

Source for [AaronSaray.com](https://aaronsaray.com).

## Tech

`make` lists every command.

* [Astro](https://astro.build): builds the static site.
* [TypeScript](https://www.typescriptlang.org): types for the `.ts` files and the script in every `.astro` file. `astro check` is the type-checker.
* [Tailwind CSS](https://tailwindcss.com): styling. v4, so the config is `src/styles/global.css`.
* [Volta](https://volta.sh): pins Node and npm, in `package.json`.
* [Make](https://www.gnu.org/software/make/): every repeated command is a target.
* [Prettier](https://prettier.io): formatting. Separate from ESLint: `eslint-config-prettier` turns off ESLint's own formatting rules.
* [ESLint](https://eslint.org): lints the JS, TS, and Astro files.
* [markdownlint](https://github.com/DavidAnson/markdownlint-cli2): lints the docs. All three skip `src/content/`.
* [Playwright](https://playwright.dev): browser tests, with [axe](https://github.com/dequelabs/axe-core) for the accessibility sweep.
* [GitHub Actions](https://docs.github.com/actions): runs `make ci` on push.

## Writing a Blog Post

```shell
make post TITLE="My Post Title"
```

* Remove `draft: true` to publish.
* The first tag picks the post's social card image.
* A new tag gets a line in `scripts/stubs/post.md`. The build names the file and image it needs.
* `evergreen: true` turns off the old-post notice.
* Body headers start at H2. The post title is the H1.
* `/proofread <slug>` and `/fact-check <slug>` in Claude Code; with no argument they take the post modified in git. Both only report. The habits `/proofread` leaves alone are the bullets in `.claude/skills/proofread/voice.md`.
* `/related <what you remember writing about>` prints paste-ready links to older posts. With no argument it checks its index against the posts and proposes the rows to change.
* Link to another post by its final URL (`/2023/some-slug/`).

### Post Behaviors

`make post` writes a draft dated today from `scripts/stubs/post.md`, prints its path, and stops if the file exists.
The filename is the URL slug and the date's year is the URL path: `/2026/my-post-title/`. `draft: true` keeps the post out of every build,
and `make dev` shows it with a Draft badge. `context:` renders the "Context:" pills under the meta line.
`<!--more-->` ends the excerpt shown on lists, in feeds, and as the meta description.

### Code

Inline code is single backticks. A block is a fence with a language, which labels the block beside its copy button. A fence with no language is labeled `txt`.

````markdown
```php
class User {}
```
````

### Code Filenames

````markdown
```php filename="app/Models/User.php"
class User {}
```
````

### Output

Terminal output: a terminal label and no copy button.

````markdown
```output
OK (3 tests, 5 assertions)
```
````

### Callouts

A callout and a markdown blockquote render as the same box.

```markdown
:::callout
Editorial note about this entry, not part of it.
:::

> Editorial note about this entry, not part of it.
```

### Images

```markdown
![Alt Text](/uploads/2026/file.png)

[![Alt Text](/uploads/2026/file.png)](/uploads/2026/file.png)
```

The second opens on click, and its target can also be a document. A lone image renders as a framed figure. A caption is its own paragraph below the image.

The build stamps image `width` and `height`. A retina capture named `file@2x.png` or `file@3x.png` is stamped at half or a third of its pixels.

## Updating the CV

`src/content/pages/cv.md`. Each kind of entry is typed one way, because the `.cv` rules in `src/styles/global.css` key on its shape.

* Dates are `Mon YYYY`, a bare `YYYY`, or a range with the word "to" (`Oct 2018 to present`). Never a slash or a dash.
* A plain paragraph, like a section intro, takes no italic or bold. The first one in any paragraph is styled as an entry's date or title.

### CV Behaviors

Frontmatter `title` is the H1 and `intro` is the lede. The section index under them is the H2s in file order.

### Roles

The date in italics is the H4's first thing. Roles at one organization share its H3.

```markdown
### Talimer, Milwaukee, WI

#### *Nov 2020 to Feb 2021* Advisory Chief Technology Officer

As the Advisory CTO at Talimer, I help review decisions ...

#### *Jan 2020 to Nov 2020* Chief Technology Officer

Freelancer's first is the Talimer motto ...
```

### Talks and Credentials

One table row: the date, then the title, then the venue or issuer in italics.

```markdown
| Oct 2019 | The Freelance Economy Panel *FallX19 Fall Experiment, Milwaukee, WI* |
```

### Community

The date in italics, then the organization in bold.

```markdown
*2019 to 2020* **[i.c.Stars](https://milwaukee.icstars.org)** Community volunteer.
```

### Publications

The title in bold, linked or not.

```markdown
**[Securing Laravel](https://nocompromises.gumroad.com/l/securing-laravel)** A free e-book ...
```

## Adding a Book

Copy a file in `src/content/books/` and put the cover image beside it.

* `order` sorts the list, lowest first.
* `cover` is the flat front cover, any size.

## Layout

* `src/content/blog/` is the posts, `src/content/tags/` is per-tag prose, `src/content/pages/` is the cv and colophon bodies, `src/content/books/` is one file per book on `/books/`.
* `src/pages/` is the routes, including hand-rolled RSS feeds (`/blog/index.xml`, per-tag), `sitemap.xml`, and `/logo.svg`. They stay that way rather than move to the Astro packages; `src/lib/rss.ts` and `src/pages/sitemap.xml.ts` say why at the top.
* `src/plugins/` is the markdown pipeline (code chrome, callouts, figures, heading anchors, image attributes, Shiki theme). Every file in `src/content/pages/`, `src/content/tags/`, and `src/content/books/` declares `anchorDepth`, the deepest heading level that gets an anchor link, 0 for none; posts do not, and link H2 and H3.
* `src/icons/` is the Tabler icon set, one SVG per name, rendered with `<Icon name="arrow-right" class="size-4" strokeWidth={1.5} />`. Adding an icon is dropping the Tabler file into the folder.
* `src/assets/logo.svg` is the mark, the one file it lives in; `/logo.svg` is built from it. Updating the mark is replacing this file and putting the two `style` fills (`--logo-s`, `--logo-a`) back on the paths; the build fails without them.
* `src/konami/` is the Konami-code easter egg, described below.
* `public/` is static files served verbatim (`uploads/`, favicons, `_redirects`, `_headers`).
* `tests/` is the Playwright suite: `e2e/` for behavior, `a11y/` for the axe sweep, `routes.ts` for the route table both read. A run writes one draft fixture post into the blog collection and removes it afterward; `make clean` removes a leftover.

## The Konami Code

Up, Up, Down, Down, Left, Right, Left, Right, B, A on any page. A desert drops in over the lower three quarters of the window, something runs across it, and it hoists back out. Escape ends it early. Keys typed into an editable field do not count.

## URLs

Blog permalinks are `/:year/:slug/`: the filename is the slug, the date's year is the year.

## To-Do for Launch

* [ ] full code review
* [ ] deploy to cloudflare pages
* [ ] disable email obfuscation on cloudflare - dont need that js
* [ ] page speed - lighthouse stuff
