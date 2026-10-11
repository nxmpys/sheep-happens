import { describe, expect, it } from 'vitest';
import {
  EMPTY_FILTERS,
  countMatches,
  isFiltered,
  matchesChange,
  normalize,
  parseFilterState,
  serializeFilterState,
  type FilterableChange,
} from '../src/lib/filters';

const iceLance: FilterableChange = { tree: 'frost', kinds: ['new'], text: 'Ice Lance Instantáneo, +300 % contra objetivos congelados' };
const arcaneSubtlety: FilterableChange = { tree: 'arcane', kinds: ['moved', 'adjusted'], text: 'Arcane Subtlety Pasa de la fila 1 a la 2' };
const mageArmor: FilterableChange = { tree: 'baseline', kinds: ['adjusted'], text: 'Mage Armor Más regeneración de maná' };
const all = [iceLance, arcaneSubtlety, mageArmor];

describe('normalize', () => {
  it('strips accents and case', () => {
    expect(normalize('  Maná ÁRCANO ')).toBe('mana arcano');
  });
});

describe('matchesChange', () => {
  it('matches everything with empty filters', () => {
    expect(countMatches(all, EMPTY_FILTERS)).toBe(3);
  });

  it('filters by tree', () => {
    expect(countMatches(all, { ...EMPTY_FILTERS, tree: 'frost' })).toBe(1);
  });

  it('filters by any of several kinds', () => {
    expect(matchesChange(arcaneSubtlety, { ...EMPTY_FILTERS, kind: 'adjusted' })).toBe(true);
    expect(matchesChange(arcaneSubtlety, { ...EMPTY_FILTERS, kind: 'moved' })).toBe(true);
    expect(matchesChange(arcaneSubtlety, { ...EMPTY_FILTERS, kind: 'new' })).toBe(false);
  });

  it('requires every search term, ignoring accents', () => {
    expect(matchesChange(mageArmor, { ...EMPTY_FILTERS, query: 'mana armor' })).toBe(true);
    expect(matchesChange(mageArmor, { ...EMPTY_FILTERS, query: 'mana lance' })).toBe(false);
  });

  it('combines tree, kind and text', () => {
    const state = { tree: 'frost', kind: 'new', query: 'congelados' } as const;
    expect(countMatches(all, state)).toBe(1);
    expect(countMatches(all, { ...state, tree: 'fire' })).toBe(0);
  });
});

describe('URL state', () => {
  it('round-trips through the query string', () => {
    const state = { tree: 'fire', kind: 'moved', query: 'fire blast' } as const;
    expect(parseFilterState(serializeFilterState(state))).toEqual(state);
  });

  it('serializes empty filters as an empty string', () => {
    expect(serializeFilterState(EMPTY_FILTERS)).toBe('');
    expect(isFiltered(EMPTY_FILTERS)).toBe(false);
  });

  it('ignores unknown values instead of failing', () => {
    expect(parseFilterState('?tree=shadow&kind=removed&q=')).toEqual(EMPTY_FILTERS);
  });

  it('caps very long queries', () => {
    expect(parseFilterState(`?q=${'a'.repeat(500)}`).query).toHaveLength(80);
  });
});
