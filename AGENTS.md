# AGENTS.md — operating manual for yandesbiens.com

You are working on **yandesbiens.com**, the public website and **Research Compiler** for the
independent AI research lab **Éthiqueia Québec inc.** (public face: **Yan Desbiens**). This file
is your complete brief — read it fully before acting. It is written so an agent starting cold can
manage the site end to end: edit content, ship a proof drop, and deploy to production.

> Companion docs in this repo, read as needed: `CLAUDE.md` (same operating manual, terser),
> `RESEARCH_COMPILER.md` (the operating model), `RESEARCH_PROGRAM.md` (the program/lab map),
> `PROOF_DROP_PLAYBOOK.md` (per-drop steps), `RELEASE_CHECKLIST.md` (versioning + DOI),
> `docs/sred/RESEARCH_LOG.md` (the SR&ED evidence trail).

---

## 0. Operating principles (non-negotiable)

- **Evidence over hype.** Every performance claim is reproducible from a one-command script, or it
  is explicitly marked *speculative*. Never manufacture conclusions. Publish the failure case.
- **Proofs over projects.** One reproducible proof > ten new ideas. The next step is usually the
  next *proof drop* or *devlog*, not more features.
- **Compose, document, preserve** > spectacular features. Think in decades. Act like a lab
  colleague, not a code generator.
- **Do not invent achievements or exaggerate benchmarks.** Document what actually happened.

---

## 1. Brand + naming rules (locked)

- **Yan Desbiens** = public face / author / first-person voice ("I built…").
- **Éthiqueia Québec inc.** = the lab / publisher / IP holder. Footer: `© Éthiqueia Québec inc.`
  Affiliation line: *Yan Desbiens — Éthiqueia Québec inc., Québec, Canada.* Centralized in
  `src/data/site.ts`.
- **NeuroArch** is the primary name for the cognitive-architecture thread. Do **not** use *Hermes*
  as the primary reference (Hermes = the agent *substrate* NeuroArch runs on). `/projects/hermes`
  301-redirects to `/projects/neuroarch` via `public/_redirects`.
- **OpenPaw is not a pillar** — keep it off forward-facing surfaces (one demoted "background tooling"
  mention max).
- Lab pillars: NeuroArch, UFM, FMM, Fractal Neurons, YSON/QJSON, ForgeLM, AEON, the benchmarks,
  memory architectures, cognitive systems, local-first AI.

---

## 2. Stack + key facts

- **Location:** `/home/yan/yandesbiens` (run all commands from here).
- **Stack:** Astro 5 (static output) + React islands. JetBrains Mono. Terminal/hacker aesthetic:
  green-on-near-black with a pink (`#ff5fd1`) accent, CRT scanlines.
- **Host:** Cloudflare Pages, project name **`yandesbiens`**, account **yand@outlook.fr**
  (account ID `c114e3170dd7fbc2de75d9be1a3e7edd`, in `wrangler.toml`). Live at
  https://yandesbiens.com (+ www) and https://yandesbiens.pages.dev.
- **Git:** local branch is **`master`**; the Cloudflare **production branch is `main`**. There is
  **no GitHub remote** — the site is published *only* by `wrangler pages deploy`. Do not look for an
  `origin`. (The sister library repos `ufm`/`fmm`/`aeon-living-worlds` are separate and *do* live on
  GitHub under `Linutesto`.)
- **Server bits** are Cloudflare **Pages Functions** in `functions/api/` (`chat.ts` = rate-limited
  Workers AI chat demo; `subscribe.ts` = newsletter capture). These are **not** part of the Astro
  build. KV namespaces (in `wrangler.toml`): `CHAT_RL` (chat rate-limit), `SUBSCRIBERS` (newsletter,
  keys `sub:<email>`). Secret `CF_AI_TOKEN` is a Pages secret, not in the repo.

---

## 3. The data spine — single source of truth (`src/data/`)

Add data **here**; pages derive from it. Never hand-maintain derived things like graph edges.

