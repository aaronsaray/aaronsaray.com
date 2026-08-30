// Several hexes track the palette tokens in global.css by hand (bg =
// --color-surface, comments = --color-ink-mute, keywords = the
// accent's hover companion); a palette change there must be mirrored here.
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
      settings: { foreground: "#777f8a", fontStyle: "italic" },
    },
  ],
};
