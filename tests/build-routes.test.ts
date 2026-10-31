import { describe, expect, it } from 'vitest';
import { buildRole } from '../src/lib/build-roles';
import { buildIcon, buildPath, canonicalUse, contentPages, contentPath, routeConflicts, usedContents } from '../src/lib/build-routes';
import { buildSections } from '../src/lib/build-page';
import { checkIntegrity } from '../src/lib/data';
import { buildSchema, type Build } from '../src/lib/schemas';
import { applySwap } from '../src/lib/talents';
import { datasetWithFixture, fixtureBuild as base } from './fixtures/builds';

function build(id: string, overrides: Partial<Build>): Build {
  return { ...structuredClone(base), id, recommendedFor: [], discouragedFor: [], ...overrides };
}

describe('build pages', () => {
  it('get a localized URL from their first use and their slug', () => {
    expect(buildPath(base, 'es')).toBe('/es/builds/leveo/pirofrio-en-solitario/');
    expect(buildPath(base, 'en')).toBe('/en/builds/leveling/frostfire-solo/');
    expect(buildPath(build('pvp', { uses: ['pvp', 'dungeons'], slug: { es: 'arcano', en: 'arcane' } }), 'es', { base: '/sub/' })).toBe('/sub/es/builds/jcj/arcano/');
  });

  it('keep one canonical URL when they cover several contents', () => {
    const dual = build('dual', { uses: ['dungeons', 'raid'], slug: { es: 'fuego', en: 'fire' } });
    expect(canonicalUse(dual)).toBe('dungeons');
    expect(buildPath(dual, 'en')).toBe('/en/builds/dungeons/fire/');
  });

  it('give a page to the contents the guide links to, with or without builds', () => {
    expect(contentPath('leveling', 'es')).toBe('/es/builds/leveo/');
    expect(usedContents([base, build('dual', { uses: ['dungeons', 'leveling'] })])).toEqual(['leveling', 'dungeons']);
    expect(contentPages([])).toEqual(['leveling', 'dungeons', 'pvp']);
    expect(contentPages([build('raid', { uses: ['raid'] })])).toEqual(['leveling', 'dungeons', 'pvp', 'raid']);
  });

  it('never share a URL', () => {
    expect(routeConflicts([base, build('other', { uses: ['leveling', 'pvp'] })])).toEqual([
      '"other" and "frost-leveling-solo" would share the URL /es/builds/leveo/pirofrio-en-solitario/: change the first use or the slug',
      '"other" and "frost-leveling-solo" would share the URL /en/builds/leveling/frostfire-solo/: change the first use or the slug',
    ]);
    expect(routeConflicts([base, build('other', { uses: ['pvp', 'leveling'] })])).toEqual([]);
    const data = datasetWithFixture();
    data.builds.push(build('twin', {}));
    expect(checkIntegrity(data).join('\n')).toMatch(/would share the URL/);
  });

  it('show Frostfire for Frost builds that take Fire', () => {
    expect(buildIcon({ spec: 'frost', hybridWith: 'fire' })).toBe('frostfire');
    expect(buildIcon({ spec: 'fire', hybridWith: undefined })).toBe('fire');
  });

  it('share one template with stable section anchors', () => {
    expect(buildSections('es').map((s) => s.id)).toEqual([
      'pros-y-contras',
      'talentos',
      'por-que-estos-puntos',
      'variantes',
      'rotacion',
      'estadisticas-y-equipo',
    ]);
    expect(buildSections('en')).toHaveLength(buildSections('es').length);
  });
});

describe('not recommended', () => {
  it('is a third role next to recommended and viable', () => {
    const b = build('b', { uses: ['leveling', 'pvp'], recommendedFor: ['leveling'], discouragedFor: ['pvp'] });
    expect(buildRole(b, 'leveling')).toBe('recommended');
    expect(buildRole(b, 'pvp')).toBe('not-recommended');
  });

  it('must name a use of the build that is not recommended', () => {
    const raw = { ...structuredClone(base), recommendedFor: ['leveling'], discouragedFor: ['leveling'] };
    expect(buildSchema.safeParse(raw).success).toBe(false);
    expect(buildSchema.safeParse({ ...structuredClone(base), discouragedFor: ['raid'] }).success).toBe(false);
  });
});

describe('talent variants', () => {

  it('swap ranks on the final build', () => {
    expect(applySwap({ a: 3, b: 2 }, { a: 3 }, { c: 3 })).toEqual({ b: 2, c: 3 });
  });

  it('must keep the total and leave a valid build', () => {
    const data = datasetWithFixture();
    const build = data.builds.find((b) => b.id === base.id)!;
    build.variants = [{ ...build.variants[0]!, remove: { incineration: 3 }, add: { 'improved-fireball': 2 } }];
    expect(checkIntegrity(data).join('\n')).toMatch(/removes and adds a different number of points/);
    build.variants = [{ ...build.variants[0]!, remove: { incineration: 3 }, add: { 'critical-mass': 3 } }];
    expect(checkIntegrity(data).join('\n')).toMatch(/variant/);
  });
});
