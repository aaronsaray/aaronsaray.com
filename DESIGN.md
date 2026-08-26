# DESIGN.md

Design decisions for the aaronsaray.com redesign. This file grows as
decisions are made — during inspiration review, prototyping, and beyond.
Each decision gets recorded here so it's not re-litigated later.

Most decisions below were promoted from the inspiration review
(`.design/INSPIRATION.md`, reviewed August 26, 2026). That file holds the
full per-image context and is archived; this file is the authority going
forward.

## Site-Wide

* **The entire site is dark.** No light mode, no theme toggle. Article
  pages get a deliberate dark reading treatment — not an afterthought.
* **No search functionality.** Anywhere. No search box in the header, no
  ⌘K palette.
* **Background is near-black, not pure black** (the `~#0a0a0a` family),
  and darker than typical "dark mode" grays. Final value comes with the
  palette.
* **Monochromatic accent-tinted surfaces:** surface colors (cards, chips,
  bands) are tinted toward the accent hue rather than neutral gray, so
  accents feel related to the base instead of stuck on. Applies whatever
  the final hue is.

## Typography

* **Inter-class grotesque for body/UI; final typeface choice pending.**
  Aaron likes the Inter look but is open to other fonts in that family
  (neo-grotesque sans-serifs). Decide during prototyping.
* **Serif display face for blog post titles and section headers**, in
  bright white — the serif-against-sans contrast plus the brighter color
  is the liked pattern. Body stays sans.
* **Body is a regular sans.** Never a monospace or mono-look face for
  prose.
* **Hierarchy on dark comes from size, weight, and lightness** (white →
  grays), not from color hues.

## Color

* Palette undecided. Liked combinations to draw from:
  * Off-white + yellow accent on dark navy ("in your face yet not too
    bright")
  * Deep navy/teal
  * Accent-tinted dark surfaces (see Site-Wide)
* The accent color does the emphasis work: two-tone wordmark, numbered
  eyebrows, status pills.
* Avoid the blue-purple AI cliché (see Overall Direction).

## Logo

* **The AS mark gets redone as a new SVG.** The current one
  (`themes/aaronsaray/static/logo.svg`) is hand-edited and not great.
* Direction decided when the logo work happens: either the same design
  made more geometrically clean, or a merged shared-stroke style — "an A
  shape that is an A but not obvious" (ligature, negative-space counters,
  diagonal notch cuts).
* Single flat color, no gradients or outlines — must read at any size and
  sit on dark backgrounds.
* Placed top-left in the header.
* Two-tone wordmark is an option if a wordmark accompanies the mark: word
  in neutral, one element in the accent color.

## Header / Navigation

* **Compact single-row slim top bar:** logo left, nav links right
  (possibly with social icons). Minimal vertical cost.
* No search box (site-wide decision).
* Dropdown chevron indicators are fine on nav items that have children.
* **Nav structure (decided Aug 26, 2026):** About ▾ (Who am I, CV) —
  Writing ▾ (Blog, Books) — Contact.

## Homepage

First design target. Structure, top to bottom:

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
* **Beliefs/manifesto section after the hero:** a multi-column grid of
  short punchy statements, each a small uppercase letterspaced accent
  eyebrow with sequential numbering ("#01"…) over a two-to-three-line
  bold serif statement. No paragraphs.
* Further homepage sections TBD during prototyping.

## Blog Post Pages

Second design target. Main style reference is the Tempest PHP blog — as
direction, not copied identically.

* **Serif title** (bright white) with a subtitle/secondary line under it.
* **Meta area: no author name** (single-author site). Potentially a sub
  header, then the date and tags, likely.
* Tag presentation candidate: `#queues`-style hash links in the meta line
  (date — read time — tag). Tags migration itself is still open.
* Body: regular sans with strong color/contrast against the dark
  background; generous paragraph and line spacing.
* **Links:** slightly brighter than body text, underlined, with the
  underline in a different color than the text. (Alternate liked style:
  non-underlined colored links that read as links by contrast alone —
  Tempest's underlined style is the default direction.)
* **Inline code:** subtle slightly-less-dark background chips. Keep the
  treatment light — not a heavy background with loose padding.
* **Code blocks:** clearly distinct elements from the prose, but the
  **same width as the prose column** — never bleeding wider.
* Tables: clean and simple.
* **No author bio block** at the end of posts (can be reconsidered
  later). No subscribe/newsletter section.
* Breadcrumbs: unresolved — liked in the reference, but inconsistent on
  non-nested pages (CV, contact). Needs more consideration.

## Footer

* **The footer does real work — not minimal or boring.**
* Hierarchy, top to bottom: two primary CTA boxes (the two main tasks to
  take) → brand mark → full sitemap-style link columns → bottom meta row.
* **Link columns (decided Aug 26, 2026):**
  * Site — full page list (Home, Who am I, CV, Blog, Books, Contact)
  * Find Me — GitHub, CodePen, LinkedIn, Twitter
  * Projects — Laravel Podcast, Mastering Laravel, Learn the Phonetic
    Alphabet, Typesetter.io (keep the `?rel=as` referral params from the
    Hugo site). ChickenFacts is dropped — that site is coming down.
  * Other Sites — More Better Faster, 1lastcheck
* **Bottom meta row:** copyright/license left, RSS feed link right —
  they're the same tier of supporting information.
* **No Fathom privacy CTA** in the new site (the Hugo footer's
  "I don't invade your privacy" band does not carry over).
* No tag-page links in menus or footer — tags get handled later.

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
* **Dropdown menus:** open instantly, but linger briefly before fading
  out on mouse-away. The trigger's hover state and its panel are locked
  to the same timing — they appear and dim together.
* **Hover accents stay muted:** hover borders/icons reach only partial
  accent brightness (~75%), never full intensity.
* Scroll cue animates with a small, slow drift — movement is minimal.

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

## Undecided

* Color palette (liked combinations recorded under Color)
* Layout system / grid
* Home page design (first design target)
* Blog entry page design (second design target)
* Breadcrumbs on blog pages
* Tags migration approach (presentation candidate exists)
