import { DatabaseSync } from 'node:sqlite';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequestGet, onRequestPost, type D1Database, type Env } from '../functions/api/community-builds';
import { communityCode, communitySpec, parseQuery, parseSubmission } from '../src/lib/community-builds';
import { talents } from '../src/lib/data';
import { parseWowheadBuild, treeTalents } from '../src/lib/talents';

const ORIGIN = 'https://sheephappens.app';

/** Fills a tree from the top, each talent to its max rank (no tree holds all 51 points). */
function fillTree(tree: 'arcane' | 'fire' | 'frost', count: number, points: Record<string, number> = {}) {
  const list = treeTalents(talents, tree).sort((a, b) => a.row - b.row || a.col - b.col);
  let left = count;
  for (const talent of list) {
    if (left === 0) break;
    const rank = Math.min(talent.maxRank, left);
    points[talent.id] = rank;
    left -= rank;
  }
  return points;
}

/** D1 on top of node:sqlite, enough for the statements the function runs. */
function fakeD1(): D1Database {
  const db = new DatabaseSync(':memory:');
  const statement = (sql: string, values: unknown[] = []) => ({
    sql,
    values,
    bind: (...next: unknown[]) => statement(sql, next),
    run: async () => db.prepare(sql).run(...(values as never[])),
    all: async <T,>() => ({ results: db.prepare(sql).all(...(values as never[])) as T[] }),
  });
  return {
    prepare: (sql) => statement(sql),
    batch: async (list) => Promise.all(list.map((s) => (/^\s*SELECT/i.test((s as unknown as { sql: string }).sql) ? s.all() : s.run()))),
  };
}

describe('community build rules', () => {
  it('names the main tree and a second one from 17 points', () => {
    expect(communitySpec(fillTree('frost', 41, fillTree('arcane', 10)), talents)).toEqual({ main: 'frost', second: null });
    expect(communitySpec(fillTree('frost', 34, fillTree('arcane', 17)), talents)).toEqual({ main: 'frost', second: 'arcane' });
    expect(communitySpec(fillTree('fire', 31, fillTree('arcane', 20)), talents)).toEqual({ main: 'fire', second: 'arcane' });
  });

  it('accepts only complete, valid builds with one to three known tags', () => {
    const code = communityCode(fillTree('frost', 41, fillTree('arcane', 10)), talents);
    expect(parseSubmission({ code, tags: ['pvp-bg', 'pvp-bg', 'raid'] }, talents)).toEqual({
      ok: true,
      value: { code, tags: ['pvp-bg', 'raid'], spec: { main: 'frost', second: null } },
    });
    expect(parseSubmission({ code: communityCode(fillTree('frost', 40, fillTree('arcane', 10)), talents), tags: ['raid'] }, talents)).toEqual({ ok: false, error: 'build' });
    expect(parseSubmission({ code: '5555555555555555', tags: ['raid'] }, talents)).toEqual({ ok: false, error: 'build' });
    expect(parseSubmission({ code: '<script>', tags: ['raid'] }, talents)).toEqual({ ok: false, error: 'build' });
    expect(parseSubmission({ code, tags: [] }, talents)).toEqual({ ok: false, error: 'tags' });
    expect(parseSubmission({ code, tags: ['raid', 'pvp-bg', 'farming', 'leveling'] }, talents)).toEqual({ ok: false, error: 'tags' });
    expect(parseSubmission({ code, tags: ['arena'] }, talents)).toEqual({ ok: false, error: 'tags' });
  });

  it('stores the canonical code, whatever trailing zeros the link had', () => {
    const code = communityCode(fillTree('frost', 41, fillTree('arcane', 10)), talents);
    expect(code).toContain('--');
    const parsed = parseSubmission({ code: code.replace('--', '-000-'), tags: ['raid'] }, talents);
    expect(parsed.ok && parsed.value.code).toBe(code);
    expect(parseWowheadBuild(`v2${code}`, talents)).toEqual(fillTree('frost', 41, fillTree('arcane', 10)));
  });

  it('ignores unknown filters', () => {
    expect(parseQuery(new URLSearchParams('tag=pvp-bg&spec=fire'))).toEqual({ tag: 'pvp-bg', spec: 'fire' });
    expect(parseQuery(new URLSearchParams('tag=x&spec=shadow'))).toEqual({ tag: null, spec: null });
  });
});

