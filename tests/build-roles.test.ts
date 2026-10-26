import { describe, expect, it } from 'vitest';
import { buildRole, recommendedConflicts } from '../src/lib/build-roles';
import { checkIntegrity, dataset } from '../src/lib/data';
import { buildSchema, type Build } from '../src/lib/schemas';

const base = dataset.builds.find((b) => b.id === 'frost-leveling-solo')!;

function build(id: string, overrides: Partial<Build>): Build {
  return { ...structuredClone(base), id, recommendedFor: [], ...overrides };
}

describe('recommended or viable', () => {
  it('labels a build recommended or viable per use', () => {
    const dual = build('dual', { uses: ['leveling', 'dungeons'], recommendedFor: ['dungeons'] });
    expect(buildRole(dual, 'dungeons')).toBe('recommended');
    expect(buildRole(dual, 'leveling')).toBe('viable');
  });

  it('allows one recommended build per use and level', () => {
    const a = build('a', { level: 60, recommendedFor: ['leveling'] });
    expect(recommendedConflicts([a, build('b', { level: 30, recommendedFor: ['leveling'] })])).toEqual([]);
    expect(recommendedConflicts([a, build('c', { level: 60, recommendedFor: ['leveling'] })])).toEqual([
      '"c" and "a" are both recommended for leveling at level 60',
    ]);
  });

  it('is checked by the data integrity rules', () => {
    const data = structuredClone(dataset);
    data.builds.push({ ...structuredClone(base), id: 'one', slug: { es: 'una', en: 'one' }, recommendedFor: ['leveling'] });
    data.builds.push({ ...structuredClone(base), id: 'other', slug: { es: 'otra', en: 'other' }, recommendedFor: ['leveling'] });
    expect(checkIntegrity(data).join('\n')).toMatch(/both recommended for leveling at level 60/);
  });

  it('must name one of the build’s own uses', () => {
    const raw = { ...structuredClone(base), recommendedFor: ['raid'] };
    expect(buildSchema.safeParse(raw).success).toBe(false);
  });
});
