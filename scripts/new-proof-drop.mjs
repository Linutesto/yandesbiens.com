#!/usr/bin/env node
/**
 * new-proof-drop — scaffold every artifact for a proof drop from one command.
 *
 * Usage:
 *   node scripts/new-proof-drop.mjs \
 *     --slug fmm-paging --title "Memory that pages itself" \
 *     --track memory --desc "FMM condensation benchmark" [--issue 2]
 *
 * Creates:
 *   src/content/blog/<slug>.md            (proof-drop blog post, frontmatter wired)
 *   src/content/newsletter/<NNN>-<slug>.md (newsletter issue)
 *   scripts/drafts/<slug>.md              (X / LinkedIn / Reddit social drafts)
 *
 * Then prints the publish checklist. RSS + sitemap update automatically on build.
 */
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TRACKS = ['memory', 'cognition', 'agents', 'training', 'fractal'];

function arg(name, def = '') {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
const slug = arg('slug');
const title = arg('title');
const track = arg('track');
const desc = arg('desc', '');
if (!slug || !title || !track) {
  console.error('Required: --slug <slug> --title "<title>" --track <' + TRACKS.join('|') + '> [--desc "..."] [--issue N]');
  process.exit(1);
}
if (!TRACKS.includes(track)) {
  console.error(`--track must be one of: ${TRACKS.join(', ')}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

// next issue number
const nlDir = join(ROOT, 'src/content/newsletter');
let issue = parseInt(arg('issue', '0'), 10);
if (!issue) {
  const nums = readdirSync(nlDir)
    .map((f) => parseInt(f.match(/^(\d+)/)?.[1] ?? '0', 10))
    .filter(Boolean);
  issue = (nums.length ? Math.max(...nums) : 0) + 1;
}
const issueStr = String(issue).padStart(3, '0');

const blogPath = join(ROOT, 'src/content/blog', `${slug}.md`);
const nlPath = join(nlDir, `${issueStr}-${slug}.md`);
const draftPath = join(ROOT, 'scripts/drafts', `${slug}.md`);

const wrote = [];
function write(path, body) {
  if (existsSync(path)) { console.warn(`! skip (exists): ${path}`); return; }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body);
  wrote.push(path.replace(ROOT + '/', ''));
}

write(blogPath, `---
title: "${title}"
date: ${today}
description: "${desc}"
tags: ["${track}", "benchmark"]
track: ${track}
proofDrop: true
ogImage: /img/${slug}/hero.png
draft: true
---

This is a proof drop. Rule: every claim is reproducible from a one-command script, or it's
marked speculative.

## the claim

> TODO: one sentence, falsifiable.

## the setup

TODO: hardware, model, method. Keep it short.

## the result

![TODO hero figure](/img/${slug}/hero.png)

| metric | baseline | this |
|---|---:|---:|
| TODO | — | — |

## what this shows (and doesn't)

TODO: the honest reading. Include the regime where it fails.

## reproduce it

\`\`\`bash
TODO: one command
\`\`\`

## limitations

- TODO

---

> *Yan Desbiens — work conducted at Éthiqueia Québec inc.*
`);

write(nlPath, `---
title: "${title}"
issue: ${issue}
date: ${today}
description: "${desc}"
track: ${track}
tags: ["${track}"]
draft: true
---

TODO: 120-word recap of the drop. Lead with the result, link the full writeup.

→ **Full writeup, figures, and repro:** [/blog/${slug}/](/blog/${slug}/)

## what's next

TODO.

— Yan

*Research conducted at Éthiqueia Québec inc.*
`);

write(draftPath, `# Social drafts — ${title}

Calibrate every number to the data. Don't round up. Keep the honest limitation.

## X / Twitter
1/ TODO hook + result
2/ method
3/ the honest catch
4/ reproduce: github + yandesbiens.com/blog/${slug}/

## LinkedIn
TODO professional framing, lead with reproducibility, include the limitation.
Repo + writeup links. #AI #MachineLearning #LocalAI #OpenResearch

## r/LocalLLaMA
Title: TODO
Body: setup, table, takeaways incl. failure case, one-command repro.
`);

// Citable publication record — paste into src/data/publications.ts
const pubId = `desbiens${today.slice(0, 4)}${slug.replace(/[^a-z0-9]/gi, '')}`;
write(join(ROOT, 'scripts/drafts', `${slug}.publication.ts.txt`), `// → paste into the publications[] array in src/data/publications.ts
{
  id: '${pubId}',
  slug: '${slug}',
  title: '${title}',
  shortTitle: '${title}',
  authors: ['Yan Desbiens'],
  date: '${today}',
  type: 'benchmark',
  track: '${track}',
  version: 'v0.1.0',
  repo: 'https://github.com/Linutesto/TODO',
  url: 'https://yandesbiens.com/blog/${slug}/',
  artifacts: [
    { label: 'Code + one-command repro', href: 'https://github.com/Linutesto/TODO' },
  ],
  abstract: 'TODO: 3-4 sentence abstract — claim, method, result, honest limitation.',
  doi: null, // mint via Zenodo on release (see RELEASE_CHECKLIST.md), then fill
  reproducible: true,
},
`);

// GitHub release notes draft
write(join(ROOT, 'scripts/drafts', `${slug}.release.md`), `# Release — ${title}

**Proof drop** · track: ${track} · ${today}

## Summary
TODO: one paragraph — what shipped and the headline result.

## Evidence
- Benchmark: /blog/${slug}/
- Repro: \`cd benchmarks && ./run.sh\`
- Figures + logs: results/

## Honest limitations
- TODO

## Cite
See CITATION.cff in this repo, or https://yandesbiens.com/cite/ (id: ${pubId}).

## DOI
Mint via Zenodo on tag (see RELEASE_CHECKLIST.md), then update CITATION.cff + publications.ts.
`);

console.log('\nCreated:');
wrote.forEach((w) => console.log('  + ' + w));
console.log(`\nPublish checklist for "${title}" (issue #${issue}):`);
console.log(`  1. drop figures into  public/img/${slug}/`);
console.log(`  2. write the post + newsletter (remove "draft: true" when ready)`);
console.log(`  3. paste scripts/drafts/${slug}.publication.ts.txt into src/data/publications.ts`);
console.log(`     (this auto-flows to /cite, the post's Cite block, /status, /timeline)`);
console.log(`  4. add "${slug}" to the matching thread's posts[] in src/data/research.ts`);
console.log(`  5. bump that thread's maturity/evidence in src/data/research.ts + RESEARCH_PROGRAM.md`);
console.log(`  6. (optional) add a /projects entry + a /timeline milestone (src/data/timeline.ts)`);
console.log(`  7. npm run build  → verify /blog/${slug}/, /cite/, /status/, rss/benchmarks.xml`);
console.log(`  8. deploy: npx wrangler pages deploy ./dist --project-name yandesbiens --branch main`);
console.log(`  9. GitHub release: use scripts/drafts/${slug}.release.md (see RELEASE_CHECKLIST.md for DOI)`);
console.log(` 10. post the social drafts in scripts/drafts/${slug}.md\n`);
