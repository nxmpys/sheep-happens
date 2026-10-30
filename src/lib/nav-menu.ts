/**
 * What each menu entry's dropdown lists: the same pages its hub shows as cards,
 * plus the sections of the hub page worth reaching directly (calculators,
 * glossary). Builds also lists the contents that have builds; those pages are
 * generated from builds.json, so it gets them as an argument.
 */
import { pathFor, type Locale, type NavGroup, type PageId } from '../i18n/routes';
import { NAV_LABELS } from '../i18n/ui';
import { USE_TITLES } from '../i18n/builds';
import { contentPath } from './build-routes';
import type { BuildUse } from './schemas';

export interface MenuLink {
  label: string;
  url: string;
  /** The page it leads to, to mark it as current. Absent on sections of a page. */
  page?: PageId;
}

export interface MenuBlock {
  heading?: string;
  links: MenuLink[];
}

export function menuBlocks(group: NavGroup, locale: Locale, opts: { base?: string; contents?: readonly BuildUse[] } = {}): MenuBlock[] {
  const base = opts.base ?? '/';
  const items: MenuLink[] = (group.items ?? []).map((page) => ({ label: NAV_LABELS[locale][page], url: pathFor(page, locale, { base }), page }));
  const sections: MenuLink[] = (group.sections ?? []).map((section) => ({
    label: section.label[locale],
    url: pathFor(group.page, locale, { base, hash: section.hash[locale] }),
  }));

  switch (group.key) {
    case 'builds':
      return [
        {
          links: [
            ...(opts.contents ?? []).map((use) => ({ label: USE_TITLES[locale][use], url: contentPath(use, locale, { base }) })),
            ...items.filter((link) => link.page === 'talents'),
          ],
        },
        // «Arcano» alone says little: the heading tells what these three are.
        { heading: locale === 'es' ? 'Ramas' : 'Trees', links: items.filter((link) => link.page !== 'talents') },
      ];
    case 'addons':
      return [{ heading: 'MageProcs', links: sections }];
    case 'tools':
      // In the order its hub page shows them.
      return [{ links: [...sections, ...items] }];
    default:
      return [{ links: [...items, ...sections] }];
  }
}
