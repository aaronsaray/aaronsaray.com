# DESIGN.md

Design decisions for the aaronsaray.com redesign. This file grows as
decisions are made — during inspiration review, prototyping, and beyond.
Each decision gets recorded here so it's not re-litigated later.

Decisions below come from two rounds: the inspiration review
(`.design/INSPIRATION.md`, reviewed August 26, 2026 — archived, full
per-image context lives there) and the prototyping sessions that
produced `.design/home.html`, `.design/blog-single.html`, and
`.design/blog.html`. The prototypes are the visual authority; this file
is the written one. When they disagree, ask Aaron.

## Site-Wide

* **The entire site is dark.** No light mode, no theme toggle. Article
  pages get a deliberate dark reading treatment — not an afterthought.
* **No search functionality.** Anywhere. No search box in the header, no
  ⌘K palette.
* **Background is near-black, not pure black**, and darker than typical
  "dark mode" grays. Decided: `#0a0a0a` (`--color-night`).
* **Monochromatic accent-tinted surfaces:** surface colors (cards, chips,
  bands) are tinted toward the accent hue rather than neutral gray, so
  accents feel related to the base instead of stuck on. Realized as
  `--color-surface: #10141a` (cool tint toward the steel-blue accent).
* **Layout frame:** page chrome (header, footer, homepage sections) uses
  a `max-w-6xl` centered container; reading pages (blog index, blog
  post) use a `max-w-3xl` column. Padding `px-5` mobile / `px-8` from
  `sm:` up.
* **Custom scrollbar:** very dark and muted (`#2c3238` thumb on the
  night background) but still findable.
* **Smooth in-page anchor scrolling** (`scroll-behavior: smooth`),
  turned off under `prefers-reduced-motion`.

## Typography

Typefaces decided during prototyping (August 2026):

* **Inter** for body/UI (`--font-sans`, fallback ui-sans-serif /
  system-ui).
* **Fraunces** as the serif display face (`--font-display`, fallback
  ui-serif / Georgia) — blog post titles, section headers, entry titles,
  footer CTA titles, beliefs statements.
* **Mono is the system stack** (`ui-monospace` / SF Mono / Menlo /
  Consolas) — no webfont for code.
* Both webfonts are self-hosted variable fonts (Inter 400–900,
  Fraunces opsz 9–144 + wght 400–700), latin subset, served from
  `public/fonts/` and preloaded. The site makes no third-party
  requests.
* **Serif display face for blog post titles and section headers**, in
  bright white — the serif-against-sans contrast plus the brighter color
  is the liked pattern. Body stays sans.
* **Body is a regular sans.** Never a monospace or mono-look face for
  prose.
* **Hierarchy on dark comes from size, weight, and lightness** (white →
  grays), not from color hues.

## Color

Palette decided during prototyping (August 2026) and final: off-white
ink and a muted steel-blue accent on off-black, surfaces cool-tinted
toward the accent. The `@theme` tokens:

* `--color-night: #0a0a0a` — page background
* `--color-surface: #10141a` — cards, chips, code blocks, dropdown
  panels
* `--color-ink: #e7e9ec` — primary text
* `--color-ink-dim: #8e959e` — secondary text (subtitles, descriptions,
  intro lines)
* `--color-ink-faint: #5d646d` — tertiary text (meta lines, column
  labels, quiet icons)
* `--color-prose: #bfc5cc` — article body text only: brighter than
  ink-dim for long-form reading, below full ink so headings still lead
* `--color-accent: #537e9e` — the emphasis color; `#7fa6c4` is its
  brighter hover companion
* `--color-hairline: #1b2026` — separators and borders

Supporting decisions:

* Headings and the hero name push past ink toward white (`text-white`,
  hero name `#dfe2e6`).
* One-off colors: `#b08d57` amber for the old-post notice icon; syntax
  highlighting is a desaturated near-monochrome set (keywords/types
  `#7fa6c4`, strings `#a3b389`, variables/numbers `#c2a583`,
  function/class names `#dde0e4`, comments ink-faint italic).
* The accent color does the emphasis work: tag links, link underlines,
  numbered eyebrows, hover borders and icons.
* Avoid the blue-purple AI cliché (see Overall Direction).

## Logo

