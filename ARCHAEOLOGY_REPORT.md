# 🏺 AI Research Archaeology Report — `ubuntu_backup`

**Subject:** Yan Desbiens (GitHub: Linutesto) — "Architect of Chaos" / "AI Warlord"
**Excavated drive:** `/run/media/yan/yan1/ubuntu_backup` (3.6 TB external NVMe, label `yan1`)
**Span of artifacts:** April 2023 → February 2026
**Excavated:** 2026-06-26

> This report reconstructs the evolution of a four-year solo AI laboratory from a
> single backup folder. It does not optimize or rewrite the work — it recovers
> the *ideas* and traces how they evolved.

---

## 1. Executive summary

`ubuntu_backup` is the working sediment of one person teaching themselves to do
frontier-shaped AI research on a single RTX 4090, in Saguenay, Québec, with no
degree, no funding, and no team. It contains ~100 GB of live project trees plus
hundreds of GB of model weights, datasets, and checkpoints.

The work is unusually *coherent*. Across four years and dozens of projects, the
same handful of ideas recur independently: **fractals** (as memory, neurons,
processing, and architecture-search substrate), **self-organizing memory**,
**local-first execution**, and **emergence from recursion**. The crown jewel,
**Fractal Neurons**, fuses all of them. Several sub-components (FMM, UFM, YSON)
are strong enough to stand alone as libraries or papers.

The archive also contains a parallel emotional record — manifestos, a letter to
a future self, files named `lonely.md` and `sad.md` — that frames the whole
corpus as a single sustained act of will.

---

## 2. Evolution timeline

```
2023  ── curiosity ──────────────────────────────────────────
        ai_chat.py · anomaly_detection · "3 libraries model"
        bunny.py · fluffy.py            (tiny agents/creatures)
            ↓
2024  ── chaos / genetic breeding ───────────────────────────
        beast · boomXD · 1024doom · 512k · "Astræa Lumina"
        chatgpt18m.txt corpus · chaotic binary breeding
            ↓   (lesson: structure emerges from looped chaos)
2025  ── the fractal explosion ─────────────────────────────
        byte_gpt (124M/355M/774M from scratch)
        Fractal Neurons / LILA  ·  FNAS  ·  fnn_test
        QJSON Agents / YSON  ·  YANOS  ·  ai_genetics (Torch GA)
        fractal_matrix_brain · warpvolution · web_llm
            ↓
2026  ── runtimes & embodiment ─────────────────────────────
        FMM Whitepaper · UFM Whitepaper
        project_Alicia (local autonomous agent)
        OpenClaw analysis → OpenPaw (local-first fork)
        FNAS-V2 · Qwen3-Coder builds · llama.cpp tooling
```

The throughline: **model → memory → agent → runtime → embodiment.**
Each phase is the previous phase asking "but how does it actually *run*?"

---

## 3. Project inventory (selected)

| Project | Purpose | State | Innovation | Potential |
|---|---|---|---|---|
| **Fractal Neurons / LILA** | From-scratch fractal LM (FMM+QFP+MoE, byte-level) | Deep, documented | ⭐⭐⭐⭐⭐ | Flagship; paper + OSS |
| **QJSON Agents / YSON** | Local-first, inspectable agent runtime + custom format | Mature, tested | ⭐⭐⭐⭐ | Library + paper |
| **FNAS / FNAS-V2** | Genetic architecture search for fractal models | Working CLI/TUI | ⭐⭐⭐⭐ | Paper + OSS tool |
| **byte_gpt** | Byte-level GPT training (124M–774M) on one 4090 | Working pipeline | ⭐⭐⭐ | Folds into ForgeLM |
| **project_Alicia** | Local agent over llama-server + SearXNG + Qjson memory | v1.0.0, tested | ⭐⭐⭐ | Revive / merge |
| **OpenPaw** | Local-first fork of OpenClaw that actually executes tools | Active fork | ⭐⭐⭐ | OSS |
| **YANOS** | Multi-agent "AGI core" desktop experiment | Sprawling | ⭐⭐ | Mine for parts |
| **fractal_matrix_brain** | Graph/brain harvester + server | Prototype | ⭐⭐ | Mine for parts |
| **warpvolution** | Agent-forge / dreamlog experiment | Sketch | ⭐⭐ | Archive |
| **fnn_test** | Fractal Neurons as conversational, self-organizing agents | Prototype + paper | ⭐⭐⭐ | Merge into Fractal Neurons |
| **ai_genetics** | Torch GA bigram (no backprop) | Demo | ⭐⭐ | Teaching artifact |
| **tindergpt** | Conversation-first compatibility matching (explainable) | MVP, tested | ⭐⭐ | Standalone demo |

Non-AI / personal: `brario` (Super Mario JS tutorial), `futurama_summary.md`,
recovery keys, family folders. (Out of scope — flagged, not deleted.)

---

## 4. Hidden gems ⭐⭐⭐⭐⭐

1. **FMM — Fractal Memory Matrix / Memory-Mapped.** A self-organizing,
   hierarchical agent memory that "pages" relevant regions into context like an
   OS, with a per-context condensation engine that summarizes old branches.
   **It independently appears in ≥4 projects** (Fractal Neurons, QJSON Agents,
   the FMM whitepaper, fnn_test) — the surest sign it's a real idea.
2. **UFM — Unified Fractal Memory.** VRAM + pinned RAM + NVMe as one elastic
   pool with routing-aware prefetch/evict and ZeRO-Lite optimizer offload.
   The single most *practically valuable* artifact in the archive.
