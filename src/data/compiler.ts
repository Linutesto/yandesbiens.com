// The Research Compiler — the lab's operating model.
// It maps the full lifecycle of an idea to the concrete system that implements
// each stage, and marks honest coverage (built / partial / gap). This is how we
// minimize friction between a discovery and a public scientific artifact.
export type StageStatus = 'built' | 'partial' | 'gap';

export type Stage = {
  n: number;
  name: string;
  system: string; // what implements it today
  status: StageStatus;
  href?: string;
};

export const lifecycle: Stage[] = [
  { n: 1, name: 'Hypothesis', system: 'research.ts "next proof needed" per thread', status: 'partial', href: '/research' },
  { n: 2, name: 'Prototype', system: 'project repos (ufm, fmm, …)', status: 'partial', href: '/graph' },
  { n: 3, name: 'Benchmark', system: 'one-command harness (e.g. ufm/benchmarks)', status: 'built' },
  { n: 4, name: 'Evidence', system: 'telemetry + figures + reproducible results/', status: 'built' },
  { n: 5, name: 'Documentation', system: 'benchmark README + RESEARCH_PROGRAM.md', status: 'built' },
  { n: 6, name: 'Publication', system: 'publications.ts → proof-drop post + Cite', status: 'built', href: '/cite' },
  { n: 7, name: 'Distribution', system: 'RSS ×4 + newsletter + social drafts', status: 'built', href: '/newsletter' },
  { n: 8, name: 'Archive', system: 'downloads/ + committed results + releases', status: 'partial', href: '/resources' },
  { n: 9, name: 'Knowledge graph', system: 'graph.ts → /graph (auto from spine)', status: 'built', href: '/graph' },
  { n: 10, name: 'Citation', system: 'CITATION.cff + BibTeX (DOI pending Zenodo)', status: 'partial', href: '/cite' },
  { n: 11, name: 'Research memory', system: 'timeline + SR&ED log + RESEARCH_PROGRAM', status: 'built', href: '/timeline' },
];

export const compilerThesis =
  'Éthiqueia is a Research Compiler: it turns an idea into a public, reproducible, citable artifact with minimum friction. Every proof drop runs the same pipeline, so each result becomes a permanent scientific asset the next one builds on.';
