/** Turns changelog refs ("change:ice-lance") into labels and links for the page. */
import { href } from '../i18n/locale';
import type { Locale } from '../i18n/routes';
import { abilities, changes, facts, milestones, sources } from './data';
import { localName } from './names';
import type { RefKind } from './schemas';

export interface ResolvedRef {
  label: string;
  href?: string;
  external?: boolean;
}

export function resolveRef(reference: string, locale: Locale): ResolvedRef {
  const [kind, id] = reference.split(':') as [RefKind, string];
  switch (kind) {
    case 'change': {
      const change = changes.find((c) => c.id === id);
      if (!change) break;
      const page = change.tree === 'baseline' ? 'changes' : (`talents-${change.tree}` as const);
      return { label: localName(change, locale), href: href(page, locale, `change-${id}`) };
    }
    case 'milestone': {
      const milestone = milestones.find((m) => m.id === id);
      if (!milestone) break;
      const label = milestone.name
        ? localName({ name: milestone.name, nameEs: milestone.nameEs }, locale)
        : `${milestone.points} ${locale === 'es' ? 'puntos' : 'points'}`;
      return { label, href: href(`talents-${milestone.tree}`, locale, 'milestones') };
    }
    case 'ability': {
      const ability = abilities.find((a) => a.id === id);
      if (!ability) break;
      return { label: localName(ability, locale), href: href('guide', locale, `role-${ability.role}`) };
    }
    case 'fact': {
      const fact = facts.find((f) => f.id === id);
      if (!fact) break;
      return { label: fact.label[locale] };
    }
    case 'source': {
      const source = sources.find((s) => s.id === id);
      if (!source) break;
      return { label: source.publisher, href: source.url, external: true };
    }
  }
  return { label: reference };
}
