# Proof-Drop Playbook

How to ship one result as a compounding set of artifacts. The goal: **one experiment →
weeks of content**, every claim reproducible or marked speculative.

## The pipeline

```
benchmark/result
      ↓  scaffold
blog post (proof drop) ── auto ──► rss.xml + rss/benchmarks.xml + rss/research.xml
      ↓                                     + sitemap
newsletter issue ───────── auto ──► rss/newsletter.xml
      ↓
social drafts (X / LinkedIn / Reddit)
      ↓
research index update (thread maturity + posts[])
      ↓
project page update (optional)
      ↓
lead-magnet report (optional, /resources)
```

## One command to scaffold

```bash
node scripts/new-proof-drop.mjs \
  --slug fmm-paging \
  --title "Memory that pages itself" \
  --track memory \
  --desc "FMM condensation benchmark"
```

This creates (as drafts):
- `src/content/blog/<slug>.md` — proof-drop post, frontmatter wired (`track`, `proofDrop`, `ogImage`)
- `src/content/newsletter/<NNN>-<slug>.md` — newsletter issue (auto-incremented number)
- `scripts/drafts/<slug>.md` — X / LinkedIn / Reddit drafts

## Then (the checklist the script prints)

1. Drop figures into `public/img/<slug>/` (hero image = the OG card).
2. Write the post + newsletter; delete `draft: true` when ready.
3. Add `<slug>` to the matching thread's `posts[]` in `src/data/research.ts`.
4. Bump that thread's `maturity` + `evidence` in `src/data/research.ts` **and** `RESEARCH_PROGRAM.md`.
5. (Optional) add/update a `/projects` entry in `src/data/projects.ts`.
6. (Optional) add a downloadable report to `public/downloads/` + list it in `src/pages/resources.astro`.
7. `npm run build` — verify `/blog/<slug>/`, `/newsletter/`, `/rss.xml`, `/rss/benchmarks.xml`.
8. Deploy: `npx wrangler pages deploy ./dist --project-name yandesbiens` (OAuth: `npx wrangler login`).
9. Post the drafts in `scripts/drafts/<slug>.md`.

## Frontmatter reference

**Blog** (`src/content/blog/*.md`):
```yaml
title, date, description, tags: []
track: memory | cognition | agents | training | fractal   # puts it in the research feed
proofDrop: true        # puts it in rss/benchmarks.xml + adds the badge
ogImage: /img/<slug>/hero.png
draft: true            # hidden from build until removed
```

**Newsletter** (`src/content/newsletter/*.md`): `title, issue, date, description, track, tags, draft`.

## The standards (non-negotiable)

- Every performance claim is reproducible from a one-command script in-repo, or tagged speculative.
- Publish the failure case. The regime where it *doesn't* work is part of the result.
- Numbers are calibrated to the data — never rounded up for effect.
- Byline: **Yan Desbiens**. Affiliation: **Éthiqueia Québec inc., Québec, Canada**.

## Capture & analytics

- Signups POST to `/api/subscribe` (Cloudflare Pages Function) → KV `SUBSCRIBERS`.
  Export later with `wrangler kv key list --binding SUBSCRIBERS`.
- Analytics: set `cfAnalyticsToken` in `src/data/site.ts` to the Cloudflare Web Analytics
  beacon token (cookieless). Zone-level traffic is already in the Cloudflare dashboard.