* **Redone and final:** the mark is `.design/logo.svg`; the old
  hand-edited mark is archived as `.design/logo-archive.svg`.
* The draft is **two-tone**: one element in ink (`#e7e9ec`), one in the
  accent (`#537e9e`). Flat fills, no gradients or outlines.
* Placed top-left in the header at `h-8`, and repeated as the brand mark
  in the footer.

## Header / Navigation

* **Compact single-row slim top bar:** logo left (`h-8`), nav links
  right. No social icons in the header — those live in the footer.
* No search box (site-wide decision).
* **Nav structure (decided Aug 26, 2026):** About ▾ (Who am I, CV) —
  Writing ▾ (Blog, Books) — Contact. Chevron indicators on the two
  dropdown triggers.
* **Nav links rest at 60% opacity and reach full on hover** (opacity as
  state); dropdown items rest at 70%.
* **Dropdown panels:** surface background, hairline border, square
  corners, right-aligned under the trigger. Open on hover/focus-within.
  Timing is in Motion.
* **On the homepage the header overlays the hero** (absolutely
  positioned over the full-viewport section); on every other page it
  sits in normal flow. Same bar either way.

## Homepage

First design target — prototyped in `.design/home.html`. All copy in it
(beliefs statements, help descriptions) is placeholder that Aaron
rewrites. Structure, top to bottom:

* **Full-viewport hero, left-aligned** (not centered), heavy-weight
  type, tight letter-spacing and line-height. Flat background — no
  gradient/texture in the hero. The three lines read as one sentence:
  * "Hi, I'm" — grey, sentence-case, led by a short hairline rule that
    starts at the left margin; the rule's length optically aligns the
    "Hi" with the top of the A in "Aaron" (alignment is to the glyph's
    ink, derived from the name's font size — not a fixed indent)
  * "Aaron Saray" — still the largest element, but restrained (not
    viewport-filling)
  * "I make things better" — smaller than the name and dimmer than
    full white
  * "let me show you how" — lighter gray, centered horizontally at the
    bottom with a gently-animated scroll-down chevron
* **Beliefs/manifesto section after the hero:** a multi-column grid
  (3-up desktop, 2-up tablet, single column mobile) of short punchy
  statements, each a small uppercase letterspaced accent eyebrow with
  sequential numbering ("#01"…) over a bold serif statement. No
  paragraphs. Six statements in the prototype. Items fade-and-rise in
  as they enter the viewport via pure-CSS scroll-driven animation
  (`animation-timeline: view()`) with a gentle left-to-right stagger —
  progressive enhancement, honors `prefers-reduced-motion`, no JS.
* **"How I can help" section:** an editorial index — full-width rows
  with hairline separators, serif row titles (As a programmer / As a
  coach / As a CTO) beside a short sans description, two-column from
  `md:` up. Deliberately unlike the beliefs grid and the footer CTA
  boxes. Rows use the same scroll-driven reveal.
* **Two-tone kicker closes the section** (the one permitted use of the
  two-tone headline treatment): dim phrase, bright payoff.
* Then the footer. That's the whole page — no further homepage sections.

## Blog Post Pages

Second design target — prototyped in `.design/blog-single.html`. Main
style reference was the Tempest PHP blog, as direction not copied. The
prototype's `.prose` stylesheet is written as element rules on purpose:
it is the typography stylesheet the Astro markdown pipeline will need.

* **Serif title** (bright white, `text-4xl`/`text-5xl`).
* **REVERSED (August 27, 2026): subtitles are scrapped.** The prototype's
  sans subtitle line under the title does not exist in the built site —
  post pages go title → meta line. No subtitle field, no placeholder
  copy. (Decided during migration planning; `.design/*.html` left
  untouched per Aaron.)
* **Meta line: no author name** (single-author site). Date · read time ·
  `#tag` hash links, in ink-faint with middot separators; tags in the
  accent color, brightening to `#7fa6c4` on hover. Hairline rule below.
* **Old-content notice** (post older than 18 months, carrying over the
  Hugo behavior): bordered surface box under the meta line, amber
  history icon, bold lead-in sentence.
* **Body:** `--color-prose` sans at `1.0625rem` / 1.75 line-height in
  the `max-w-3xl` column; `1.25rem` between blocks.
* **Links:** brighter than body (ink → white on hover), underlined 1px,
  underline in the accent at 60% (full accent on hover), offset 4px.
  The underlined style is decided; the no-underline alternate is dead.
* **Heading anchors:** every h2/h3 is a self-link. A small Tabler link
  icon rides after the heading text at all times, faint, warming to the
  accent on hover; headings get `scroll-margin-top`.
* **Inline code:** subtle chips — surface background, hairline border,
  tight padding (`0.125rem 0.375rem`), system mono at 0.875em.
* **Code blocks:** surface background with hairline border, exactly the
  prose column width — never bleeding wider. Every block carries a
  language tag and a copy button (copy icon flips to an accent check
  for 1.5s). Blocks with a filename get a **filename header bar**
  attached to the block's top (night background, per-language Tabler
  file icon, filename scrolls alone if too long; language tag + copy
  button pinned right); bare blocks float the controls in the top-right
  corner. Copy-to-clipboard is a few lines of inline vanilla JS — no
  framework island.
