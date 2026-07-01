---
title: "agentos devlog — from a terminal kernel to an agent I run from my phone"
date: 2026-07-01
description: "How the agentos kernel grew into a self-hosted agent platform: a ReAct loop over 120+ models, ~26 real tools, a permission layer that keeps a human in the loop, runtime tool-forging in a sandbox, and an environment-aware system prompt. Engineering, not a benchmark."
tags: ["agentos", "devlog", "agents", "tool-use", "local-first", "safety"]
track: agents
---

This is a development log, not a result. There's no benchmark in this post — it's an
engineering write-up of a week spent turning [agentos](/projects/agentos/), my small
terminal-native agent kernel, into something I actually reach for from my phone. I want to
be plain about that up front, because the rest of the research program lives or dies on
reproducible proofs, and this isn't one of those. It's plumbing — but plumbing I'm fond of.

## the itch

agentos already had the bones: a tool bus an agent can discover and call, pluggable LLM
providers, SQLite memory, and a tight event loop. What it didn't have was a way to *use* it
without a keyboard, and a way to give the agent real reach into my machine without that
being reckless.

So the week's work was two things: a mobile-first web layer on top of the kernel, and — much
more interesting — a safety model that makes "let an agent touch my whole computer" a
sentence I can say without flinching.

## the platform

One OpenAI-compatible provider puts an entire model catalog — 120-plus models — behind a
searchable picker, switchable mid-conversation. There are two modes. *Chat* is a plain
streaming conversation with the human firmly in the loop. *Agent* is a ReAct loop that
streams its reasoning tool-by-tool: you watch it decide to search the web, read a file, run
a snippet, look again, and answer — with a stop button and a step budget, because a loop you
can't interrupt is a loop you don't trust.

Underneath sits roughly two dozen real tools: web search and page-fetch, filesystem
read/write/search, Python and Node and shell runners, image analysis, persistent memory. The
agent doesn't describe what it *would* do; it does it.

## the part that's actually the point: permissions

An agent with a shell is a liability unless you decide, deliberately, what it's allowed to
do. So the permission layer isn't a feature bolted on the side — it's the spine.

Every risky action (a write, a shell command, running code) is classified by risk. In **Ask**
mode, the agent pauses and the action pops up on my phone — the exact tool, the exact
arguments — and I approve or deny it. Low-risk reads and searches don't interrupt me;
everything with teeth does. There's a **Full** mode for when I'm watching and want it to just
go, and a **filesystem scope** that fences the agent into a chosen directory — paths outside
it are refused in both modes.

The honest caveat, which I put in the docs too: a scope confines the structured file tools
cleanly, but a raw shell can always wander. The real control for shell and code is the
approval gate, not the fence. Saying where a safety boundary *doesn't* hold is part of
building one.

Secrets never touch the source. Access is a hashed, timing-safe PIN, and the whole thing runs
on my own private network rather than the open internet. It's a personal tool, deliberately.

## the part I'm fondest of: it can extend itself

When the agent hits a task no existing tool covers, it can write a new tool — a small
JavaScript function — which is screened for obvious escapes, compiled, and run in a hardened
`node:vm` sandbox with a minimal set of globals and no filesystem or process access. If it
works, it joins the toolset for the rest of the session. The first time I watched the agent
forge a tool and immediately call it, unprompted, was the good kind of unsettling.

It also carries a library of ~88 capability guides it can search and load — recipes for
specialized tasks — and follow using its ordinary tools.

Credit where it's due: the tool-forging sandbox and the skill catalog are adapted from the
open-source [@framers/agentos](https://github.com/framerslab/agentos) project (Apache-2.0).
The kernel, the platform, and the safety layer are mine; the good ideas for self-extension
were theirs, and reusing them beat reinventing them.

## making the agent aware of itself

One small change had an outsized effect: the system prompt is now regenerated *every turn*
with live context — which model it's running as, the time of day, its filesystem scope, its
permission mode, how many tools and skills it currently has. Ask it where it is and it
answers correctly, with no tool call, because the answer is in front of it. An agent that
knows its own situation makes visibly better decisions about what to reach for.

## where it honestly stands

It's engineering, and it's finished enough to live on: I use it. It is not a research claim,
not benchmarked, and not public infrastructure — it's a self-hosted personal agent with a
safety model I trust enough to hand real access to. The [project page](/projects/agentos/)
has the capability list; this post is the why behind it.

The next interesting question is the research one that's been sitting underneath all of this:
what does an agent like this *remember* across sessions, and can that be measured rather than
asserted? That's [NeuroArch's](/projects/neuroarch/) problem, and it's where the proofs will
have to come from.
