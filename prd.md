# StudioSplit — Product Requirements Document (PRD)

## 1. Product summary

**Contribution-based ownership splits for collaborative creative work.**

StudioSplit converts months of messy off-chain creative collaboration into one auditable, rubric-bound ownership split. Collaborators checkpoint contribution claims against immutable artifact versions. At finalization, VecDB surfaces overlapping claims and related checkpoints. Validators assign fixed contribution bands by dimension; deterministic code normalizes the agreed bands into exactly 10,000 basis points. The model never directly chooses percentages.

The product uses a deliberate operating model:

1. high-frequency domain work happens off-chain;
2. a bounded, immutable/public artifact or case is frozen;
3. the Intelligent Contract retrieves only relevant semantic memory;
4. validators judge the semantic question independently;
5. deterministic contract code decides whether/how authoritative state changes.

## 2. Problem

The product must settle:

> **a project-version-bound contributor ownership/credit split expressed as exactly 10,000 basis points**

The problem is not that ordinary software cannot produce an answer. It can. The problem is that when multiple parties care about the final result, letting one operator/model author the authoritative state reintroduces the trust assumption GenLayer is meant to remove.

## 3. Why GenLayer is load-bearing

Delete GenLayer and the system loses at least one of:

- independent access to public evidence;
- independent semantic judgment;
- agreement on decision-critical meaning;
- a shared immutable result other contracts can consume.

VecDB alone does not fix this. Similarity only identifies relevant history.

## 4. Goals

- Fast normal workflow off-chain.
- Explicit escalation to shared judgment.
- Project-owned semantic institutional memory.
- Version-bound rules/evidence.
- Deterministic, inspectable state changes.
- Composable final receipts.
- Distinct domain-specific user experience.
- Honest failure/abstain states.
- Real StudioNet deployment proof before release claims.

## 5. Non-goals

- copyright/legal adjudication
- secret unreleased content in public VecDB
- automatic royalty payment in MVP
- plagiarism detection
- LLM-created percentages

## 6. Actors

| Actor | Role |
| --- | --- |
| project creator | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| creative collaborator | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| producer/editor | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| GenLayer validator | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| royalty/credit consumer | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |

## 7. Scope split

### Off-chain

Media files, DAW sessions, Figma files, video assets, comments and collaborative work. Public/intentional evidence snapshots are stored outside chain with digests.

### On-chain

Project rubric; collaborator registry; checkpoint digests; bounded contribution claims; semantic overlap index; finalization case; agreed contribution bands; deterministic bps split; immutable split receipt.

### Semantic memory

Embed each checkpoint claim from role, artifact version, contribution dimension, bounded description and referenced artifact digest. During finalization, retrieve overlaps for each contributor/dimension pair to highlight duplicate/overlapping claims and longitudinal contribution patterns.

### Consensus question

For each collaborator and rubric dimension, validators choose a fixed band 0-5 based on public checkpoint evidence and retrieved overlaps: NONE, MINOR, SUPPORTING, MATERIAL, LEADING, DEFINING. They also flag DUPLICATIVE/DEPENDENT claims. Deterministic weights from the project rubric convert bands to scores and then normalize all contributors to exactly 10,000 bps.

## 8. MVP

Up to 8 collaborators, 5 fixed contribution dimensions, public evidence snapshots, checkpointing, semantic overlap recall, consensus band matrix, deterministic normalization to 10,000 bps and exportable split receipt.

The MVP is not considered complete until a hosted frontend performs the critical path against a real StudioNet deployment.

## 9. User stories

- As a **project creator**, I can configure the authoritative rules/charter and see exactly which version every case uses.
- As a **creative collaborator**, I can perform normal work off-chain and escalate only the bounded cases that need shared judgment.
- As a **producer/editor**, I can inspect the public evidence and related semantic history without treating similarity as truth.
- As a **GenLayer validator**, I receive bounded, versioned inputs and can reject a semantically wrong leader decision.
- As an external integrator, I can read a typed final receipt without trusting an app operator or scraping rationale prose.

## 10. Lifecycle

Product statuses:

- OPEN
- CHECKPOINTING
- FINALIZATION_REQUESTED
- UNDER_REVIEW
- FINALIZED
- ABSTAINED
- CANCELLED

Generic lifecycle:

```text
normal off-chain work
 -> freeze bounded public artifact/case
 -> on-chain submit
 -> deterministic preflight
 -> bounded semantic retrieval
 -> consensus
 -> deterministic validation/state transition
 -> finalized receipt
 -> frontend authoritative re-read
```

## 11. Product surfaces

| Route | Product surface | Primary action |
| --- | --- | --- |
| / | Project tape | Open project |
| /projects/[id]/lanes | Collaborator lanes | Inspect lane |
| /projects/[id]/checkpoint | Checkpoint recorder | Record checkpoint |
| /projects/[id]/artifacts | Artifact version room | Select version |
| /projects/[id]/overlap | Overlap matrix | Inspect overlap |
| /projects/[id]/finalize | Final split desk | Request/run finalization |
| /projects/[id]/receipt | Credit receipt | Export credit sheet |

The visual composition for each route is specified in `ui/ux.md`.

## 12. Functional requirements

### FR-1 — Public browsing

Where a record is public, the user can inspect it without connecting a wallet.

### FR-2 — Explicit wallet identity

Wallet connection occurs only after user action. Production writes are injected-wallet only and network-gated.

### FR-3 — Versioned top-level configuration

Rules/charter/rubric/manifests that affect a decision are versioned and visible in the resulting receipt.

### FR-4 — Off-chain work plane

Routine/high-volume work stays in collaborators’ existing tools and does not require one StudioSplit transaction per action.

### FR-5 — Immutable escalation

