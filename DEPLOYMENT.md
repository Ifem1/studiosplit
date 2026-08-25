# StudioSplit deployment truth

StudioSplit is deployed to StudioNet from contract source commit `8ffd51da2524209e3f4df0196cad769d759eb5c0`.

- Contract: `0xaABdC3D91E4bb62Ee63A30055113B49C875BAf8b`
- Deployment transaction: `0x6c083a0ee80db7da80ff2ddd605befe392e9a323732240fd580a6cf2f564caf5`
- Deployment result: `MAJORITY_AGREE`; leader and agreeing validators reported GenVM `SUCCESS`
- Explorer: https://genlayer-explorer.vercel.app
- Deployed schema: verified; 15 required methods present

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
10. The CLI account and StudioNet RPC were verified. A successful project lifecycle and hosted frontend remain unproven: the current CLI argument parser does not preserve the rubric JSON string required by `create_project`, and no hosting credentials are configured.
