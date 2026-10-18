/**
 * Sources of sections that repeat the same list (one per race, one per
 * profession) are shown once, in «Fuentes de esta página» at the end. A
 * section only keeps, as a short reference, the sources the others do not cite.
 */
import { professions, races } from './data';

/** Sources every list cites, in the order of the first list. */
export function sharedSourceIds(lists: readonly (readonly string[])[]): string[] {
  const [first = [], ...rest] = lists;
  return first.filter((id) => rest.every((list) => list.includes(id)));
}

/** The sources of one section that the other sections do not all cite. */
export function ownSourceIds(list: readonly string[], shared: readonly string[]): string[] {
  return list.filter((id) => !shared.includes(id));
}

export const sharedRaceSources = sharedSourceIds(races.map((r) => r.sources));
export const sharedProfessionSources = sharedSourceIds(professions.map((p) => p.sources));

/**
 * Every source of a page, without duplicates: its frontmatter list, then the
 * sources of the race and profession sections it shows (read from its MDX body).
 */
export function pageSourceIds(frontmatter: readonly string[], body = ''): string[] {
  const ids = [...frontmatter];
  if (body.includes('<RaceCards')) ids.push(...races.flatMap((r) => r.sources));
  for (const match of body.matchAll(/<ProfessionDetail id="([^"]+)"/g)) {
    ids.push(...(professions.find((p) => p.id === match[1])?.sources ?? []));
  }
  return [...new Set(ids)];
}
