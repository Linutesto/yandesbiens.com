// /llms.txt — a curated, markdown map of the lab for LLMs and agents.
// Generated from the canonical data spine so it never drifts from the site.
// Convention: https://llmstxt.org/
import type { APIContext } from 'astro';
import { SITE } from '../data/site';
import { publications } from '../data/publications';
import { projects } from '../data/projects';
import { threads, THESIS } from '../data/research';
import { tracks } from '../data/tracks';

const firstSentence = (s: string, max = 240): string => {
  const m = s.match(/^.*?[.!?](\s|$)/);
  let out = (m ? m[0] : s).trim();
  if (out.length > max) out = out.slice(0, max - 1).trimEnd() + '…';
  return out;
};

export async function GET(context: APIContext) {
  const base = (context.site?.href ?? `${SITE.url}/`).replace(/\/$/, '');
  const abs = (p: string) => `${base}${p}`;
  const pubs = [...publications].sort((a, b) => (a.date < b.date ? 1 : -1));

  const L: string[] = [];
  L.push(`# ${SITE.name} — ${SITE.org}`);
  L.push('');
  L.push(`> ${SITE.description}`);
  L.push('');
  L.push(THESIS);
  L.push('');
  L.push(
    'Solo, local-first AI research on a single RTX 4090 in Québec. The lab ships **proof drops**: ' +
      'small, reproducible benchmarks published with the code, the numbers, and the honest failure case. ' +
      'Person-led (Yan Desbiens — author, first-person voice); entity-backed (Éthiqueia Québec inc. — publisher, IP holder).'
  );
  L.push('');

  L.push('## Proof drops & publications (citable)');
  for (const p of pubs) {
    const repo = p.repo ? ` Code: ${p.repo}.` : '';
    L.push(`- [${p.shortTitle}](${p.url}): ${p.type}, ${p.date}, track ${p.track}. ${firstSentence(p.abstract)}${repo}`);
  }
  L.push('');

  L.push('## Research threads');
  for (const t of threads) {
    L.push(`- **${tracks[t.track].label}** (${t.maturity}) — ${t.evidence} Next: ${t.nextProof}`);
  }
  L.push('');

  L.push('## Projects');
  for (const pr of projects) {
    L.push(`- [${pr.name}](${abs(`/projects/${pr.slug}/`)}): ${pr.tagline} (${pr.status})`);
  }
  L.push('');

  L.push('## Key pages');
  L.push(`- Research program: ${abs('/research')}`);
  L.push(`- Compiler status: ${abs('/status')}`);
  L.push(`- How to cite (BibTeX/APA): ${abs('/cite')}`);
  L.push(`- Timeline: ${abs('/timeline')}`);
  L.push(`- Knowledge graph: ${abs('/graph')}`);
  L.push(`- Blog: ${abs('/blog')}`);
  L.push(`- Newsletter: ${abs('/newsletter')}`);
  L.push('');

  L.push('## How to cite');
  L.push(
    `Citation keys, BibTeX, and APA for every output: ${abs('/cite')}. ` +
      `Author: ${SITE.name}. Publisher: ${SITE.org}. Affiliation line: ${SITE.affiliation}.`
  );
  L.push('');

  L.push('## Feeds & contact');
  L.push(`- All posts (RSS): ${abs('/rss.xml')}`);
  L.push(`- Proof drops (RSS): ${abs('/rss/benchmarks.xml')}`);
  L.push(`- Research (RSS): ${abs('/rss/research.xml')}`);
  L.push(`- Code: ${SITE.github}`);
  L.push(`- Security / disclosure: ${abs('/.well-known/security.txt')}`);
  L.push('');

  return new Response(L.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
