# StudioSplit — Technical Requirements Document (TRD)

## 1. Technical objective

Build a production-quality GenLayer application whose authoritative contract settles **a project-version-bound contributor ownership/credit split expressed as exactly 10,000 basis points** while keeping bulk work off-chain.

The implementation must make GenLayer load-bearing. If the consensus path were replaced by a single backend LLM call, the trust property of the final state would disappear.


## Shared GenLayer engineering baseline

This project is intentionally aligned with the current patterns already proven in the owner's GenLayer repositories. Treat these as non-negotiable defaults unless the owner explicitly changes them.

### Network and client

- Target network: **GenLayer StudioNet**
- Chain ID: **61999**
- RPC/endpoint: **`https://studio.genlayer.com/api`**
- Explorer base: **`https://explorer-studio.genlayer.com`**
- Browser client: **`genlayer-js` exactly `1.1.8`**
- Frontend baseline: Next.js `16.3.2`, React `19.2.4`, React DOM `19.2.4`, TypeScript ^5, Tailwind CSS ^4
- Import `studionet` from `genlayer-js/chains`; do not hand-roll chain metadata unless a proven SDK defect requires an explicit override.
- Writes are **injected-wallet only**. Use `window.ethereum`, request accounts only after an explicit user action, read the wallet chain before allowing writes, and refuse to sign on the wrong network.
- Never generate, persist, import, display, fund or fall back to a browser/local/server private key.
- If the SDK needs an account object for read calls, an ephemeral in-memory read account may exist for the duration of the read only. It is never persisted, funded or used to sign.
- There is no backend signer or server-side signing path.

### Wallet/session behavior

Implement the same safety properties as the mature wallet provider pattern in `ometere123/intent-guard`:

1. Do not auto-connect on page load.
2. Track `accountsChanged`, `chainChanged`, and provider `disconnect`.
3. Show the network the wallet actually reports, not merely the network this build targets.
4. Gate `getWriteClient()` a second time immediately before a signature request.
5. On wrong network, offer `wallet_switchEthereumChain`; if the wallet refuses, keep writes disabled.
6. A UI-level disabled button is not sufficient protection. The transaction helper must independently refuse.

### Transaction truthfulness

A transaction receipt becoming available is not the same as a successful contract execution.

For every write:

1. Submit with the injected client.
2. Wait for `TransactionStatus.FINALIZED`.
3. Re-read the transaction.
4. Inspect the GenVM leader execution result.
5. Treat only an explicit successful execution as application success.
6. A finalized rollback/error must be shown as failure and must not mutate optimistic UI into a fake success state.
7. After success, re-read authoritative contract state before presenting the final state.

Recommended finality polling baseline from the existing production pattern: 5-second interval, up to 90 retries. Tune only with evidence.

### Live-data rule

Fixtures are permitted for local visual development only if visibly labeled. In a production/live build:

- missing contract address = unavailable state, not silent fixture fallback;
- failed read = unavailable/error state, not zero/default fabricated state;
- failed write = failure state, not a toast followed by optimistic success;
- every displayed on-chain claim must come from a contract read.

### VecDB / embeddings rule

Use native contract-owned vector memory as a **retrieval primitive**, never as truth or authorization.

Current proven contract pattern:

```python
# {
#   "Seq": [
#     { "Depends": "py-lib-genlayer-embeddings:0bmbm3cyfwxsyh454z53vxqjf47wz2q7smcqp1q4g4a6k2kidnyk" },
#     { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
#   ]
# }

import typing
import numpy as np
from dataclasses import dataclass
from genlayer import *
import genlayer_embeddings

@allow_storage
@dataclass
class VectorPointer:
    record_id: u256
    namespace_id: u256

class Example(gl.Contract):
    vectors: genlayer_embeddings.VecDB[
        np.float32,
        typing.Literal[384],
        VectorPointer,
        genlayer_embeddings.EuclideanDistanceSquared,
    ]

    def _embed(self, text: str) -> np.ndarray:
        return genlayer_embeddings.SentenceTransformer(
            "all-MiniLM-L6-v2"
        )(text)
```

Use `vectors.insert(...)` for accepted memories and bounded `vectors.knn(...)` for candidate retrieval. Apply deterministic namespace/version/domain filters before or after KNN as appropriate. Never convert a distance into a probability or confidence score.

