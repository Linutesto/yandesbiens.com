/// <reference types="@cloudflare/workers-types" />
//
// sentinel.ts — a lightweight "request intelligence" layer shared by the
// Pages Functions. Deliberately small: it does NOT log normal traffic, only
// *flagged* events (probing, malformed payloads, bot honeypots, abuse caps).
//
// Three jobs:
//   1. blocklist  — an IP that earns too many strikes gets walled for a while.
//   2. flagging   — suspicious events are written to KV (IP + endpoint + reason
//                   + timestamp) for later inspection, and bump a rolling strike
//                   counter that triggers the auto-block.
//   3. decoy      — callers can return a believable fake instead of an error,
//                   so a blocked attacker keeps probing a dead end.
//
// All state lives in its own KV namespace (binding: SENTINEL). Everything is
// best-effort and wrapped so a KV hiccup never breaks the real endpoint.
//
// View the data locally (no public admin surface):  node scripts/sentinel.mjs

const FLAG_TTL = 60 * 60 * 24 * 7; // keep individual flags 7 days
const STRIKE_TTL = 60 * 30; // rolling 30-min strike window per IP
const BLOCK_TTL = 60 * 60 * 24; // an auto-block lasts 24h
const BLOCK_THRESHOLD = 8; // strikes within the window -> auto-block

export function clientIp(request: Request): string {
  return request.headers.get('CF-Connecting-IP') || '0.0.0.0';
}

/** True if this IP is currently walled (manually or auto-blocked). */
export async function isBlocked(kv: KVNamespace | undefined, ip: string): Promise<boolean> {
  if (!kv) return false;
  try {
    return (await kv.get(`block:${ip}`)) !== null;
  } catch {
    return false; // never let an observability failure block real users
  }
}

/**
 * Record a flagged event and bump the IP's strike count; auto-block once it
 * crosses the threshold. Best-effort: any error is swallowed.
 */
export async function flag(
  kv: KVNamespace | undefined,
  opts: { ip: string; endpoint: string; reason: string; meta?: Record<string, unknown> }
): Promise<void> {
  if (!kv) return;
  const { ip, endpoint, reason, meta } = opts;
  const ts = new Date().toISOString();
  try {
    // 1) append a flag record — key is time-sortable for easy tail-reading.
    const id = `flag:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    await kv.put(id, JSON.stringify({ ip, endpoint, reason, ts, meta }), {
      expirationTtl: FLAG_TTL,
    });

    // 2) bump rolling strike count for this IP.
    const strikeKey = `strike:${ip}`;
    const strikes = Number((await kv.get(strikeKey)) || '0') + 1;
    await kv.put(strikeKey, String(strikes), { expirationTtl: STRIKE_TTL });

    // 3) auto-block once the IP is clearly misbehaving.
    if (strikes >= BLOCK_THRESHOLD) {
      await kv.put(`block:${ip}`, JSON.stringify({ since: ts, reason, strikes }), {
        expirationTtl: BLOCK_TTL,
      });
    }
  } catch {
    // observability is non-critical; do not surface failures to the caller.
  }
}