- `tracks.ts` — the 5 research tracks (`memory`, `cognition`, `agents`, `training`, `fractal`).
- `research.ts` — threads: lineage, projects, maturity, evidence, next proof, `posts[]` (blog ids).
  Powers `/research`.
- `publications.ts` — **the citable-output registry** (benchmarks/"proof drops"). Append one entry
  and it auto-flows to `/cite`, the blog post's Cite block, `/status`, `/timeline`, and `/graph`.
  Citation key format: `desbiensYYYYkey`. **Only put real, reproducible, citable outputs here.**
- `cite.ts` — BibTeX / APA / plain formatters.
- `timeline.ts` — program milestones → `/timeline`.
- `graph.ts` — builds the knowledge graph from tracks + research + publications → `/graph`
  (derives automatically; never drifts).
- `compiler.ts` — the 11 lifecycle stages + live coverage → `/status`.
- `projects.ts` — project cards/pages (`/projects/<slug>`). Has an optional `links?: {label,href}[]`
  field rendered as a `// links` section, and `featured?: true` (gets the live 3D embed — only AEON).
- `site.ts` — SEO / identity / brand / analytics token.

---

## 4. Pages + content

Pages: `/` `/research` `/status` `/timeline` `/graph` `/cite` `/newsletter` `/resources`
`/blog/*` `/projects/*`. RSS: `/rss.xml`, `/rss/benchmarks.xml`, `/rss/research.xml`,
`/rss/newsletter.xml`. Schemas live in `src/content.config.ts`.

- **Blog** frontmatter: `title, date, description, tags[], track?, proofDrop?, ogImage?, draft?`.
  Files in `src/content/blog/*.md`. The layout adds `BlogPosting` JSON-LD, OG, keyword tags
  automatically. A `track` shows a track badge linking to `/research#<track>`.
- **Newsletter** frontmatter: `title, issue, date, description, track?, tags[], draft?`. Files in
  `src/content/newsletter/NNN-slug.md`.

---

## 5. Commands

```bash
npm run build      # Astro static build -> dist/
npm run dev        # local dev server
# Scaffold every artifact for a proof drop (blog + newsletter + publication record + drafts):
node scripts/new-proof-drop.mjs --slug <slug> --title "…" --track <track> --desc "…" [--issue N]
```

---

## 6. DEPLOY — read carefully, this is the part that bites

The production branch is **`main`** but the local git branch is **`master`**. A plain deploy lands on
a **Preview** env and **production Functions go stale** (e.g. `/api/subscribe` 405 on prod). You
**must** pass `--branch main`.

```bash
cd /home/yan/yandesbiens
npm run build                       # always rebuild first; deploy ships ./dist
unset CLOUDFLARE_API_TOKEN          # force OAuth — the saved API token LACKS pages:write
npx wrangler pages deploy ./dist --project-name yandesbiens --branch main --commit-dirty=true
```

- **Auth is OAuth**, logged in as **yand@outlook.fr**. If wrangler is not authenticated, run
  `npx wrangler login` once (interactive, opens a browser) and pick that account — **not** the gmail
  account. The API token in the secret store only has read scopes for Pages and will fail the upload.
- After deploy, the main domain is Cloudflare-proxied and **edge-cached** — a changed page can take a
  moment to propagate, or check the per-deploy `https://<hash>.yandesbiens.pages.dev` URL printed by
  wrangler to see changes immediately.
