# StudioSplit deployment truth

The hardened deployment is the single canonical StudioSplit contract for this release. The original deployment is retained only as superseded historical evidence.

- Contract: `0xaABdC3D91E4bb62Ee63A30055113B49C875BAf8b`
- Deployment transaction: `0x6c083a0ee80db7da80ff2ddd605befe392e9a323732240fd580a6cf2f564caf5`
- Deployment result: `MAJORITY_AGREE`; leader and agreeing validators reported GenVM `SUCCESS`
- Official StudioNet explorer: https://explorer-studio.genlayer.com
- Deployed schema: verified; 15 required methods present

The original address above is superseded historical evidence. Its project 1 receipt totaled 10,000 bps, but it is not the production contract.

The canonical hardened source with evidence digest verification and retrieved-candidate memory authorization is deployed at `0xd45953553188f4f985aF0F7978F3CB1f57fB1dde`, tx `0x27ec436feb88125ec294afa211099c3f739f563d3f5840ac23dd7f51c1d0b020`, with GenVM `SUCCESS` and verified schema. Its project 1 currently reads `ABSTAINED`, `total_bps=0`; a valid hardened 10,000-bps receipt is not claimed.

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
