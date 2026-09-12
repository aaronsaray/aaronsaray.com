import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// The deepest heading level that gets an anchor link; 0 for none.
// Required on every collection but blog, whose value lives in
// astro.config.mjs. No .default(): src/plugins/rehype-heading-anchors.mjs
// reads the raw frontmatter, which zod output never reaches.
const anchorDepth = z.number().int().min(0).max(6);

const blog = defineCollection({
  // generateId keeps the slug = filename stem VERBATIM. The default
  // loader slugifies ids (github-slugger), which would strip the dot
  // from fixing-laravel-5.4-dependency-on-phpunit-5 and break its URL.
  loader: glob({
    pattern: "*.md",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  // .strict() everywhere: without it zod silently discards unknown
  // keys, so a typo'd `darft: true` would publish a draft post with
  // zero signal. A crashed build naming the file is the right outcome.
  schema: z
    .object({
      title: z.string(),
      // A string: the URL year is its first 4 characters, and Date
      // coercion through a timezone could shift it.
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}($|T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2})?$)/),
      tags: z.array(z.string()).min(1),
      context: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
      // Overrides the tag policy in src/lib/evergreen.ts.
      evergreen: z.boolean().optional(),
    })
    .strict(),
});

const tags = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/tags",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      anchorDepth: anchorDepth,
    })
    .strict(),
});

const pages = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/pages",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      intro: z.string().optional(),
      // Wraps each H2 block in a <section> (src/plugins/rehype-sections.mjs).
      sections: z.boolean().optional(),
      anchorDepth: anchorDepth,
    })
    .strict(),
});

const books = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/books",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        href: z.string(),
        cover: image(),
        order: z.number().int(),
        anchorDepth: anchorDepth,
      })
      .strict(),
});

export const collections = { blog, tags, pages, books };
