---
title: "proof drop #3 — a cheap router decides whether the locality bet pays"
date: 2026-06-27
description: "A near-free centroid router recovers 98% of the oracle's recall at ~60× flat-scan speed — when the memory is separable. As topics overlap, routing (not retrieval) becomes the bottleneck and the win evaporates."
tags: ["fmm", "benchmark", "memory", "retrieval", "routing", "rag", "local-first"]
track: memory
proofDrop: true
ogImage: /img/fmm-router/separability.png
---

Proof drop #3. Same rule as the first two: every number here is reproducible from a one-command
script, or it's marked speculative.

[Proof drop #2](/blog/fmm-benchmark/) ended on a cliffhanger. Topic-scoped retrieval was far
faster and more accurate than a flat scan — **when the topic was known** — and a *misrouted*
scope had recall 0.0. But I cheated: I handed the search an oracle. In production nobody hands
you the topic. A **router** has to guess it. So "misrouted" isn't a freak event — it's whatever
fraction of the time the router is wrong.

This drop fires the oracle and measures what's actually left.

## the claim

> Replace the oracle with the **cheapest router that could work** — one centroid per topic, route
> the query to the nearest one. Does it cash the scoping win, and when does it stop?

The router is deliberately the floor: each leaf subtree gets **one centroid** — the mean of its
items, a descriptor [FMM](https://github.com/Linutesto/fmm) already has lying around. Route the
query to the nearest centroid(s) by cosine, then search only that region. The cost is
`O(number-of-topics × dim)` — independent of how many items you've stored. It ships in the
library this release (v0.3.0) as `route()` and `route_and_retrieve()`.

I compare four strategies: **flat** (no routing), **oracle** (true topic — proof drop #2's
ceiling), **router top-1** (best-guess topic), and **router top-3** (union of the 3 best guesses).

## the setup

Same synthetic topic tree as #2 — 16 domains × 8 subtopics = 128 leaf clusters, dim 128 — so the
two drops are directly comparable. Two sweeps:

- **separability:** vary how tight the clusters are (scatter `ε`) at fixed size. This is a stand-in
  for *how well-organized your memory is*.
- **size:** vary the store size at an `ε` where routing works, to see if the win survives scaling.

Vectors are synthetic, so this tests the *structure of routing*, not embedding quality.

## the result, part 1 — routing is nearly free, and it works when memory is organized

At **128,000 items** with reasonably separable topics (`ε = 0.10`):

| strategy | searches | latency | recall@k | routing acc |
|---|---:|---:|---:|---:|
| flat scan | 128,000 | 8.00 ms | 0.985 | — |
| oracle (true topic) | 1,000 | 0.049 ms | 0.985 | 1.00 |
| **centroid router · top-3** | 3,000 | **0.134 ms** | **0.965** | **0.98** |
| centroid router · top-1 | 1,000 | 0.050 ms | 0.905 | 0.92 |

![Query latency vs store size](/img/fmm-router/latency.png)

The routing decision itself costs **≈ 0.002 ms per query — about 4000× cheaper than the 8 ms flat
scan it replaces.** For that, top-3 recovers **98% of the oracle's recall** while staying **~60×
faster than flat**; top-1 is **~159× faster** at 92% of oracle recall. The cliffhanger from #2 has
a happy ending — *as long as the memory is organized.* Which brings us to the catch.

## the result, part 2 — routing, not retrieval, is the bottleneck

Now hold the size fixed and slide the clusters from tight to overlapping:

![Realized recall vs cluster overlap](/img/fmm-router/separability.png)

| ε (cluster overlap) | oracle recall | router top-1 (acc) | router top-3 (acc) |
|---:|---:|---:|---:|
| 0.05 — tight | 0.89 | 0.89 (1.00) | 0.89 (1.00) |
| 0.10 | 1.00 | 0.885 (0.89) | 0.985 (0.98) |
| 0.15 | 1.00 | 0.64 (0.64) | 0.79 (0.79) |
| 0.20 | 1.00 | 0.39 (0.39) | 0.62 (0.62) |
| 0.45 — overlapping | 1.00 | 0.07 (0.07) | 0.18 (0.18) |

The oracle line (green) stays pinned at the top — *if you know the topic, scoping always works.*
But the router lines fall off a cliff as the clusters blur together. And look at the last two
columns: **realized recall tracks routing accuracy almost exactly.** That's the whole story in one
observation — once you're inside the right scope, retrieval is easy; the entire game is landing in
the right scope.

![Routing accuracy vs cluster overlap](/img/fmm-router/accuracy.png)

This is proof drop #2's binary "misrouted = 0" turned into a **continuous curve** — a measured
function of how separable your memory is, not a yes/no.

## the honest catch (and the tie that binds the thread)

Here's the part I didn't expect when I started. **Proof drop #2 ran at `ε = 0.45`.** That's the
far-right edge of the chart above — exactly the regime where this cheap router routes correctly
**7%** of the time. So #2's beautiful oracle advantage was real, but a trivial router *could not
have cashed it* at the separability #2 used. The oracle wasn't a convenience; it was load-bearing.

That reframes the whole locality bet — UFM, FMM, all of it:

> **Locality is a superpower you only get if you can address the right region.** Scoping doesn't
> fail at retrieval; it fails at *routing*. Keeping memory separable — or building a stronger
> router — is the lever the entire bet rests on.

Two cheap levers already show up in the data: **top-r** (widening to the 3 best guesses roughly
triples a tiny scope and recovers much of the accuracy — 0.64 → 0.79 at `ε = 0.15`), and
**organization** (a memory that keeps its topics tight hands the router an easy job). The third
lever — a *learned* router that pushes the crossover rightward — is the next proof.

## reproduce it

```bash
git clone https://github.com/Linutesto/fmm && cd fmm
pip install -e ".[torch]" && pip install matplotlib
cd benchmarks && ./run_router.sh
```

It prints your environment, runs a library correctness check (the shipped `route()` picks the
right subtree and stays inside it), runs both sweeps, and writes every number to `results/`. Method
and full tables are in the [benchmark README](https://github.com/Linutesto/fmm/tree/master/benchmarks#proof-drop-3--does-a-cheap-router-cash-the-scoping-win).

## limitations (so you don't over-read this)

- **Synthetic embeddings**, same as #2 — this isolates the *routing* question from embedding
  quality. Real-embedding corpora are future work; absolute numbers will move.
- **`ε` is a stand-in for "how separable is your memory."** Real corpora won't hand you an `ε`.
  The transferable claim is the *shape* — routing accuracy gates realized recall, and a centroid
  router is essentially free — not a specific recall number.
- The centroid router is intentionally the **floor**. A learned router would do better; measuring
  how much better is the open question this drop sharpens, not one it closes.

---

Three proof drops, one thesis sharpening into focus: **capable AI you can own, through memory that
organizes itself.** #1 and #2 showed locality is a superpower. #3 shows the bill: you only collect
if you can find your way to the right room. Next, a router that finds it more often.

> *Yan Desbiens — work conducted at Éthiqueia Québec inc. Proof drop #3.*
