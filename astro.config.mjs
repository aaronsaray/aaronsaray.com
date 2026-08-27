// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://aaronsaray.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  redirects: {
    // Hugo generated this alias page; static build emits the same
    // meta-refresh file. Cloudflare _redirects upgrades it to a 301.
    '/blog/page/1/': '/blog/',
  },
  markdown: {
    // The remark/rehype pipeline (not the Sätteri default) — the code
    // chrome, heading anchors, and table wrappers are rehype plugins.
    processor: unified({
      gfm: true,
      // Hugo's Goldmark typographer maps -- to en and --- to em dash;
      // smartypants only matches that with oldschool dashes.
      smartypants: { dashes: 'oldschool' },
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
