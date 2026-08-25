# StudioSplit — Project Plan

## Mission

Build **StudioSplit** into a complete contract + frontend product, using the specifications in this folder as the source of truth.

StudioSplit converts months of messy off-chain creative collaboration into one auditable, rubric-bound ownership split. Collaborators checkpoint contribution claims against immutable artifact versions. At finalization, VecDB surfaces overlapping claims and related checkpoints. Validators assign fixed contribution bands by dimension; deterministic code normalizes the agreed bands into exactly 10,000 basis points. The model never directly chooses percentages.

## MVP target

Up to 8 collaborators, 5 fixed contribution dimensions, public evidence snapshots, checkpointing, semantic overlap recall, consensus band matrix, deterministic normalization to 10,000 bps and exportable split receipt.

## Planning principles

1. Do not build the UI first and retrofit a weak contract.
2. Do not build consensus before deterministic state/version/size guards.
3. Do not store high-frequency work on-chain simply because it is easy to model.
4. Do not turn VecDB into a classifier. It is context retrieval.
5. Do not call a deployment “done” until a real StudioNet lifecycle is exercised.
6. Do not create fake fallback data in live mode.
7. Every meaningful work unit updates `handoff.md` immediately.
8. When a durable decision changes, update `memory.md` in the same work unit.

## Reference demo the implementation must support

Create a song/video project with four collaborators, add checkpoints across writing/editing/design/production, intentionally overlap two claims, request finalization, inspect semantic overlap, reach band matrix, normalize to 10,000 bps and export a signed credit sheet.

## Phase 0 — Repository and truth scaffold

- Create the recommended repository tree.
- Copy these blueprint docs verbatim first; do not rewrite them from memory.
- Add package manifests with pinned baseline versions.
- Add `.env.example` with StudioNet variables and no secrets.
- Create a placeholder README that explicitly says not deployed yet.
- Initialize `handoff.md` workflow and commit.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 1 — Deterministic contract skeleton

- Add dependency header and imports.
- Implement storage dataclasses, enums and counters.
- Implement create/register deterministic methods and view methods.
- Implement all size, role, namespace and version guards.
- Write direct tests for creation, invalid inputs, ownership, pagination and forbidden transitions.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 2 — Semantic memory

- Add the project-specific `VectorPointer`.
- Implement normalized embedding text exactly around: Embed each checkpoint claim from role, artifact version, contribution dimension, bounded description and referenced artifact digest. During finalization, retrieve overlaps for each contributor/dimension pair to highlight duplicate/overlapping claims and longitudinal contribution patterns.
- Insert only invariant-approved records.
- Implement bounded KNN + namespace/version filters.
- Expose a preview view for testing/audit.
- Add tests proving a semantically related but out-of-namespace record cannot authorize anything.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 3 — Consensus path

- Define strict decision envelope and allowed enums.
- Implement leader logic for: For each collaborator and rubric dimension, validators choose a fixed band 0-5 based on public checkpoint evidence and retrieved overlaps: NONE, MINOR, SUPPORTING, MATERIAL, LEADING, DEFINING. They also flag DUPLICATIVE/DEPENDENT claims. Deterministic weights from the project rubric convert bands to scores and then normalize all contributors to exactly 10,000 bps.
- Implement independent validator reasoning rather than format-only validation.
- Treat fetched evidence as hostile/untrusted data.
- Add deterministic post-consensus validation.
- Add explicit abstain/failure path.
- Forge incorrect leader outputs in tests and prove rejection.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 4 — Browser evidence preparation

- Do not create a backend, database, API route, server signer or object-store integration.
- Implement bounded public URL + digest inputs in the frontend.
- Keep draft/form state browser-only and non-authoritative.
- Make fixture mode explicit; live mode reads only chain state.

**Exit gate:** repository contains no server/database path and browser inputs bind exactly to contract arguments.
## Phase 5 — GenLayer web client

- Implement config/client/read-client modules.
- Implement injected-wallet provider and network gate.
- Implement typed contract reads and schema verification.
- Implement write helper and FINALIZED + GenVM execution check.
- Implement one live/fixtures boundary; production live mode never silently falls back.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 6 — Distinct frontend

- Implement the visual archetype: analog recording studio + session sheet + mixing console.
- Build routes around domain records, not generic cards.
- Build the semantic-memory context view.
- Build the transaction rail and authoritative receipt.
- Implement responsive/mobile behavior.
- Implement all empty/error/abstain states from `ui/ux.md`.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 7 — Integration and adversarial testing

- Wire browser-reviewed public artifact URL + digest inputs to contract submission.
- Verify every frontend-required contract method against schema.
- Run deterministic/direct suites.
- Run wallet-session regressions.
- Test malformed RPC/contract data.
- Test missing evidence, stale version and forged consensus output.
- Run production build/typecheck/lint.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 8 — StudioNet proof

