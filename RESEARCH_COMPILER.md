# The Research Compiler

Éthiqueia is not a website. It is a **Research Compiler**: a system that turns an idea
into a public, reproducible, citable scientific artifact with minimum friction. The site,
the repos, the pipeline, and the data spine are its passes.

> **North star:** produce *proofs*, not projects. One reproducible proof is worth more than
> ten new ideas. Think in decades. Prefer infrastructure that **composes, documents, and
> preserves** research over spectacular features.

## The lifecycle (the compiler passes)

| # | Stage | Implemented by | Coverage |
|---|-------|----------------|----------|
| 1 | Hypothesis | `research.ts` "next proof needed" per thread | partial |
| 2 | Prototype | project repos (ufm, fmm, …) | partial |
| 3 | Benchmark | one-command harness (`ufm/benchmarks/`) | built |
| 4 | Evidence | telemetry + figures + reproducible `results/` | built |
| 5 | Documentation | benchmark README + `RESEARCH_PROGRAM.md` | built |
| 6 | Publication | `publications.ts` → proof-drop post + `Cite` | built |
| 7 | Distribution | RSS ×4 + newsletter + social drafts | built |
| 8 | Archive | `downloads/` + committed results + GitHub releases | partial |
| 9 | Knowledge graph | `graph.ts` → `/graph` (auto from spine) | built |
| 10 | Citation | `CITATION.cff` + BibTeX (+ DOI via Zenodo) | partial |
| 11 | Research memory | timeline + SR&ED log + `RESEARCH_PROGRAM.md` | built |

Live coverage is shown, always current, on **/status**.

## The single source of truth

The compiler stays coherent because everything downstream of stage 6 is generated from one
registry. Append a record to `src/data/publications.ts` and it propagates automatically to:
`/cite`, the post's citation block, `/status`, `/timeline`, and `/graph`. Add a thread or
project to `research.ts`/`tracks.ts` and the graph + research index update themselves.

```
publications.ts ──┬─► /cite (BibTeX + APA)
                  ├─► blog Cite block
                  ├─► /status (latest + counts)
                  ├─► /timeline (milestone)
                  └─► /graph (node + edges)
```

## Running a pass (one idea → artifact)

```bash
node scripts/new-proof-drop.mjs --slug <slug> --title "…" --track <track> --desc "…"
# fill the post + benchmark; paste the generated publications.ts record
npm run build
npx wrangler pages deploy ./dist --project-name yandesbiens --branch main
```

See `PROOF_DROP_PLAYBOOK.md` (per-drop steps), `RELEASE_CHECKLIST.md` (versioning + DOI),
and `docs/sred/RESEARCH_LOG.md` (evidence trail).

## The honest gaps (next infra to compose, in priority)

1. **First-class hypotheses (stage 1).** Today a "next proof" is a sentence in `research.ts`.
   Make it a typed record (open question → predicted result → status) so a hypothesis can be
   opened, then *closed by* a proof drop. Closes the loop at the front of the compiler.
2. **Release + DOI archive (stages 8/10).** Tag releases, connect Zenodo, mint DOIs. Rails
   exist (`RELEASE_CHECKLIST.md`); needs accounts + a stabilized output.
3. **Prototype as a first-class pass (stage 2).** Link each project node to the hypothesis it
   tests and the benchmark that judges it.

Everything else is built. The next *work* is not more infrastructure — it is the next
**proof** (FMM is queued), which the compiler will turn into all of the above for free.
