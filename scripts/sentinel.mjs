#!/usr/bin/env node
//
// sentinel.mjs — local viewer for the Q-Sentinel request-intelligence layer.
// Reads the SENTINEL KV namespace via wrangler (OAuth) and prints recent
// flagged events, currently-blocked IPs, and active strike counters.
//
// Usage (from repo root):
//   node scripts/sentinel.mjs            # show flags + blocks
//   node scripts/sentinel.mjs --unblock <ip>   # lift a block manually
//
// No public admin endpoint exists by design — this is the only way to read it.

import { execFileSync } from 'node:child_process';

const BINDING = 'SENTINEL';
// Use the OAuth session (pages/kv scope), not a custom API token.
const env = { ...process.env };
delete env.CLOUDFLARE_API_TOKEN;

function wrangler(args) {
  return execFileSync('npx', ['wrangler', ...args], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
}

function kvList() {
  const out = wrangler(['kv', 'key', 'list', '--binding', BINDING]);
  return JSON.parse(out);
}

function kvGet(key) {
  try {
    return wrangler(['kv', 'key', 'get', key, '--binding', BINDING]);
  } catch {
    return null;
  }
}

function kvDelete(key) {
  wrangler(['kv', 'key', 'delete', key, '--binding', BINDING]);
}

// ── manual unblock ──────────────────────────────────────────
const unblockIdx = process.argv.indexOf('--unblock');
if (unblockIdx !== -1) {
  const ip = process.argv[unblockIdx + 1];
  if (!ip) {
    console.error('usage: node scripts/sentinel.mjs --unblock <ip>');
    process.exit(1);
  }
  kvDelete(`block:${ip}`);
  kvDelete(`strike:${ip}`);
  console.log(`✅ unblocked ${ip} (block + strikes cleared)`);
  process.exit(0);
}

// ── report ──────────────────────────────────────────────────
const keys = kvList().map((k) => k.name);
const flagKeys = keys.filter((k) => k.startsWith('flag:'));
const blockKeys = keys.filter((k) => k.startsWith('block:'));
const strikeKeys = keys.filter((k) => k.startsWith('strike:'));

console.log('\n🛡️  Q-Sentinel — yandesbiens.com\n' + '─'.repeat(48));
console.log(`flags: ${flagKeys.length}   blocked IPs: ${blockKeys.length}   IPs with strikes: ${strikeKeys.length}\n`);

if (blockKeys.length) {
  console.log('🚫 BLOCKED IPs');
  for (const k of blockKeys) {
    const ip = k.slice('block:'.length);
    let info = {};
    try { info = JSON.parse(kvGet(k) || '{}'); } catch {}
    console.log(`   ${ip}  since ${info.since || '?'}  (${info.reason || '?'}, ${info.strikes ?? '?'} strikes)`);
  }
  console.log('   → lift one with: node scripts/sentinel.mjs --unblock <ip>\n');
}

if (flagKeys.length) {
  // flag:<ms>:<rand> — sort by the embedded timestamp, newest last.
  const recent = flagKeys
    .map((k) => ({ k, ms: Number(k.split(':')[1]) || 0 }))
    .sort((a, b) => a.ms - b.ms)
    .slice(-30);
  console.log(`🚩 RECENT FLAGS (last ${recent.length})`);
  for (const { k } of recent) {
    let f = {};
    try { f = JSON.parse(kvGet(k) || '{}'); } catch {}
    const meta = f.meta ? '  ' + JSON.stringify(f.meta) : '';
    console.log(`   ${f.ts || '?'}  ${(f.ip || '?').padEnd(15)}  ${(f.reason || '?').padEnd(18)} ${f.endpoint || ''}${meta}`);
  }
  console.log('');
} else {
  console.log('✅ no flags — quiet out there.\n');
}