describe('/api/community-builds', () => {
  const frost = communityCode(fillTree('frost', 41, fillTree('arcane', 10)), talents);
  const hybrid = communityCode(fillTree('frost', 34, fillTree('arcane', 17)), talents);
  const fire = communityCode(fillTree('fire', 41, fillTree('frost', 10)), talents);
  const post = (env: Env, body: unknown, headers: Record<string, string> = {}) =>
    onRequestPost({
      request: new Request(`${ORIGIN}/api/community-builds`, {
        method: 'POST',
        headers: { Origin: ORIGIN, 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
      }),
      env,
    });
  const get = async (env: Env, query = '') => {
    const res = await onRequestGet({ request: new Request(`${ORIGIN}/api/community-builds${query}`), env });
    return { status: res.status, body: (await res.json()) as { builds: { code: string; total: number; tags: { tag: string; votes: number }[] }[]; counts: Record<string, number> } };
  };
  const turnstile = (outcome: Record<string, unknown>) => vi.stubGlobal('fetch', vi.fn(async () => Response.json(outcome)));
  const passing = { success: true, action: 'community-build', hostname: 'sheephappens.app' };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('ranks builds by votes, overall and per tag or tree', async () => {
    turnstile(passing);
    const env: Env = { COMMUNITY_DB: fakeD1(), TURNSTILE_SECRET_KEY: 'secret' };
    for (const [code, tags] of [
      [frost, ['pvp-bg']],
      [frost, ['pvp-bg', 'pvp-general']],
      [hybrid, ['raid']],
      [hybrid, ['raid']],
      [hybrid, ['raid', 'dungeons']],
      [fire, ['pvp-bg']],
    ] as const) {
      expect((await post(env, { code, tags, token: 't' })).status).toBe(201);
    }
    const all = await get(env);
    expect(all.status).toBe(200);
    expect(all.body.builds.map((b) => [b.code, b.total])).toEqual([
      [hybrid, 4],
      [frost, 3],
      [fire, 1],
    ]);
    expect(all.body.builds[0]!.tags).toEqual([
      { tag: 'raid', votes: 3 },
      { tag: 'dungeons', votes: 1 },
    ]);
    expect(all.body.counts).toMatchObject({ 'pvp-bg': 3, raid: 3, dungeons: 1, 'pvp-general': 1, leveling: 0 });
    expect((await get(env, '?tag=pvp-bg')).body.builds.map((b) => b.code)).toEqual([frost, fire]);
    expect((await get(env, '?spec=fire')).body.builds.map((b) => b.code)).toEqual([fire]);
    expect((await get(env, '?spec=fire')).body.counts['raid']).toBe(0);
  });

  it('is unavailable without its database or secret', async () => {
    expect((await get({})).status).toBe(503);
    expect((await post({ COMMUNITY_DB: fakeD1() }, { code: frost, tags: ['raid'], token: 't' })).status).toBe(503);
  });

  it('refuses other origins, bad builds, missing tokens and foreign Turnstile checks', async () => {
    const env: Env = { COMMUNITY_DB: fakeD1(), TURNSTILE_SECRET_KEY: 'secret' };
    turnstile(passing);
    expect((await post(env, { code: frost, tags: ['raid'], token: 't' }, { Origin: 'https://evil.example' })).status).toBe(403);
    expect((await post(env, { code: '1', tags: ['raid'], token: 't' })).status).toBe(400);
    expect((await post(env, { code: frost, tags: ['raid'] })).status).toBe(400);
    turnstile({ ...passing, action: 'feedback' });
    expect((await post(env, { code: frost, tags: ['raid'], token: 't' })).status).toBe(403);
    expect((await get(env)).body.builds).toEqual([]);
  });
});