Before chain submission, the user can inspect the exact bounded artifact/reference/digest being committed. Editing afterward produces a new digest/version.

### FR-6 — Related-memory preview

The product can show relevant semantic memories, clearly labeled as related context.

### FR-7 — Consensus trigger

The eligible actor can trigger the project-specific review. Long-running consensus is represented as stages, not fake percentage progress.

### FR-8 — Fail closed

Unavailable evidence, malformed outputs, stale state or validator disagreement cannot silently become a positive decision.

### FR-9 — Authoritative receipt

A final receipt includes record ID, contract/network, input version/digests, memory IDs, decision-critical output, tx/finality and resulting state.

### FR-10 — Append-only history

Historical decisions remain inspectable after later versions/corrections.

### FR-11 — Integrator surface

Stable view methods expose machine-readable final status.

## 13. Product-specific contract capabilities

- create_project(name, charter_url, charter_digest, rubric_json) -> project_id
- add_collaborator(project_id, wallet, role_label)
- submit_checkpoint(project_id, artifact_url, artifact_digest, dimension_code, contribution_text) -> checkpoint_id
- request_finalization(project_id, release_artifact_url, release_digest) -> finalization_id
- adjudicate_finalization(finalization_id) -> band matrix + split
- cancel_finalization(finalization_id)
- get_project_count()
- get_project(project_id)
- list_projects(start, limit)
- list_collaborators(project_id)
- get_checkpoint(checkpoint_id)
- list_checkpoints(project_id, start, limit)
- get_finalization(finalization_id)
- get_split(project_id)
- preview_overlaps(project_id, collaborator, dimension, k)

## 14. Product-specific rules

- Only registered collaborators may checkpoint for themselves.
- Rubric weights freeze when first checkpoint is submitted.
- Final percentages are deterministic normalization of agreed integer bands.
- Split sum must equal exactly 10,000 bps.
- Finalized project cannot accept new checkpoints without explicit new version/reopen workflow.
- Artifact digest is required for every checkpoint.

## 15. Public evidence requirements

- HTTPS/content-addressed and validator-accessible.
- Digest/version bound.
- Bounded before prompt construction.
- Treated as untrusted data.
- No private secrets in chain/VecDB.
- Unavailable source produces no invented positive result.

## 16. Primary demo fixture

Four-person music/video project with dimensions writing, arrangement, production, visual edit, project direction. Two people claim the same chorus arrangement checkpoint; one is original and the other dependent refinement.

The fixture should seed local UI/direct tests. It is not proof until a corresponding live StudioNet path is executed.

## 17. Required edge behavior

- Two collaborators claim same edit; overlap is surfaced and validators can mark dependent contributions without zeroing both.
- Contributor has many low-value checkpoints; volume alone cannot dominate because rubric is dimension-based.
- A collaborator does not participate in finalization; creator may still request because the on-chain project rules govern eligibility.
- All bands are zero due insufficient evidence; ABSTAINED rather than division by zero.
- Release artifact changes after finalization request; digest mismatch requires new finalization.

## 18. UX requirements

UI identity:

- **Archetype:** analog recording studio + session sheet + mixing console
- **Signature:** Each collaborator is a vertical mixer channel. Checkpoints appear as tape markers on a horizontal session timeline. Final bps is shown on a physical-looking split sheet, not a donut chart.
- **Fonts:** DM Sans for UI; DM Mono for version/hash; Fraunces used sparingly for project titles
- **Geometry:** horizontal channel strips, fader-like contribution bars, ruled paper areas, 5px radius; no bento cards
- **Motion:** fader values animate only after finalized split; tape-head cursor for timeline scrubbing

The wallet must remain utility chrome. The main artifact/work object dominates.

## 19. Security requirements

1. StudioSplit has no backend/database/API service; all GenLayer writes are injected-wallet only.
2. Wrong-chain writes are blocked both in UI and client helper.
3. Finalized rollback/error is not success.
4. Unknown RPC/contract shape fails closed.
5. Prompt-injection-like fetched content cannot alter governing rules.
6. Similarity cannot directly authorize state.
7. Stale versions cannot mutate newer state.
8. Decision enums/IDs are deterministically bounded.
9. Public storage contains no secrets/private source material.
10. No live-mode fabricated fallback.

## 20. Success metrics

- 100% of writes injected-wallet signed.
- 100% final successes verified through GenVM execution + authoritative re-read.
- 0 silent fixture fallback in live mode.
- 0 VecDB distance displayed as truth/confidence.
- 100% final decisions expose input versions/digests.
- One happy-path and one fail-closed/abstain path demonstrated before release.
- Fresh agent can implement from this pack + repository files without prior chat context.

## 21. Acceptance criteria

- [ ] Contract state/API implements the intended domain lifecycle.
- [ ] Direct tests cover every invariant.
- [ ] VecDB insert/retrieval rules are tested.
- [ ] Validator rejects a well-formed wrong leader payload in direct mode where tooling permits.
- [ ] Repository contains no backend service, API routes or database integration; browser state cannot author chain truth.
- [ ] Hosted UI follows `ui/ux.md`.
- [ ] Hosted UI reads deployed StudioNet state.
- [ ] Contract schema verified.
- [ ] StudioNet consensus path proven.
- [ ] Wallet/network regressions tested.
- [ ] Deployment facts recorded in `handoff.md`/`memory.md`.
- [ ] README/submission copy distinguishes live proof from direct-test coverage.

## 22. Reference end-to-end demo

Create a song/video project with four collaborators, add checkpoints across writing/editing/design/production, intentionally overlap two claims, request finalization, inspect semantic overlap, reach band matrix, normalize to 10,000 bps and export a signed credit sheet.
