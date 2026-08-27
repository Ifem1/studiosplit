# StudioSplit deployment truth

The single canonical StudioSplit contract is `0xb178cc6319eD4143464fbf5218625723fF6a5bb4`, deployed from source commit `41d2940e336618fa3f47b34c3d5a38c5125daf88` with deployment tx `0x54a0ebd76c8041b7de933d12099bd947c701be3fbc87eb0c74597243c82d56c5`.

Steward hardening is implemented in the working tree but is not yet deployed: charter content is fetched and digest-verified during adjudication, collaborators explicitly accept on-chain, and abstained finalizations can be retried into a new record. The canonical deployment above therefore remains the prior release until a fresh deployment proves these additions.

- Deployment result: `MAJORITY_AGREE`; leader execution `SUCCESS` with returned `FINALIZED`/`10000` payload
- Official StudioNet explorer: https://explorer-studio.genlayer.com
- Deployed schema: verified; 15 required methods present

Lifecycle evidence: create `0xcc100753d9bfa3c7ecd5b2d2db058e9a221d809fafcdbdf89432c03eb5908e58`; request finalization `0x951d63df7dc88d4fea2f17ee77a75194ccf509c8b0bac8632e410bd929225148`; adjudication `0x0ff14b296a64552440d2f030ded65069b1f36f32b82f60f06123894abe2c1bc8`. Five dimension checkpoints were committed before the request. Final project and finalization are `FINALIZED`; `get_split(1).total_bps=10000`.

## Target

- Network: GenLayer StudioNet
- Chain ID: `61999`
- RPC: `https://studio.genlayer.com/api`
- Browser SDK: `genlayer-js` `1.1.8`
- Deployable contract: `contracts/studiosplit.py`

## Release gate

1. Install the official GenLayer runtime/test tooling.
2. Run `genvm-lint check contracts/studiosplit.py`.
3. Run `pytest tests/direct -v` with `genlayer-test` installed.
4. Deploy the frozen source commit to StudioNet using the owner-controlled deployment flow. **Completed for the deployment above.**
5. Record contract address and deployment tx only after GenVM success is verified.
6. Set `NEXT_PUBLIC_STUDIOSPLIT_DATA=live` and `NEXT_PUBLIC_STUDIOSPLIT_CONTRACT=<verified address>`.
7. Install frontend dependencies and run typecheck/lint/build.
8. Use the hosted browser with an injected wallet to execute create → collaborators → checkpoints → overlap → finalization → receipt.
9. For every write, verify `FINALIZED` plus `txExecutionResultName === FINISHED_WITH_RETURN`, then re-read chain state.
10. The CLI account and StudioNet RPC were verified. The JSON-string issue was bypassed with `scripts/live-studionet-lifecycle.mjs`, which uses a correctly encoded argv token. Vercel deployment is READY; browser testing confirmed fail-closed wallet detection, so no hosted write is claimed.
