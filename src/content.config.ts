import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { pageFrontmatter } from './lib/schemas';

/**
 * Prose for every page, one MDX file per page and locale:
 *   src/content/pages/es/guide.mdx  →  pageId: guide, locale: es
 * Structured game data lives in src/data/*.json (see src/lib/data.ts).
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
  schema: pageFrontmatter,
});

export const collections = { pages };
