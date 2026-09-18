// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import { remarkCallout } from "./src/plugins/remark-callout.mjs";
import { rehypeCodeChrome } from "./src/plugins/rehype-code-chrome.mjs";
import { rehypeTableWrap } from "./src/plugins/rehype-table-wrap.mjs";
import { rehypeFigure } from "./src/plugins/rehype-figure.mjs";
import { rehypeImgAttrs } from "./src/plugins/rehype-img-attrs.mjs";
import { rehypeSections } from "./src/plugins/rehype-sections.mjs";
import { rehypeHeadingAnchors } from "./src/plugins/rehype-heading-anchors.mjs";
import { aaronsarayDark } from "./src/plugins/shiki-theme.mjs";
import { shikiMetaFilename } from "./src/plugins/shiki-meta-filename.mjs";
import { shikiOutputRootStyle } from "./src/plugins/shiki-output-root-style.mjs";

export default defineConfig({
  site: "https://aaronsaray.com",
  trailingSlash: "always",
  // The toolbar overlays the bottom of the viewport and spoils layout
  // checks in the browser.
  devToolbar: {
    enabled: false,
  },
  build: {
    format: "directory",
  },
  redirects: {
    // /blog/page/1/ is in the URL contract. The static build emits a
    // meta-refresh page here; public/_redirects upgrades it to a 301.
    "/blog/page/1/": "/blog/",
  },
  markdown: {
    // Astro runs Shiki before the user rehype plugins and rehype-raw
    // after them. The chrome plugins emit raw nodes and depend on that.
    processor: unified({
      gfm: true,
      // Post prose writes -- and --- expecting en and em dashes; only
      // oldschool mode renders them that way.
      smartypants: { dashes: "oldschool" },
      remarkPlugins: [remarkDirective, remarkCallout],
      rehypePlugins: [
        rehypeSlug,
        // A document without anchorDepth is a post: every other
        // collection's schema requires the key. 3 links H2 and H3.
        [rehypeHeadingAnchors, { depth: 3 }],
        rehypeCodeChrome,
        rehypeTableWrap,
        rehypeFigure,
        rehypeImgAttrs,
        rehypeSections,
      ],
    }),
    shikiConfig: {
      theme: aaronsarayDark,
      // apacheconf, basic, and env are corpus languages Shiki doesn't
      // ship under these names. `output` is not a language: it marks a
      // block as terminal output, which rehype-code-chrome styles as
      // its own kind. Astro keeps the authored name in data-language
      // and resolves the alias only to pick a grammar, which is what
      // both the language label and that styling read.
      langAlias: {
        apacheconf: "apache",
        basic: "plaintext",
        env: "ini",
        output: "plaintext",
      },
      transformers: [shikiMetaFilename(), shikiOutputRootStyle()],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // 0: Astro inlines any script chunk under this limit back into the
    // HTML as an inline module, which a CSP would then have to hash.
    build: {
      assetsInlineLimit: 0,
    },
    // Fail on a taken port instead of sliding to the next one, so a
    // second dev server is obvious rather than quietly on 4322. Only
    // catches a listener on the same host: a wildcard-bound process on
    // 4321 still lets localhost:4321 bind, with a warning.
    server: {
      strictPort: true,
    },
  },
});
