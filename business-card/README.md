# Business Card

```shell
make card
```

Writes `front.pdf` and `back.pdf` from `index.html`. Open `index.html` in a browser to iterate: 
both sides stack, with a dashed trim line (5 mm corners) and a dashed safe-area line that never print.

## This Card

MOO Luxe, Standard size, rounded corners, Ocean Blue seam. The seam is a solid paper insert, not ink, so its blue is fixed and is not the site's accent.

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

## Uploading

1. Business Cards, Luxe, Standard, rounded corners, Ocean Blue seam.
2. Upload `front.pdf` as the front design and `back.pdf` as the back.
3. Check MOO's trim overlay in the preview: the copy sits inside it and the size raises no error.
