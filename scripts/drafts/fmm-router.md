# Social drafts — proof drop #3 — a cheap router decides whether the locality bet pays

Calibrate every number to the data. Don't round up. Keep the honest limitation.

## X / Twitter

1/ Last drop I showed: searching the *right region* of a memory beats scanning all of it —
164× faster, more accurate. But I cheated. I handed the search an oracle telling it which region.

Production has no oracle. So I fired it and bolted on the cheapest router that could work. 🧵

2/ The router: one centroid per topic (the mean of its items — the store already has it). Route
the query to the nearest centroid, search only that region. Cost is independent of store size.

At 128k items, when topics are separable: it costs ~0.002 ms/query. ~4000× cheaper than the scan.

3/ And it *works*: a top-3 centroid router recovers **98% of the oracle's recall** at **~60×
flat-scan speed**. Top-1: ~159× faster, 92% recall. The router is essentially free and cashes
almost the whole locality win.

4/ The catch — and it's the interesting part. As topics *overlap*, the router falls off a cliff.
Realized recall tracks routing accuracy almost exactly: once you're in the right scope retrieval
is easy; the whole game is landing in the right scope.

[separability figure]

5/ Kicker: proof drop #2 ran at *exactly* the overlapping regime where this cheap router routes
correctly 7% of the time. Its oracle win was real — but a trivial router couldn't have cashed it.
The oracle wasn't a convenience. It was load-bearing.

6/ Takeaway: locality (UFM, FMM, all of it) is a superpower you only get if you can address the
right region. Scoping doesn't fail at retrieval — it fails at *routing*.

Next proof: a learned router that pushes the crossover into the hard regime.

7/ Synthetic embeddings (isolates the routing question), one-command repro, every number in the
repo. Floor result, honestly bounded.

Code: github.com/Linutesto/fmm
Writeup: yandesbiens.com/blog/fmm-router/

## LinkedIn

Proof drop #3 from the memory thread at Éthiqueia.

Two drops ago I benchmarked topic-scoped retrieval: searching only the relevant region of a
memory is dramatically faster and more accurate than a flat scan — but only when you *know* which
region. I handed the search an oracle. Production doesn't have one; a router has to guess.

So this drop replaces the oracle with the cheapest router that could work — one centroid per topic
— and measures the end-to-end result. Two findings:

1. When the memory is well-organized, routing is nearly free (~0.002 ms/query, ~4000× cheaper than
the flat scan it replaces) and cashes the win: at 128k items, a top-3 centroid router recovers 98%
of the oracle's recall while staying ~60× faster than flat.

2. When topics overlap, routing — not retrieval — becomes the bottleneck. Realized recall falls
along a continuous curve that tracks routing accuracy, down toward chance.

The honest tie-back: my previous benchmark ran in exactly that hard regime, so its oracle advantage
was real but uncashable by a trivial router. Routing quality gates the entire locality bet — for
semantic memory (FMM) and physical memory (UFM) alike.

Synthetic embeddings (to isolate the structural question), one-command reproduction, every number
open. The centroid router is intentionally the floor; a learned router is the next proof.

Writeup: yandesbiens.com/blog/fmm-router/
Code: github.com/Linutesto/fmm

#AI #MachineLearning #LocalAI #OpenResearch #RAG

## r/LocalLLaMA

Title: I benchmarked whether a *cheap* router can cash the "search only the relevant region" win — and where it breaks

Body:

Follow-up to my earlier benchmark on topic-scoped retrieval (paging the relevant region of a
vector memory instead of scanning all of it). That result assumed you *know* the right region — an
oracle. Production has no oracle: a router has to pick the scope. So I tested the cheapest router
that could work.

**Router:** one centroid per topic subtree (mean of its items — already sitting in the store).
Route the query to the nearest centroid(s) by cosine, search only that region. Cost is O(#topics ×
dim), independent of how many items you've stored.

**Setup:** synthetic topic tree, 16 domains × 8 subtopics = 128 leaves, dim 128, 128k items, CPU.
Compared flat scan / oracle (true topic) / router top-1 / router top-3.

**Result 1 — when topics are separable, routing is nearly free and works:**

| mode | latency | recall@k | routing acc |
|---|---:|---:|---:|
| flat | 8.00 ms | 0.985 | — |
| oracle | 0.049 ms | 0.985 | 1.00 |
| router top-3 | 0.134 ms | 0.965 | 0.98 |
| router top-1 | 0.050 ms | 0.905 | 0.92 |

The routing decision itself is ~0.002 ms — ~4000× cheaper than the flat scan it avoids. Top-3
recovers 98% of oracle recall at ~60× flat speed.

**Result 2 — when topics overlap, routing is the bottleneck.** Realized recall falls along a
continuous curve that tracks routing accuracy, from the oracle ceiling down toward chance (top-1
routing accuracy 0.07 at high overlap). Once you're in the right scope retrieval is easy — the
whole game is landing there.

**Honest catch:** my previous benchmark ran in exactly that high-overlap regime, so its oracle win
was real but uncashable by a trivial router. Routing quality gates the whole thing.

Synthetic embeddings (isolates the routing question from embedding quality — real corpora are
future work). One-command repro, every number in the repo:

- Code: github.com/Linutesto/fmm  (`cd benchmarks && ./run_router.sh`)
- Writeup + figures: yandesbiens.com/blog/fmm-router/
