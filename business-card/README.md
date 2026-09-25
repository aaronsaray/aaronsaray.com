# Business Card

```shell
make card
```

Writes `front.pdf` and `back.pdf` from `index.html`. Open `index.html` in a browser to iterate: both sides stack, with a dashed trim line (5 mm corners) and a dashed safe-area line that never print.

## This Card

MOO Luxe, Standard size, rounded corners, Ocean Blue seam. The seam is a solid paper insert, not ink, so its blue is fixed and is not the site's accent.

## MOO Stocks

* **Original**: 16 pt.
* **Super**: 18 pt, silky smooth.
* **Cotton**: made from cotton linters, unbleached, soft texture.
* **Luxe**: 32 pt, four layers of Mohawk Superfine, uncoated, writable on both sides. Seam colors: Raven Black, Chili Red, Ocean Blue, Polar White, Tiger Orange, Forest Green, Light Pink, Sunny Yellow.

Corners are square or rounded (5 mm radius) on every stock. Matte, gloss, soft touch, spot gloss, and foil finishes are coated-stock options; Luxe is uncoated.

## Artwork Specs

| | Inches | Pixels in `index.html` |
| --- | --- | --- |
| Trim | 3.50 x 2.00 | 336 x 192 |
| Bleed (the PDF page) | 3.66 x 2.16 | 352 x 208 |
| Safe area | 3.34 x 1.84 | 320.64 x 176.64 |

* Text 8 pt or larger, lines 0.5 pt or thicker.
* The background fills the bleed; text and the logo stay inside the safe area.
* The PDF page is 264 x 156 pt (3.667 x 2.167 in): Chromium rounds a page box to whole points, and the bleed absorbs the 0.17 mm.
* Vector throughout: the logo is the SVG's paths, and text is embedded glyph outlines.

## Color

The PDF is RGB with no profile; MOO converts it to CMYK. `#0a0a0a` prints as a rich black. Uncoated stock prints softer than the screen and spreads ink, so reversed text stays at 9 pt or larger and weight 500 or heavier.

## Uploading

1. Business Cards, Luxe, Standard, rounded corners, Ocean Blue seam.
2. Upload `front.pdf` as the front design and `back.pdf` as the back.
3. Check MOO's trim overlay in the preview: the copy sits inside it and the size raises no error.
