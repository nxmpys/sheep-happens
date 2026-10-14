/**
 * Detects data records whose facts changed without bumping `updated`.
 * Only the canonical (English) text and the factual fields count: fixing a
 * Spanish typo does not require a changelog entry, changing a fact does.
 */

type Json = Record<string, unknown>;

/** Factual fields per data file. Text fields compare their English version only. */
export const FACT_FIELDS: Record<string, string[]> = {
  'changes.json': ['name', 'tree', 'category', 'kinds', 'row', 'previousRow', 'milestone', 'learnLevel', 'summary.en', 'details.en', 'notes.facts', 'status', 'sources'],
  'milestones.json': ['name', 'changeId', 'note.en', 'status', 'sources'],
  'abilities.json': ['name', 'school', 'role', 'level', 'changeIds', 'summary.en', 'status', 'sources'],
  'facts.json': ['value.en', 'status', 'sources'],
  'builds.json': ['uses', 'spec', 'level', 'fromLevel', 'legacyTalented', 'points', 'order', 'summary.en', 'status', 'gameVersion', 'sources'],
  'races.json': ['racials.facts', 'status', 'sources'],
  'professions.json': ['kind', 'edge', 'ratings', 'priority', 'benefit.en', 'limitation.en', 'summary.en', 'pros.en', 'cons.en', 'pair.with', 'verdict.en', 'items.facts', 'status', 'sources'],
  'profession-picks.json': ['professions', 'alternative.professions', 'why.en', 'status', 'sources'],
};

/** Fields holding a list of localized texts: compare their English versions. */
const LOCALIZED_LISTS = new Set(['details.en', 'pros.en', 'cons.en']);

function pick(record: Json, field: string): unknown {
  if (LOCALIZED_LISTS.has(field)) return ((record[field.split('.')[0]!] as Json[] | undefined) ?? []).map((d) => d['en']);
  if (field === 'items.facts') {
    return ((record['items'] as Json[] | undefined) ?? []).map((i) => [i['name'], i['wowhead'], (i['note'] as Json | undefined)?.['en']]);
  }
  if (field === 'racials.facts') {
    return ((record['racials'] as Json[] | undefined) ?? []).map((r) => [r['id'], r['kind'], (r['effect'] as Json | undefined)?.['en'], r['value']]);
  }
  if (field === 'notes.facts') {
    return ((record['notes'] as Json[] | undefined) ?? []).map((n) => [n['status'], (n['text'] as Json | undefined)?.['en']]);
  }
  const [key, sub] = field.split('.');
  const value = record[key!];
  return sub ? (value as Json | undefined)?.[sub] : value;
}

export interface DiffProblem {
  ref: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Compares two versions of a data file (arrays of records with `id`).
 * `kind` is the ref prefix used by the changelog ("change", "fact"…).
 */
export function diffRecords(file: string, kind: string, before: Json[], after: Json[]): DiffProblem[] {
  const fields = FACT_FIELDS[file] ?? [];
  const previous = new Map(before.map((r) => [r['id'] as string, r]));
  const current = new Map(after.map((r) => [r['id'] as string, r]));
  const problems: DiffProblem[] = [];

  for (const [id, record] of current) {
    const ref = `${kind}:${id}`;
    const old = previous.get(id);
    if (!old) {
      if (!record['updated']) problems.push({ ref, severity: 'error', message: 'new record without an "updated" date' });
      continue;
    }
    const changed = fields.filter((f) => JSON.stringify(pick(old, f)) !== JSON.stringify(pick(record, f)));
    if (changed.length > 0 && record['updated'] === old['updated']) {
      problems.push({ ref, severity: 'error', message: `facts changed (${changed.join(', ')}) but "updated" was not bumped` });
    }
  }
  for (const id of previous.keys()) {
    if (!current.has(id)) {
      problems.push({ ref: `${kind}:${id}`, severity: 'warning', message: 'record removed: explain it in a changelog entry' });
    }
  }
  return problems;
}
