import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    type: z.enum(['hub', 'spoke']),
    service: z.string(),
    locationName: z.string().optional(),
    locationSlug: z.string().optional(),
    parentHub: z.string().optional(),
    landmarks: z.array(z.string()).optional(),
    neighborhoodContext: z.string().optional(),
  })
});

export const collections = { pages };
