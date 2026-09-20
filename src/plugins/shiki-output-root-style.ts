import type { ShikiConfig } from "astro";

type Transformer = NonNullable<ShikiConfig["transformers"]>[number];

// Shiki writes the theme's background and foreground inline on the pre,
// where no class can override them. Output blocks take their colors
// from global.css instead, so the declarations are suppressed at the
// source. Astro appends its own overflow-x afterward and is unaffected.
export function shikiOutputRootStyle(): Transformer {
  return {
    name: "output-root-style",
    preprocess(_code, options) {
      if (options.lang === "output") {
        options.rootStyle = false;
      }
    },
  };
}
