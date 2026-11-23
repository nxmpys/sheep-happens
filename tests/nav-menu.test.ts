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
    expect(labels('learn', 'en')).toEqual(['The class', 'Combat', 'Specializations', 'Arcane', 'Fire', 'Frost', 'First steps in Azeroth', 'Spells by level', 'Glossary']);
    expect(labels('tools', 'en')).toEqual(['Crit multiplier', 'Spell hit', 'Talent calculator', 'Mage cheat sheet', 'Forever changes', 'MageProcs']);
  });

  it('keeps the talent trees apart, as a list without a heading', () => {
    const blocks = menuBlocks(group('learn'), 'en');
    expect(blocks.map((block) => block.heading)).toEqual([undefined, undefined, undefined]);
    expect(blocks[1]!.links.map((link) => link.tree)).toEqual(['arcane', 'fire', 'frost']);
  });

  it('links sections of a hub page by their anchor', () => {
    const links = menuBlocks(group('tools'), 'es')[0]!.links;
    expect(links[0]!.url).toBe('/es/herramientas/#multiplicador-de-crítico');
    expect(links[0]!.page).toBeUndefined();
  });

  it('shows leveling, then PvE with dungeons and raid hanging from it, then PvP', () => {
    const blocks = menuBlocks(group('builds'), 'es', { contents: ['leveling', 'dungeons', 'raid', 'pvp'] });
    expect(blocks.map((block) => block.heading)).toEqual([undefined, undefined, undefined]);
    expect(blocks.map((block) => block.links.map((link) => link.label))).toEqual([['Leveo', 'PvE'], ['Mazmorras', 'Banda'], ['JcJ']]);
    expect(blocks.map((block) => block.links.map((link) => link.url))).toEqual([
      ['/es/builds/leveo/', '/es/builds/?f=pve'],
      ['/es/builds/mazmorras/', '/es/builds/banda/'],
      ['/es/builds/jcj/'],
    ]);
    expect(blocks[1]!.links.every((link) => link.child)).toBe(true);
  });

  it('leaves out PvE when it has no content page', () => {
    const blocks = menuBlocks(group('builds'), 'en', { contents: ['leveling', 'pvp'] });
    expect(blocks.map((block) => block.links.map((link) => link.label))).toEqual([['Leveling'], ['PvP']]);
  });

  it('shows the addon once, under its own heading in Tools', () => {
    const block = menuBlocks(group('tools'), 'en').at(-1)!;
    expect(block.heading).toBe('Addons');
    expect(block.links.map((link) => link.label)).toEqual(['MageProcs']);
  });
});
