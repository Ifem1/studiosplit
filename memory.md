# StudioSplit — Project Memory

> This is a **repository-local project memory file**, not model/session memory. Agents should read it from disk. Keep it concise enough to scan, but update it whenever a durable decision changes.

## Project identity

**Name:** StudioSplit  
**Tagline:** Contribution-based ownership splits for collaborative creative work.  
**Core thesis:** StudioSplit converts months of messy off-chain creative collaboration into one auditable, rubric-bound ownership split. Collaborators checkpoint contribution claims against immutable artifact versions. At finalization, VecDB surfaces overlapping claims and related checkpoints. Validators assign fixed contribution bands by dimension; deterministic code normalizes the agreed bands into exactly 10,000 basis points. The model never directly chooses percentages.

### What the system ultimately settles

a project-version-bound contributor ownership/credit split expressed as exactly 10,000 basis points

### Core actors

- project creator
- creative collaborator
- producer/editor
- GenLayer validator
- royalty/credit consumer

## Current status

**Phase:** GitHub-published implementation; runtime/deployment proof pending  
**Code status:** Contract + backendless frontend published on `Ifem1/studiosplit` `main`  
**StudioNet contract:** Not deployed yet  
**Live frontend:** Not deployed yet  
**Last durable update:** 2026-08-25

The first implementing agent must not invent fake deployment addresses, transaction hashes, test counts or live URLs. Add them here only after they exist and have been verified.

## Non-negotiable product boundary

### Off-chain

Media files, DAW sessions, Figma files, video assets and collaboration remain in the tools collaborators already use. StudioSplit does not operate a backend or database. The browser accepts public/intentional evidence references plus digests; only bounded references/claims are committed on-chain.

### On-chain

Project rubric; collaborator registry; checkpoint digests; bounded contribution claims; semantic overlap index; finalization case; agreed contribution bands; deterministic bps split; immutable split receipt.

### Semantic memory

Embed each checkpoint claim from role, artifact version, contribution dimension, bounded description and referenced artifact digest. During finalization, retrieve overlaps for each contributor/dimension pair to highlight duplicate/overlapping claims and longitudinal contribution patterns.

### Consensus question

For each collaborator and rubric dimension, validators choose a fixed band 0-5 based on public checkpoint evidence and retrieved overlaps: NONE, MINOR, SUPPORTING, MATERIAL, LEADING, DEFINING. They also flag DUPLICATIVE/DEPENDENT claims. Deterministic weights from the project rubric convert bands to scores and then normalize all contributors to exactly 10,000 bps.

## Frozen engineering defaults

- StudioNet chain ID: `61999`
- RPC: `https://studio.genlayer.com/api`
- Explorer: `https://explorer-studio.genlayer.com`
- `genlayer-js`: `1.1.8`
- Next.js: `16.3.2`
- React: `19.2.4`
- React DOM: `19.2.4`
- TypeScript: `^5`
- Tailwind: `^4`
- Writes: injected EIP-1193 wallet only
- Backend/database/API service: forbidden
- Server signer: forbidden
- Vector model baseline: `all-MiniLM-L6-v2` / 384 dimensions
- Similarity semantics: retrieval only
- Live data: no silent fixture fallback
- Finality: wait for FINALIZED, then inspect GenVM execution before success
- Persistence: authoritative application state is contract storage + contract-owned VecDB; browser state is ephemeral/local only

## Contract invariants

- Only registered collaborators may checkpoint for themselves.
- Rubric weights freeze when first checkpoint is submitted.
- Final percentages are deterministic normalization of agreed integer bands.
- Split sum must equal exactly 10,000 bps.
- Finalized project cannot accept new checkpoints without explicit new version/reopen workflow.
- Artifact digest is required for every checkpoint.

## Scope lock

### MVP

Up to 8 collaborators, 5 fixed contribution dimensions, public evidence snapshots, checkpointing, semantic overlap recall, consensus band matrix, deterministic normalization to 10,000 bps and exportable split receipt.

### Explicit non-goals

- copyright/legal adjudication
- secret unreleased content in public VecDB
- automatic royalty payment in MVP
- plagiarism detection
- LLM-created percentages

## Known edge cases to preserve during implementation

- Two collaborators claim same edit; overlap is surfaced and validators can mark dependent contributions without zeroing both.
- Contributor has many low-value checkpoints; volume alone cannot dominate because rubric is dimension-based.
- One collaborator refuses finalization; product may still finalize if project charter says creator can request, but the refusal is recorded off-chain.
- All bands are zero due insufficient evidence; ABSTAINED rather than division by zero.
- Release artifact changes after finalization request; digest mismatch requires new finalization.

