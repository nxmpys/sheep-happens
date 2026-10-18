/** Turns changelog refs ("change:ice-lance") into labels and links for the page. */
import { href } from '../i18n/locale';
import type { Locale } from '../i18n/routes';
import { abilities, builds, changes, facts, milestones, picks, professions, races, sources } from './data';
import { localName } from './names';
import { professionAnchor } from './professions';
import { dedupeRefs, type ResolvedRef } from './ref-list';
import type { RefKind } from './schemas';

export type { ResolvedRef } from './ref-list';

/**
 * Label and link of one record. Returns undefined for a record it cannot name:
 * the raw "kind:id" is internal and must never reach the page.
 */
export function resolveRef(reference: string, locale: Locale): ResolvedRef | undefined {
  const [kind, id] = reference.split(':') as [RefKind, string];
  switch (kind) {
    case 'change': {
      const change = changes.find((c) => c.id === id);
      if (!change) break;
      // The full card of every change lives on the changes page.
      return { label: localName(change, locale), href: href('changes', locale, `change-${id}`) };
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
    case 'build': {
      const build = builds.find((b) => b.id === id);
      if (!build) break;
      return { label: build.name[locale], href: href(build.page ?? 'builds', locale, build.id) };
    }
    case 'race': {
      const race = races.find((r) => r.id === id);
      if (!race) break;
      return { label: race.name[locale], href: href('races', locale, `race-${race.id}`) };
    }
    case 'profession': {
      const profession = professions.find((p) => p.id === id);
      if (!profession) break;
      return { label: profession.name[locale], href: href('professions', locale, professionAnchor(profession, locale)) };
    }
    case 'pick': {
      const pick = picks.find((p) => p.id === id);
      if (!pick) break;
      return { label: pick.goal[locale], href: href('professions', locale, `pick-${pick.id}`) };
    }
  }
  return undefined;
}

/** Every ref of an entry that can be named, without two chips for the same name. */
export function resolveRefs(references: readonly string[], locale: Locale): ResolvedRef[] {
  return dedupeRefs(references.map((reference) => resolveRef(reference, locale)));
}
