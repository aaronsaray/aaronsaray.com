<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/logo-dark.svg">
    <img src=".github/assets/logo-light.svg" width="96" alt="">
  </picture>
</p>

<h1 align="center">aaronsaray.com</h1>

<p align="center">
  <a href="https://github.com/aaronsaray/aaronsaray.com/actions/workflows/ci.yml"><img src="https://github.com/aaronsaray/aaronsaray.com/actions/workflows/ci.yml/badge.svg?branch=main" alt="ci"></a>
  <a href="https://aaronsaray.com"><img src="https://img.shields.io/website?url=https%3A%2F%2Faaronsaray.com&label=site" alt="site"></a>
  <a href="https://astro.build"><img src="https://img.shields.io/github/package-json/dependency-version/aaronsaray/aaronsaray.com/astro?label=astro" alt="astro"></a>
</p>

---

## Tech

`make` lists every command.

* [Astro](https://astro.build): builds the static site.
* [TypeScript](https://www.typescriptlang.org): type-checks the `.ts` files and every `.astro` script with `make check`.
* [Tailwind CSS](https://tailwindcss.com): styling. The config is `src/styles/global.css`.
* [Volta](https://volta.sh): pins Node and npm, in `package.json`.
* [Make](https://www.gnu.org/software/make/): every repeated command is a target.
* [Prettier](https://prettier.io): formatting.
* [ESLint](https://eslint.org): lints the JS, TS, and Astro files.
* [Playwright](https://playwright.dev): browser tests, with [axe](https://github.com/dequelabs/axe-core) for the accessibility sweep.
* [GitHub Actions](https://docs.github.com/actions): runs `make ci` on push; on `main`, a second job deploys the tested `dist/`.
* [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/): hosts `dist/`, with `public/_headers` and `public/_redirects` applied at the edge.

## Writing a Blog Post

```shell
make post TITLE="My Post Title"
```

Writes a draft dated today from `scripts/stubs/post.md` and prints its path. The filename is the URL slug and the date's year is the URL path: `/2026/my-post-title/`.

* `draft: true` keeps the post out of every build; `make dev` shows it with a Draft badge. Remove it to publish.
* The first tag picks the post's social card image.
* A new tag gets a line in `scripts/stubs/post.md`. The build names the file and image it needs.
* `context:` renders the "Context:" pills under the meta line.
* `evergreen: true` turns off the old-post notice.
* `<!--more-->` ends the excerpt shown on lists, in feeds, and as the meta description.
* Body headers start at H2. The post title is the H1.
* Link to another post by its final URL (`/2023/some-slug/`).
* `/proofread <slug>` and `/fact-check <slug>` in Claude Code report on a post and never edit it; with no argument they take the post modified in git. `/proofread` skips the habits listed in `.claude/skills/proofread/voice.md`.
* `/related <what you remember writing about>` prints paste-ready links to older posts. With no argument it checks its index against the posts and proposes the rows to change.

### Code

A block is a fence with a language, which labels the block beside its copy button. A fence with no language is labeled `txt`.

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

`src/content/pages/cv.md`. Frontmatter `title` is the H1 and `intro` is the lede; the section index under them is the H2s in file order. Each kind of entry is typed one way, because the `.cv` rules in `src/styles/global.css` key on its shape.

* Dates are `Mon YYYY`, a bare `YYYY`, or a range with the word "to" (`Oct 2018 to present`). Never a slash or a dash.
* A plain paragraph, like a section intro, takes no italic or bold. The first one in any paragraph is styled as an entry's date or title.

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

## Site Images

* An image in a page template goes in `src/assets/` and is imported, so the build optimizes it and stamps its size.
* `public/images/` holds the social cards, served as-is at fixed URLs. The build names the file each new tag needs.

## Icons and the Logo

```astro
<Icon name="arrow-right" class="size-4" strokeWidth={1.5} />
```

* A new icon is the Tabler SVG dropped into `src/icons/`. The filename is the `name`.
* A new `src/assets/logo.svg` needs the two `style` fills (`--logo-s`, `--logo-a`) put back on its paths. The build stops and prints the format.
* `.github/assets/` holds the README's two copies of the logo with plain fills, dark and light. A new logo means new copies.

## Business Card

```shell
make card
```

`business-card/README.md` has the MOO specs, the stock, and how to upload.

## Adding a Page

* A new page gets a line in `ROUTES` at the top of `tests/pages/all.spec.ts`. `make verify` fails until it has one.
* `/testing` in Claude Code loads the test rules from `.claude/skills/testing/SKILL.md`.

## The Konami Code

Up, Up, Down, Down, Left, Right, Left, Right, B, A on any page. The bunchie/oogmagoog is rendered into a claude-developed background.

## Deploy

CI deploys `main` to Cloudflare Workers with `make deploy`. The Worker is created by the first deploy from `wrangler.jsonc`,
never in the dashboard. One-time setup, done 2026-09-26:

* Cloudflare > Workers & Pages > Account details: copy the Account ID.
* My Profile > API Tokens > Create Token > template **Edit Cloudflare Workers**. Account Resources: the `me@aaronsaray.com` account. Zone Resources: Specific zone > aaronsaray.com.
* GitHub repo > Settings > Environments > New environment > `production`. Environment secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
* DNS > Records > Add record: Type `A`, Name `www`, IPv4 `192.0.2.1` (reserved placeholder), proxied, comment
  `proxied for redirect tooling`.
* Workers & Pages > aaronsaray-com > Domains > Add > Custom Domain: `aaronsaray.com`, subdomain field empty. Wait for
  status Active. Cloudflare adds the apex DNS record itself.
* aaronsaray.com zone > Rules > Overview > Create rule > Redirect Rule. Custom filter expression > Edit expression:

  ```text
  (not ssl) or (http.host eq "www.aaronsaray.com")
  ```

  URL redirect: Type Dynamic, Expression `concat("https://aaronsaray.com", http.request.uri.path)`, Status code 301,
  Preserve query string on. Deploy.
* SSL/TLS > Edge Certificates: HSTS on, Max Age 1 month.
* Security > Settings > Client-side abuse: Email Address Obfuscation off.
