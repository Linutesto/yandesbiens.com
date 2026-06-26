// ws.js — STATIC REPLAY shim for the website embed.
// Drop-in replacement for AEON's live WebSocket module. Instead of a running
// simulation, it replays a captured snapshot: seeds every world layer from
// latest.json, loops the recorded "live" (units/markers) + "wildlife" frames,
// and redirects the renderer's /api/render/* chunk fetches to baked JSON.
// No backend, no AI — the real renderer, fed recorded reality.

const DATA = "/aeon/data";

// ── reactive store (identical contract to the original) ──
const listeners = new Map();
const state = {};
export const store = {
  state,
  on(type, fn) {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type).add(fn);
    if (state[type]) fn(state[type]);
    return () => listeners.get(type)?.delete(fn);
  },
  emit(type, payload) {
    state[type] = payload;
    listeners.get(type)?.forEach((fn) => fn(payload));
  },
};

// ── redirect the renderer's render API to static files ──
// ChunkClient calls fetch("/api/render/manifest") and
// fetch("/api/render/chunk/<cx>/<cy>?lod=<lod>") directly, so we intercept fetch.
const realFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  const url = typeof input === "string" ? input : input?.url || "";
  if (url.includes("/api/render/manifest")) {
    return realFetch(`${DATA}/manifest.json`, init);
  }
  const m = url.match(/\/api\/render\/chunk\/(\d+)\/(\d+)\?lod=(\d+)/);
  if (m) {
    // only lod 2 was captured; the renderer is pinned to it. others 404 → null (safe).
    return realFetch(`${DATA}/chunk_${m[1]}_${m[2]}_${m[3]}.json`, init);
  }
  return realFetch(input, init);
};

// ── REST helper (used by ChunkClient.loadManifest) ──
export async function api(path) {
  try {
    const r = await fetch(path);
    if (!r.ok) return { error: `HTTP ${r.status}` };
    return await r.json();
  } catch (e) {
    return { error: e.message || "fetch error" };
  }
}
export const post = async () => ({ ok: true });
export const send = () => {};
export const health = { ok: true, latencyMs: 0, lastError: "" };

// ── boot: seed static layers, then loop the living layer ──
export async function connect() {
  store.emit("_conn", { online: true });

  // 1) seed every captured world layer (overview/cities/society/wildlife/…)
  let latest = {};
  try {
    latest = await (await fetch(`${DATA}/latest.json`)).json();
  } catch (e) {
    console.warn("AEON embed: latest.json failed", e);
  }
  for (const [type, msg] of Object.entries(latest)) {
    if (type !== "live") store.emit(type, msg); // live is driven by the loop below
  }

  // 2) loop the recorded motion (trade/migration/army markers + wildlife)
  let tape = [];
  try {
    tape = await (await fetch(`${DATA}/tape_live.json`)).json();
  } catch (e) {
    console.warn("AEON embed: tape_live.json failed", e);
  }
  if (!Array.isArray(tape) || tape.length === 0) {
    if (latest.live) store.emit("live", latest.live);
    return;
  }

  const loopMs = (tape[tape.length - 1].t - tape[0].t + 0.4) * 1000;
  const t0base = tape[0].t;
  function playOnce() {
    const start = performance.now();
    for (const frame of tape) {
      const delay = (frame.t - t0base) * 1000;
      setTimeout(() => store.emit(frame.msg.type, frame.msg), delay);
    }
    setTimeout(playOnce, loopMs);
    void start;
  }
  playOnce();
}
