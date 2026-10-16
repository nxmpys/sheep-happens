/**
 * POST /api/feedback (Cloudflare Pages Function).
 *
 * Receives the form at the end of each guide page, checks the Turnstile token
 * and opens an issue labelled `feedback` in the public repository. It stores
 * nothing and asks for no personal data. Setup: docs/deployment.md
 * («Formulario de feedback»).
 */
import { FEEDBACK_ACTION, FEEDBACK_REPO, feedbackIssue, parseFeedback } from '../../src/lib/feedback';

export interface Env {
  /** Turnstile secret key (Cloudflare dashboard → Turnstile). */
  TURNSTILE_SECRET_KEY?: string;
  /** Fine-grained GitHub token with Issues: read and write on the repository only. */
  FEEDBACK_GITHUB_TOKEN?: string;
  /** owner/name; defaults to the site's repository. */
  FEEDBACK_REPO?: string;
}

interface Context {
  request: Request;
  env: Env;
}

/** Large enough for 2000 characters of any script, small enough to refuse junk early. */
const MAX_BODY_BYTES = 16_384;

function reply(status: number, data: Record<string, unknown>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

async function verifyTurnstile(token: string, secret: string, hostname: string): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  if (!res.ok) return false;
  const outcome = (await res.json()) as { success?: boolean; action?: string; hostname?: string };
  return outcome.success === true && outcome.action === FEEDBACK_ACTION && outcome.hostname === hostname;
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  if (!env.TURNSTILE_SECRET_KEY || !env.FEEDBACK_GITHUB_TOKEN) return reply(503, { error: 'unavailable' });

  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return reply(403, { error: 'origin' });
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415, { error: 'invalid' });

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return reply(413, { error: 'length' });
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return reply(400, { error: 'invalid' });
  }
  const fields = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;

  // Honeypot: a hidden field people never see. Pretend it worked so bots learn nothing.
  if (typeof fields['website'] === 'string' && fields['website'] !== '') return reply(200, { ok: true });

  const parsed = parseFeedback(raw);
  if (!parsed.ok) return reply(400, { error: parsed.error });

  const token = fields['token'];
  if (typeof token !== 'string' || token === '') return reply(400, { error: 'verify' });
  if (!(await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, url.hostname))) return reply(403, { error: 'verify' });

  const issue = feedbackIssue(parsed.value, url.origin);
  const res = await fetch(`https://api.github.com/repos/${env.FEEDBACK_REPO || FEEDBACK_REPO}/issues`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.FEEDBACK_GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'sheep-happens-feedback',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify(issue),
  });
  if (!res.ok) {
    console.error('feedback: GitHub answered', res.status, await res.text());
    return reply(502, { error: 'upstream' });
  }
  const created = (await res.json()) as { html_url?: string };
  return reply(201, { ok: true, url: created.html_url });
}
