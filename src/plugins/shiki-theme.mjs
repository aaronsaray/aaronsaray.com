// Sparse TextMate theme for Shiki, per DESIGN.md: desaturated,
// near-monochrome, with the accent's brighter sibling doing keyword
// duty. Mirrors the .tok-* palette from .design/blog-single.html.
export const aaronsarayDark = {
  name: "aaronsaray-dark",
  type: "dark",
  fg: "#aab1b9",
  bg: "#10141a",
  settings: [
    { settings: { foreground: "#aab1b9", background: "#10141a" } },
    {
      scope: ["keyword", "storage", "support.type"],
      settings: { foreground: "#7fa6c4" },
    },
    {
      scope: ["string"],
      settings: { foreground: "#a3b389" },
    },
    {
      scope: ["variable", "constant.numeric"],
      settings: { foreground: "#c2a583" },
    },
    {
      scope: [
        "entity.name.function",
        "entity.name.class",
        "entity.name.type",
        "support.function",
        "support.class",
      ],
      settings: { foreground: "#dde0e4" },
    },
    {
      scope: ["comment"],
      settings: { foreground: "#5d646d", fontStyle: "italic" },
    },
  ],
};
