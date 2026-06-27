---
title: "proof drop #3 — a cheap router decides whether the locality bet pays"
issue: 2
date: 2026-06-27
description: "A near-free centroid router recovers 98% of the oracle's recall at ~60x flat-scan speed — when the memory is separable. As topics overlap, routing (not retrieval) becomes the bottleneck and the win evaporates."
track: memory
tags: ["memory", "retrieval", "routing", "benchmark"]
---

Proof drop #2 showed that searching the *right region* of a memory beats scanning all of it —
but I cheated and handed the search an oracle for which region that was. Production has no oracle.
So #3 fires the oracle and bolts on the cheapest router that could work: one centroid per topic
(the mean of its items, which the store already has), route the query to the nearest one.

The result splits cleanly in two. **When the memory is organized, routing is nearly free and it
works:** at 128k items a top-3 centroid router recovers **98% of the oracle's recall** at **~60×
the speed of a flat scan**, and the routing decision itself costs ~0.002 ms — about 4000× cheaper
than the scan it replaces. **When topics overlap, routing — not retrieval — becomes the
bottleneck:** realized recall falls along a continuous curve that tracks routing accuracy, down
toward chance. The kicker: proof drop #2 ran in *exactly* that hard regime, so its oracle win was
real but uncashable by a trivial router. **Routing quality gates the whole locality bet.**

→ **Full writeup, figures, and repro:** [/blog/fmm-router/](/blog/fmm-router/)

## what's next

A *learned* router — to push the crossover rightward and cash the win in harder, more realistic
regimes. That's proof drop #4. The centroid router is the floor; now we measure the ceiling.

— Yan

*Research conducted at Éthiqueia Québec inc.*