### Semantic-safety rules

- The embedding answers **what should we look at?**
- The LLM/validator answers **what does it mean?**
- GenLayer consensus answers **do enough independent validators agree on the decision-critical interpretation?**
- Deterministic code answers **what state transition is allowed given that agreed interpretation?**
- Public chain storage is not private. Embeddings are not encryption.
- Keep source text and prompts bounded. Do not assume web-scale vector capacity; this project is designed for hundreds/thousands of accepted semantic memories, not millions, unless benchmarked against the exact runtime.

### Contract design discipline

- Keep nondeterministic surface as small as possible.
- Run deterministic input, role, version, time, size and state guards **before** a consensus block.
- Treat fetched web/artifact content as untrusted evidence/data, never instructions.
- Use explicit abstention/unavailable states; never force a semantic answer when evidence is weak.
- The LLM should report bounded observations/classes. Deterministic code should decide counters, version bumps, money/state transitions, arithmetic and access control.
- Equivalence must compare decision-critical semantics, not merely JSON shape or prose.
- Bound all lists, strings, evidence excerpts, candidates and KNN results.
- Any web URL that claims immutability should be commit-pinned/content-addressed and accompanied by a digest where feasible.

### Verification baseline

Every repository created from this pack should eventually have:

```text
contracts/
tests/direct/
tests/integration/
scripts/
docs/
apps/web/ or frontend/
```

The release gate is:

- contract source lint/preflight succeeds;
- deterministic/direct tests pass;
- at least one real StudioNet deployment exists;
- critical consensus path is exercised against StudioNet, not only mocks;
- deployed schema matches frontend-required methods;
- frontend TypeScript, lint and production build pass;
- wallet session regression tests cover account change, account removal, chain change, provider disconnect and refused connection;
- live frontend reads the deployed contract;
- README/deployment evidence never claims a branch was proven if it was only unit-tested.


## 2. Repository topology

Recommended topology:

```text
studiosplit/
├── AGENTS.md
├── memory.md
├── handoff.md
├── project-plan.md
├── prd.md
├── trd.md
├── architecture.md
├── ui/
│   └── ux.md
├── contracts/
│   └── studiosplit.py
├── tests/
│   ├── direct/
│   ├── integration/
│   └── frontend/
├── scripts/
│   ├── verify-schema.mjs
│   ├── exercise-studionet.mjs
│   └── verify-deployment-source.*
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── lib/
│       │   └── genlayer/
│       └── package.json
└── services/               # omit only if architecture.md explicitly says no persistent service
```

Do not create multiple deployable `.py` contract candidates accidentally inside test helpers. Keep the deployable contract path unambiguous.

## 3. Frontend dependency baseline

