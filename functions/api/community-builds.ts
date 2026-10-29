/**
 * /api/community-builds (Cloudflare Pages Function).
 *
 * POST: a reader publishes a full build from the talent calculator with one to
 * three tags (Turnstile-checked); each tag of that build gets one more vote.
 * GET ?tag=&spec=: the builds published most often, optionally for one tag or
 * main tree. Votes live in a D1 database (binding COMMUNITY_DB) as one row per
 * build and tag; nothing about the reader is stored. Setup: docs/deployment.md
 * («Builds de la comunidad»).
 */
import rawTalents from '../../src/data/talents.json';
import { COMMUNITY_ACTION, COMMUNITY_LIMIT, COMMUNITY_TAGS, COMMUNITY_TREE, parseQuery, parseSubmission, rowToBuild, type CommunityRow } from '../../src/lib/community-builds';
import type { Talent } from '../../src/lib/schemas';
import { readJson, reply, verifyTurnstile } from '../../src/lib/turnstile';

/** The part of the D1 API used here (https://developers.cloudflare.com/d1/worker-api/). */
interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  run(): Promise<unknown>;
  all<T>(): Promise<{ results: T[] }>;
}
export interface D1Database {
  prepare(query: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown[]>;
}

export interface Env {
  /** D1 database (Settings → Bindings → D1 database, variable name COMMUNITY_DB). */
  COMMUNITY_DB?: D1Database;
  /** Turnstile secret key, the same one the feedback form uses. */
  TURNSTILE_SECRET_KEY?: string;
}

interface Context {
  request: Request;
  env: Env;
}

/** talents.json is validated at build time (lib/data.ts); the function only needs ids, trees and ranks. */
const talents = rawTalents as Talent[];
const MAX_BODY_BYTES = 2048;

/** One table per talent tree (COMMUNITY_TREE); the first tree used the bare name. */
const TABLE = `community_builds_v${COMMUNITY_TREE}`;

const SCHEMA = `CREATE TABLE IF NOT EXISTS ${TABLE} (
  code TEXT NOT NULL,
  tag TEXT NOT NULL,
  main TEXT NOT NULL,
  second TEXT NOT NULL DEFAULT '',
  votes INTEGER NOT NULL DEFAULT 0,
  updated TEXT NOT NULL,
  PRIMARY KEY (code, tag)
)`;
/** The table is created on first use, so setting up only needs the binding. */
const ready = new WeakMap<D1Database, Promise<unknown>>();
function ensureSchema(db: D1Database): Promise<unknown> {
  let done = ready.get(db);
  if (!done) {
    done = db
      .prepare(SCHEMA)
      .run()
      .catch((error: unknown) => {
        ready.delete(db);
        throw error;
      });
    ready.set(db, done);
  }
  return done;
}

const RANKING = `SELECT code, main, second, SUM(votes) AS total,
    SUM(CASE WHEN tag = ?1 THEN votes ELSE 0 END) AS hits,
    group_concat(tag || ':' || votes) AS tags
  FROM ${TABLE}
  WHERE ?2 IS NULL OR main = ?2
  GROUP BY code
  HAVING ?1 IS NULL OR hits > 0
  ORDER BY CASE WHEN ?1 IS NULL THEN total ELSE hits END DESC, total DESC, MAX(updated) DESC
  LIMIT ?3`;
const TAG_TOTALS = `SELECT tag, SUM(votes) AS votes FROM ${TABLE} WHERE ?1 IS NULL OR main = ?1 GROUP BY tag`;

export async function onRequestGet({ request, env }: Context): Promise<Response> {
  const db = env.COMMUNITY_DB;
  if (!db) return reply(503, { error: 'unavailable' });
  const { tag, spec } = parseQuery(new URL(request.url).searchParams);
  try {
    await ensureSchema(db);
    const [ranking, totals] = (await db.batch([
      db.prepare(RANKING).bind(tag, spec, COMMUNITY_LIMIT),
      db.prepare(TAG_TOTALS).bind(spec),
    ])) as [{ results: CommunityRow[] }, { results: { tag: string; votes: number }[] }];
    const counts = Object.fromEntries(COMMUNITY_TAGS.map((t) => [t, 0]));
    for (const row of totals.results) if (row.tag in counts) counts[row.tag] = Number(row.votes);
    return reply(200, { builds: ranking.results.map(rowToBuild), counts }, 'public, max-age=60');
  } catch (error) {
    console.error('community-builds: D1 read failed', error);
    return reply(502, { error: 'upstream' });
  }
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  const db = env.COMMUNITY_DB;
  if (!db || !env.TURNSTILE_SECRET_KEY) return reply(503, { error: 'unavailable' });

  const body = await readJson(request, MAX_BODY_BYTES);
  if (!body.ok) return body.response;
  const parsed = parseSubmission(body.value, talents);
  if (!parsed.ok) return reply(400, { error: parsed.error });

  const token = (body.value as Record<string, unknown>)['token'];
  if (typeof token !== 'string' || token === '') return reply(400, { error: 'verify' });
  if (!(await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, new URL(request.url).hostname, COMMUNITY_ACTION))) {
    return reply(403, { error: 'verify' });
  }

  const { code, tags, spec } = parsed.value;
  const today = new Date().toISOString().slice(0, 10);
  try {
    await ensureSchema(db);
    await db.batch(
      tags.map((tag) =>
        db
          .prepare(
            `INSERT INTO ${TABLE} (code, tag, main, second, votes, updated) VALUES (?1, ?2, ?3, ?4, 1, ?5)
             ON CONFLICT (code, tag) DO UPDATE SET votes = votes + 1, updated = excluded.updated`,
          )
          .bind(code, tag, spec.main, spec.second ?? '', today),
      ),
    );
  } catch (error) {
    console.error('community-builds: D1 write failed', error);
    return reply(502, { error: 'upstream' });
  }
  return reply(201, { ok: true, code });
}
