# Release & DOI Checklist

How a proof drop becomes a versioned, permanently citable release with a DOI.
The rails are in place now; mint DOIs when an output stabilizes — never before.

## One-time setup (do once, when ready)

1. **ORCID** — create an iD at https://orcid.org. Add it to every `CITATION.cff`
   (`orcid:` line, currently commented) and to `src/data/site.ts` if desired.
2. **Zenodo ↔ GitHub** — sign in to https://zenodo.org with GitHub, then flip the
   toggle "on" for the repos you want archived (`ufm`, `fmm`, …). Zenodo will mint a
   DOI automatically on every GitHub *release*.
3. (Optional) Add the Zenodo "concept DOI" badge to each repo README.

## Per release (per proof drop that stabilizes)

1. Finalize the benchmark + blog post; ensure `benchmarks/` reproduces clean.
2. Bump version in `pyproject.toml`, `__init__.py`, and `CITATION.cff` (`version`, `date-released`).
3. Tag + push:
   ```bash
   git tag -a v0.1.2 -m "UFM v0.1.2 — <headline>" && git push origin v0.1.2
   ```
4. Create the GitHub release using `scripts/drafts/<slug>.release.md`.
   → Zenodo mints a **version DOI** + a stable **concept DOI**.
5. Backfill the DOI:
   - `CITATION.cff`: add `doi:` and an `identifiers:` block.
   - `src/data/publications.ts`: set `doi: '10.5281/zenodo.XXXXXXX'` for the entry.
     (This auto-updates /cite, the post's Cite block, and /status — "DOI pending" → real DOI.)
6. Rebuild + deploy the site:
   ```bash
   npm run build && npx wrangler pages deploy ./dist --project-name yandesbiens --branch main
   ```

## What's already wired (no action needed)

- `publications.ts` carries a `doi` field (currently `null` → renders "DOI pending").
- `CITATION.cff` ships in `ufm`, `fmm`, and the lab repo (GitHub "Cite this repository").
- `/cite` renders BibTeX + APA for every output and slots a DOI in automatically.
- `scripts/new-proof-drop.mjs` emits a `*.release.md` draft and a `*.publication.ts.txt` snippet.

## Integrity rule

A DOI points at a frozen, reproducible artifact. Only mint once the repo state behind
the claim is tagged and the benchmark reproduces from that tag. No DOIs for drafts.
