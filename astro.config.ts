import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import { remarkCallout } from "./src/plugins/remark-callout.ts";
import { rehypeCodeChrome } from "./src/plugins/rehype-code-chrome.ts";
import { rehypeTableWrap } from "./src/plugins/rehype-table-wrap.ts";
import { rehypeFigure } from "./src/plugins/rehype-figure.ts";
import { rehypeImgAttrs } from "./src/plugins/rehype-img-attrs.ts";
import { rehypeSections } from "./src/plugins/rehype-sections.ts";
import { rehypeHeadingAnchors } from "./src/plugins/rehype-heading-anchors.ts";
import { aaronsarayDark } from "./src/plugins/shiki-theme.ts";
import { shikiMetaFilename } from "./src/plugins/shiki-meta-filename.ts";

export default defineConfig({
  site: "https://aaronsaray.com",
  devToolbar: {
    enabled: false,
  },
  build: {
    format: "directory",
  },
  // The "jsx" default deletes a line break beside an inline tag.
  compressHTML: true,
  redirects: {
    // Builds a meta-refresh page; public/_redirects upgrades it to a 301.
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
      remarkPlugins: [remarkCallout],
      rehypePlugins: [
        rehypeSlug,
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
      // `output` is not a language: rehype-code-chrome keys on the name.
      langAlias: {
        apacheconf: "apache",
        basic: "plaintext",
        env: "ini",
        output: "plaintext",
      },
      transformers: [shikiMetaFilename()],
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
    // second dev server is obvious rather than quietly on 4322.
    server: {
      strictPort: true,
    },
  },
});
