import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

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
      // A string on purpose: the URL year is the first 4 characters, and
      // Date coercion through a timezone could shift it.
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}($|T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2})?$)/),
      tags: z.array(z.string()).min(1),
      context: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
      // Overrides the tag-derived evergreen policy (src/lib/evergreen.ts)
      // that decides whether an old post shows the age notice. true:
      // never show it (a timeless essay with technical tags); false:
      // show it despite evergreen tags. Omit for the default.
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
    })
    .strict(),
});

export const collections = { blog, tags, pages };
