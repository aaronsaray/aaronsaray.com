# Design Inspiration Notes

Review notes for the screenshots in [`inspiration/`](./inspiration/).
Process: Aaron reacts to each image first (what he likes, what he doesn't),
then Claude names the underlying techniques and patterns so they're
transferable. Each image is assessed fresh on its own — no cross-image
comparisons here. The holistic review across all images happens later,
when these notes get parsed and promoted to `DESIGN.md`.

## 1.webp

![1](./inspiration/1.webp)

Source: Ghost (ghost.build) landing page.

**Aaron's reaction:** Saved this as a homepage reference. Likes the big
bold font dominating the screen, the black color, and the lighter
color/smaller font for secondary text. Maps to his homepage idea: full-page
"Hi, I'm Aaron Saray and I make things better — let me show you how," with
a scroll-down cue and menus at top. Big/bold homepage is something he's
struggled to figure out; this struck him as the answer.

**Techniques identified:**

- Near-black charcoal background (~`#0a0a0a`, not pure black) with white
  headline and ~50%-gray supporting text — hierarchy via size/weight/
  lightness only, no color hues
- Massive heavy-weight grotesk headline with negative letter-spacing and
  tight line-height; fills most of the viewport
- Small "eyebrow" line above the headline — pattern candidate: eyebrow
  "Hi, I'm Aaron Saray" + huge headline "I make things better."
- Minimal top nav, small links
- Headline is left-aligned (not centered), which is part of the
  editorial/confident feel

**Decisions (to promote to DESIGN.md later):**

- Left-aligned headline, as in the reference.
- **Entire site is dark.** No light mode, no theme toggle. Article pages
  get a deliberate dark reading treatment.
- Homepage text hierarchy, top to bottom: "Hi, I'm" (small, eyebrow-style)
  → "Aaron Saray" (largest) → "I make things better" (slightly smaller
  than the name) → "let me show you how" (lighter gray, smaller, toward
  the bottom of the screen, paired with the scroll-down cue).
- The "AS" logo mark carries over (in redone form — a new SVG is
  planned), placed top-left (where the reference has the Ghost wordmark).
- **No search functionality** on the new site. (Site-wide decision, not
  specific to this image — candidate for CLAUDE.md/DESIGN.md when we
  promote; recorded once here to avoid duplication.)

## 2.webp

![2](./inspiration/2.webp)

Source: "Dear AI" pre-order page for *Co-Existence* by Ethan Mollick
(co-existence.ai).

**Aaron's reaction — likes:**

- The font colors against the background: off-white + yellow accent on
  dark navy. "In your face yet not too bright."
- The color juxtaposition (yellow accent on dark) is nice.
- The intro paragraph ("You're likely parsing this on someone's
  behalf…") — which is a **serif**. Aaron liked it *in this design
  specifically*, but his overall preference remains sans-serif fonts.
  Read: serif body can work on a dark page, but sans is the default.
- The compressed horizontal-line / old-TV-scanline texture — but only
  used **sparingly**, e.g., a band at the top or bottom of a page. The
  footer shows it working: clean, simple, pattern clearly visible.
  Mid-page it read as confusing/muddy (possibly screenshot artifact).
- Footer overall: clean and simple.

**Dislikes:**

- The glowing circle top-left (the green "CHANNEL OPEN" status dot).
- Background gradients.
- The pre-order endpoints section (row of white pill buttons) — hated.

**Neutral:**

- The 01–04 numbered-list section is "nice," maybe useful someday, but
  not core.

## 3.webp

![3](./inspiration/3.webp)

Source: Tempest PHP framework blog (tempestphp.com) — Brent's "A new
Markdown parser" post. Aaron: probably the main style reference for the
blog post pages — but not to be copied identically.

**Aaron's reaction — likes:**

- Top menu bar: logo left, nav links right (here: Community / Blog /
  Documentation / GitHub star count). **Without** the center search ⌘K
  box — no search on the new site.
- Breadcrumb: likes the design and the idea, but it may not be
  applicable in the final pass — it would look weird on non-nested pages
  (CV, contact), and having it only sometimes would be inconsistent.
  Unresolved — needs more consideration; to be figured out later.
- Serif title contrasting with the rest of the page.
- The subtitle/secondary line under the title, and the byline/date line.
  **Resolved:** no author name (single-author site). Aaron's meta area:
  potentially a sub header, then the date and tags, likely.
- Body font color/contrast on this background is great. But the body
  face itself is monospace (or a mono-look face — character widths are
  uniform), and once Aaron learned that, he's not into it: keep the
  color/contrast qualities, use a regular sans for body.
- Links: slightly brighter than body text, underlined, with the
  underline in a different color than the text.
- Inline code / pre styling: slightly-less-dark background chips around
  code. Nice.
- Table style: clean and simple.
- Paragraph and line spacing feels right.
- Secondary section headers — awesome, and confirmed: Aaron likes them
  *because* they're serif (same family as the title) combined with the
  brighter/whiter color. Serif headers + bright white is the liked
  pattern here.

**Dislikes:**

- Footer: too boring. (Acknowledged it fits this site's minimal blog
  purpose, but not what Aaron wants.)

## 4.webp

![4](./inspiration/4.webp)

Source: Yahoo Finance dark mode (Fortune article page).

**Overall:** way too busy, not directly applicable to the site — saved
for specific elements, not the layout.

**Aaron's reaction — likes:**

- Font choice and size again (bold sans headline, readable sans body).
- The byline / read-time block: author, date, "4 min read" — likes both
  the design and the content of that meta row. (**Resolved:** Aaron's
  row won't include an author name — potentially a sub header, then the
  date and tags, likely.)
- Background is not pure black — liked, though Aaron plans to go much
  darker than this.
- Everything shares the same *style* of flat color: a monochromatic
  surface palette tinted toward the accent hue — very-dark-green-leaning
  surfaces matching the bright green buttons/accents, so accents feel
  related to the base rather than stuck on. Transferable regardless of
  final hue.
- The tiny inline graphs (sparklines) — likes the design; no real use
  case for them on his site.
- Link styling: colored text, not underlined, but obviously links by
  color contrast alone.
- Separator lines and borders: solid (not gradient) 1px hairlines look
  good here. Caveat: doesn't want many random lines separating things —
  use sparingly.

## 5.webp

![5](./inspiration/5.webp)

Source: an "AD" monogram logo (design-gallery shot, e.g. Dribbble). Small
review — logo reference only, not a page design.

**Aaron's reaction:** Likes this logo, particularly that it has an A —
"an A shape that is an A but not obvious." The site has an existing "AS"
mark (`themes/aaronsaray/static/logo.svg`), but it's a hand-edited
version and not great — **the logo will be redone as a new SVG** at some
point: if not a new design, then the same design made more geometrically
clean. This review is about why the reference appeals, compared against
the current mark.

**Comparison with the existing AS logo:**

- Both are bold, heavy, geometric sans monograms of initials — same
  species of mark.
- The reference merges its two letters into **one continuous shape**: the
  A has no literal crossbar or full outline; it's implied by a
  negative-space triangle counter and a diagonal slice, and its right
  stroke doubles as the D's stem (a shared-stroke ligature). That's the
  "A but not obvious" quality Aaron likes.
- The existing AS mark instead **overlaps two distinct letters**: the A
  (dark charcoal) and S (slate navy) each stay legible on their own, with
  the A's right leg clipping across the S. Two colors, two letterforms —
  interlocked, not merged.
- The reference is a single flat color (white) on near-black — which
  happens to suit the all-dark site direction; the current AS mark's dark
  charcoal A would need a light/white treatment to sit on dark
  backgrounds anyway.

Direction for the redo (same design made geometric vs. a merged style
like this reference) will be decided when the logo work happens.

**Techniques identified (relevant to the planned logo redo):**

- Shared-stroke / ligature monogram — adjacent letters borrow a stroke
- Negative-space counters doing the letter-recognition work instead of
  drawn outlines
- Diagonal notch cuts to separate merged forms while keeping one
  silhouette
- Single flat color, no gradients or outlines — reads at any size

## 6.webp

![6](./inspiration/6.webp)

Source: Fahrenheit 212 (fahrenheit-212.com), innovation consultancy,
part of Capgemini Invent. Light background, orange accent.

**Overall:** the image with the least Aaron likes — a few specific
elements only.

**Aaron's reaction — likes:**

- The logo: its top-left placement and the two-color style ("Fahrenheit"
  in dark gray, "212" in bold orange — the accent color doing the
  emphasis). Not the small sub-line beneath it — Aaron doesn't like
  that part.
- The concept of the big text in the center — a giant serif statement
  headline ("Make things better. / Make better things.") sitting alone
  mid-page — but **not** the thin orange swooping lines woven through
  the letters.
- The beliefs section: really likes the design *and* the idea — a row of
  five columns, each with a small uppercase letterspaced orange eyebrow
  ("BELIEF #01" … "#05") over a short bold serif statement ("Ideas are
  easy. Impact is hard."). Strong candidate for the homepage, as a
  section after the main hero.

**Techniques identified:**

- Numbered eyebrow labels: small caps-style uppercase, wide
  letter-spacing, accent color, sequential numbering (#01–#05) — turns a
  plain list into a manifesto
- Multi-column grid of short punchy statements, each one line of
  eyebrow plus two-to-three lines of display text — scannable, no
  paragraphs
- Standalone statement headline given an entire band of the page with
  generous whitespace
- Two-tone wordmark: one word neutral, one element in the accent color

## 7.webp

![7](./inspiration/7.webp)

Source: Diving Laravel (divinglaravel.com), Mohamed Said's Laravel blog —
"Rationing Your Laravel Queue Workers Memory And CPU Consumption."

**Aaron's reaction — likes:**

- The top section's design: the underwater-feeling gradient/texture at
  the top of the page matches the "Diving Laravel" concept. Likes these
  very subtle design choices that add depth to the design without
  distracting from it — theme-reinforcing atmosphere, not decoration.
- The color in general (deep navy/teal palette).
- Code blocks designed as clearly separate elements from the text — but
  does **NOT** like that they bleed wider than the text column. Keep
  code blocks distinct; keep them the same width as the prose.
- The `#queues` tag in the meta line (date — read time — tag): possibly
  a useful way to present tags on the new site. (Tags are a known open
  migration item; this is a candidate presentation.)
- The author block at the bottom — *sort of* likes it. The tension:
  single-author site, so a "By Aaron Saray" block may be unnecessary —
  but someone could land directly on a blog entry and not know who he
  is; and the footer will likely carry links to his other sites anyway.
  **Resolved: not adding it** — can be reconsidered in the future.

**Dislikes:**

- Inline code chips (`--max-time`, `--max-jobs`): the background color
  and the spacing/padding around them. (Distinct inline-code styling is
  still wanted — see 3.webp likes — just not this treatment.)
- The subscribe/newsletter section above the author block.

**Techniques identified:**

- Thematic atmosphere via a subtle top-of-page gradient/texture that
  fades into the flat page background — depth without competing with
  content
- Meta line combining date, read time, and tag link in one row
- Author bio card at article end: avatar, name, short blurb, social
  links — an "in case you landed here cold" identity block

## 8.webp

![8](./inspiration/8.webp)

Source: Raycast landing page (raycast.com), early beta-era version.
Near-black dark theme.

**Aaron's reaction — likes:**

- The small header section: a compact, slim top bar — logo left, nav
  links, social icons right. Including the dropdown indicator (chevron)
  next to "Extensions" in the nav.
- The general gradient glow in the middle, behind the main app window
  panel (the red/blue radial glow framing the screenshot) — with a
  caveat: don't **overuse** these. This treatment is way too common.
- The coloring of the "Beta" tag (small accent-red pill next to the
  version info).
- The extension-logo row in "Turn on superpowers": the logos sit at
  reduced opacity and change when active or hovered (the active Linear
  icon is bright while the rest stay dim). Likes that.
- The color/brightness juxtaposition in the "More focus, less clutter."
  headline — first phrase bright white, second phrase dimmed gray in the
  same line. Likes the technique, but this instance is slightly too
  jarring — and he'd only use two-tone where it really makes sense, not
  as a default headline treatment.
- The full footer section — the whole arrangement: a two-box CTA row in
  the main area ("Be part of the journey" / "Stay up to date") acting as
  the two primary tasks to take, then another logo at the bottom, then
  basically a whole sitemap of links (Product / Company / Extensions /
  Connect columns).

**Dislikes:**

- "Level up your productivity" centered headline: almost too bright,
  almost too glowy.
- The "Download for Mac" button (light pill button on dark).
- The four square panels ("Perform tasks in seconds," "Security by
  default," etc. — icon + bold title + short text cards in a 2×2 grid):
  **hates** this design and style. It's so common but feels so weak —
  too corporate. **Hard decision: the new design will not have random
  panel grids issuing "4 of something" like this.**

**Techniques identified:**

- Compact single-row header: slim bar, small type, logo/nav/social in
  one line — minimal vertical cost
- Radial gradient glow as a backdrop to elevate one hero element —
  effective in isolation, cliché when repeated
- Opacity as state: dimmed logos/items at partial opacity, full
  brightness on hover/active — communicates state without color or
  borders
- Two-tone headline: same size and weight, brightness split mid-sentence
  to emphasize one phrase (dial the contrast gentler than here)
- Small accent-color pill tag for status metadata (Beta)
- Footer as hierarchy: primary CTAs first (two boxes), then brand mark,
  then full sitemap link columns — footer does real navigation work
