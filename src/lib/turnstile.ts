/**
 * Server side of Cloudflare Turnstile, shared by the Pages Functions that take
 * reader input (functions/api/feedback.ts, functions/api/community-builds.ts).
 */

/** True when the token passed, was issued for `action` and on this site's hostname. */
export async function verifyTurnstile(token: string, secret: string, hostname: string, action: string): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  if (!res.ok) return false;
  const outcome = (await res.json()) as { success?: boolean; action?: string; hostname?: string };
  return outcome.success === true && outcome.action === action && outcome.hostname === hostname;
}

export function reply(status: number, data: Record<string, unknown>, cache = 'no-store'): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache },
  });
}

/**
 * Reads a same-origin JSON body of at most `maxBytes`. Returns the parsed
 * value, or the error response to send back.
 */
export async function readJson(request: Request, maxBytes: number): Promise<{ ok: true; value: unknown } | { ok: false; response: Response }> {
  if (request.headers.get('Origin') !== new URL(request.url).origin) return { ok: false, response: reply(403, { error: 'origin' }) };
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return { ok: false, response: reply(415, { error: 'invalid' }) };
  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) return { ok: false, response: reply(413, { error: 'length' }) };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, response: reply(400, { error: 'invalid' }) };
  }
}
