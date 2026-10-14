/**
 * Small helpers for the professions page. Pure, so they are unit tested.
 */
import type { Locale } from '../i18n/routes';
import type { Profession } from './schemas';

/**
 * The id Astro gives a Markdown heading (github-slugger): lowercase, punctuation
 * removed, each space turned into a hyphen. Accented letters are kept.
 * The professions page writes one "### <name>" heading per profession, so the
 * picks and the comparison table link to it with this slug.
 */
export function headingSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

export function professionAnchor(profession: Pick<Profession, 'name'>, locale: Locale): string {
  return headingSlug(profession.name[locale]);
}

/** Item page in Wowhead's Forever database. */
export function wowheadItemUrl(id: number): string {
  return `https://www.wowhead.com/forever/item=${id}`;
}

/** Professions that take one of the two primary slots, in data order. */
export function primaryProfessions<T extends Pick<Profession, 'kind'>>(list: readonly T[]): T[] {
  return list.filter((p) => p.kind !== 'secondary');
}
