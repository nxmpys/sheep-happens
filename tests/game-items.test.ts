import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { classQuests, getItem, items, libraryBooks, talentText, talents } from '../src/lib/data';
import { TREE_ICONS } from '../src/lib/icons';

const icon = (name: string) => existsSync(new URL(`../public/icons/${name}.jpg`, import.meta.url));

describe('game icons', () => {
  it('has the icon of every talent, item and tree', () => {
    const names = [
      ...talents.map((talent) => talentText.talents[talent.id]?.icon).filter((name): name is string => Boolean(name)),
      ...items.map((item) => item.icon),
      ...Object.values(TREE_ICONS),
    ];
    expect(names.filter((name) => !icon(name))).toEqual([]);
  });

  it('knows the icon of every talent', () => {
    expect(talents.filter((talent) => !talentText.talents[talent.id]?.icon).map((talent) => talent.id)).toEqual([]);
  });
});

describe('class quests', () => {
  it('are sorted by level and reward known items', () => {
    const levels = classQuests.map((quest) => quest.level);
    expect(levels).toEqual([...levels].sort((a, b) => a - b));
    for (const quest of classQuests) for (const reward of quest.rewards) expect(() => getItem(reward)).not.toThrow();
  });

  it('never set the hard level below the pick-up level', () => {
    for (const quest of classQuests) if (quest.hard) expect(quest.hard).toBeGreaterThan(quest.level);
  });

  it('offer one reward per faction where the chain splits', () => {
    for (const quest of classQuests) {
      const factions = new Set(quest.rewards.map((id) => getItem(id).faction).filter(Boolean));
      if (factions.size > 0) expect([...factions].sort()).toEqual(['alliance', 'horde']);
    }
  });
});

describe('library books', () => {
  it('give each faction at least 25 reachable books', () => {
    for (const faction of ['alliance', 'horde'] as const) {
      expect(libraryBooks.filter((book) => book.faction === 'both' || book.faction === faction).length).toBeGreaterThanOrEqual(25);
    }
  });

  it('give each faction 10 books before level 20', () => {
    for (const faction of ['alliance', 'horde'] as const) {
      const early = libraryBooks.filter((book) => book.band === '1-20' && (book.faction === 'both' || book.faction === faction));
      expect(early.length).toBeGreaterThanOrEqual(10);
    }
  });

  it('use distinct Wowhead items', () => {
    const ids = libraryBooks.map((book) => book.wowhead);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
