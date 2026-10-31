import { describe, expect, it } from 'vitest';
import { LOCALES, PRIMARY_NAV, pathFor } from '../src/i18n/routes';
import { menuBlocks } from '../src/lib/nav-menu';

const group = (key: (typeof PRIMARY_NAV)[number]['key']) => PRIMARY_NAV.find((g) => g.key === key)!;
const labels = (key: (typeof PRIMARY_NAV)[number]['key'], locale: 'es' | 'en') =>
  menuBlocks(group(key), locale, { contents: ['leveling', 'dungeons'] }).flatMap((block) => block.links.map((link) => link.label));

describe('menuBlocks', () => {
  it('gives every menu entry something to list', () => {
    for (const locale of LOCALES) {
      for (const entry of PRIMARY_NAV) expect(labels(entry.key, locale).length).toBeGreaterThan(0);
    }
  });

  it('lists every page of the entry, so nothing is only reachable through its hub', () => {
    for (const locale of LOCALES) {
      for (const entry of PRIMARY_NAV) {
        const urls = menuBlocks(entry, locale).flatMap((block) => block.links.map((link) => link.url));
        for (const page of entry.items ?? []) expect(urls).toContain(pathFor(page, locale));
      }
    }
  });

  it('lists what the user asked for under Learn and Tools', () => {
    expect(labels('learn', 'en')).toEqual(['The class', 'Combat', 'Specializations', 'Arcane', 'Fire', 'Frost', 'First steps in Azeroth', 'Glossary']);
    expect(labels('tools', 'en')).toEqual(['Crit multiplier', 'Spell hit', 'Talent calculator', 'Forever changes', 'MageProcs']);
  });

  it('keeps the talent trees apart, as a row without a heading', () => {
    const blocks = menuBlocks(group('learn'), 'en');
    expect(blocks.map((block) => block.heading)).toEqual([undefined, undefined, undefined]);
    expect(blocks[1]!.links.map((link) => link.tree)).toEqual(['arcane', 'fire', 'frost']);
  });

  it('links sections of a hub page by their anchor', () => {
    const links = menuBlocks(group('tools'), 'es')[0]!.links;
    expect(links[0]!.url).toBe('/es/herramientas/#multiplicador-de-crítico');
    expect(links[0]!.page).toBeUndefined();
  });

  it('shows the contents with builds', () => {
    const blocks = menuBlocks(group('builds'), 'es', { contents: ['leveling', 'dungeons'] });
    expect(blocks[0]!.links.map((link) => link.url)).toEqual(['/es/builds/leveo/', '/es/builds/mazmorras/']);
  });

  it('shows the addon once, under its own heading in Tools', () => {
    const block = menuBlocks(group('tools'), 'en').at(-1)!;
    expect(block.heading).toBe('Addons');
    expect(block.links.map((link) => link.label)).toEqual(['MageProcs']);
  });
});
