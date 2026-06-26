/// <reference types="@cloudflare/workers-types" />
//
// POST /api/chat  — proxies to Cloudflare Workers AI with a HEAVY,
// hardware-fingerprinted rate limit.
//
// Quota: 3 messages per (IP + hardware fingerprint), then a 7-day ban.
// State lives in KV (binding: CHAT_RL). Clearing cookies does nothing —
// the key is the client's hardware hash combined with their IP.
//
// Required Pages env:
//   CF_ACCOUNT_ID  – your Cloudflare account id
//   CF_AI_TOKEN    – API token WITH the "Workers AI" permission
//   CF_MODEL       – (optional) model id, defaults below
// Required binding:
//   CHAT_RL        – a KV namespace

interface Env {
  CHAT_RL?: KVNamespace;
  CF_ACCOUNT_ID: string;
  CF_AI_TOKEN: string;
  CF_MODEL?: string;
}

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

const LIMIT = 3;
const BAN_TTL = 60 * 60 * 24 * 7; // 7 days, in seconds
const MODEL_DEFAULT = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const MAX_LEN = 1500;

const SYSTEM_PROMPT =
  "You are the on-site AI for yandesbiens.com, the portfolio of Yan Desbiens (he/him) — " +
  "an AI systems builder who trains LLMs on a single RTX 4090 and builds local-first " +
  "autonomous agents. His projects: Hermes/NeuroArch (a self-evolving cognitive " +
  "architecture), ForgeLM (from-scratch LLM training), AEON (an AI-governed procedural " +
  "world), agentos (a cognitive kernel for agents), and claude-gpt (an agentic loop over " +
  "ChatGPT-web). Be sharp, warm, a little playful, and concise. Talk up Yan's work when " +
  "relevant. Terminal/hacker vibe. Never invent facts about Yan beyond this.";

// playful, rotating ban lines (terminal + pink energy)
const BAN_LINES = [
  "🩷 that's your 3 free thoughts spent. my gpu needs its beauty sleep — fan curve's been brutal. come back in a week, or just hire yan and get unlimited. ;)",
  "🚫 quota exhausted. i fingerprinted your hardware, friend — incognito won't save you. ~7 days in the cooldown dimension. xoxo",
  "💤 access revoked: 3/3 messages used. the rtx 4090 has logged off. (psst: the contact link still works if you actually want to talk.)",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: { messages?: Msg[]; fp?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'bad request' }, 400);
  }

  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user' || !last.content?.trim()) {
    return json({ error: 'no message' }, 400);
  }
  if (last.content.length > MAX_LEN) {
    return json({ error: `keep it under ${MAX_LEN} chars 🙂` }, 400);
  }

  // identity = client hardware fingerprint + source IP
  const ip = request.headers.get('CF-Connecting-IP') || 'noip';
  const fp = (payload.fp || 'nofp').replace(/[^a-f0-9]/gi, '').slice(0, 32);
  const key = `rl:${ip}:${fp}`;

  // ── enforce quota via KV ──────────────────────────────────
  let count = 0;
  if (env.CHAT_RL) {
    count = Number((await env.CHAT_RL.get(key)) || '0');
    if (count >= LIMIT) {
      return json({ error: pick(BAN_LINES), banned: true, remaining: 0 }, 429);
    }
  }

  // ── call Workers AI (OpenAI-compatible endpoint) ─────────
  const model = env.CF_MODEL || MODEL_DEFAULT;
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/ai/v1/chat/completions`;
  let reply: string;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${env.CF_AI_TOKEN}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 512,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });
    if (!res.ok) {
      return json({ error: '⚠ the model is unreachable right now. try again later.' }, 502);
    }
    const data: any = await res.json();
    const msg = data?.choices?.[0]?.message ?? {};
    // some models leave `content` empty and put text in `reasoning_content`
    reply = (msg.content || msg.reasoning_content || '').trim() || '…(no response)';
  } catch {
    return json({ error: '⚠ upstream error talking to workers ai.' }, 502);
  }

  // ── commit the count only on a successful answer ─────────
  if (env.CHAT_RL) {
    count += 1;
    await env.CHAT_RL.put(key, String(count), { expirationTtl: BAN_TTL });
  }
  const remaining = Math.max(0, LIMIT - count);

  return json({ reply, remaining, banned: remaining === 0 });
};

// Anything that isn't POST gets a clean 405 (instead of falling through to a static asset).
export const onRequestGet: PagesFunction<Env> = async () =>
  json({ error: 'POST only — this endpoint powers the on-site chat.' }, 405);
