// Canonical registry of citable research outputs ("proof drops" and articles).
// This is the scientific-asset spine: every entry can be rendered as a page
// citation, a BibTeX record, a CITATION.cff, and (later) minted to a DOI.
//
// Rule: an entry lives here only when it has reproducible evidence or an open
// implementation behind it. No opinions, no marketing.
import type { TrackId } from './tracks';

export type PubType = 'benchmark' | 'article' | 'software' | 'dataset';

export type Artifact = { label: string; href: string };

export type Publication = {
  id: string; // stable citation key, e.g. desbiens2026ufm
  slug?: string; // blog post slug, if any
  title: string;
  shortTitle: string;
  authors: string[];
  date: string; // ISO yyyy-mm-dd
  type: PubType;
  track: TrackId;
  version?: string;
  repo?: string;
  url: string; // canonical landing page
  artifacts: Artifact[];
  abstract: string;
  doi?: string | null; // filled when minted (Zenodo)
  reproducible: boolean;
};

export const ORG = 'Éthiqueia Québec inc.';

export const publications: Publication[] = [
  {
    id: 'desbiens2026forgelm4090cost',
    slug: 'forgelm-4090-cost',
    title: 'What it costs to train an LLM from scratch on one RTX 4090',
    shortTitle: 'ForgeLM on one 4090',
    authors: ['Yan Desbiens'],
    date: '2026-06-29',
    type: 'benchmark',
    track: 'training',
    version: 'v0.1.0',
    repo: 'https://github.com/Linutesto/forgelm',
    url: 'https://yandesbiens.com/blog/forgelm-4090-cost/',
    artifacts: [
      { label: 'Code + one-command repro', href: 'https://github.com/Linutesto/forgelm/tree/master/benchmarks/single-4090-cost' },
      { label: 'Loss curve', href: '/img/forgelm-4090-cost/loss-curve.png' },
    ],
    abstract:
      "A single consumer RTX 4090 (24 GB) pretrains ForgeLM's entire 30M-500M model family from scratch. We measure the real training envelope — VRAM, throughput, and tokens/day per config — with `forge plan` (real forward+backward+optimizer steps, torch.compile off as a conservative floor), and report the loss curve from an actual 120M run (cross-entropy 9.65 -> 2.78 over 9.04B tokens, ~20h wall-clock at a sustained 126k tok/s). The practical cost beats the spec sheet: the real run held 126k tok/s at 11.6 GB versus the planner's 84.5k tok/s at 15.8 GB, and VRAM is non-monotonic in parameters (250M fits in less than 120M because it runs a smaller micro-batch). Engineering numbers only — model-quality metrics (perplexity, HellaSwag, ARC) are left as honest 'run it' placeholders. The 24 GB ceiling is real: 500M at 20.4 GB OOMs against a live desktop session.",
    doi: null,
    reproducible: true,
  },
  {
    id: 'desbiens2026fmmrouter',
    slug: 'fmm-router',
    title:
      'Does a cheap router cash the locality bet? Centroid routing for topic-scoped memory',
    shortTitle: 'FMM Router (Proof Drop #3)',
    authors: ['Yan Desbiens'],
    date: '2026-06-27',
    type: 'benchmark',
    track: 'memory',
    version: 'v0.3.0',
    repo: 'https://github.com/Linutesto/fmm',
    url: 'https://yandesbiens.com/blog/fmm-router/',
    artifacts: [
      { label: 'Code + one-command repro', href: 'https://github.com/Linutesto/fmm/tree/master/benchmarks' },
      { label: 'Figures', href: '/img/fmm-router/separability.png' },
    ],
    abstract:
      'Topic-scoped retrieval (Proof Drop #2) wins decisively when the topic is known, but production has no oracle: a router must pick the scope. We replace the oracle with the cheapest router that could work — one centroid per topic subtree (the mean of its items, already held by the store) — and measure end-to-end retrieval in Fractal Memory (FMM) on the same synthetic hierarchy (16 domains x 8 subtopics, dim 128). When topics are separable, the router is nearly free (~0.002 ms/query, ~4000x cheaper than the 8 ms flat scan it replaces) and cashes the win: at 128k items a top-3 centroid router recovers 98% of the oracle recall (0.965 vs 0.985) while staying ~60x faster than flat; top-1 is ~159x faster at 92%. As topics overlap, realized recall falls along a continuous curve that tracks routing accuracy — from the oracle ceiling toward chance (top-1 routing accuracy 0.07 at high overlap). The tie-back: Proof Drop #2 ran at exactly that high-overlap regime, so its oracle advantage, though real, was uncashable by a trivial router. Routing quality gates the locality bet; a learned router is the next proof. Embeddings are synthetic; the claim is the shape (routing accuracy gates realized recall) and that centroid routing is essentially free.',
    doi: null,
    reproducible: true,
  },
  {
    id: 'desbiens2026fmm',
    slug: 'fmm-benchmark',
    title:
      'Hierarchical scoping beats flat semantic search: topic-scoped retrieval in Fractal Memory',
    shortTitle: 'FMM Benchmark (Proof Drop #2)',
    authors: ['Yan Desbiens'],
    date: '2026-06-27',
    type: 'benchmark',
    track: 'memory',
    version: 'v0.2.0',
    repo: 'https://github.com/Linutesto/fmm',
    url: 'https://yandesbiens.com/blog/fmm-benchmark/',
    artifacts: [
      { label: 'Code + one-command repro', href: 'https://github.com/Linutesto/fmm/tree/master/benchmarks' },
      { label: 'Figures', href: '/img/fmm/recall.png' },
    ],
    abstract:
      'We benchmark topic-scoped retrieval against a flat scan in Fractal Memory (FMM) on a synthetic hierarchical corpus (16 domains x 8 subtopics). As the store grows to 128k items, a flat vector scan degrades on both axes: latency rises ~linearly (8.3 ms) and recall@k falls (0.48 to 0.155) as cross-topic distractors accumulate. Restricting search to the query\'s subtree is sublinear and removes distractors: leaf-scoped retrieval is ~164x faster and ~3.7x more accurate than flat at 128k. The cost is strict: a misrouted scope (wrong topic) has recall 0.0. Hierarchical memory is a bet on routing locality — it pays only when the correct region can be addressed, making the topic router the next thing to measure. Embeddings are synthetic; the claim is the relative advantage and scaling trend.',
    doi: null,
    reproducible: true,
  },
  {
    id: 'desbiens2026ufm',
    slug: 'ufm-benchmark',
    title:
      'Unified Fractal Memory: running a routed model larger than VRAM on a single consumer GPU',
    shortTitle: 'UFM Benchmark (Proof Drop #1)',
    authors: ['Yan Desbiens'],
    date: '2026-06-27',
    type: 'benchmark',
    track: 'memory',
    version: 'v0.1.1',
    repo: 'https://github.com/Linutesto/ufm',
    url: 'https://yandesbiens.com/blog/ufm-benchmark/',
    artifacts: [
      { label: 'Code + one-command repro', href: 'https://github.com/Linutesto/ufm/tree/master/benchmarks' },
      { label: 'Benchmark report', href: '/downloads/ufm-benchmark-report.md' },
      { label: 'Figures', href: '/img/ufm/vram.png' },
    ],
    abstract:
      'We benchmark Unified Fractal Memory (UFM), a residency manager that treats GPU VRAM and CPU RAM as one elastic pool, on a routed Mixture-of-Experts whose expert bank exceeds device memory. On a 23.5 GB RTX 4090, the standard all-on-GPU placement OOMs at a 24 GB bank; UFM runs the same model holding VRAM at 19.6 GB. When the active working set fits the VRAM budget, UFM matches baseline throughput within ~1% and is ~240x faster than naive per-call CPU offloading; when every expert is touched every step (no locality), UFM is transfer-bound and offers no speedup over naive streaming. UFM is a bet on routing locality, not unbounded memory.',
    doi: null,
    reproducible: true,
  },
];

export const getPublication = (id: string) => publications.find((p) => p.id === id);
export const getPublicationBySlug = (slug: string) =>
  publications.find((p) => p.slug === slug);
