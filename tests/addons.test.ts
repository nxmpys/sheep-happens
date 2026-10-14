import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { addons, checkIntegrity, dataset, type Dataset } from '../src/lib/data';
import { addonJsonLd } from '../src/lib/seo';

const publicDir = fileURLToPath(new URL('../public', import.meta.url));
const siteUrl = 'https://sheephappens.app/';
const urls = { pageUrl: `${siteUrl}es/addons/`, siteUrl, asset: (path: string) => `${siteUrl}${path.slice(1)}` };

describe('addons data', () => {
  it('every icon and capture exists under public/', () => {
    for (const addon of addons) {
      for (const path of [addon.icon, ...addon.screenshots.map((s) => s.src)]) {
        expect(existsSync(`${publicDir}${path}`), path).toBe(true);
      }
    }
  });

  it('keeps captures in the folder of their addon', () => {
    const data: Dataset = structuredClone(dataset);
    data.addons[0]!.screenshots[0]!.src = '/og/es-home.png';
    expect(checkIntegrity(data).join('\n')).toMatch(/is outside \/addons\//);
  });

  it('links the download page only once it is public', () => {
    const addon = addons.find((a) => a.id === 'mageprocs')!;
    expect(addonJsonLd({ ...addon, listing: 'pending' }, 'es', urls)).not.toHaveProperty('downloadUrl');
    expect(addonJsonLd({ ...addon, listing: 'live' }, 'es', urls)).toHaveProperty('downloadUrl', addon.url);
  });

  it('credits our own addons to the site and claims no ratings or downloads', () => {
    const addon = addons.find((a) => a.origin === 'own')!;
    const jsonLd = addonJsonLd(addon, 'en', urls);
    expect(jsonLd.author).toEqual({ '@id': `${siteUrl}#organization` });
    expect(jsonLd).not.toHaveProperty('aggregateRating');
    expect(jsonLd).not.toHaveProperty('interactionStatistic');
  });
});
