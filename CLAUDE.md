# CLAUDE.md — Éthiqueia Research Compiler (yandesbiens.com)

This repo is not a portfolio. It is the **Research Compiler** for the independent AI research
lab **Éthiqueia Québec inc.** — it turns an idea into a public, reproducible, citable
scientific artifact with minimum friction. Read `RESEARCH_COMPILER.md` for the full model.

## Operating principles (non-negotiable)

- **Evidence over hype.** Every performance claim is reproducible from a one-command script,
  or it is explicitly marked *speculative*. Never manufacture conclusions. Publish the failure
  case — the regime where something *doesn't* work is part of the result.
- **Proofs over projects.** One reproducible proof > ten new ideas. The next step is almost
  always the next *proof drop*, not more features.
- **Compose, document, preserve** > spectacular features. Think in decades.
- Act like a lab colleague, not a code generator.

## Brand architecture

- **Yan Desbiens** = public face / author / byline / narrative voice ("I built…").
- **Éthiqueia Québec inc.** = the lab / publisher / IP holder. Footer: `© Éthiqueia Québec inc.`
  Affiliation line: *Yan Desbiens — Éthiqueia Québec inc., Québec, Canada.*
- Centralized in `src/data/site.ts`.

## Naming rules (locked 2026-06-27)

- **NeuroArch** is the primary name for the cognitive-architecture thread. Do NOT use *Hermes*
  as the primary reference — Hermes is only the competent agent *substrate* NeuroArch runs on.
  (`/projects/hermes` 301-redirects to `/projects/neuroarch` via `public/_redirects`.)
- **OpenPaw is not an original research contribution / not a pillar.** Keep it off forward-facing
  surfaces (a single demoted "background tooling" mention in `research.ts` lineage is the max).
- **Lab pillars:** NeuroArch, UFM, FMM, Fractal Neurons, YSON/QJSON, ForgeLM, AEON, the
  benchmarks, memory architectures, cognitive systems, local-first AI.

## The data spine (single source of truth)

`src/data/` is canonical. Add data there; pages derive from it (never hand-maintain edges).

- `tracks.ts` — the 5 research tracks (memory, cognition, agents, training, fractal).
- `research.ts` — threads: lineage, projects, maturity, evidence, next proof. Powers `/research`.
- `publications.ts` — **citable outputs registry.** Append one entry and it auto-flows to
  `/cite`, the blog Cite block, `/status`, `/timeline`, and `/graph`. Citation key = `desbiensYYYYkey`.
- `cite.ts` — BibTeX/APA/plain formatters.
- `timeline.ts` — program evolution → `/timeline`.
- `graph.ts` — builds the knowledge graph from tracks+research+publications → `/graph`.
- `compiler.ts` — the 11 lifecycle stages + live coverage → `/status`.
- `projects.ts` — project cards/pages. `site.ts` — SEO/identity/analytics token.

## Pages

`/` `/research` `/status` `/timeline` `/graph` `/cite` `/newsletter` `/resources` `/blog/*`
`/projects/*`. RSS: `/rss.xml`, `/rss/benchmarks.xml`, `/rss/research.xml`, `/rss/newsletter.xml`.
Server bits are Cloudflare Pages Functions in `functions/api/` (`chat.ts`, `subscribe.ts`) —
NOT part of the Astro build.

## Content schemas

Blog frontmatter: `title, date, description, tags[], track?, proofDrop?, ogImage?, draft?`.
Newsletter: `title, issue, date, description, track?, tags[], draft?`. Schema in `src/content.config.ts`.

## Commands

```bash
npm run build            # Astro static build -> dist/
npm run dev              # local dev
# Ship a proof drop (scaffolds blog + newsletter + publication record + release notes + social):
node scripts/new-proof-drop.mjs --slug <slug> --title "…" --track <track> --desc "…"
```

### Deploy (IMPORTANT)

```bash
# Production branch is `main`; local git branch is `master`. ALWAYS pass --branch main,
# or the deploy lands on a Preview env and production functions go stale.
unset CLOUDFLARE_API_TOKEN          # use OAuth (npx wrangler login) — it has pages:write
npx wrangler pages deploy ./dist --project-name yandesbiens --branch main --commit-dirty=true
```

KV namespaces: `CHAT_RL` (chat rate-limit), `SUBSCRIBERS` (newsletter; keys `sub:<email>`).

## How to ship a proof drop (the compiler loop)

1. Build the benchmark in `<repo>/benchmarks/` (one-command `run.sh`, telemetry, OOM/failure
   capture, figures). Run it on real hardware — never fabricate numbers.
2. `node scripts/new-proof-drop.mjs …` → fill the post; paste the generated `publications.ts` record.
3. Copy figures to `public/img/<slug>/`. Add a `/timeline` milestone; add the post id to the
   thread's `posts[]` and bump its maturity/evidence in `research.ts` (+ `RESEARCH_PROGRAM.md`).
4. `npm run build`; verify `/blog/<slug>/`, `/cite/`, `/status/`, `/graph/`, `/rss/benchmarks.xml`.
5. Deploy (`--branch main`). Tag a GitHub release per `RELEASE_CHECKLIST.md`; log SR&ED evidence
   in `docs/sred/RESEARCH_LOG.md`. Post the drafts in `scripts/drafts/<slug>.md`.

## Reference docs

`RESEARCH_COMPILER.md` (operating model) · `RESEARCH_PROGRAM.md` (the program) ·
`PROOF_DROP_PLAYBOOK.md` (per-drop steps) · `RELEASE_CHECKLIST.md` (versioning + DOI) ·
`docs/sred/RESEARCH_LOG.md` (evidence trail) · `ARCHAEOLOGY_REPORT.md` (the dig).

Sister repos (separate git): `/home/yan/ufm`, `/home/yan/fmm` (libraries, MIT, with CITATION.cff).
