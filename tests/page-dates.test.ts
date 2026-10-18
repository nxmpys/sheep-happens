import { describe, expect, it } from 'vitest';
import { dataset } from '../src/lib/data';
import { latestDate, shownDataDates } from '../src/lib/page-dates';
import { lastModified } from '../src/lib/seo';

describe('shownDataDates', () => {
  it('reads the records a page shows from its data components', () => {
    const solo = dataset.builds.find((b) => b.id === 'frost-leveling-solo')!;
    const dates = shownDataDates(`Texto\n\n<BuildPicker ids={['frost-leveling-solo']} recommended="frost-leveling-solo" />`, dataset);
    expect(dates).toEqual([solo.updated]);
    expect(shownDataDates('<FactList ids={["legacy", "respec"]} />', dataset)).toHaveLength(
      dataset.facts.filter((f) => ['legacy', 'respec'].includes(f.id) && f.updated).length,
    );
    expect(shownDataDates('Sin componentes de datos.', dataset)).toEqual([]);
  });

  it('dates a page that lists the changelog by its newest entry', () => {
    const newest = [...dataset.changelog].sort((a, b) => b.date.localeCompare(a.date))[0]!.date;
    const home = lastModified('home', new Date('2026-10-11T00:00:00Z'), '<ChangelogList limit={3} compact />');
    expect(home.toISOString().slice(0, 10)).toBe(newest);
  });
});

describe('latestDate', () => {
  it('keeps the review date when nothing is newer', () => {
    const reviewed = new Date('2026-10-14T00:00:00Z');
    expect(latestDate(reviewed, ['2026-10-01', '2026-10-13'])).toBe(reviewed);
    expect(latestDate(reviewed, ['2026-10-16']).toISOString().slice(0, 10)).toBe('2026-10-16');
  });
});
