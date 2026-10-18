import { describe, expect, it } from 'vitest';
import { liveNotices, notices } from '../src/lib/data';

describe('notices', () => {
  it('ends the duel tournament banner at midnight in Madrid on 19 October', () => {
    const tournament = notices.find((n) => n.id === 'duel-tournament-30')!;
    expect(new Date(tournament.end).toISOString()).toBe('2026-10-18T22:00:00.000Z');
  });

  it('leaves ended notices out of the build', () => {
    expect(liveNotices(new Date('2026-10-18T21:59:00Z')).map((n) => n.id)).toContain('duel-tournament-30');
    expect(liveNotices(new Date('2026-10-18T22:00:00Z')).map((n) => n.id)).not.toContain('duel-tournament-30');
  });
});
