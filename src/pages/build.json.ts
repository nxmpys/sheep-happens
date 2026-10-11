/**
 * /build.json: which commit is live. Cloudflare Pages sets CF_PAGES_COMMIT_SHA
 * during the build; the production smoke test waits until it matches the pushed commit.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      commit: process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? 'local',
      branch: process.env.CF_PAGES_BRANCH ?? null,
      builtAt: new Date().toISOString(),
    }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
