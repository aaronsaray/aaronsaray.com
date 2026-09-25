import type { ShikiConfig } from "astro";

type Transformer = NonNullable<ShikiConfig["transformers"]>[number];

// Copies the fence meta `filename="…"` onto the pre as data-filename,
// where rehype-code-chrome reads it. Astro hands the raw meta string
// to transformers as options.meta.__raw.
export function shikiMetaFilename(): Transformer {
  return {
    name: "meta-filename",
    pre(node) {
      const m = /filename="([^"]*)"/.exec(this.options.meta?.__raw ?? "");
      if (m) {
        node.properties.dataFilename = m[1];
      }
    },
  };
}
