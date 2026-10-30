import { describe, expect, it } from 'vitest';
import { diffRecords } from '../src/lib/data-diff';

const base = {
  id: 'ice-lance',
  name: 'Ice Lance',
  summary: { es: 'Texto', en: 'Text' },
  details: [],
  notes: [],
  status: 'verified',
  sources: ['blizzard-deep-dive-mage'],
};

describe('diffRecords', () => {
  it('accepts unchanged data and Spanish-only edits', () => {
    const after = { ...base, summary: { es: 'Texto corregido', en: 'Text' } };
    expect(diffRecords('changes.json', 'change', [base], [after])).toEqual([]);
  });

  it('requires "updated" when a fact changes', () => {
    const after = { ...base, status: 'tested' };
    const [problem] = diffRecords('changes.json', 'change', [base], [after]);
    expect(problem?.ref).toBe('change:ice-lance');
    expect(problem?.message).toMatch(/status/);
  });

  it('is satisfied once "updated" is bumped', () => {
    const after = { ...base, summary: { es: 'Texto', en: 'New text' }, updated: '2026-10-18' };
    expect(diffRecords('changes.json', 'change', [base], [after])).toEqual([]);
  });

  it('accepts another change on the day of its "updated" date, but not later', () => {
    const before = { ...base, updated: '2026-10-30' };
    const after = { ...before, status: 'tested' };
    expect(diffRecords('changes.json', 'change', [before], [after], '2026-10-30')).toEqual([]);
    expect(diffRecords('changes.json', 'change', [before], [after], '2026-10-31')).toHaveLength(1);
  });

  it('flags new records without a date and warns about removals', () => {
    const problems = diffRecords('changes.json', 'change', [base], [{ ...base, id: 'arcane-blast' }]);
    expect(problems.map((p) => [p.ref, p.severity])).toEqual([
      ['change:arcane-blast', 'error'],
      ['change:ice-lance', 'warning'],
    ]);
  });

  it('counts note status changes as facts', () => {
    const before = { ...base, notes: [{ status: 'analysis', text: { es: 'a', en: 'a' } }] };
    const after = { ...base, notes: [{ status: 'verified', text: { es: 'a', en: 'a' } }] };
    expect(diffRecords('changes.json', 'change', [before], [after])).toHaveLength(1);
  });
});