## UI identity

- Archetype: **analog recording studio + session sheet + mixing console**
- Signature: Each collaborator is a vertical mixer channel. Checkpoints appear as tape markers on a horizontal session timeline. Final bps is shown on a physical-looking split sheet, not a donut chart.
- Fonts: DM Sans for UI; DM Mono for version/hash; Fraunces used sparingly for project titles
- Geometry: horizontal channel strips, fader-like contribution bars, ruled paper areas, 5px radius; no bento cards
- Motion: fader values animate only after finalized split; tape-head cursor for timeline scrubbing

Do not let implementation drift into a generic centered hero + three cards + gradient dashboard. `ui/ux.md` is authoritative.

## Decision log

| Date | Decision | Reason | Supersedes |
|---|---|---|---|
| 2026-08-23 | Keep high-volume activity off-chain and settle bounded authoritative state on GenLayer. | Mirrors the project's central off-chain-work/on-chain-settlement thesis and keeps consensus purposeful. | — |
| 2026-08-23 | Use contract-owned VecDB as semantic recall, never as an automatic verdict. | Similarity is relatedness, not truth. | — |
| 2026-08-23 | Injected wallet is the only write identity. | Matches existing hardened repository behavior and avoids hidden custody. | — |
| 2026-08-23 | Fail closed on missing public evidence or malformed consensus output. | A weak answer must not silently become authoritative state. | — |
| 2026-08-23 | UI follows the project-specific design language in `ui/ux.md`. | The ten projects must be visually and structurally distinct. | — |
| 2026-08-25 | StudioSplit is contract + frontend only; no backend, database, API routes, server cache or server signer. | Owner explicitly locked the product to the same serverless boundary as their other contract-first projects. | Earlier optional Supabase/Hono work-plane plan |

## Source conventions inherited from existing repositories

The implementation plan intentionally follows proven patterns from these owner repositories:

- `ometere123/intent-guard/package.json` — `genlayer-js` 1.1.8, Next.js 16.3.2, React 19.2.4.
- `ometere123/intent-guard/src/components/wallet-provider.tsx` — explicit injected wallet flow, network gating and wallet event handling.
- `ometere123/intent-guard/src/lib/genlayer/contract.ts` — wait for FINALIZED, re-read transaction and inspect GenVM execution.
- `ometere123/scopelock/contracts/scopelock.py` — native `genlayer_embeddings.VecDB`, 384-dimensional `all-MiniLM-L6-v2`, bounded KNN precedent retrieval.
- Owner research, *GenLayer VectorDB + Vector Embeddings* (Aug 2026) — embeddings provide semantic representation, VecDB persistent semantic memory/search, consensus judges meaning; embeddings are not truth or encryption.

## Open decisions

These are allowed to be decided during implementation, but must be recorded here when settled:

- Exact deployed contract address and deployment source commit.
- Exact public hosting URL.
- Whether a second network besides StudioNet is supported after the StudioNet proof is complete.
- Performance limits discovered for the project's actual VecDB population and KNN size.

## Agent continuity rule

At the end of every work session:

1. Ensure `handoff.md` has the most recent factual state.
2. Update this file only for durable decisions/status changes.
3. Do not paste long implementation logs here; keep those in `handoff.md`.
4. Never record secrets, private keys, seed phrases or private source material.
## 2026-08-25 release audit status

The repository was cloned and audited. The real contract/frontend source exists; interrupted `.bootstrap2/part-10` transfer residue was removed. Verified: Python contract compilation, source schema (15/15), direct tests (7 passed, 1 skipped), and frontend source tests (4 passed). `npm install` stalled in the current environment, so dependency-backed typecheck/lint/production build are not claimed. No StudioNet deployment, live transaction evidence, or hosted frontend URL is claimed.

## 2026-08-25 deployment continuation

Frontend dependencies installed successfully. TypeScript, ESLint, Next production build, frontend tests (4 passed), and direct tests (7 passed, 1 skipped) pass. StudioNet deployment is verified from source commit `8ffd51da2524209e3f4df0196cad769d759eb5c0`: contract `0xaABdC3D91E4bb62Ee63A30055113B49C875BAf8b`, deployment tx `0x6c083a0ee80db7da80ff2ddd605befe392e9a323732240fd580a6cf2f564caf5`, schema 15 methods. Read-only smoke returned project_count 0. Live lifecycle and hosted frontend remain unproven; CLI writes with malformed rubric/url were rejected fail-closed.