- Deploy a frozen source commit to StudioNet.
- Record address and deployment tx.
- Verify deployed source/schema.
- Execute the reference demo with real transactions.
- Capture at least one live consensus success.
- Capture at least one fail-closed/abstain path where feasible.
- Re-read all final state from chain.
- Update handoff/memory with exact facts only.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 9 — Release hardening

- Deploy hosted frontend in live mode.
- Exercise one write from hosted UI.
- Audit all copy for fabricated/unproven claims.
- Confirm no generated/local private-key path exists.
- Confirm repository has no backend/API/database path and no signer secret.
- Run accessibility/responsive pass.
- Freeze release tag/commit and create reviewer-oriented deployment evidence.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.


## Workstreams and ownership

| Workstream | Primary outputs | Release blocker? |
|---|---|---|
| Intelligent Contract | State machine, VecDB, consensus, views | Yes |
| Direct/testing | Invariants, forged leader rejection, ABI/schema | Yes |
| Web3 client | Injected wallet, reads/writes/finality | Yes |
| UI/UX | Domain-specific routes and states | Yes |
| StudioNet proof | Deployment + live transaction evidence | Yes |
| Documentation | Handoff, memory, deployment truth | Yes |

## Contract milestone checklist

- Implement and test `create_project(name, charter_url, charter_digest, rubric_json) -> project_id`.
- Implement and test `add_collaborator(project_id, wallet, role_label)`.
- Implement and test `submit_checkpoint(project_id, artifact_url, artifact_digest, dimension_code, contribution_text) -> checkpoint_id`.
- Implement and test `request_finalization(project_id, release_artifact_url, release_digest) -> finalization_id`.
- Implement and test `adjudicate_finalization(finalization_id) -> band matrix + split`.
- Implement and test `cancel_finalization(finalization_id)`.
- Implement and test `get_project_count()` and `list_projects(start, limit)` for backendless discovery.
- Implement and test `get_project(project_id)` and `list_collaborators(project_id)`.
- Implement and test `get_checkpoint(checkpoint_id)` and `list_checkpoints(project_id, start, limit)`.
- Implement and test `get_finalization(finalization_id)`.
- Implement and test `get_split(project_id)`.
- Implement and test `preview_overlaps(project_id, collaborator, dimension, k)`.

## Invariant checklist

- Test: Only registered collaborators may checkpoint for themselves.
- Test: Rubric weights freeze when first checkpoint is submitted.
- Test: Final percentages are deterministic normalization of agreed integer bands.
- Test: Split sum must equal exactly 10,000 bps.
- Test: Finalized project cannot accept new checkpoints without explicit new version/reopen workflow.
- Test: Artifact digest is required for every checkpoint.

## UX milestone checklist

- Build and verify: Project tape.
- Build and verify: Collaborator lanes.
- Build and verify: Checkpoint recorder.
- Build and verify: Artifact version room.
- Build and verify: Overlap matrix.
- Build and verify: Final split desk.
- Build and verify: Credit receipt.
- Build and verify: Release archive.

## Risk register

| Risk | Early signal | Mitigation |
|---|---|---|
| Consensus prompts too large | timeouts/rotation spikes | lower KNN/evidence bounds; split cases |
| VecDB namespace contamination | irrelevant candidates | deterministic namespace/version filters |
| Wrong-chain wallet writes | user wallet not 61999 | write gate in UI and client helper |
| Finalized rollback shown as success | receipt-only logic | inspect GenVM execution |
| UI drifts generic | component-kit/default template | enforce `ui/ux.md` screenshot review |
| Public evidence disappears | validator fetch failures | immutable/content-addressed refs + abstain |
| Runtime API differs from plan | compile/lint/integration failure | verify current SDK, log exact change, do not invent API |
| Overclaim in README | branch only unit-tested | proof table distinguishes direct vs live |

## Project-specific edge-case backlog

- Two collaborators claim same edit; overlap is surfaced and validators can mark dependent contributions without zeroing both.
- Contributor has many low-value checkpoints; volume alone cannot dominate because rubric is dimension-based.
- A collaborator does not participate in finalization; creator may still request because the on-chain project rules govern eligibility.
- All bands are zero due insufficient evidence; ABSTAINED rather than division by zero.
- Release artifact changes after finalization request; digest mismatch requires new finalization.

## Definition of complete

The project is complete only when:

- the MVP flow works end to end;
- the contract is deployed on StudioNet;
- at least one real consensus path is proven;
- the frontend is wired to that contract;
- injected wallet is the only write mechanism;
- contract reads are authoritative;
- direct and frontend checks pass;
- UI is recognizably distinct;
- evidence and VecDB behavior are bounded;
- `memory.md` and `handoff.md` contain the exact final state.
