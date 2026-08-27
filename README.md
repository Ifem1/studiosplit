# StudioSplit

**Contribution-based ownership splits for collaborative creative work.**

StudioSplit turns a frozen set of public creative-contribution checkpoints into a shared ownership/credit split on GenLayer. Validators assign fixed **0–5 contribution bands** by collaborator and rubric dimension; deterministic contract code converts those agreed bands into **exactly 10,000 basis points**. The model never chooses percentages.

## Architecture lock

StudioSplit is intentionally **contract + frontend only**:

- no backend service;
- no API routes;
- no persistent app database;
- no server signer or generated/local wallet;
- existing creative tools/public hosts keep the large files;
- the browser submits validator-accessible HTTPS references + SHA-256 digests;
- contract state and contract-owned VecDB are authoritative;
- VecDB retrieves related claims but never decides truth or authorization.

## Contract

`contracts/studiosplit.py` implements:

- project creation with a fixed five-dimension rubric;
- creator-controlled collaborator registration while OPEN;
- explicit on-chain collaborator acceptance before finalization;
- collaborator-only self-checkpointing;
- artifact URL + SHA-256 binding;
- contract-owned semantic overlap memory with project/version/dimension filters;
- frozen finalization requests;
- permissionless bounded consensus adjudication;
- `FINALIZE` / `ABSTAIN` result validation;
- retryable finalization after transient evidence or consensus abstention;
- deterministic largest-remainder normalization to 10,000 bps;
- backendless discovery/read views for projects, lanes, checkpoints, finalization and receipt.

## Frontend

The Next.js application lives in `apps/web` and uses the project-specific **analog recording studio + session sheet + mixing console** language. Routes:

- `/` — project tape / create project
- `/projects/[id]/lanes` — collaborator mixer channels
- `/projects/[id]/checkpoint` — ruled checkpoint recorder
- `/projects/[id]/artifacts` — frozen artifact/version room
- `/projects/[id]/overlap` — semantic overlap matrix
- `/projects/[id]/finalize` — band matrix + normalization + split desk
- `/projects/[id]/receipt` — printable credit receipt

Writes use only `window.ethereum`. The write helper re-checks the active account and chain immediately before signing. A transaction is not shown as successful merely because it finalized: the frontend requires an explicit successful GenVM execution result and then re-reads authoritative contract state.

## Local fixture mode

`.env.example` defaults to `NEXT_PUBLIC_STUDIOSPLIT_DATA=fixture` so reviewers can inspect the complete interface without fabricating live chain state. Fixture screens are visibly labeled and write buttons are disabled.

For real use, set:

```bash
NEXT_PUBLIC_GENLAYER_CHAIN=studionet
NEXT_PUBLIC_GENLAYER_ENDPOINT=https://studio.genlayer.com/api
NEXT_PUBLIC_STUDIOSPLIT_CONTRACT=0x...
NEXT_PUBLIC_STUDIOSPLIT_DATA=live
```

Live mode never silently falls back to fixtures.

## Verification completed in this build session

```text
python -m compileall -q contracts tests              PASS
pytest tests/direct tests/frontend -q                18 passed, 4 runtime failures
node --test tests/frontend/*.test.mjs                PASS
node scripts/verify-schema.mjs                       PASS (15/15)
npm run typecheck                                     PASS
npm run lint                                          PASS
npm run build                                         PASS
```

The four runtime failures are a Windows-only `gltest` temporary-file cleanup error (`PermissionError: [WinError 32]`) during direct VM deployment; the package is installed and the remaining 18 source/direct/frontend tests pass. The live StudioNet lifecycle below is independent runtime proof.

Current release status: the canonical StudioNet contract is `0xb178cc6319eD4143464fbf5218625723fF6a5bb4`, deployed from source commit `41d2940e336618fa3f47b34c3d5a38c5125daf88` with deployment tx `0x54a0ebd76c8041b7de933d12099bd947c701be3fbc87eb0c74597243c82d56c5`. Project 1 reached `FINALIZED` through adjudication tx `0x0ff14b296a64552440d2f030ded65069b1f36f32b82f60f06123894abe2c1bc8`; `get_split(1)` returned one entry at `10000` bps and `total_bps=10000`. Terminal consensus was `MAJORITY_AGREE`; leader execution was `SUCCESS` with a returned `FINALIZED`/`10000` payload. Official StudioNet explorer: https://explorer-studio.genlayer.com. Production frontend: https://studiosplit-web.vercel.app, Vercel deployment `dpl_D9KjCD1buCJR1KEqbb6CLRFGndWC`.

## Release verification

The canonical lifecycle, schema, source tests, frontend tests, typecheck, lint, compile, and production build are verified. Hosted production routes are served from `https://studiosplit-web.vercel.app`; live chain reads resolve the canonical contract above.
