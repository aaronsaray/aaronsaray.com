import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // generateId keeps the slug = filename stem VERBATIM. The default
  // loader slugifies ids (github-slugger), which would strip the dot
  // from fixing-laravel-5.4-dependency-on-phpunit-5 and break its URL.
  loader: glob({
    pattern: '*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    // A string on purpose: the URL year is the first 4 characters, and
    // Date coercion through a timezone could shift it.
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}($|T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2})?$)/),
    tags: z.array(z.string()).min(1),
    context: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

const tags = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/tags',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/pages',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, tags, pages };
