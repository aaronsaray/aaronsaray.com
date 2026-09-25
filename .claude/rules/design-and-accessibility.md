---
paths:
  - "src/**/*.astro"
  - "src/styles/**"
  - "src/plugins/**"
  - "src/konami/**"
---

# Design and Accessibility

## Design

* The built site is the design reference. Match the patterns already
  in the components and `src/styles/global.css`.
* **Where a style lives.** Tailwind utilities on the element, or
  `src/styles/global.css`. No `<style>` blocks in components. Ask, in
  order:
  * Used in one place? Utilities on the element, including `hover:`,
    `group-*:`, and `motion-reduce:` variants. A class name that
    appears in one template should have been utilities.
  * The same utility stack in more than one template? One `@utility`
    in global.css (`page-title` is the model), never a copied class
    string. Keyframes go in `@theme` as `--animate-*`.
  * Markup the templates never author (the markdown pipeline's output:
    `.prose`, `.entry-excerpt`, the code chrome)? Element rules in
    global.css, on the class hooks the plugins emit. One nested block
    per hook (`.prose { h2 { } }`, `@variant lg` inside `.cv`); the
    build flattens it, and a nested selector list flattens to `:is()`.
    Inside one, a declaration is plain CSS on the theme variables
    (`var(--color-ink)`, `var(--text-xs)`, `--alpha()`). `@apply` is
    for a utility this file names (`page-title`) or a stack that
    carries a variant (`sm:`, `hover:`).
  * In global.css for another reason (the header blur, whose four
    masks only read as one ramp side by side)? One line at the top of
    the block saying why.
  * Must not load on a page that never uses it? A stylesheet beside
    the code that imports it with `?inline` and injects it.
    `src/konami/scene.css` is the only one.

## Accessibility

Aaron holds this site to a higher bar than the field does, and he is
learning the subject as the site is built. Do not wait to be asked, and
do not assume he knows a rule already: say what the rule is, and why,
when it comes up.

`make verify` runs axe over every route in `tests/pages/all.spec.ts`,
at a desktop and a phone viewport. A green run is a floor: automation
covers a minority of WCAG AA, and the rest is judgment that gets raised
in conversation.

* **Text color comes from the palette tokens in
  `src/styles/global.css`.** The comment on that block has the grounds,
  the exceptions, and the no-opacity rule; read it before touching a
  color. Animate hover with `transition-colors`.
* **Leave contrast margin.** axe passes only a ratio strictly above
  4.5 and reports it truncated to two decimals, so a value near the
  line is one color tweak from failing.
* **A contrast ratio is written down only where axe cannot measure
  it**: non-text (axe has no WCAG 1.4.11 rule), states the tests never
  render (hover, focus, `::selection`), anything outside the DOM (the
  scrollbar), and what axe reports as incomplete. It goes in a comment
  on the declaration that sets the color. A ratio axe measures gets no
  comment.
* **A hover state raises contrast, never lowers it.**
* **Interactive targets stay at least 24x24px**, using padding with
  negative margin where the visual size is smaller.
* **Every animation has a `prefers-reduced-motion` branch.** `still()`
  in `src/konami/scene.ts` is the model for one that is a different
  scene, not a shortened one.
* **axe cannot judge these.** Check them by hand when the markup they
  touch changes, and say so: whether alt text means anything (in
  `src/content/` flag it, never rewrite it), whether focus order
  matches reading order and stays visible (tab through anything new),
  whether a screen reader can operate anything interactive (the
  comment in `NavItem.astro` records the known gap), and whether the
  page holds at 200% zoom.
