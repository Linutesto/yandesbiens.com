// Citation formatters. One Publication -> BibTeX / APA / plain text.
// Keep deterministic and dependency-free so any artifact can render its own
// "how to cite" block, and so a DOI can be slotted in later without churn.
import { ORG, type Publication } from './publications';

const year = (iso: string) => iso.slice(0, 4);

export function toBibTeX(p: Publication): string {
  const fields: [string, string | undefined][] = [
    ['title', `{${p.title}}`],
    ['author', p.authors.join(' and ')],
    ['year', year(p.date)],
    ['howpublished', `{\\url{${p.url}}}`],
    ['institution', `{${ORG}}`],
    ['version', p.version],
    ['note', p.doi ? `{DOI: ${p.doi}}` : `{Reproducible benchmark, ${ORG}}`],
    ['url', p.url],
    ['doi', p.doi ?? undefined],
  ];
  const body = fields
    .filter(([, v]) => v)
    .map(([k, v]) => `  ${k} = ${v!.startsWith('{') ? v : `{${v}}`},`)
    .join('\n');
  return `@misc{${p.id},\n${body}\n}`;
}

export function toAPA(p: Publication): string {
  const authors = p.authors
    .map((a) => {
      const parts = a.trim().split(' ');
      const last = parts.pop()!;
      const initials = parts.map((n) => n[0] + '.').join(' ');
      return `${last}, ${initials}`;
    })
    .join(', ');
  const v = p.version ? ` (${p.version})` : '';
  const doi = p.doi ? ` https://doi.org/${p.doi}` : ` ${p.url}`;
  return `${authors} (${year(p.date)}). ${p.title}${v}. ${ORG}.${doi}`;
}

export function toPlain(p: Publication): string {
  return `${p.authors.join(', ')}. "${p.title}." ${ORG}, ${year(p.date)}. ${p.doi ? `DOI: ${p.doi}` : p.url}`;
}
