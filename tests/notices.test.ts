import { describe, expect, it } from 'vitest';
import { liveNotices } from '../src/lib/data';
import { noticeSchema } from '../src/lib/schemas';

const tournament = noticeSchema.parse({
  id: 'duel-tournament-30',
  start: '2026-10-13T00:00:00+02:00',
  end: '2026-10-19T00:00:00+02:00',
  variant: 'tip',
  title: { es: 'Torneo', en: 'Tournament' },
  before: { es: 'Mira la', en: 'See the' },
  link: { page: 'builds', label: { es: 'build', en: 'build' } },
  after: { es: '.', en: '.' },
});

describe('notices', () => {
  it('reads end times with their offset (midnight in Madrid)', () => {
    expect(new Date(tournament.end).toISOString()).toBe('2026-10-18T22:00:00.000Z');
  });

  it('leaves ended notices out of the build', () => {
    expect(liveNotices(new Date('2026-10-18T21:59:00Z'), [tournament])).toHaveLength(1);
    expect(liveNotices(new Date('2026-10-18T22:00:00Z'), [tournament])).toHaveLength(0);
  });
});
