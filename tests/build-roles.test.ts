import { describe, expect, it } from 'vitest';
import { buildRole, recommendedConflicts } from '../src/lib/build-roles';
import { checkIntegrity } from '../src/lib/data';
import { buildSchema, type Build } from '../src/lib/schemas';
import { datasetWithFixture, fixtureBuild as base } from './fixtures/builds';

function build(id: string, overrides: Partial<Build>): Build {
  return { ...structuredClone(base), id, recommendedFor: [], ...overrides };
}

describe('recommended or viable', () => {
  it('labels a build recommended or viable per use', () => {
    const dual = build('dual', { uses: ['leveling', 'dungeons'], recommendedFor: ['dungeons'] });
    expect(buildRole(dual, 'dungeons')).toBe('recommended');
    expect(buildRole(dual, 'leveling')).toBe('viable');
  });

  it('allows one recommended build per use, focus and level', () => {
    const a = build('a', { level: 60, focus: 'single-target', recommendedFor: ['leveling'] });
    expect(recommendedConflicts([a, build('b', { level: 30, focus: 'single-target', recommendedFor: ['leveling'] })])).toEqual([]);
    expect(recommendedConflicts([a, build('aoe', { level: 60, focus: 'aoe', recommendedFor: ['leveling'] })])).toEqual([]);
    expect(recommendedConflicts([a, build('c', { level: 60, focus: 'single-target', recommendedFor: ['leveling'] })])).toEqual([
      '"c" and "a" are both recommended for leveling (single-target) at level 60',
    ]);
  });

  it('is checked by the data integrity rules', () => {
    const data = datasetWithFixture();
    data.builds.push({ ...structuredClone(base), id: 'one', slug: { es: 'una', en: 'one' }, recommendedFor: ['leveling'] });
    data.builds.push({ ...structuredClone(base), id: 'other', slug: { es: 'otra', en: 'other' }, recommendedFor: ['leveling'] });
    expect(checkIntegrity(data).join('\n')).toMatch(/both recommended for leveling \(single-target\) at level 60/);
  });

  it('needs a focus that makes sense for every use', () => {
    expect(buildSchema.safeParse({ ...structuredClone(base), focus: 'battlegrounds' }).success).toBe(false);
    expect(buildSchema.safeParse({ ...structuredClone(base), uses: ['leveling', 'raid'], focus: 'aoe' }).success).toBe(false);
    expect(buildSchema.safeParse({ ...structuredClone(base), uses: ['leveling', 'raid'], focus: 'single-target' }).success).toBe(true);
  });

  it('must name one of the build’s own uses', () => {
    const raw = { ...structuredClone(base), recommendedFor: ['raid'] };
    expect(buildSchema.safeParse(raw).success).toBe(false);
  });
});
