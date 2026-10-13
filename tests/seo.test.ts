import { describe, expect, it } from 'vitest';
import { articleJsonLd, websiteJsonLd } from '../src/lib/seo';

const siteUrl = 'https://sheephappens.app/';
const article = articleJsonLd({
  locale: 'es',
  url: `${siteUrl}es/talentos/escarcha/`,
  siteUrl,
  title: 'Mago de Escarcha',
  description: 'Descripción',
  published: new Date('2026-10-11T00:00:00Z'),
  modified: new Date('2026-10-12T00:00:00Z'),
  image: `${siteUrl}og/es-talents-frost.png`,
});

describe('structured data', () => {
  it('articles belong to the WebSite node of the root page', () => {
    for (const locale of ['es', 'en', 'all'] as const) {
      expect(article.isPartOf['@id']).toBe(websiteJsonLd(locale, siteUrl, '')['@id']);
    }
  });

  it('the site publishes everything as one organization with a logo', () => {
    const website = websiteJsonLd('all', siteUrl, '');
    expect(article.publisher).toEqual(website.publisher);
    expect(article.author).toEqual(website.publisher);
    expect(website.publisher.logo).toBe(`${siteUrl}apple-touch-icon.png`);
  });

  it('dates are plain ISO days', () => {
    expect(article.datePublished).toBe('2026-10-11');
    expect(article.dateModified).toBe('2026-10-12');
  });
});
