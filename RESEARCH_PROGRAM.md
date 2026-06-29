# The Research Program

**Author:** Yan Desbiens — independent AI researcher
**Lab:** Work conducted at **Éthiqueia Québec inc.** (independent research lab, Québec, Canada)
**Status:** living document · last updated 2026-06-27

> This is the canonical map of the lab. It exists so that scattered repositories read
> as one coherent research program. Every project below is evidence for a single thesis.

---

## Thesis

> **Capable AI you can own — on commodity hardware — through self-similar architecture
> and memory that organizes itself.**

Three load-bearing commitments make the program coherent:

1. **Self-similar structure** — reuse a small set of parameters across a fractal/recursive
   topology to buy depth and width cheaply.
2. **Self-organizing memory** — memory that grows, prunes, pages, and condenses itself,
   instead of a flat vector store.
3. **Local-first execution** — everything must run on hardware an individual can own
   (a single RTX 4090), which also makes it private and auditable by construction.

The third commitment is where the lab's name earns its keep: *responsible AI proven by
architecture, not press releases.* Local-first ⇒ data sovereignty. Open + reproducible
⇒ scientific transparency. Inspectable agents ⇒ auditability.

---

## How to read this map

Every thread lists: its **lineage** (which projects descend from one recurring idea),
the **current lead artifact** (the one thing that best proves it right now), a **maturity**
level, and the **evidence still needed**. Maturity is deliberately conservative — a thread
is only "proven" when there is a reproducible benchmark behind it.

Maturity scale: `concept` → `prototype` → `shipped` (code others can run) →
`benchmarked` (reproducible evidence) → `published` (paper/peer artifact).

---

## Thread 1 — Self-organizing memory

**Idea:** memory for AI should be hierarchical and self-managing, not a flat embedding bag.

- **Lineage:** FMM (Fractal Memory Matrix / Memory-Mapped) → UFM (Unified Fractal Memory).
  The FMM idea independently reappeared in Fractal Neurons, QJSON Agents, fnn_test, and Hermes
  before being extracted. UFM generalized it from *semantic* memory to *physical* memory
  (VRAM/RAM as one pool).
