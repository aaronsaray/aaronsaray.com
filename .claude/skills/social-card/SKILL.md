---
name: social-card
description: The design rules and the method for a tag's social card, public/images/tag/<tag>.jpg. Load before drawing or redrawing one.
argument-hint: "[what to do with a card]"
disable-model-invocation: true
---

# Social Card

The argument is the task. With none, ask Aaron what he wants done.

## The Design

`laravel.jpg` and `php.jpg` in `public/images/tag/` are the models: a
new card sits beside them at the same size and weight.

* A 1200x630 JPG: one symbol centered on flat `night`, nothing else.
* The symbol fits a 440x270 box at the center.
* The symbol is the mark without its wordmark. A brand with no symbol
  gets its wordmark in a 600x270 box.
* The brand's color, all of them when the mark has several. Where it
  is too dark to see on `night`, any color that works: `accent` and
  `ink` first. Another brand's guidelines never constrain a card.
* An outline mark stays an outline.
* Every symbol is SVG art, never a photo.

`night`, `accent`, and `ink` are the tokens in `src/styles/global.css`.

### A Tag With No Brand

A symbol drawn by hand like a Lucide icon at stroke 1.5: a 48 grid,
stroke 3, round caps and joins. Detailed enough to read as the
object, never busy.

* Outlines in `accent`, fills `#1a2833` and `#243746`, secondary
  lines `#3d5f78`.
* The part that acts (a needle, a filament, a click) in `ink`, amber
  `#f2c14e`, green `#4caf6e`, or red `#e5534b`.
* A window carries red, amber, and green title bar dots.

## Where Symbols Come From

* Simple Icons:
  `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/<slug>.svg`,
  colors in the package's `data/simple-icons.json`. A mark it dropped
  is in an older major version.
* Otherwise the project's own site, an icon set that carries it
  (vscode-icons, gilbarbara/logos), or Wikimedia Commons.
* A tag with no brand: Lucide, as the icon itself or the shape to
  draw from.

## Making One

1. Draw the card as `<tag>.svg` in the repo root, with
   `viewBox="0 0 1200 630"`: a `rect` for the ground, then the symbol
   scaled to its rendered bounds (rendered on magenta with `sharp`
   and trimmed), not its viewBox. Aaron looks at it there.
2. Once he accepts it, render it with `sharp` from `node_modules` to
   `public/images/tag/<tag>.jpg`, flattened on `night`, as
   `jpeg({ quality: 90, progressive: true, mozjpeg: true })`. Delete
   the SVG.
