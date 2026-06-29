// Canonical, structured map of the Éthiqueia research program.
// Rendered at /research. Prose long-form lives in RESEARCH_PROGRAM.md; this is
// the machine-readable map that links threads → projects → repos → proof.
import type { TrackId } from './tracks';

export type Maturity = 'concept' | 'prototype' | 'shipped' | 'benchmarked' | 'published';

export const maturityRank: Record<Maturity, number> = {
  concept: 0, prototype: 1, shipped: 2, benchmarked: 3, published: 4,
};

export type ProjectRef = {
  name: string;
  slug?: string; // site project page
  repo?: string; // github
  note?: string;
};

export type Thread = {
  track: TrackId;
  lineage: string;
  projects: ProjectRef[];
  leadArtifact: { label: string; href: string };
  maturity: Maturity;
  evidence: string;
  nextProof: string;
  posts: string[]; // blog ids
};

export const THESIS =
  'Capable AI you can own — on commodity hardware — through self-similar architecture and memory that organizes itself.';

export const threads: Thread[] = [
  {
    track: 'memory',
    lineage:
      'FMM (Fractal Memory Matrix / Memory-Mapped) → UFM (Unified Fractal Memory). The FMM idea independently reappeared in Fractal Neurons, QJSON Agents, fnn_test, and NeuroArch before being extracted; UFM generalized it from semantic memory to physical memory (VRAM/RAM as one pool).',
    projects: [
      { name: 'UFM', slug: 'ufm', repo: 'https://github.com/Linutesto/ufm' },
      { name: 'FMM', repo: 'https://github.com/Linutesto/fmm' },
    ],
    leadArtifact: { label: 'UFM benchmark — proof drop #1', href: '/blog/ufm-benchmark/' },
    maturity: 'benchmarked',
    evidence:
      'Three reproducible proof drops (2026-06-27). #1 (UFM): runs a 24 GB expert bank on a 23.5 GB RTX 4090 where baseline OOMs; within ~1% of baseline throughput when the working set fits; ~240× faster than naive offload. #2 (FMM): topic-scoped retrieval ~164× faster + ~3.7× more accurate than flat at 128k when the topic is known; recall 0.0 if misrouted. #3 (FMM router): a near-free centroid router (~0.002 ms/query) recovers 98% of oracle recall at ~60× flat-scan speed when topics are separable, but realized recall tracks routing accuracy and collapses toward chance as topics overlap. All three converge on one finding: locality pays only when you can address the right region.',
    nextProof:
      'A learned topic router that pushes the routing-accuracy crossover into harder (overlapping) regimes where the cheap centroid router fails — measured end-to-end against the centroid floor (proof drop #3). Plus: real-embedding retrieval corpora; training-time paging (autograd-safe) + OffloadedAdam memory curves.',
    posts: ['ufm-benchmark', 'fmm-benchmark', 'fmm-router'],
  },
  {
    track: 'cognition',
    lineage:
      'NeuroArch — a cognitive architecture with idle cognition, self-revising beliefs, and memory crystallization, running on a competent local-agent substrate · AEON (an AI-governed deterministic world).',
    projects: [
      {
        name: 'NeuroArch',
        slug: 'neuroarch',
        note:
          'The agent substrate is already competent today. NeuroArch is the architecture on top — idle cognition, belief recalibration, dream-phase crystallization — which it does not yet fully run. The thread is about giving a working agent those background cycles and then measuring them.',
      },
      {
        name: 'AEON',
        slug: 'aeon',
        repo: 'https://github.com/Linutesto/aeon-living-worlds',
        note:
          'AI-governed deterministic world, now open-source and built in public, with embodied citizens driven by a teacher-to-student liquid neural network. Documented in a technical whitepaper and an ongoing devlog.',
      },
    ],
    leadArtifact: { label: 'NeuroArch', href: '/projects/neuroarch/' },
    maturity: 'prototype',
    evidence:
      'Running systems, documented in public. AEON is open-source with a technical whitepaper and a devlog (e.g. tracing a liquid-network trainability bug to a missing normalization and fixing it). Internal/emergent behaviors are not yet formally measured, so all capability claims stay marked speculative — this thread is framed as engineering, not results.',
    nextProof:
      'Measurable, reproducible behaviors: memory growth over time, belief-revision traces, idle-cycle throughput, and long-run determinism/drift soak tests — before any public capability claim.',
    posts: ['aeon-liquid-brain-stability'],
  },
  {
    track: 'agents',
    lineage:
      'QJSON Agents + YSON (persona/state format) → Alicia (local autonomous agent) → agentos (live kernel). (OpenPaw exists as background tooling, not a core research pillar.)',
    projects: [
      { name: 'QJSON Agents / YSON', slug: 'qjson-agents' },
      { name: 'agentos', slug: 'agentos' },
    ],
    leadArtifact: { label: 'QJSON Agents / YSON', href: '/projects/qjson-agents/' },
    maturity: 'shipped',
    evidence:
      'Code others can run; agents whose identity + memory are plain files. The YSON spec and an inspectable-memory demo are not yet written up.',
    nextProof:
      'A published YSON spec; a reproducible demo of inspectable, file-based agent memory compared against opaque memory stacks.',
    posts: [],
  },
  {
    track: 'training',
    lineage:
      'byte_gpt → ForgeLM → the 4090 capacity planner / autopilot. UFM (Memory Systems) is the bridge that lets this thread scale past 24 GB.',
    projects: [{ name: 'ForgeLM', slug: 'forgelm' }],
    leadArtifact: { label: 'ForgeLM', href: '/projects/forgelm/' },
    maturity: 'benchmarked',
    evidence:
      'Measured training envelope (VRAM, throughput, tokens/day) for the full 30M-500M family on one RTX 4090, re-verified 2026-06-29, plus a real 120M loss curve (9.65 → 2.78 over 9.04B tokens). One-command reproduce.',
    nextProof:
      'Model-quality numbers from a full run — held-out perplexity and HellaSwag/ARC via `forge eval` — to put a quality axis next to the cost axis.',
    posts: ['forgelm-4090-cost'],
  },
  {
    track: 'fractal',
    lineage:
      'Fractal Neurons (the flagship) → fnn_test (fractal neurons as conversational agents) → FNAS / FNAS-V2 (genetic search over fractal genomes). LILA is the persona/emergence layer — treated as inspiration, explicitly speculative.',
    projects: [
      { name: 'Fractal Neurons', slug: 'fractal-neurons' },
      { name: 'FNAS', slug: 'fnas' },
    ],
    leadArtifact: { label: 'Fractal Neurons', href: '/projects/fractal-neurons/' },
    maturity: 'prototype',
    evidence:
      'Rich and documented, but NOT yet benchmarked. All architectural-advantage claims are marked speculative until measured.',
    nextProof:
      'A controlled, small-scale comparison of the fractal backbone vs. a parameter-matched transformer (loss/perplexity at equal params + equal compute).',
    posts: [],
  },
];