- **Lead artifact:** [`ufm`](https://github.com/Linutesto/ufm) + the **UFM benchmark**
  (this is the lab's first formal proof drop).
- **Also shipped + benchmarked:** [`fmm`](https://github.com/Linutesto/fmm) (pure-Python tree +
  torch lattice) — topic-scoped retrieval (v0.2.0) and a centroid router (v0.3.0).
- **Maturity:** `benchmarked` ✅ — **three reproducible proof drops (2026-06-27):**
  - **#1 (UFM):** runs a 24 GB expert bank on a 23.5 GB RTX 4090 where the baseline OOMs;
    full-GPU throughput when the working set fits the budget, ~240× faster than naive offload;
    honest no-locality failure case. Writeup: [/blog/ufm-benchmark](/blog/ufm-benchmark/).
  - **#2 (FMM scoping):** topic-scoped retrieval ~164× faster + ~3.7× more accurate than flat
    at 128k *when the topic is known*; recall 0.0 if misrouted. [/blog/fmm-benchmark](/blog/fmm-benchmark/).
  - **#3 (FMM router):** a near-free centroid router (~0.002 ms/query) recovers 98% of oracle
    recall at ~60× flat-scan speed *when topics are separable*; realized recall tracks routing
    accuracy and collapses toward chance as topics overlap. [/blog/fmm-router](/blog/fmm-router/).
  - **The convergent finding:** locality (physical or semantic) pays only when you can address
    the right region. Routing quality gates the whole bet.
- **Next evidence:** a **learned** topic router that extends the operating regime past the
  centroid floor (proof drop #3's open question); real-embedding retrieval corpora; training-time
  paging (autograd-safe) + `OffloadedAdam` memory curves; cost-aware eviction vs. LRU ablation.

## Thread 2 — Fractal cognition

**Idea:** a parameter-shared, self-similar backbone as an alternative inductive bias to
stacked transformer blocks.

- **Lineage:** Fractal Neurons (the flagship) → fnn_test (fractal neurons as conversational
  agents) → FNAS / FNAS-V2 (genetic search over fractal genomes). LILA is the
  persona/emergence layer — treated as *inspiration/flavor*, explicitly speculative.
- **Lead artifact:** Fractal Neurons (architecture + training stack).
- **Maturity:** `prototype` (rich, documented) — **not** yet benchmarked.
- **Evidence needed:** a controlled, small-scale comparison of the fractal backbone vs. a
  parameter-matched transformer baseline (loss/perplexity at equal params + equal compute).
  Until that exists, all architectural advantage claims are marked **speculative**.

## Thread 3 — Local-first agent runtimes

**Idea:** agents whose identity and memory are plain, inspectable files — not a cloud black box.

- **Lineage:** QJSON Agents + YSON (persona format) → Alicia (local autonomous agent) →
  OpenPaw (local-first runtime) → agentos (live).
- **Lead artifact:** QJSON Agents + the YSON spec.
- **Maturity:** `shipped` but under-documented.
- **Evidence needed:** the YSON format written up as a spec; a reproducible demo of
  inspectable, file-based agent memory; a comparison against opaque memory stacks.

## Thread 4 — Training on commodity hardware

**Idea:** the full model lifecycle — raw bytes → trained model — on one consumer GPU.

- **Lineage:** byte_gpt → ForgeLM (live) → the 4090 capacity planner / autopilot.
  UFM (Thread 1) is the bridge that lets this thread scale past 24 GB.
- **Lead artifact:** [`forgelm`](https://github.com/Linutesto/forgelm) + a reproducible
  "train an LLM from scratch on one 4090" recipe.
- **Maturity:** `benchmarked` ✅ — **proof drop (2026-06-29):**
  [What it costs to train an LLM from scratch on one RTX 4090](https://yandesbiens.com/blog/forgelm-4090-cost/).
  Measured training envelope (VRAM/throughput/tokens-day) for the full 30M–500M family on one
  RTX 4090 (4/5 configs re-verified), plus a real 120M loss curve (9.65 → 2.78 over 9.04B tokens).
  Honest finding: the real run beat the conservative planner (126k vs 84.5k tok/s, 11.6 vs 15.8 GB);
  the 24 GB ceiling is documented (500M OOMs). One-command reproduce in `benchmarks/single-4090-cost/`.
- **Next proof:** model-quality numbers from a full run — held-out perplexity + HellaSwag/ARC via
  `forge eval` — to put a quality axis next to the cost axis.

## Thread 5 — Cognitive systems & world models

**Idea:** systems that keep reasoning between prompts, and worlds governed by a model.

- **Lineage:** Hermes / NeuroArch (idle cognition, self-evolving beliefs) · AEON
  (AI-governed deterministic world).
- **Lead artifact:** Hermes (architecture case study).
- **Maturity:** `prototype` / research-stage. **Highest speculative gravity** — framed as
  engineering case studies, never as capability claims.
- **Evidence needed:** measurable, reproducible behaviors (e.g., memory growth over time,
  belief-revision traces) before any public claim.

---

## The evidence bar (lab policy)

Nothing ships with a performance claim unless it is **(a)** reproducible from a one-command
script in-repo, or **(b)** explicitly tagged *speculative / hypothesis*. Visionary concepts
(QFP "time as a primitive", LILA emergence, "consciousness") are inspiration; engineering is
proof. We earn credibility on Threads 1/3/4 (the verifiable) to buy the right to publish 2/5.

## The artifact multiplier

Every significant result runs one pipeline:
`repo → benchmark → blog → website project → X/LinkedIn → Reddit → newsletter → future paper`.
One experiment is meant to produce weeks of compounding content.

## Public positioning

- **Face & voice:** Yan Desbiens, independent researcher. All bylines, talks, social.
- **Institutional backbone:** Éthiqueia Québec inc. — lab of record, IP/copyright holder,
  paper-affiliation line, grant applicant, contracting party.
- **Affiliation line:** *Yan Desbiens — Éthiqueia Québec inc. (independent research lab),
  Québec, Canada.*

---

## Current focus

**Proof drop #1 — the UFM benchmark** (Thread 1). The first piece of formal, reproducible
evidence for the program. See [`ufm/benchmarks/`](https://github.com/Linutesto/ufm).
