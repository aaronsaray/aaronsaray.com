import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Deepest heading level that gets an anchor link, 0 for none. Blog has
// no key and gets the depth passed to rehypeHeadingAnchors in
// astro.config.ts. No .default(): the plugin reads the raw frontmatter,
// so a zod default never reaches it.
const anchorDepth = z.number().int().min(0).max(6);

const blog = defineCollection({
  // The default id is slugified, which drops the dot from
  // fixing-laravel-5.4-dependency-on-phpunit-5 and breaks its URL.
  loader: glob({
    pattern: "*.md",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  // .strict() everywhere: zod drops unknown keys, so a typo like
  // `darft: true` would publish the draft silently.
  schema: z
    .object({
      title: z.string(),
      // A string: Date coercion could shift the URL year across a timezone.
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}($|T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2})?$)/),
      tags: z.array(z.string()).min(1),
      context: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
      evergreen: z.boolean().optional(),
    })
    .strict(),
});

const tags = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/tags",
  }),
  schema: z
    .object({
      anchorDepth: anchorDepth,
    })
    .strict(),
});

const pages = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/pages",
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      intro: z.string().optional(),
      // Wraps each H2 block in a <section> (src/plugins/rehype-sections.ts).
      sections: z.boolean().optional(),
      anchorDepth: anchorDepth,
    })
    .strict(),
});

const books = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/books",
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
