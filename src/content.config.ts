import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const trackEnum = z.enum(['memory', 'cognition', 'agents', 'training', 'fractal']);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // research thread this post belongs to (optional)
    track: trackEnum.optional(),
    // is this a formal proof drop (benchmark/result)?
    proofDrop: z.boolean().default(false),
    // optional social/OG card image (absolute path under /public)
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const newsletter = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/newsletter' }),
  schema: z.object({
    title: z.string(),
    issue: z.number(),
    date: z.coerce.date(),
    description: z.string().optional(),
    track: trackEnum.optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, newsletter };
