/**
 * Spell and talent index for the hover tooltips.
 *
 * Every bold spell name in a guide page («**Lanza de hielo**») is looked up
 * here by its Spanish or English name. The tooltip shows only what the guide
 * already documents: school or tree, learning level, row, the summary and the
 * Forever changes, each with its verification status. Mana costs are not
 * shown because no official source has published them for Forever.
 */
import type { Locale } from '../i18n/routes';
import { normalize } from './filters';
import type { Ability, Change, Milestone, Status, Talent } from './schemas';

export type TooltipSchool = 'arcane' | 'fire' | 'frost' | 'frostfire' | 'baseline';

export interface TooltipChange {
  id: string;
  summary: string;
  kinds: string[];
  status: Status;
}

export interface SpellTooltip {
  key: string;
  name: string;
  /** English name, shown as a hint on Spanish pages. */
  english?: string;
  school: TooltipSchool;
  /** "Hechizo de Escarcha · Nivel 4", "Talento de Fuego · Fila 3". */
  facts: string[];
  summary?: string;
  status: Status;
  changes: TooltipChange[];
  /** Hash of the change card on the changes page, if there is one. */
  changeAnchor?: string;
}

export interface SpellIndex {
  entries: Record<string, SpellTooltip>;
  /** Normalized name → entry key. */
  names: Map<string, string>;
}

const SCHOOL_LABEL: Record<Locale, Record<TooltipSchool, string>> = {
  es: { arcane: 'Arcano', fire: 'Fuego', frost: 'Escarcha', frostfire: 'Fuego y Escarcha', baseline: 'Base' },
  en: { arcane: 'Arcane', fire: 'Fire', frost: 'Frost', frostfire: 'Fire and Frost', baseline: 'Baseline' },
};

function schoolOf(school: Ability['school'] | Change['tree']): TooltipSchool {
  if (school === 'arcane' || school === 'fire' || school === 'frost' || school === 'frostfire') return school;
  return 'baseline';
}

/** "Frost Armor / Ice Armor" → both names; "Comprensión (Comprender pergamino)" → both parts. */
function nameVariants(name: string | undefined): string[] {
  if (!name) return [];
  const parts = name.split(' / ').flatMap((part) => {
    const match = /^(.*?)\s*\((.*)\)$/.exec(part);
    return match ? [part, match[1]!, match[2]!] : [part];
  });
  return [...new Set(parts.map((p) => p.trim()).filter((p) => p.length > 2))];
}

function localName(record: { name: string; nameEs?: string | undefined }, locale: Locale) {
  if (locale === 'es' && record.nameEs && record.nameEs !== record.name) return { name: record.nameEs, english: record.name };
  return { name: record.name };
}

export function buildSpellIndex(
  data: { abilities: readonly Ability[]; changes: readonly Change[]; talents: readonly Talent[]; milestones?: readonly Milestone[] },
  locale: Locale,
): SpellIndex {
  const es = locale === 'es';
  const entries: Record<string, SpellTooltip> = {};
  const names = new Map<string, string>();
  const changeById = new Map(data.changes.map((c) => [c.id, c]));
  const talentByChange = new Map(data.talents.filter((t) => t.changeId).map((t) => [t.changeId!, t]));
  const covered = new Set<string>();

  const register = (key: string, entry: SpellTooltip, ...recordNames: (string | undefined)[]) => {
    entries[key] = entry;
    for (const variant of recordNames.flatMap(nameVariants)) {
      const normalized = normalize(variant);
      if (!names.has(normalized)) names.set(normalized, key);
    }
  };
  const toChange = (change: Change): TooltipChange => ({
    id: change.id,
    summary: change.summary[locale],
    kinds: change.kinds,
    status: change.status,
  });
  // Milestone slots confirmed for a talent, by English name (milestones.json).
  const milestonePoints = new Map(
    (data.milestones ?? []).filter((m) => m.name && m.status !== 'pending').map((m) => [m.name!, m.points] as const),
  );
  const talentFacts = (talent: Talent | undefined, change?: Change) => {
    const school = SCHOOL_LABEL[locale][talent?.tree ?? 'baseline'];
    const facts = [es ? `Talento de ${school}` : `${school} talent`];
    if (talent) facts.push(`${es ? 'Fila' : 'Row'} ${talent.row}`);
    const milestone = change?.milestone ?? (talent ? milestonePoints.get(talent.name) : undefined);
    if (milestone) facts.push(es ? `Decisivo de ${milestone} puntos` : `${milestone}-point milestone`);
    return facts;
  };

  // Base abilities: summary from abilities.json, Forever changes linked from it.
  for (const ability of data.abilities) {
    const school = schoolOf(ability.school);
    const facts = [`${es ? 'Hechizo' : 'Spell'} · ${SCHOOL_LABEL[locale][school]}`];
    if (ability.level) {
      const classic = ability.status !== 'verified' && ability.status !== 'tested';
      facts.push(es ? `Nivel ${ability.level}${classic ? ' (Classic)' : ''}` : `Level ${ability.level}${classic ? ' (Classic)' : ''}`);
    }
    const linked = ability.changeIds.map((id) => changeById.get(id)).filter((c): c is Change => c !== undefined);
    // A change named like the ability is the ability's own Forever change.
    const own = linked.find((c) => c.name === ability.name);
    if (own) covered.add(own.id);
    register(
      `ability-${ability.id}`,
      {
        key: `ability-${ability.id}`,
        ...localName(ability, locale),
        school,
        facts,
        summary: ability.summary[locale],
        status: ability.status,
        changes: linked.slice(0, 3).map(toChange),
        ...(linked[0] ? { changeAnchor: `change-${(own ?? linked[0]).id}` } : {}),
      },
      ability.nameEs,
      ability.name,
    );
  }

  // Forever changes that are not a base ability already listed above.
  for (const change of data.changes) {
    if (covered.has(change.id)) continue;
    const talent = talentByChange.get(change.id);
    const school = schoolOf(change.tree);
    const facts = change.category === 'talent' ? talentFacts(talent, change) : [es ? 'Sistema de Forever' : 'Forever system'];
    if (change.learnLevel) facts.push(es ? `Nivel ${change.learnLevel}` : `Level ${change.learnLevel}`);
    register(
      `change-${change.id}`,
      {
        key: `change-${change.id}`,
        ...localName(change, locale),
        school,
        facts,
        status: change.status,
        changes: [toChange(change)],
        changeAnchor: `change-${change.id}`,
      },
      change.nameEs,
      change.name,
    );
  }

  // Talents Forever did not change (Pyroblast, Presence of Mind, Ice Barrier…).
  for (const talent of data.talents) {
    if (talent.changeId) continue;
    register(
      `talent-${talent.id}`,
      {
        key: `talent-${talent.id}`,
        ...localName(talent, locale),
        school: talent.tree,
        facts: talentFacts(talent),
        summary: es
          ? 'Forever no ha anunciado cambios en este talento: funciona como en Classic mientras no se compruebe lo contrario.'
          : 'Forever has not announced changes to this talent: it works as in Classic until proven otherwise.',
        status: 'classic',
        changes: [],
      },
      talent.nameEs,
      talent.name,
    );
  }

  return { entries, names };
}

/** Finds the tooltip for a visible spell name, or undefined. */
export function findSpell(index: SpellIndex, text: string): SpellTooltip | undefined {
  const key = index.names.get(normalize(text));
  return key ? index.entries[key] : undefined;
}