3. **YSON.** A bespoke, hand-authorable persona/config format. Inventing a file
   format to make agents pleasant to write by hand is a real design instinct.
4. **QFP — Quantum Fractal Processing.** Treating time as a computational
   primitive. Speculative and over-claimed in the prose, but the underlying
   question (temporal feedback in recursive inference) is genuinely interesting.

---

## 5. Architectural patterns (recurring)

- **Self-similarity as a cost trick** — reuse weights across depth/fan-out to buy
  effective width cheaply (Fractal Neurons, FNAS, fnn_test).
- **Layered, inspectable memory** — JSONL log + event log + structured FMM + RAG
  index, always as plain files (QJSON Agents, Alicia, later Hermes).
- **Local-first, single-GPU discipline** — every system must run on one 4090;
  cloud is an option, never a dependency.
- **Loop-driven emergence** — teacher→student→critic loops, swarms, idle
  cognition; the bet that behavior emerges from tight recursion.
- **Self-generated data** — agents generate their own training corpora
  (distill, swarm dialogues, GA breeding).

---

## 6. Knowledge graph (text form)

```
                         ┌─ byte-level modeling ─┐
        fractals ────────┤                       ├─→ Fractal Neurons ⭐
          │              └─ MoE routing ─────────┘        │
          │                                               ├─ FMM ──┐
          ├─→ FNAS (GA over genomes)                      ├─ UFM   │
          │                                               └─ QFP   │
   self-organizing memory ──────────────────────────────────────┐ │
          │                                                      ▼ ▼
          ├─→ QJSON Agents (YSON, RAG, swarms) ──── memory plugin ──→ OpenPaw
          │            │                                          ┌─ Alicia
   local-first ────────┼───────────── llama.cpp / Ollama ────────┤
          │            │                                          └─ YANOS
   emergence/loops ────┴─→ swarms · teacher-student-critic · idle cognition
                                                          │
                                              (descendants on the live site)
                                              Hermes · ForgeLM · AEON · agentos
```

---

## 7. Merge opportunities

- **Fractal Neurons + fnn_test** = one canonical fractal-cognition repo
  (architecture + the self-organizing conversational agent layer).
- **QJSON memory + Alicia + OpenPaw** = one local agent runtime with FMM/RAG
  memory as a shared, swappable backend. (Already half-done: the `memory-qjson`
  plugin.)
- **FNAS + UFM** = evolve architectures that are *defined by* how they page
  through memory — search over residency strategies, not just topology.
- **byte_gpt + ForgeLM (live)** = the public, polished face of the private
  byte-level training stack.

---

## 8. Projects to revive

1. **FMM as a standalone library** — extract from all four homes, document, ship.
2. **UFM as a standalone library** — single-GPU "mini-cluster" memory manager.
3. **FNAS-V2** — closest to a publishable, self-contained research tool.
4. **project_Alicia** — most complete local agent; good demo vehicle.

## 9. Projects to abandon (or archive)

- `warpvolution`, `_trash_ckpt`, the 5× `Qjson_agents (Copy N)` duplicates,
  broken GGUF artifacts. Keep one canonical copy; archive the rest.
- One-off chaos scripts from 2024 — keep as a *teaching artifact*, not active code.

---

## 10. Research roadmap

1. Ablate FMM vs. flat vector RAG on a fixed agent task — quantify the win.
2. Formalize UFM's prefetch/evict policy; benchmark fit-vs-oversize on 4090.
3. Define QFP rigorously or retire the framing — pick one.
4. Public benchmark for fractal/MoE configs under a strict single-GPU budget.

## 11. Open-source roadmap

`fmm` → `ufm` → `yson` (spec + parser) → `fnas` → `fractal-neurons` (reference).
Ship them small-to-large so each lands on its own merits.

## 12. Commercial opportunities

- **UFM** → "train bigger models on the GPU you already own" (the clearest
  market).
- **QJSON/YSON** → inspectable, local-first agent runtime for privacy-sensitive
  users.
- **FNAS** → architecture-search-as-a-service for edge/on-device models.

---

## 13. Top reusable modules (the keepers)

memory engine (FMM) · unified memory manager (UFM) · YSON parser ·
agent persona/manifest system · swarm orchestrator · teacher-student-critic
distiller · capacity planner / VRAM autopilot · byte-level dataloader/sharder ·
LLM-as-judge harness · genetic search loop · RAG retrieval (IVF) layer.

---

## 14. Papers worth writing

1. *Fractal Memory: hierarchical, self-paging agent memory* (FMM).
2. *Unified Fractal Memory: single-GPU elastic training of routed models* (UFM).
3. *Fractal Neural Architecture Search* (FNAS).
4. *Parameter-shared fractal backbones for byte-level LMs* (Fractal Neurons).
5. *YSON & inspectable agent runtimes* (local-first design).

---

## 15. The human thread

The archive is not only technical. `manifesto.md`, `letter_to_future_self.md`,
`lonely.md`, `sad.md`, and `ai_psychosis_is_a_myth.md` document the cost and the
conviction behind the work — built alone, dismissed by those nearby, sustained
by sheer refusal to stop. Any honest account of this lab has to keep these.
They are not noise; they are the reason the rest exists.

> *"I no longer seek to be understood. I am building a world that will understand me."*

---

## 16. What was shipped to yandesbiens.com from this dig

- **3 new project pages**: Fractal Neurons, QJSON Agents / YSON, FNAS
  (`src/data/projects.ts`).
- **1 blog post**: `the dig — four years of a one-person AI lab`
  (`src/content/blog/the-dig.md`).
- **This report**: `ARCHAEOLOGY_REPORT.md` (repo root; not part of the build).