* **Syntax highlighting:** the desaturated near-monochrome token
  palette (see Color); the accent hue does keyword duty.
* **Blockquote:** quiet accent left spine, brighter (ink) text.
* **Tables:** hairline row rules only — no zebra, no chrome; uppercase
  letterspaced faint headers; first column in ink. Wrapped in an
  `overflow-x-auto` div so a wide table scrolls itself, never the page
  (Astro build: add the wrapper via rehype plugin).
* **Images/figures:** centered, framed in a bordered surface box,
  capped at prose width.
* **header-call-out shortcode** (editorial context before the body):
  accent left spine on a faint surface band, slightly smaller ink-dim
  text.
* **Laravel podcast CTA** on posts tagged laravel (current Hugo
  behavior carries over): bordered box after the article with a 2px
  accent top edge.
* **Footer of the article: a centered "Go to all posts" back link**
  with a left arrow that slides on hover, matching the footer CTAs.
* **No breadcrumbs** — resolved by the prototype: the back link plus
  the header nav cover the need, and breadcrumbs were inconsistent on
  non-nested pages anyway.
* **No author bio block** at the end of posts (can be reconsidered
  later). No subscribe/newsletter section.

## Blog Index

Derived page, prototyped in `.design/blog.html` (rendered as page 2 of
71 to show full pagination).

* Serif "Blog" page title, then an ink-dim intro line: entry count and
  ordering, plus a quiet cross-sell sentence linking to the books page
  ("Looking for something meatier? Check out my books.") styled exactly
  like an article link — a sentence, not a boxed callout.
* **Entry list:** hairline dividers between entries, nothing heavier.
  Each entry is the serif title (linked, white, hover shows an accent
  underline that fades in — the underline is always present but
  transparent at rest so only its color animates), then the teaser,
  then the same date · read time · `#tags` meta line as the post page.
* **REVERSED (August 27, 2026): the teaser is the excerpt, not a
  subtitle.** The prototype's one-line subtitle slot renders the post's
  `<!--more-->` excerpt (Hugo behavior kept), in ink-dim.
* **Pagination:** 10 posts per page. "← Newer" left, "Older →" right,
  in ink-dim with arrows that slide on hover; a "Page X of Y" indicator
  centered between them, one size smaller (`text-xs`) in ink-faint —
  supporting information, not the same weight as the links. On page 1
  the Newer link simply isn't rendered; same for Older on the last
  page.

## Footer

* **The footer does real work — not minimal or boring.** It is
  identical on every page.
* Hierarchy, top to bottom: two primary CTA boxes (the two main tasks to
  take) → brand mark → full sitemap-style link columns → bottom meta row.
* **Treatment:** hairline top border on a faint surface wash
  (`bg-surface/40`). CTA boxes ("Read the blog" / "Say hello"): hairline
  border, serif title, short ink-dim description, right arrow icon; on
  hover the border warms to accent-at-75% and the arrow slides right.
  Column links use opacity-as-state (60% → 100%).
* The footer RSS link points at `/blog/index.xml` (the URL the feed
  already lives at — see CLAUDE.md).
