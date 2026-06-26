import { useEffect, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

const GREETING =
  "boot ok. i'm yan's AI, running on cloudflare workers ai.\n" +
  'ask me about his projects, his stack, or anything really.\n' +
  '(heads up: you get 3 messages — my gpu is shy.)';

/* ── hardware fingerprint ───────────────────────────────────
   GPU + CPU + RAM + screen + tz, hashed. Clearing cookies won't
   reset your quota — the server keys off this. */
function gpuInfo(): string {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl') ||
      c.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return 'no-webgl';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return String(gl.getParameter(gl.VERSION));
    return (
      gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) +
      '/' +
      gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)
    );
  } catch {
    return 'gpu-err';
  }
}

async function fingerprint(): Promise<string> {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const parts = [
    nav.userAgent,
    nav.language,
    nav.hardwareConcurrency ?? '?',
    nav.deviceMemory ?? '?',
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    gpuInfo(),
  ].join('|');
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(parts),
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

export default function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [banned, setBanned] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const fpRef = useRef<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fingerprint().then((fp) => (fpRef.current = fp));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' });
  }, [msgs, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy || banned) return;
    const next = [...msgs, { role: 'user' as const, content: text }];
    setMsgs(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: next.filter((m) => m.role !== 'system').slice(-8),
          fp: fpRef.current,
        }),
      });
      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        banned?: boolean;
        remaining?: number;
      };
      if (typeof data.remaining === 'number') setRemaining(data.remaining);
      if (res.status === 429 || data.banned) {
        setBanned(true);
        setMsgs((m) => [
          ...m,
          { role: 'assistant', content: data.error || 'rate limit reached.' },
        ]);
      } else if (data.reply) {
        setMsgs((m) => [...m, { role: 'assistant', content: data.reply! }]);
      } else {
        setMsgs((m) => [
          ...m,
          { role: 'assistant', content: data.error || '⚠ something glitched. try again.' },
        ]);
      }
    } catch {
      setMsgs((m) => [
        ...m,
        { role: 'assistant', content: '⚠ network error — could not reach the kernel.' },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chat">
      <div className="chat-bar">
        <span className="dot" /> ./chat --model workers-ai
        <span className="quota">
          {banned
            ? 'quota: exhausted'
            : remaining !== null
              ? `${remaining} message${remaining === 1 ? '' : 's'} left`
              : '3 messages max'}
        </span>
      </div>

      <div className="log" ref={scrollRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`row ${m.role}`}>
            <span className="who">
              {m.role === 'user' ? 'you' : 'ai'}
              <span className="colon">:</span>
            </span>
            <span className="content">{m.content}</span>
          </div>
        ))}
        {busy && (
          <div className="row assistant">
            <span className="who">
              ai<span className="colon">:</span>
            </span>
            <span className="content thinking">thinking</span>
          </div>
        )}
      </div>

      <form
        className="entry"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <span className="ps">&gt;</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={banned ? 'access revoked 🩷' : 'type a message…'}
          disabled={busy || banned}
          autoComplete="off"
          spellCheck={false}
          aria-label="chat input"
        />
        <button type="submit" disabled={busy || banned || !input.trim()}>
          send
        </button>
      </form>
    </div>
  );
}
