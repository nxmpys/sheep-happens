import { describe, expect, it } from 'vitest';
import { critMultiplier, formatPercent } from '../src/lib/crit';

describe('critMultiplier', () => {
  it('reproduces the official Frostfire Bolt example (200% + 40% = 280%)', () => {
    const result = critMultiplier({ school: 'frostfire', iceShards: 5, ignite: 5 });
    expect(result.hit).toBe(2);
    expect(result.ignite).toBe(0.8);
    expect(result.total).toBe(2.8);
  });

  it('gives a plain 150% crit without talents', () => {
    expect(critMultiplier({ school: 'frostfire', iceShards: 0, ignite: 0 }).total).toBe(1.5);
  });

  it('ignores Ice Shards for Fire spells', () => {
    const result = critMultiplier({ school: 'fire', iceShards: 5, ignite: 5 });
    expect(result.usesIceShards).toBe(false);
    expect(result.hit).toBe(1.5);
    expect(result.total).toBe(2.1);
  });

  it('ignores Ignite for Frost spells', () => {
    const result = critMultiplier({ school: 'frost', iceShards: 5, ignite: 5 });
    expect(result.usesIgnite).toBe(false);
    expect(result.total).toBe(2);
  });

  it('scales per rank as in Classic', () => {
    expect(critMultiplier({ school: 'frost', iceShards: 3, ignite: 0 }).hit).toBe(1.8);
    expect(critMultiplier({ school: 'fire', iceShards: 0, ignite: 2 }).ignite).toBe(0.24);
  });

  it('clamps invalid ranks', () => {
    expect(critMultiplier({ school: 'frostfire', iceShards: 9, ignite: -2 }).total).toBe(2);
    expect(critMultiplier({ school: 'frostfire', iceShards: Number.NaN, ignite: 0 }).total).toBe(1.5);
  });
});

describe('formatPercent', () => {
  it('uses the locale convention', () => {
    expect(formatPercent(2.8, 'en')).toBe('280%');
    expect(formatPercent(2.8, 'es')).toBe('280 %');
    expect(formatPercent(1.62, 'es')).toBe('162 %');
  });
});
