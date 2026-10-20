// @ts-check
import { existsSync, readdirSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { parse as parseYaml } from 'yaml';
import { LOCALES, pathFor } from './src/i18n/routes.ts';
import { lastModified } from './src/lib/seo.ts';

// Production URL (Cloudflare Pages). Override with SITE_URL for another host
// or a custom domain, and BASE_PATH if the site lives under a sub-path.
const site = process.env.SITE_URL || 'https://sheephappens.app';
const base = process.env.BASE_PATH || '/';

/**
 * Sitemap metadata per URL: last modification (manual review or changelog entry)
 * and the equivalent page in the other language (hreflang alternates).
 */
function sitemapIndex() {
  const index = new Map();
  for (const locale of LOCALES) {
    const dir = new URL(`./src/content/pages/${locale}/`, import.meta.url);
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
      const source = readFileSync(new URL(file, dir), 'utf8');
      const frontmatter = parseYaml(source.split(/^---\s*$/m)[1] ?? '');
      if (frontmatter.status !== 'published') continue;
      const reviewed = new Date(`${frontmatter.reviewed}T00:00:00Z`);
      index.set(pathFor(frontmatter.pageId, locale, { base }), {
        // Dated like the page itself: review, changelog and the data it shows.
        lastmod: lastModified(frontmatter.pageId, reviewed, source.split(/^---\s*$/m).slice(2).join('---')).toISOString(),
        links: [
          ...LOCALES.map((lang) => ({ lang, url: new URL(pathFor(frontmatter.pageId, lang, { base }), site).href })),
          {
            lang: 'x-default',
            // The root language chooser is the x-default for the home pages.
            url: new URL(frontmatter.pageId === 'home' ? base : pathFor(frontmatter.pageId, 'es', { base }), site).href,
          },
        ],
      });
    }
  }
  // The root page: language chooser and home of the site for search engines.
  const home = index.get(pathFor('home', 'es', { base }));
  if (home) index.set(base, { lastmod: home.lastmod, links: home.links });
  return index;
}
const pages = sitemapIndex();

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    mdx(),
    {
      // Cloudflare Pages serves the nearest 404.html: /en/404.html for English paths, /404.html for the rest.
      // The directory format writes en/404/index.html, so move it to en/404.html.
      name: 'english-404',
      hooks: {
        'astro:build:done': ({ dir }) => {
          const folder = new URL('en/404/', dir);
          if (!existsSync(new URL('index.html', folder))) return;
          renameSync(new URL('index.html', folder), new URL('en/404.html', dir));
          rmSync(folder, { recursive: true, force: true });
        },
      },
    },
    sitemap({
      // Only real guide pages: no 404, no language-redirect root, no drafts.
      filter: (page) => pages.has(new URL(page).pathname),
      serialize: (item) => {
        const meta = pages.get(new URL(item.url).pathname);
        return meta ? { ...item, lastmod: meta.lastmod, links: meta.links } : item;
      },
    }),
  ],
});
