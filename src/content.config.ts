import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const astroChapters = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/astro/chapters' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    level: z.string().default('Core'),
    series: z.string().default('The Astro Ecosystem'),
    color: z.string().default('#5628b4'),
  }),
});

const svelteChapters = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/svelte/chapters' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    level: z.string().default('Core'),
    series: z.string().default('Reactivity with Svelte'),
    color: z.string().default('#c92907'),
  }),
});

const rustChapters = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/rust/chapters' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    level: z.string().default('Core'),
    series: z.string().default('Systems Programming in Rust'),
    color: z.string().default('#c92907'),
  }),
});

export const collections = { astro: astroChapters, svelte: svelteChapters, rust: rustChapters };
