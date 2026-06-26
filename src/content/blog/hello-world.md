---
title: "boot.log — why this site exists"
date: 2026-06-26
description: "Local-first AI, a single 4090, and a domain that cost ten bucks."
tags: ["meta", "ai", "local-first"]
---

I bought this domain for ten dollars and immediately wondered what to do with it.
The answer was obvious: a place to keep the things I build.

## the thesis

Most AI lives in someone else's datacenter. I find the opposite more interesting —
intelligence that runs on hardware I can touch. One **RTX 4090**, a pile of local
models, and systems that keep thinking even when I'm asleep.

That constraint is the whole point. When you can't throw a thousand GPUs at a problem,
you have to be clever: better routing, smaller models that punch above their weight,
memory that actually persists, determinism where it counts.

## what's here

- **ForgeLM** — training language models from scratch on a single card.
- **Hermes / NeuroArch** — a cognitive architecture that evolves itself.
- **AEON** — a procedural world steered by a local "world-spirit".
- **agentos** — the kernel that ties agents to tools.
- **claude-gpt** — a terminal agentic loop driving ChatGPT-web, with prompt
  reformulation and conversation threading.

## the chat box

There's an AI on the home page you can talk to. It runs on Cloudflare Workers AI,
not my local stack — because exposing my 4090 to the open internet seemed like a
great way to donate my electricity bill to strangers.

You get three messages. Use them wisely. 🩷

> built local. shipped global.
