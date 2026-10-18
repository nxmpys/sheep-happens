/**
 * Filtering rules for the builds page. Pure functions shared by the client
 * script and the unit tests. URL parameters use language-neutral ids
 * (?use=aoe&spec=frost) so a filtered link works in both locales.
 */
import { BUILD_SPECS, BUILD_USES, type BuildSpec, type BuildUse } from './schemas';

export interface BuildFilterState {
  use: BuildUse | 'all';
  spec: BuildSpec | 'all';
}

export interface FilterableBuild {
  uses: readonly string[];
  spec: string;
}

export const EMPTY_BUILD_FILTERS: BuildFilterState = { use: 'all', spec: 'all' };

function isUse(value: string | null): value is BuildUse {
  return value !== null && (BUILD_USES as readonly string[]).includes(value);
}

function isSpec(value: string | null): value is BuildSpec {
  return value !== null && (BUILD_SPECS as readonly string[]).includes(value);
}

/** Reads filters from a query string, ignoring unknown or invalid values. */
export function parseBuildFilters(search: string): BuildFilterState {
  const params = new URLSearchParams(search);
  const use = params.get('use');
  const spec = params.get('spec');
  return { use: isUse(use) ? use : 'all', spec: isSpec(spec) ? spec : 'all' };
}

/** Returns "" when no filter is active, otherwise "?use=…&spec=…". */
export function serializeBuildFilters(state: BuildFilterState): string {
  const params = new URLSearchParams();
  if (state.use !== 'all') params.set('use', state.use);
  if (state.spec !== 'all') params.set('spec', state.spec);
  const out = params.toString();
  return out ? `?${out}` : '';
}

export function isBuildFiltered(state: BuildFilterState): boolean {
  return state.use !== 'all' || state.spec !== 'all';
}

export function matchesBuild(build: FilterableBuild, state: BuildFilterState): boolean {
  if (state.use !== 'all' && !build.uses.includes(state.use)) return false;
  if (state.spec !== 'all' && build.spec !== state.spec) return false;
  return true;
}