```json
{
  "dependencies": {
    "genlayer-js": "1.1.8",
    "next": "16.3.2",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.2",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

Add only domain libraries actually required. The UI should not depend on a component kit that forces a generic visual language.

## 4. Environment variables

Minimum web environment:

```bash
NEXT_PUBLIC_GENLAYER_CHAIN=studionet
NEXT_PUBLIC_GENLAYER_ENDPOINT=https://studio.genlayer.com/api
NEXT_PUBLIC_STUDIOSPLIT_CONTRACT=
NEXT_PUBLIC_STUDIOSPLIT_DATA=live
```

There is no server environment. No private key, seed phrase or signer secret belongs in the application repository or browser storage.

## 5. Contract dependency header

Start the deployable contract with:

```python
# {
#   "Seq": [
#     { "Depends": "py-lib-genlayer-embeddings:0bmbm3cyfwxsyh454z53vxqjf47wz2q7smcqp1q4g4a6k2kidnyk" },
#     { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
#   ]
# }
```

Verify these dependency hashes against the current StudioNet environment before final deployment. If they change, record the exact change in `handoff.md` and `memory.md`; do not silently update.

## 6. Domain state model

Required conceptual records:

- Project { creator, name, charter_url, charter_digest, rubric_json, status, collaborator_count, checkpoint_count, version }
- Collaborator { project_id, wallet, role_label, active }
- Checkpoint { project_id, contributor, artifact_url, artifact_digest, dimension_code, contribution_text, submitted_at }
- Finalization { project_id, release_url, release_digest, status, band_matrix_json, overlap_refs_json, rationale, requested_at, resolved_at }
- SplitEntry { project_id, contributor, bps, score_units }
- VectorPointer { checkpoint_id, project_id, contributor }

### Status vocabulary

- OPEN
- CHECKPOINTING
- FINALIZATION_REQUESTED
- UNDER_REVIEW
- FINALIZED
- ABSTAINED
- CANCELLED

Use numeric storage enums (`u8`/`u16`) where appropriate and expose readable names in views. Never accept arbitrary status strings from a model.

## 7. Contract API

### Intended public surface

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

### Method semantics

| Method/area | Required semantics |
| --- | --- |
| create_project | Creator freezes contribution dimensions and integer weights in rubric JSON; becomes project creator. |
| add_collaborator | Creator-only while project OPEN; wallet unique. Removal disables future checkpoints but preserves history. |
| submit_checkpoint | Registered collaborator only for self. Bind one artifact digest, one dimension and bounded contribution description. |
| request_finalization | Creator-only. Freeze checkpoint set and rubric version; release artifact digest immutable. Move project to review lock. |
| preview_overlaps | Contributor/dimension-scoped KNN to find overlapping/dependent checkpoint claims. |
| adjudicate_finalization | Permissionless. Validators assign 0-5 bands for each collaborator×dimension; deterministic normalization yields exactly 10,000 bps. |
| cancel_finalization | Creator may cancel only before consensus result; project returns to checkpointing if charter permits. |
| get_split | Machine-readable wallet→bps map plus finalization digest. |

When a method name in this table differs slightly from the sketch signature, preserve the behavior, then choose one final name and update **all** docs/schema/client code in the same work unit.

### ABI discipline

- Public method parameters use schema-safe primitive ABI types and cast internally.
- Bound JSON strings before parsing.
- Use `@allow_storage` dataclasses, `TreeMap`, `DynArray` and typed values.
- Avoid bare persistent `dict`/`list`.
- Views return bounded schema-stable objects.
- Record base/version fingerprints anywhere stale-state mutation is possible.

## 8. Project-specific authorization model

Authorization is intentionally narrow:

- Top-level creation may be permissionless unless the method table says otherwise.
- Steward/owner powers configure the project but cannot forge a semantic verdict.
- Permissionless review/finalize methods are preferred when the decision inputs are already frozen, because liveness should not depend on one operator.
- Off-chain role membership is never sufficient for an on-chain privileged write unless the contract stores/verifies the role.
- UI must derive role affordances from contract state/address rather than assuming the connected wallet is privileged.

## 9. VecDB design

Embed each checkpoint claim from role, artifact version, contribution dimension, bounded description and referenced artifact digest. During finalization, retrieve overlaps for each contributor/dimension pair to highlight duplicate/overlapping claims and longitudinal contribution patterns.

### Required storage pattern

```python
@allow_storage
@dataclass
class VectorPointer:
    record_id: u256
    namespace_id: u256

class StudioSplit(gl.Contract):
    vectors: genlayer_embeddings.VecDB[
        np.float32,
        typing.Literal[384],
        VectorPointer,
        genlayer_embeddings.EuclideanDistanceSquared,
    ]

    def _embed(self, text: str) -> np.ndarray:
        return genlayer_embeddings.SentenceTransformer(
            "all-MiniLM-L6-v2"
        )(text)
