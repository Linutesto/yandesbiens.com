---
title: "A 24 GB model on a 24 GB GPU"
issue: 1
date: 2026-06-27
description: "Proof drop #1 — UFM runs a model larger than VRAM on a single 4090, plus the honest case where it doesn't help."
track: memory
tags: ["ufm", "benchmark", "memory"]
---

Welcome to the first issue. The format is simple: every time the lab ships a **proof drop** —
a small, reproducible result — you get the short version here, with the link to the full
writeup and the code.

One rule governs all of it: **every claim is reproducible from a one-command script, or it's
marked speculative.** No hype, no vibes-based benchmarks.

## This drop: UFM

The question: can a single RTX 4090 run a model whose memory footprint exceeds its VRAM?

I tested [UFM](https://github.com/Linutesto/ufm) — a manager that treats VRAM + RAM as one
pool — on a routed Mixture-of-Experts with a 24 GB expert bank, on a 23.5 GB card.

- The standard "all on GPU" approach **OOMs**.
- UFM runs the same model, holding VRAM at **19.6 GB**.
- When the working set fits the budget, it does so at **~1% of baseline throughput** and
  **~240× faster than naive CPU offload**.

And the part most benchmarks skip — the failure case: when every expert fires every step
(no locality), UFM ties naive streaming. It's a bet on locality, not magic memory. I'd
rather show you the edge of the envelope than pretend there isn't one.

→ **Full writeup, figures, and repro:** [yandesbiens.com/blog/ufm-benchmark](/blog/ufm-benchmark/)

## What's next

Memory Systems thread continues: training-time paging and optimizer-state offload curves.
After that, the fractal backbone gets its first controlled comparison.

You can always see the whole program — threads, maturity, and the next proof needed — on the
[research page](/research).

— Yan

*Research conducted at Éthiqueia Québec inc.*
