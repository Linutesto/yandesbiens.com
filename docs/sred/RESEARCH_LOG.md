# Research Log — Éthiqueia Québec inc.

A contemporaneous record of experimental development, structured to support an
**SR&ED** claim (Scientific Research & Experimental Development, CRA + Revenu Québec).
It is also just good science: every entry ties a technological uncertainty to the work
done to resolve it and the measured result.

> **Why this exists.** SR&ED credits reward *systematic investigation to resolve
> technological uncertainty*, documented as you go. This log is the evidence trail. It
> records work that actually happened — nothing is manufactured. Dates, hypotheses, and
> results map to commits, benchmarks, and releases.

## What SR&ED needs from each entry

1. **Technological objective** — the capability sought.
2. **Technological uncertainty** — why it wasn't obvious it could be achieved (or how).
3. **Hypotheses / approaches tried** — including ones that failed.
4. **Systematic work performed** — experiments, with method.
5. **Results & conclusions** — measured outcomes, what was learned.
6. **Evidence** — commits, benchmark runs, figures, releases.
7. **Dates & personnel** — who, when.

Keep entries factual and conservative. Eligible = the *experimental development*, not
routine engineering. When in doubt, record the uncertainty and the experiment; let an
SR&ED advisor scope eligibility later.

---

## Entry 2026-001 — UFM: bounding VRAM for routed models that exceed device memory

- **Track:** Memory Systems · **Personnel:** Yan Desbiens · **Period:** 2026-06 (extraction + benchmark)
- **Technological objective:** Run / serve a routed Mixture-of-Experts whose parameter
  footprint exceeds a single 24 GB GPU, without collapsing to CPU-only throughput.
- **Technological uncertainty:** It was not known whether routing-aware paging of expert
  sub-modules between VRAM and pinned host RAM could keep peak VRAM bounded *and* retain
  near-GPU throughput. Standard memory managers treat models as dense/monolithic; the
  throughput cost of per-step paging, and the regime boundaries, were unknown a priori.
- **Hypotheses / approaches:**
  1. Keep routers/attention/stem resident; page only experts on demand (LRU keep-hot).
  2. Compare against (a) all-on-GPU baseline and (b) naive per-call `.cuda()/.cpu()` offload.
  3. Expectation: paging is cheap when the working set fits the VRAM budget; uncertain
     otherwise.
- **Systematic work performed:** Built a reproducible harness (`ufm/benchmarks/`) sweeping
  expert count past VRAM, with VRAM/RAM telemetry, throughput, and OOM capture. Required a
  correctness fix to residency detection (`register_module` device-awareness, v0.1.1) before
  the larger-than-VRAM case was even registrable — itself an experimental finding about the
  primitive.
- **Results & conclusions (measured, RTX 4090):**
  - 24 GB expert bank on a 23.5 GB GPU: baseline **OOMs**; UFM runs at **19.6 GB** peak VRAM.
  - Working set ≤ budget (96 experts): UFM **21,174 tok/s**, within ~1% of baseline (21,017),
    and **~240×** faster than naive offload (87 tok/s).
  - No locality (192 experts touched every step): UFM (37 tok/s) ≈ naive (43) — transfer-bound.
  - **Conclusion:** routing-aware paging resolves the memory-vs-throughput tradeoff *iff*
    the active working set fits the budget; otherwise the system is bandwidth-limited. This
    boundary was the resolved uncertainty.
- **Evidence:** repo `Linutesto/ufm` (v0.1.1), `benchmarks/results/` (summary.json, telemetry
  CSVs, figures), blog `/blog/ufm-benchmark/`, citation id `desbiens2026ufm`.

---

## Entry 2026-002 — FMM: does hierarchical scoping improve retrieval over flat search?

- **Track:** Memory Systems · **Personnel:** Yan Desbiens · **Period:** 2026-06 (capability + benchmark)
- **Technological objective:** Determine whether organizing agent memory as a topic hierarchy
  and restricting retrieval to the relevant subtree ("paging the region") improves retrieval
  over a flat vector scan — and to build the capability needed to measure it.
- **Technological uncertainty:** It was not known whether hierarchical scoping helps *recall*
  (vs. only latency), or how the flat baseline degrades with scale. Naively, a flat semantic
  index is assumed adequate; whether topic locality yields a both-axes win, and the size of the
  penalty when the scope is wrong, were unknown.
- **Hypotheses / approaches:**
  1. Scoped search is sublinear (≈ N/scope faster) — expected.
  2. Scoped search also improves recall by removing cross-topic distractors — uncertain.
  3. A misrouted scope should fail hard — needed as a control to bound the claim.
- **Systematic work performed:** Added topic-scoped retrieval to the FMM library
  (`FractalMemoryMatrix.retrieve(query, topic_prefix=…)`, v0.2.0) — the capability did not exist
  and was required to obtain the evidence. Built a reproducible harness (`fmm/benchmarks/`) with
  a synthetic hierarchical corpus, sweeping N from 2k→128k across flat / domain-scoped /
  leaf-scoped / misrouted modes, measuring median latency and recall@k, plus a library
  correctness check (scoped retrieve stays inside the subtree).
- **Results & conclusions (measured, CPU):**
  - Flat scan degrades on both axes with scale: latency ~linear (8.3 ms at 128k), recall falls
    0.48→0.155 (distractor accumulation).
  - Leaf-scoped retrieval at 128k: **0.05 ms (~164× faster) and recall 0.58 (~3.7× higher)**.
  - Misrouted scope: **recall 0.0** — scoping is a bet on routing locality.
  - **Conclusion:** hierarchical scoping improves retrieval on both latency and recall when the
    topic is known; the resolved uncertainty is that the benefit is conditional on correct
    routing, which redirects the next investigation to the topic router.
- **Evidence:** repo `Linutesto/fmm` (v0.2.0), `benchmarks/results/` (summary.json, figures),
  blog `/blog/fmm-benchmark/`, citation id `desbiens2026fmm`.

---

## Entry template (copy for each new investigation)

```
## Entry YYYY-NNN — <title>
- Track: <track> · Personnel: <names> · Period: <yyyy-mm[..yyyy-mm]>
- Technological objective:
- Technological uncertainty:
- Hypotheses / approaches:
- Systematic work performed:
- Results & conclusions (measured):
- Evidence: <commits / benchmark runs / figures / release / citation id>
```

> Not tax advice. This log is structured to make an eligibility review by a qualified
> SR&ED practitioner straightforward; scope and quantum should be confirmed with one.