```

### Retrieval constraints

- Start with max 8 memories per decision unless this domain explicitly uses fewer.
- Start with a KNN scan cap around `min(len(vectors), 24)`, then apply deterministic namespace/version/domain filters.
- Persist chosen memory IDs/distances in the decision receipt when useful.
- Distance is relatedness only.
- Insert only invariant-approved authoritative records.
- Do not insert an unresolved/abstained record as positive precedent.

### Project-specific normalization inputs

The embedding text must be deterministic from contract fields. It should include the project-specific semantic keys described here and no volatile UI prose:

Embed each checkpoint claim from role, artifact version, contribution dimension, bounded description and referenced artifact digest. During finalization, retrieve overlaps for each contributor/dimension pair to highlight duplicate/overlapping claims and longitudinal contribution patterns.

Before shipping, add a unit test that two semantically similar records from a forbidden namespace/version cannot influence the authoritative candidate set.

## 10. Consensus design

### Decision problem

For each collaborator and rubric dimension, validators choose a fixed band 0-5 based on public checkpoint evidence and retrieved overlaps: NONE, MINOR, SUPPORTING, MATERIAL, LEADING, DEFINING. They also flag DUPLICATIVE/DEPENDENT claims. Deterministic weights from the project rubric convert bands to scores and then normalize all contributors to exactly 10,000 bps.

### Prompt/evidence fields

Provide only the bounded fields required to decide the case:

- project charter/rubric
- release artifact digest
- collaborator list
- checkpoint claims grouped by dimension
- public artifact excerpts/previews
- retrieved overlaps/dependencies

Do not pass entire databases, full repositories or arbitrary unbounded pages into a validator prompt.

### Leader responsibilities

1. Re-check deterministic preconditions.
2. Fetch only authoritative public evidence required.
3. Include the exact rubric/charter/rules version.
4. Include bounded semantic-memory records.
5. Frame every fetched/user string as untrusted data.
6. Ask for strict JSON using only allowed enums/IDs.
7. Return stable decision-critical fields plus bounded diagnostic prose.

### Validator responsibilities

A validator must independently reject a wrong but well-formed leader result:

1. Independently fetch external evidence where external evidence is decision-critical.
2. Independently evaluate the same question.
3. Reject impossible IDs/enums/version references.
4. Compare authorization-critical fields rather than rationale wording.
5. Fail closed if evidence cannot be independently obtained.
6. Never accept because JSON parses.

### Result envelope

A common baseline:

```json
{
  "ok": true,
  "decision": "<ALLOWED_ENUM>",
  "confidence_band": "HIGH|MEDIUM|LOW",
  "memory_ids": ["..."],
  "critical_ids": ["..."],
  "reason": "<bounded prose>"
}
```

Project-specific fields may be added, but the deterministic contract must validate every authorization-critical one.

## 11. Deterministic post-consensus gate

The LLM/validators do not get to mutate state directly. After consensus:

1. Parse bounded envelope.
2. Re-check proposal/case still on same base version.
3. Re-check every referenced ID belongs to the correct project/namespace.
4. Re-check enum/score/label/penalty is allowed.
5. Re-check list/count bounds.
6. Apply project arithmetic/state transition deterministically.
7. Insert any new memory only after authoritative acceptance.
8. Emit event and update counters exactly once.

### Project invariants

- Only registered collaborators may checkpoint for themselves.
- Rubric weights freeze when first checkpoint is submitted.
- Final percentages are deterministic normalization of agreed integer bands.
- Split sum must equal exactly 10,000 bps.
- Finalized project cannot accept new checkpoints without explicit new version/reopen workflow.
- Artifact digest is required for every checkpoint.

## 12. Browser-only boundary

**Selected architecture:** contract + frontend only. There are no API routes, server functions, persistent databases, managed object stores or backend authentication services in StudioSplit. Collaborators continue using external creative/public hosting tools; the frontend accepts validator-accessible immutable/versioned URLs and SHA-256 digests.

### Browser restrictions

The browser may hold transient form state, fixture data in explicit fixture mode, and non-authoritative local preferences. It may not fabricate live records, persist authoritative project state, proxy privileged writes, or contain any private signing key. All production writes use the injected EIP-1193 wallet.

## 13. Frontend route contract

| Route | Screen | Desktop composition | Primary action |
| --- | --- | --- | --- |
| / | Project tape | Session timeline across width with project reels in left shelf; current release marker at right. | Open project |
| /projects/[id]/lanes | Collaborator lanes | Mixer-style vertical channels per collaborator with dimension markers and checkpoint counts. | Inspect lane |
| /projects/[id]/checkpoint | Checkpoint recorder | Artifact version top, contribution text on ruled session sheet, dimension selector like track assignment. | Record checkpoint |
| /projects/[id]/artifacts | Artifact version room | Tape-reel/version history with digest, public preview and contributors. | Select version |
| /projects/[id]/overlap | Overlap matrix | Collaborators rows × dimensions columns; cells open semantic overlap evidence. | Inspect overlap |
| /projects/[id]/finalize | Final split desk | Band matrix left, deterministic normalization math center, physical split sheet right. | Request/run finalization |
| /projects/[id]/receipt | Credit receipt | Print/export page with 10,000 bps exact total, release digest and tx. | Export credit sheet |

URLs are part of reviewer usability. Prefer deep-linkable record pages over modal-only state.

## 14. GenLayer client modules

```text
apps/web/lib/genlayer/
├── config.ts
├── client.ts
├── read-client.ts
├── contract.ts
├── execution.ts
├── data-source.ts
└── schema.ts
```

### Required behavior

- `config.ts`: StudioNet chain, endpoint, contract address, explorer override, required methods, live-data mode.
- `client.ts`: `createInjectedClient(address)` using `window.ethereum`.
- `read-client.ts`: keyless/ephemeral in-memory read account only if SDK requires it.
- `contract.ts`: typed view wrappers, write helper, finality + GenVM execution.
- `execution.ts`: robust parsing of leader receipt/execution result.
- `data-source.ts`: one live-vs-fixture boundary.
- `schema.ts`: verify every frontend-required method exists.

## 15. Finality and error behavior

| Category | Meaning | UI behavior |
|---|---|---|
| `EXPECTED_INPUT` | User/state precondition failed | Inline actionable message |
| `WRONG_NETWORK` | Wallet not on 61999 | Block signature + switch action |
| `UNAVAILABLE_READ` | RPC/source unavailable | Explicit unavailable state |
| `CONSENSUS_PENDING` | Not finalized yet | Transaction rail only |
| `CONSENSUS_DISAGREEMENT` | No accepted equivalent decision | Explain no final state |
| `GENVM_ROLLBACK` | Finalized but execution rolled back | Failure receipt; re-read |
| `MALFORMED_RESPONSE` | RPC/contract data fails guard | Fail closed |
| `ABSTAINED` | Insufficient evidence | Neutral terminal/non-authorizing state |

## 16. Test fixture

Use a deterministic demo fixture early so contract tests and UI fixture data describe the same scenario:

> Four-person music/video project with dimensions writing, arrangement, production, visual edit, project direction. Two people claim the same chorus arrangement checkpoint; one is original and the other dependent refinement.

Do not confuse this fixture with live proof. It is a test/demo dataset until StudioNet transactions exist.

## 17. Testing matrix

### Direct contract tests

- every creation/input bound;
- authorization;
- every allowed/forbidden state transition;
- stale base/version;
- all project invariants;
- VecDB insertion eligibility;
- namespace filters and KNN bounds;
- duplicate finalization/replay;
- malformed consensus result;
- invented ID/reference;
- abstain/no-evidence behavior.

### Forged leader tests

At least one forged payload must be syntactically valid and semantically wrong. The validator must reject it. Include cross-namespace memory, impossible decision-critical ID and an evidence-unavailable case.

### Frontend tests

- connect refused;
- wrong chain;
- account changes/removal;
- provider disconnect;
- finality rollback not success;
- success re-reads chain;
- no live contract = unavailable, not mock;
- mobile primary path;
- raw vector distance never labeled confidence.

### StudioNet

Prove: deployment, deterministic create/config write, memory insertion path, live consensus path, authoritative read, and one fail-closed/abstain path where practical.

## 18. Deployment procedure

1. Freeze source commit.
2. Run local contract/frontend tests.
3. Deploy to StudioNet.
4. Record address + deploy tx.
5. Retrieve deployed source/code if supported and compare.
6. Configure hosted frontend live env.
7. Verify contract schema.
8. Run the reference demo with real writes.
9. Record each tx and actual GenVM result.
10. Update `handoff.md` immediately after each proof step.
11. Update `memory.md` with final address/URL only after verified.
12. Never claim unexercised branches as live-proven.

## 19. Project-specific edge tests

- Two collaborators claim same edit; overlap is surfaced and validators can mark dependent contributions without zeroing both.
- Contributor has many low-value checkpoints; volume alone cannot dominate because rubric is dimension-based.
- A collaborator does not participate in finalization; creator may still request finalization because the frozen on-chain project rules control eligibility.
- All bands are zero due insufficient evidence; ABSTAINED rather than division by zero.
- Release artifact changes after finalization request; digest mismatch requires new finalization.

## 20. Reference demo

Create a song/video project with four collaborators, add checkpoints across writing/editing/design/production, intentionally overlap two claims, request finalization, inspect semantic overlap, reach band matrix, normalize to 10,000 bps and export a signed credit sheet.
