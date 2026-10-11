/**
 * Filtering rules for the change explorer. Pure functions, shared by the
 * client script and the unit tests. URL parameters use language-neutral ids
 * so a filtered link works in both locales.
 */
import { CHANGE_KINDS, TREES, type ChangeKind, type Tree } from './schemas';

export interface ChangeFilterState {
  tree: Tree | 'all';
  kind: ChangeKind | 'all';
  query: string;
}

export interface FilterableChange {
  tree: string;
  kinds: readonly string[];
  /** Searchable text: names and summaries in the page language. */
  text: string;
}

export const EMPTY_FILTERS: ChangeFilterState = { tree: 'all', kind: 'all', query: '' };

/** Lowercases and strips accents so "maná" matches "mana". */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function isTree(value: string | null): value is Tree {
  return value !== null && (TREES as readonly string[]).includes(value);
}

function isKind(value: string | null): value is ChangeKind {
  return value !== null && (CHANGE_KINDS as readonly string[]).includes(value);
}

/** Reads filters from a query string, ignoring unknown or invalid values. */
export function parseFilterState(search: string): ChangeFilterState {
  const params = new URLSearchParams(search);
  const tree = params.get('tree');
  const kind = params.get('kind');
  return {
    tree: isTree(tree) ? tree : 'all',
    kind: isKind(kind) ? kind : 'all',
    query: (params.get('q') ?? '').slice(0, 80),
  };
}

/** Returns "" when no filter is active, otherwise "?tree=…&kind=…&q=…". */
export function serializeFilterState(state: ChangeFilterState): string {
  const params = new URLSearchParams();
  if (state.tree !== 'all') params.set('tree', state.tree);
  if (state.kind !== 'all') params.set('kind', state.kind);
  const query = state.query.trim();
  if (query) params.set('q', query);
  const out = params.toString();
  return out ? `?${out}` : '';
}

export function isFiltered(state: ChangeFilterState): boolean {
  return state.tree !== 'all' || state.kind !== 'all' || state.query.trim() !== '';
}

/** Every whitespace-separated term must appear somewhere in the item text. */
export function matchesChange(item: FilterableChange, state: ChangeFilterState): boolean {
  if (state.tree !== 'all' && item.tree !== state.tree) return false;
  if (state.kind !== 'all' && !item.kinds.includes(state.kind)) return false;
  const terms = normalize(state.query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalize(item.text);
  return terms.every((term) => haystack.includes(term));
}

export function countMatches(items: readonly FilterableChange[], state: ChangeFilterState): number {
  return items.reduce((total, item) => total + (matchesChange(item, state) ? 1 : 0), 0);
}
