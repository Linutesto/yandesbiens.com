/// <reference types="@cloudflare/workers-types" />
//
// POST /api/subscribe — privacy-first newsletter capture.
//
// Stores nothing but: lowercased email, signup timestamp, and which page it
// came from. No third-party ESP, no tracking pixels, no IP retention beyond a
// short-lived abuse counter. State lives in KV (binding: SUBSCRIBERS).
//
// Body: { email: string, src?: string, website?: string }   (website = honeypot)
// Returns: { ok: true } | { ok: false, error: string }

import { clientIp, isBlocked, flag } from '../../lib/sentinel';

interface Env {
  SUBSCRIBERS?: KVNamespace;
  SENTINEL?: KVNamespace;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RL_LIMIT = 5; // signups per IP window
const RL_TTL = 60 * 30; // 30 min

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const ip = clientIp(request);

  // Blocklisted callers get the normal success shape — never reveal the wall.
  if (await isBlocked(env.SENTINEL, ip)) return json({ ok: true });

  let payload: { email?: string; src?: string; website?: string };
  try {
    payload = await request.json();
  } catch {
    await flag(env.SENTINEL, { ip, endpoint: '/api/subscribe', reason: 'malformed-json' });
    return json({ ok: false, error: 'bad request' }, 400);
  }

  // Honeypot: real users never fill this hidden field — a fill is a clear bot.
  if (payload.website) {
    await flag(env.SENTINEL, { ip, endpoint: '/api/subscribe', reason: 'honeypot' });
    return json({ ok: true }); // silently accept-and-drop bots
  }

  const email = (payload.email || '').trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'enter a valid email' }, 422);
  }

  if (!env.SUBSCRIBERS) {
    return json({ ok: false, error: 'capture not configured' }, 503);
  }

  // Light abuse limit per IP (hashed, short-lived — not retained as identity).
  const rlKey = `rl:${await sha256(ip)}`;
  const count = parseInt((await env.SUBSCRIBERS.get(rlKey)) || '0', 10);
  if (count >= RL_LIMIT) {
    await flag(env.SENTINEL, { ip, endpoint: '/api/subscribe', reason: 'signup-flood' });
    return json({ ok: false, error: 'too many signups, try later' }, 429);
  }

  const key = `sub:${email}`;
  const existing = await env.SUBSCRIBERS.get(key);
  if (!existing) {
    const record = {
      email,
      ts: new Date().toISOString(),
      src: (payload.src || 'unknown').slice(0, 64),
      status: 'unverified',
    };
    await env.SUBSCRIBERS.put(key, JSON.stringify(record));
  }
  await env.SUBSCRIBERS.put(rlKey, String(count + 1), { expirationTtl: RL_TTL });

  // Always return the same shape whether or not the email already existed —
  // otherwise the response lets anyone probe who is on the list (enumeration).
  return json({ ok: true });
};
