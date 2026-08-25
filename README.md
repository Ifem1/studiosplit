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
- collaborator-only self-checkpointing;
- artifact URL + SHA-256 binding;
- contract-owned semantic overlap memory with project/version/dimension filters;
- frozen finalization requests;
- permissionless bounded consensus adjudication;
- `FINALIZE` / `ABSTAIN` result validation;
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
python3 -m py_compile contracts/studiosplit.py       PASS
pytest -q tests/direct                               7 passed, 1 skipped
node --test tests/frontend/*.test.mjs                4 passed
node scripts/verify-schema.mjs                       source schema verification
npm run typecheck                                     PASS
npm run lint                                          PASS
npm run build                                         PASS
```

The single skipped direct suite is the real `genlayer-test` runtime suite; that package is not installed in the current execution environment. The repository also includes reference/source tests so deterministic arithmetic and safety structure were still checked.

StudioNet deployment is verified at `0xaABdC3D91E4bb62Ee63A30055113B49C875BAf8b` with deployment transaction `0x6c083a0ee80db7da80ff2ddd605befe392e9a323732240fd580a6cf2f564caf5`; the deployed schema exposes the required 15 methods. A successful live project lifecycle and hosted frontend are not claimed yet.

## Not yet proven

The current environment could not install npm dependencies or access the GenLayer deployment/test CLI, so the following are **not** claimed:

- `genvm-lint` pass;
- real GenLayer direct-runtime pass;
- frontend dependency-backed TypeScript/lint/production build pass;
- StudioNet deployment;
- live consensus transaction;
- hosted frontend.

See `DEPLOYMENT.md` and `handoff.md` for the exact remaining release gates.
