/**
 * What each menu entry's dropdown lists: the same pages its hub shows as cards,
 * plus the sections of the hub page worth reaching directly (calculators,
 * glossary). Builds lists the contents that have builds; those pages are
 * generated from builds.json, so it gets them as an argument.
 */
import { pathFor, ROUTES, type Locale, type NavGroup, type PageId } from '../i18n/routes';
import { NAV_LABELS } from '../i18n/ui';
import { USE_TITLES } from '../i18n/builds';
import { contentPath } from './build-routes';
import type { BuildUse, SpecTree } from './schemas';

export interface MenuLink {
  label: string;
  url: string;
  /** The page it leads to, to mark it as current. Absent on sections of a page. */
  page?: PageId;
  /** Talent tree the page belongs to: these links show as a row of chips with its school colour. */
  tree?: SpecTree;
}

export interface MenuBlock {
  heading?: string;
  links: MenuLink[];
}

export function menuBlocks(group: NavGroup, locale: Locale, opts: { base?: string; contents?: readonly BuildUse[] } = {}): MenuBlock[] {
  const base = opts.base ?? '/';
  const items: MenuLink[] = (group.items ?? []).map((page) => {
    const tree = ROUTES[page].spec;
    return { label: NAV_LABELS[locale][page], url: pathFor(page, locale, { base }), page, ...(tree ? { tree } : {}) };
  });
  const sections: MenuLink[] = (group.sections ?? []).map((section) => ({
    label: section.label[locale],
    url: pathFor(group.page, locale, { base, hash: section.hash[locale] }),
  }));

  switch (group.key) {
    case 'learn': {
      // In reading order; the three trees hang from Talents as a row of their own.
      const firstTree = items.findIndex((link) => link.tree);
      return [
        { links: items.slice(0, firstTree) },
        { links: items.filter((link) => link.tree) },
        { links: [...items.slice(firstTree).filter((link) => !link.tree), ...sections] },
      ];
    }
    case 'builds':
      return [{ links: (opts.contents ?? []).map((use) => ({ label: USE_TITLES[locale][use], url: contentPath(use, locale, { base }) })) }];
    case 'addons':
      return [{ heading: 'MageProcs', links: sections }];
    case 'tools':
      // In the order its hub page shows them.
      return [{ links: [...sections, ...items] }];
    default:
      return [{ links: [...items, ...sections] }];
  }
}
