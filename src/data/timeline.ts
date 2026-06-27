// Canonical evolution of the research program. Honest history: where each idea
// came from, what it solved, what replaced it, what's still active. Rendered at
// /timeline. Drawn from the lab archaeology + the research program.
import type { TrackId } from './tracks';

export type MStatus = 'active' | 'shipped' | 'benchmarked' | 'evolved' | 'archived';

export type Milestone = {
  when: string; // year or yyyy-mm
  title: string;
  track?: TrackId;
  status: MStatus;
  detail: string;
  replacedBy?: string;
  links?: { label: string; href: string }[];
};

export type Era = {
  year: string;
  label: string;
  summary: string;
  milestones: Milestone[];
};

export const timeline: Era[] = [
  {
    year: '2023',
    label: 'Curiosity',
    summary:
      'First contact. Small chat scripts, anomaly detection, toy agents — poking at AI the way you poke at a campfire.',
    milestones: [
      {
        when: '2023',
        title: 'First agents & scripts',
        status: 'archived',
        detail:
          'ai_chat, anomaly-detection experiments, tiny "creature" agents (bunny, fluffy). No thesis yet — just learning the terrain.',
      },
    ],
  },
  {
    year: '2024',
    label: 'Chaos / genetic breeding',
    summary:
      'Genetic algorithms and "chaotic breeding" of binaries. Mostly noise — but it taught the one idea that survived everything: structure can emerge from chaos if you let it loop.',
    milestones: [
      {
        when: '2024',
        title: 'Chaos experiments (beast, boomXD, 1024doom)',
        status: 'archived',
        detail:
          'GA over binaries, self-referential loops, recursive feedback. Dead-ended as products, but seeded the recurring bet on emergence-from-recursion.',
        replacedBy: 'Fractal cognition (2025)',
      },
    ],
  },
  {
    year: '2025',
    label: 'The fractal explosion',
    summary:
      'The obsession crystallized into real systems. Byte-level training from scratch, the fractal backbone, genetic architecture search, and inspectable local agents.',
    milestones: [
      {
        when: '2025',
        title: 'byte_gpt → ForgeLM',
        track: 'training',
        status: 'evolved',
        detail:
          'From-scratch byte-level GPT training (124M–774M) on one 4090 matured into ForgeLM, the commodity-training stack.',
        links: [{ label: 'ForgeLM', href: '/projects/forgelm/' }],
      },
      {
        when: '2025',
        title: 'Fractal Neurons / LILA',
        track: 'fractal',
        status: 'active',
        detail:
          'A parameter-shared fractal backbone (~70M params, 65k+ runtime nodes), byte-level, MoE. The flagship intellectual core. LILA persona layer kept as speculative flavor.',
        links: [{ label: 'Fractal Neurons', href: '/projects/fractal-neurons/' }],
      },
      {
        when: '2025',
        title: 'FNAS — fractal architecture search',
        track: 'fractal',
        status: 'active',
        detail: 'Genetic search over fractal model genomes with LLM-as-judge scoring.',
        links: [{ label: 'FNAS', href: '/projects/fnas/' }],
      },
      {
        when: '2025',
        title: 'QJSON Agents + YSON',
        track: 'agents',
        status: 'shipped',
        detail:
          'Local-first agents whose identity and memory are plain, inspectable files; YSON persona format. FMM appeared here, independently, again.',
        links: [{ label: 'QJSON Agents', href: '/projects/qjson-agents/' }],
      },
    ],
  },
  {
    year: '2026',
    label: 'Memory & runtimes',
    summary:
      'The recurring ideas got extracted, named, and — finally — benchmarked. Memory systems became the lab’s first proven thread.',
    milestones: [
      {
        when: '2026-06',
        title: 'Centroid router benchmarked (Proof Drop #3)',
        track: 'memory',
        status: 'benchmarked',
        detail:
          'Fired proof drop #2\'s oracle and bolted on the cheapest router that could work — one centroid per topic. When memory is separable it\'s nearly free (~0.002 ms/query) and recovers 98% of oracle recall at ~60× flat-scan speed; as topics overlap, realized recall tracks routing accuracy and collapses toward chance. The catch: proof drop #2 ran in exactly that hard regime, so its oracle win was real but uncashable by a trivial router. Routing quality gates the locality bet. Shipped route() in fmm v0.3.0.',
        links: [
          { label: 'benchmark →', href: '/blog/fmm-router/' },
          { label: 'cite', href: '/cite/' },
          { label: 'fmm ↗', href: 'https://github.com/Linutesto/fmm' },
        ],
      },
      {
        when: '2026-06',
        title: 'FMM extracted, then benchmarked (Proof Drop #2)',
        track: 'memory',
        status: 'benchmarked',
        detail:
          'The Fractal Memory idea — reinvented across four projects — pulled into a standalone library, then given topic-scoped retrieval and benchmarked: ~164× faster and ~3.7× more accurate than flat search at 128k items when the topic is known; recall 0.0 if misrouted. The locality bet, in semantic memory.',
        links: [
          { label: 'benchmark →', href: '/blog/fmm-benchmark/' },
          { label: 'cite', href: '/cite/' },
          { label: 'fmm ↗', href: 'https://github.com/Linutesto/fmm' },
        ],
      },
      {
        when: '2026-06',
        title: 'UFM extracted + benchmarked (Proof Drop #1)',
        track: 'memory',
        status: 'benchmarked',
        detail:
          'Unified Fractal Memory generalized FMM from semantic to physical memory. First reproducible proof drop: runs a 24 GB model on a 23.5 GB GPU; full-GPU throughput when the working set fits; honest no-locality failure case.',
        links: [
          { label: 'benchmark →', href: '/blog/ufm-benchmark/' },
          { label: 'cite', href: '/cite/' },
          { label: 'ufm ↗', href: 'https://github.com/Linutesto/ufm' },
        ],
      },
      {
        when: '2026',
        title: 'NeuroArch',
        track: 'cognition',
        status: 'active',
        detail:
          'The cognitive-architecture thread. A competent agent substrate today; NeuroArch is the background-cognition layer (idle reasoning, belief revision, crystallization) it does not yet fully run. Flagship long-term direction — next proof: make the cycles measurable.',
        links: [{ label: 'NeuroArch', href: '/projects/neuroarch/' }],
      },
    ],
  },
];
