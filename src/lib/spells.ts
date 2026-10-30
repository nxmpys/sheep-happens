/**
 * Spell and talent index for the hover tooltips.
 *
 * Every bold spell name in a guide page («**Lanza de hielo**») is looked up
 * here by its Spanish or English name. The tooltip shows what the spell does in
 * the game: its in-game text (src/data/spell-text.json, from the Wowhead
 * Forever database). Our own notes and the Forever changes stay on the linked
 * page; the tooltip only falls back to our description when there is no game
 * text (systems such as spell ranks, or values Wowhead does not have yet).
 */
import { pathFor, type Locale, type PageId } from '../i18n/routes';
import { normalize } from './filters';
import type { Ability, Change, GlossaryTerm, Milestone, Race, Status, Talent } from './schemas';
import type { SpellText, SpellTextEntry } from './spell-text';

export type TooltipSchool = 'arcane' | 'fire' | 'frost' | 'frostfire' | 'baseline';

/** Where "more information" leads: the Forever change card, the guide section (or race card) or the talent tree. */
export type TooltipMore = 'changes' | 'guide' | 'talents';

export interface SpellTooltip {
  key: string;
  name: string;
  /** English name, shown as a hint on Spanish pages. */
  english?: string;
  school: TooltipSchool;
  /** "Hechizo de Escarcha · Nivel 4", "Talento de Fuego · Fila 3". */
  facts: string[];
  /** Path to the spell's in-game icon (public/icons), when known. */
  icon?: string;
  /** In-game tooltip text, when the game has one. */
  game?: Omit<SpellText, 'name'>;
  /** Our own description, only when there is no game text. */
  summary?: string;
  /** Verification status of what the guide says about it (our description or its Forever change). */
  status?: Status;
  /** Page with the full information, and what kind of page it is. */
  href: string;
  more: TooltipMore;
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

/** Spanish name from the dictionary (English → Spanish), with the English one as a hint. */
function localName(record: { name: string }, locale: Locale, names: Readonly<Record<string, string>>) {
  const es = locale === 'es' ? names[record.name] : undefined;
  if (es && es !== record.name) return { name: es, english: record.name };
  return { name: record.name };
}

export function buildSpellIndex(
  data: {
    abilities: readonly Ability[];
    changes: readonly Change[];
    talents: readonly Talent[];
    milestones?: readonly Milestone[];
    /** Races, for their racial abilities. */
    races?: readonly Race[];
    spellText?: Readonly<Record<string, SpellTextEntry>>;
    /** English → Spanish names (spell-names.json). */
    names?: Readonly<Record<string, string>>;
    /** Glossary terms (glossary.json), registered after every spell so they never shadow one. */
    glossary?: readonly GlossaryTerm[];
  },
  locale: Locale,
  opts: { base?: string } = {},
): SpellIndex {
  const es = locale === 'es';
  const spanish = data.names ?? {};
  const entries: Record<string, SpellTooltip> = {};
  const names = new Map<string, string>();
  const changeById = new Map(data.changes.map((c) => [c.id, c]));
  const talentByChange = new Map(data.talents.filter((t) => t.changeId).map((t) => [t.changeId!, t]));
  const covered = new Set<string>();
  const link = (id: PageId, hash?: string) => pathFor(id, locale, { ...opts, ...(hash ? { hash } : {}) });

  const register = (key: string, entry: SpellTooltip, ...recordNames: (string | undefined)[]) => {
    entries[key] = entry;
    for (const variant of recordNames.flatMap(nameVariants)) {
      const normalized = normalize(variant);
      if (!names.has(normalized)) names.set(normalized, key);
    }
  };
  /** The game text if there is one; otherwise our description and its status. */
  const iconBase = `${(opts.base ?? '/').replace(/\/?$/, '/')}icons/`;
  const describe = (spell: number | undefined, summary: string, status: Status, stale = false) => {
    const entry = spell ? data.spellText?.[spell] : undefined;
    const icon = entry?.icon ? { icon: `${iconBase}${entry.icon}.jpg` } : {};
    const text = stale ? undefined : entry?.[locale];
    if (!text) return { ...icon, summary, status };
    const { name: _name, ...game } = text;
    return { ...icon, game, status };
  };
  // Milestone slots confirmed for a talent, by English name (milestones.json).
  const milestonePoints = new Map(
    (data.milestones ?? []).filter((m) => m.name && m.status !== 'pending').map((m) => [m.name!, m.points] as const),
  );
  const talentFacts = (talent: Talent | undefined, change?: Change) => {
    const school = SCHOOL_LABEL[locale][talent?.tree ?? 'baseline'];
    const facts = [es ? `Talento de ${school}` : `${school} talent`];
    if (talent) facts.push(`${es ? 'Fila' : 'Row'} ${talent.row}`);
    if (talent && talent.maxRank > 1) facts.push(es ? `${talent.maxRank} rangos` : `${talent.maxRank} ranks`);
    const milestone = change?.milestone ?? (talent ? milestonePoints.get(talent.name) : undefined);
    if (milestone) facts.push(es ? `Decisivo de ${milestone} puntos` : `${milestone}-point milestone`);
    return facts;
  };

  // Base abilities. A change named like the ability is its own Forever change.
  for (const ability of data.abilities) {
    const school = schoolOf(ability.school);
    const facts = [`${es ? 'Hechizo' : 'Spell'} · ${SCHOOL_LABEL[locale][school]}`];
    if (ability.level) {
      const classic = ability.status !== 'verified' && ability.status !== 'tested';
      facts.push(es ? `Nivel ${ability.level}${classic ? ' (Classic)' : ''}` : `Level ${ability.level}${classic ? ' (Classic)' : ''}`);
    }
    const own = ability.changeIds.map((id) => changeById.get(id)).find((c) => c?.name === ability.name);
    if (own) covered.add(own.id);
    register(
      `ability-${ability.id}`,
      {
        key: `ability-${ability.id}`,
        ...localName(ability, locale, spanish),
        school,
        facts,
        ...describe(ability.spell, ability.summary[locale], ability.status),
        ...(own
          ? { href: link('changes', `change-${own.id}`), more: 'changes' as const }
          : { href: link('combat', `role-${ability.role}`), more: 'guide' as const }),
      },
      spanish[ability.name],
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
        ...localName(change, locale, spanish),
        school,
        facts,
        ...describe(talent?.spell ?? change.spell, change.summary[locale], change.status),
        href: link('changes', `change-${change.id}`),
        more: 'changes',
      },
      spanish[change.name],
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
        ...localName(talent, locale, spanish),
        school: talent.tree,
        facts: talentFacts(talent),
        ...describe(
          talent.spell,
          es
            ? 'Forever no ha anunciado cambios en este talento: funciona como en Classic mientras no se compruebe lo contrario.'
            : 'Forever has not announced changes to this talent: it works as in Classic until proven otherwise.',
          'classic',
        ),
        href: link(`talents-${talent.tree}`),
        more: 'talents',
      },
      spanish[talent.name],
      talent.name,
    );
  }

  // Racials, active and passive, linking to their race card. The Spanish client
  // name (from the game text) also finds them, so «**Crueldad**» works too.
  for (const race of data.races ?? []) {
    const raceName = race.name[locale].replace(/\s*\(.*\)$/, '');
    for (const racial of race.racials) {
      const kind = racial.kind === 'active' ? (es ? 'Activa' : 'Active') : es ? 'Pasiva' : 'Passive';
      register(
        `racial-${race.id}-${racial.id}`,
        {
          key: `racial-${race.id}-${racial.id}`,
          ...(es && racial.nameEs ? { name: racial.nameEs, english: racial.name } : { name: racial.name }),
          school: 'baseline',
          facts: [es ? `Racial de ${raceName}` : `${raceName} racial`, kind],
          ...describe(racial.spell, racial.effect[locale], race.status, racial.gameTextStale),
          href: link('races', `race-${race.id}`),
          more: 'guide',
        },
        racial.name,
        racial.nameEs,
        racial.spell ? data.spellText?.[racial.spell]?.es?.name : undefined,
      );
    }
  }

  // Glossary terms: our definition, linking to the Glossary section of Learn.
  for (const term of data.glossary ?? []) {
    const [headword, ...rest] = term.terms[locale];
    register(
      `glossary-${term.id}`,
      {
        key: `glossary-${term.id}`,
        name: headword!,
        school: 'baseline',
        facts: [es ? 'Glosario' : 'Glossary'],
        summary: term.definition[locale],
        href: link('learn', `glossary-${term.id}`),
        more: 'guide',
      },
      headword,
      ...rest,
    );
  }

  return { entries, names };
}

