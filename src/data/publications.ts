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