* **Link columns (decided Aug 26, 2026):**
  * Site — full page list (Home, Who am I, CV, Blog, Books, Contact)
  * Find Me — GitHub, CodePen, LinkedIn, Twitter
  * Projects — Laravel Podcast, Learn the Phonetic Alphabet,
    Typesetter.io (no referral query params — the Hugo site's `?rel=as`
    does not carry over). ChickenFacts is dropped — that site is coming
    down.
  * Other Sites — More Better Faster, Mastering Laravel, 1lastcheck
* **Bottom meta row:** copyright/license left, RSS feed link right —
  they're the same tier of supporting information.
* **No Fathom privacy CTA** in the new site (the Hugo footer's
  "I don't invade your privacy" band does not carry over).
* No tag-page links in menus or footer — tag pages exist (see Tags),
  they're just not linked from navigation chrome.

## Tags

* **Tags stay. Non-negotiable** (decided August 26, 2026). The taxonomy
  migrates, and every tag gets a tag page — layout probably similar to
  the blog index. Tag URLs (`/tag/<term>/`) keep resolving.
* The earlier "tags migration unknown" worry was really about the
  OG-image-per-tag scheme (Hugo picks `images/tag/<first-tag>.jpg` for a
  post's social image), not about whether tags exist. That OG question
  stays open — tracked in CLAUDE.md.
* Presentation in post meta lines: the `#laravel` hash-link candidate
  (see Blog Post Pages).

## Texture & Effects

All of these are liked, and all are **use sparingly** — one per page at
most, never stacked:

* Subtle theme-reinforcing gradient/texture at the top of a page that
  fades into the flat background — atmosphere, not decoration.
* Compressed scanline texture as a band at the top or bottom of a page
  only. Never mid-page.
* Radial gradient glow behind a single hero element. Effective in
  isolation, cliché when repeated — don't overuse.
* Opacity as state: interactive logo/item rows sit at reduced opacity,
  full brightness on hover/active.
* Two-tone headline (bright phrase / dim phrase in one line): only where
  it really makes sense, never a default treatment, and with gentler
  contrast than the Raycast reference.
* Small accent-color pill tags for status metadata.
* Separators: solid 1px hairlines, not gradients — and few of them.

## Motion

* **Hover transitions are deliberately unhurried** — links and hover
  states animate noticeably slower than browser defaults; nothing snaps.
  The standard duration is **300ms**.
* **Dropdown menus:** open instantly (200ms fade with zero delay), but
  linger **300ms** before fading out on mouse-away. The trigger's hover
  state and its panel are locked to the same timing — they appear and
  dim together.
* **Hover accents stay muted:** hover borders/icons reach only partial
  accent brightness (~75%), never full intensity.
* **Arrow icons slide on hover** (footer CTAs, pagination, back links):
  a 4px translate in the arrow's direction over the standard 300ms,
  with the icon warming to accent-at-75%.
* Scroll cue animates with a small, slow drift — movement is minimal
  (3px translate over a 3s ease-in-out loop, with an opacity swell).
* **Scroll-driven reveals** (homepage grids): fade + small rise as
  items enter the viewport, pure CSS `animation-timeline: view()`,
  disabled under `prefers-reduced-motion`, absent in browsers without
  support — content just shows.

## Overall Direction

* **Do not look AI-generated.** The site must not resemble the default
  AI-designed aesthetic. Concretely, avoid:
  * Random/decorative gradients
  * The blue-purple palette cliché
  * Oversized rounded corners and pill shapes (`rounded-2xl` everything)
  * Generally: anything that reads as "every AI-generated landing page"

## Will Not Do

Hard decisions from the inspiration review:

* **No panel grids of "4 of something"** — icon + bold title + short text
  cards in a 2×2/row grid. Too common, too weak, too corporate.
* No light/white pill buttons on dark backgrounds.
* No glowing status dots.
* No too-bright, glowy headline treatments.
* No search (recorded above; repeated here because it's a hard decision).

## Iconography

* **Tabler Icons** for all icons.

## Not Yet Designed

No open design decisions — everything above is settled and the
prototypes are the target. These pages just haven't been drawn yet;
all derive from the source designs (probably during the Astro build):

* Tag pages (probably similar to the blog index — see Tags)
* Who am I, CV, Contact, Books, 404