/** Glossary spellings to underline in the guide text, as autoLinkNames entries. */
export function glossaryLinkNames(glossary: readonly GlossaryTerm[], locale: Locale): [string, string, string][] {
  return glossary.flatMap((term) => term.terms[locale].map((name): [string, string, string] => [name, `glossary-${term.id}`, 'baseline']));
}

/** Finds the tooltip for a visible spell name, or undefined. */
export function findSpell(index: SpellIndex, text: string): SpellTooltip | undefined {
  const key = index.names.get(normalize(text));
  return key ? index.entries[key] : undefined;
}

/** Visible names that must not become tooltips on their own (Blizzard the company, generic words). */
const AMBIGUOUS_NAMES = new Set([
  'Blizzard',
  'Portal',
  'Teleport',
  'Teletransporte',
  'Wands',
  'Varitas',
  'Impact',
  'Impacto',
  // Racials named like plain words ("mana regeneration", "a savage hit").
  'Perception',
  'Regeneration',
  'Hardiness',
  'Savage',
]);

/**
 * Names the page script turns into tooltip triggers when they appear as plain
 * text: the visible spell and talent names of the locale (Spanish and English
 * on Spanish pages), longest first so "Improved Frostbolt" wins over
 * "Frostbolt". Each entry is [name, tooltip key, school class].
 */
export function autoLinkNames(
  index: SpellIndex,
  records: readonly { name: string }[],
  locale: Locale,
  names: Readonly<Record<string, string>> = {},
): [string, string, string][] {
  const english = records.map((r) => r.name);
  const visible = locale === 'es' ? [...english.map((n) => names[n] ?? n), ...english] : english;
  const out = new Map<string, [string, string, string]>();
  for (const name of visible.flatMap((n) => n.split(' / ')).map((n) => n.replace(/\s*\(.*\)$/, '').trim())) {
    if (name.length <= 3 || AMBIGUOUS_NAMES.has(name) || out.has(name)) continue;
    const spell = findSpell(index, name);
    if (spell) out.set(name, [name, spell.key, spell.school === 'frostfire' ? 'fire' : spell.school]);
  }
  return [...out.values()].sort((a, b) => b[0].length - a[0].length);
}