- DNS is managed in the Cloudflare dashboard (OAuth scope can't edit DNS records); you won't touch it.

---

## 7. How to ship a proof drop (the compiler loop)

A **proof drop** = a benchmarked, citable result. (For an engineering write-up with no citable
benchmark, ship a **devlog** instead — see §8.)

1. Build/refresh the benchmark in the relevant **sister repo** (`<repo>/benchmarks/`) with a
   one-command `run.sh`, telemetry, honest failure-case capture, and figures. **Run it on real
   hardware — never fabricate numbers.**
2. `node scripts/new-proof-drop.mjs …` → fill in the generated blog post + newsletter; paste the
   generated record into `src/data/publications.ts` (fix the repo/version/abstract).
3. Copy figures into `public/img/<slug>/`. Add a `/timeline` milestone (`timeline.ts`); add the post
   id to the thread's `posts[]` in `research.ts` and bump its `maturity`/`evidence`/`nextProof`
   (mirror in `RESEARCH_PROGRAM.md`).
4. `npm run build`; verify `/blog/<slug>/`, `/cite/`, `/status/`, `/graph/`, `/rss/benchmarks.xml`.
5. Deploy (§6). Then: tag a GitHub release in the sister repo per `RELEASE_CHECKLIST.md`; log an
   SR&ED entry in `docs/sred/RESEARCH_LOG.md`; post the social copy from `scripts/drafts/<slug>.md`.

To add a publication later: append one entry to `publications.ts` → it auto-flows everywhere.

---

## 8. Proof drop vs devlog — keep the registry honest

This distinction protects credibility. Get it right.

- **Proof drop** = reproducible, benchmarked, citable. Set `proofDrop: true` in the post **and** add a
  `publications.ts` entry. The post then shows the "proof drop" badge + a Cite block; it appears in
  `/cite`, `/status`, `/graph`, `/timeline`.
- **Devlog / article** = engineering log, narrative, or update with **no** citable benchmark. Do **not**
  set `proofDrop`, and do **not** add a `publications.ts` entry. It renders as a normal post (a `track`
  badge only) with no false citation. Example already in the repo:
  `src/content/blog/aeon-liquid-brain-stability.md`. Cognition/world-model work (NeuroArch, AEON) is
  framed as **engineering, not benchmarked claims** — devlogs, not proof drops, until something is
  actually measured.

---

## 9. Verify before you deploy

```bash
npm run build
# the new/changed page exists and key surfaces picked it up:
test -f dist/blog/<slug>/index.html && echo ok
grep -c "<slug>\|<CitationKey>" dist/cite/index.html dist/status/index.html dist/rss/benchmarks.xml
grep -oE '<title>[^<]*</title>' dist/blog/<slug>/index.html   # SEO title sanity
```

Confirm internal links resolve (the target `dist/.../index.html` exists), the right badge shows
(proof-drop vs track), and — for a devlog — that **no** Cite block / proof-drop badge rendered.

---

## 10. Gotchas already paid for (don't rediscover them)

- **`--branch main` on deploy** (see §6). The single most important thing.
- **No git remote** for this repo; never try to `git push` it. Deploy = wrangler.
- **OAuth, not the API token**, for deploy; `unset CLOUDFLARE_API_TOKEN` first.
- **Astro eats a literal `//` inside a JSX expression** — `{cond && (<><h2>// links</h2>…</>)}`
  dropped the heading. Use `<h2>{'// links'}</h2>` (string expression) for any `//`-prefixed text
  inside `{…}`.
- **Commit messages:** end with `Co-Authored-By:` only if your harness requires it; this repo's
  history uses `Yan Desbiens <yandesbiens420@gmail.com>` — set `git config user.name/email` locally
  if git complains about identity.
- **Don't touch** `functions/api/*` rate-limit/KV logic casually; the chat demo bans hard (3 msgs per
  hardware fingerprint, then 7-day ban) by design.

---

## 11. Sister repos (separate git, on GitHub/Linutesto)

These hold the *code + benchmarks* behind the proof drops; the website only links to them.

- `/home/yan/ufm` → github.com/Linutesto/ufm (Unified Fractal Memory, MIT)
- `/home/yan/fmm` → github.com/Linutesto/fmm (Fractal Memory, MIT)
- `/home/yan/aeon` → github.com/Linutesto/aeon-living-worlds (AEON, PolyForm Noncommercial).
  Note: AEON's local default branch is `release/aeon-living-worlds-public-prep`; its **public branch
  is `main`** (push with `git push origin HEAD:main`). Stage specific files — never `git add -A`
  there (its working tree carries other in-progress work + local-only tooling).

---

## 12. Your job, in one line

Keep yandesbiens.com an honest, well-linked, crawlable, reproducible record of the research program.
Improve only where it genuinely helps. When you ship something, **build, verify, deploy with
`--branch main`, and confirm it live.** Evidence over hype, always.
