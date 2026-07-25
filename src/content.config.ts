import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    role: z.string(),
    year: z.number(),
    stack: z.array(z.string()),
    summary: z.string(),
    cover: z.string(),
    order: z.number(),
    published: z.boolean(),
  }),
});

export const collections = { work };
