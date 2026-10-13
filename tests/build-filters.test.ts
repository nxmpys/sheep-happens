import { describe, expect, it } from 'vitest';
import {
  EMPTY_BUILD_FILTERS,
  isBuildFiltered,
  matchesBuild,
  parseBuildFilters,
  serializeBuildFilters,
} from '../src/lib/build-filters';

describe('build filters', () => {
  it('reads valid filters from the URL and ignores unknown values', () => {
    expect(parseBuildFilters('?use=duels&spec=frost')).toEqual({ use: 'duels', spec: 'frost' });
    expect(parseBuildFilters('?use=tanking&spec=shadow')).toEqual(EMPTY_BUILD_FILTERS);
  });

  it('round-trips through the URL', () => {
    const state = { use: 'leveling', spec: 'hybrid' } as const;
    expect(parseBuildFilters(serializeBuildFilters(state))).toEqual(state);
    expect(serializeBuildFilters(EMPTY_BUILD_FILTERS)).toBe('');
  });

  it('matches by use and tree', () => {
    const build = { uses: ['duels', 'pvp'], spec: 'frost' };
    expect(matchesBuild(build, { use: 'duels', spec: 'all' })).toBe(true);
    expect(matchesBuild(build, { use: 'leveling', spec: 'all' })).toBe(false);
    expect(matchesBuild(build, { use: 'all', spec: 'fire' })).toBe(false);
    expect(matchesBuild(build, EMPTY_BUILD_FILTERS)).toBe(true);
  });

  it('knows when a filter is active', () => {
    expect(isBuildFiltered(EMPTY_BUILD_FILTERS)).toBe(false);
    expect(isBuildFiltered({ use: 'raid', spec: 'all' })).toBe(true);
  });
});
