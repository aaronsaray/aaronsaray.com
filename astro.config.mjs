// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkDirective from "remark-directive";
import { remarkCallout } from "./src/plugins/remark-callout.mjs";
import { rehypeCodeChrome } from "./src/plugins/rehype-code-chrome.mjs";
import { rehypeTableWrap } from "./src/plugins/rehype-table-wrap.mjs";
import { rehypeFigure } from "./src/plugins/rehype-figure.mjs";
import { rehypeImgDefer } from "./src/plugins/rehype-img-defer.mjs";
import { anchorIcon } from "./src/plugins/anchor-icon.mjs";
import { aaronsarayDark } from "./src/plugins/shiki-theme.mjs";
import { shikiMetaFilename } from "./src/plugins/shiki-meta-filename.mjs";

export default defineConfig({
  site: "https://aaronsaray.com",
  trailingSlash: "always",
  // The dev toolbar overlays the bottom of the viewport and gets in
  // the way of judging real layout; nothing on this site uses it.
  devToolbar: {
    enabled: false,
  },
  build: {
    format: "directory",
  },
  redirects: {
    // Hugo generated this alias page; static build emits the same
    // meta-refresh file. Cloudflare _redirects upgrades it to a 301.
    "/blog/page/1/": "/blog/",
  },
  markdown: {
    // The remark/rehype pipeline (not the Sätteri default) — the code
    // chrome, heading anchors, and table wrappers are rehype plugins.
    // Note Astro's plugin order: Shiki runs BEFORE user rehype
    // plugins; rehype-raw runs AFTER them (the chrome plugins emit
    // raw nodes and rely on this).
    processor: unified({
      gfm: true,
      // Hugo's Goldmark typographer maps -- to en and --- to em dash;
      // smartypants only matches that with oldschool dashes.
      smartypants: { dashes: "oldschool" },
      remarkPlugins: [remarkDirective, remarkCallout],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          { behavior: "wrap", test: ["h2", "h3"], content: anchorIcon },
        ],
        rehypeCodeChrome,
        rehypeTableWrap,
        rehypeFigure,
        rehypeImgDefer,
      ],
    }),
    shikiConfig: {
      theme: aaronsarayDark,
      // Corpus languages Shiki doesn't ship under these names.
      langAlias: { apacheconf: "apache", basic: "plaintext", env: "ini" },
      transformers: [shikiMetaFilename()],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
