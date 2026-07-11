---
title: "Your LLM server lies to you when the context window overflows"
date: 2026-07-11
description: "Ollama silently drops the front of an oversized prompt and returns 200 OK, so the model confidently invents an answer. llama.cpp is honest and returns a 400 — which kills the agent turn instead. I measured both, then built ContextPaw to make overflow honest and survivable. Includes a result I did not expect: telling an agent it lost information does not stop it hallucinating."
tags: ["contextpaw", "ollama", "llama.cpp", "agents", "context-window", "benchmark", "local-first"]
track: agents
---

I set out to prove something boring: that my RTX 4090 could serve four concurrent requests
against one local model. I ended the afternoon with an open-source tool, a negative result
about my own cognitive agent, and one uncomfortable pattern connecting all of it.

The pattern is this: **every layer of my local stack preferred to lie to me rather than
tell me no.**

This post is about the sharpest instance of that, and the tool I built to stop it:
[ContextPaw](https://github.com/Linutesto/contextpaw) (`pip install contextpaw`).

> **Correction (added shortly after publishing).** I originally wrote that I hadn't seen this
> behaviour documented anywhere. That was wrong, and I'd rather say so than let it stand. It
> has been reported to Ollama repeatedly:
> [#3839](https://github.com/ollama/ollama/issues/3839) — *"Detect Truncation Due to Exceeding
> Context Size"* — has been **open since April 2024**;
> [#14259](https://github.com/ollama/ollama/issues/14259) — *"truncation happens silently with
> no user-visible indication"* — since February 2026;
> [#9208](https://github.com/ollama/ollama/issues/9208) asks for the same thing from the logging
> side. What I could not find was anyone **measuring what it costs you** — so that is what the
> rest of this post does. Two years of people asking to simply be *told*, and it still doesn't
> tell you. That is the argument for a userspace fix, not against one.

---

## The thing that doesn't get logged

Send Ollama a prompt that overflows the context window. Here is what happens.

```
POST /api/generate    num_ctx = 32768
prompt = 160,689 tokens
```

```
HTTP 200 OK
prompt_eval_count: 16387
```

It returned success. It read 16,387 tokens of a 160,689-token prompt. **It did not tell me
it had thrown the rest away** — no error, no warning, no `truncated` field, nothing in the
logs. And critically, what it throws away is the **front** of the prompt: your system
instructions, your tool definitions, your task goal.

To make the damage visible, I put a secret at the very start of the prompt and asked for it
back at the end:

> **Prompt (head):** `Le mot de passe secret est ANANAS-7734.`
> …160k tokens of filler…
> **Question:** what is the secret password mentioned at the very beginning?

> **Ollama's answer:** *"Le mot de passe secret mentionné au tout début est : **remplissage**."*

It invented an answer. Confidently. With a `200 OK`. `remplissage` is French for *filler* —
it read the padding, never saw the head, and made something up rather than saying it didn't
know.

Now imagine that inside an agent loop, where the head of your prompt is the tool schema and
the task definition, and where the prompt grows every turn as tool outputs accumulate. Your
agent doesn't crash. It just gets quietly, progressively stupider, and you have nothing to
grep for.

## llama.cpp tells the truth, and that kills you too

Same prompt, same model, `llama-server`:

```json
{
  "error": {
    "type": "exceed_context_size_error",
    "message": "request (60001 tokens) exceeds the available context size (4096 tokens)",
    "n_prompt_tokens": 60001,
    "n_ctx": 4096
  }
}
```

This is *correct* behaviour for a server. Machine-readable, precise, honest. And it is
**fatal to an agent**: the turn dies, the loop breaks, the run is lost.

So: two servers, two opposite failures, same dead agent. One lies and keeps going; the other
tells the truth and stops. Neither gives you what an agent actually needs, which is to **fit
the window, keep what matters, and know what it lost.**

---

## ContextPaw

A proxy that sits in front of either backend. It speaks Ollama's API *and* the OpenAI API,
and it takes port `11434`, so nothing in your stack has to change.

```
your app ──► contextpaw :11434 ──► ollama    :11435
                              └──► llama.cpp :8091
```

It follows two rules.

**1. Never rewrite the head.**

Both servers cache the prompt *prefix*. Compacting from the front invalidates that cache
every turn and your time-to-first-token explodes — and it destroys the system prompt and tool
definitions, which is exactly what the agent cannot work without. Trimming the head is
precisely what Ollama's built-in truncation does, and it is why it produces confident
nonsense.

ContextPaw evicts from the **middle** and keeps both ends.

**2. Never evict silently.**

Every eviction is reported in the response body, in the headers, and **inline to the model
itself**:

> `[contextpaw: 12431 tokens of earlier conversation and tool output elided to fit the context window. This information is GONE from your context — if you need it, fetch it again rather than guessing.]`

Same prompt, same model, through the proxy:

```
contextpaw: compacted=True  160689 -> 26024 tokens  (budget 32452)
            strategy: middle-out (head+tail preserved)
            evicted : 134727 tokens

answer: "Le mot de passe secret est ANANAS-7734."
```

Correct. And accounted for, down to the token.

## The result I did not expect

Rule 2 above contains an assumption I had not questioned: that **telling** the model it lost
something is enough to stop it inventing. So I tested it.

I buried three facts in the **middle** of an over-long prompt — squarely inside the region
compaction evicts — and asked for them back. The marker was there, in plain language, saying
the information was gone.

| | facts recovered | what the model said |
|---|---|---|
| evict only (marker) | **0 / 3** | *"Production_Server … erreur de syntaxe … **Marc**"* |
| `--summarize` | **3 / 3** | *"**Orion-7** … certificats **TLS** expirés … **Marie-Claude**"* |

Read the first row again. The model was **explicitly told** the information had been removed
and that it should fetch it rather than guess. It invented a server name, a failure cause,
and a person anyway.

**Telling an agent it lost something does not stop it hallucinating. You have to give the
content back.**

So ContextPaw grew a `--summarize` flag: the evicted span is digested by a small local model
(`gemma3:1b` by default, ~355 tok/s on this card) and the digest is spliced into the marker.
0/3 becomes 3/3.

I only know this because I measured the thing I assumed. That is the entire reason this
research program has a rule about benchmarks.

## The mistake I made building it

My first summarizer trimmed the evicted span **head+tail** to fit its own context window.

It scored **0/3**.

Of course it did: the facts were in the *middle of the evicted span* — the middle is what
compaction throws away in the first place. **I had reproduced, inside the summarizer, the
exact bug the entire project exists to fix.** It now map-reduces over every chunk, and when a
span is too big to summarize whole it strides across *both* ends rather than truncating one.
That is locked down by a test, because I clearly cannot be trusted not to do it again.

I'm leaving this in the post on purpose. The failure mode is *seductive* — trimming to fit is
the obvious move, it looks correct, and it silently destroys the payload. That's the whole
thesis of the tool, and I walked straight into it.

---

## Where the afternoon started: four-way concurrency

The origin of all this was a much smaller question — can one 4090 serve four concurrent
requests against one model? — and the answer produced its own pile of quiet lies. Briefly,
because each one is the same disease:

- **Ollama accepts `OLLAMA_NUM_PARALLEL=4`, then ignores it.** For the `qwen35` architecture
  it forces `Parallel:1` (`sched.go`), because qwen3.5's hybrid linear-attention state can't
  be batched across sequences in its engine. It logs a `WARN` and moves on. Requests just
  queue; TTFT climbed to 14s for the fourth of four. Still true after upgrading 0.24 → 0.31.
  Serving the *same GGUF* through `llama-server --parallel 4` gave genuine four-way
  concurrency at **407 tok/s aggregate vs 110 serialized**.
- **`ollama ps` reports `100% GPU` while the model is on the CPU.** The journal said
  `model weights device=CPU size="667.5 MiB"`. `ollama ps` said `100% GPU`. One of them is
  lying, and it isn't the journal.
- **`OLLAMA_NUM_CTX` is not a real variable.** It had been sitting in my systemd drop-in for
  months doing nothing. The real one is `OLLAMA_CONTEXT_LENGTH`. Nothing warned me.
- **gemma4 returns an empty `response`** unless you pass `think: false` — the tokens go to the
  `thinking` field instead. A first benchmark run reported zero concurrency for exactly this
  reason: the parallelism was working perfectly, my client just wasn't counting tokens that
  were in a field I didn't know existed.

And the last one, which is the one that actually stung: my own long-running cognitive agent
had been executing an idle "reasoning" loop every 93 seconds for months. I finally read what
it was doing.

```
belief_revision: strengthened=606  contradictions=0  merged=0  decayed=0
--- identical in 300 of the last 300 cycles ---
```

27,834 cycles. 3,113 beliefs supported by **882,602 evidence rows it generated for itself**.
207 beliefs pinned at confidence 1.0 — unfalsifiable, unupdatable. It had never manufactured
knowledge. It had manufactured **certainty**, in a closed loop, and it had never once
encountered a fact that could tell it no.

I shut it off. That's a separate write-up, and an honest negative result I intend to publish
properly.

---

## Reproduce it

```bash
pip install contextpaw
git clone https://github.com/Linutesto/contextpaw && cd contextpaw

python3 demo_needle.py      # Ollama invents an answer; ContextPaw doesn't
python3 demo_400.py         # llama.cpp's 400 kills the turn; ContextPaw survives it
python3 demo_summarize.py   # 0/3 facts recovered -> 3/3 with --summarize
python3 -m pytest tests/ -q # 14 passed
```

Everything in this post is one of those four commands. If a number here doesn't reproduce on
your box, open an issue — I would rather be corrected than quoted.

## What ContextPaw does not do yet

- Streaming responses carry the eviction report in headers only; the body is proxied through
  untouched.
- The summarizer costs latency on the turn it runs (5 calls to a 1B model for a 17k-token
  span, ~10s), then it's cached. Enable it for agent loops, not for chat.
- Raw-prompt compaction is head+tail; only *chat messages* get true per-message semantic
  eviction. Structure your calls as messages if you can.

---

**Code:** [github.com/Linutesto/contextpaw](https://github.com/Linutesto/contextpaw) · MIT
**Install:** `pip install contextpaw`

The through-line of the whole afternoon is one sentence: **a system that would rather lie than
say no is worse than a system that fails.** Ollama's `200 OK`, `ollama ps`'s `100% GPU`,
gemma4's empty string, my agent's 882,000 self-generated proofs — every one of them was a
component choosing to look successful over being correct.

ContextPaw is the smallest possible piece of the fix: one thing in the stack that, when it
throws your context away, has the decency to tell you.
