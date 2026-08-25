# StudioSplit deployment truth

StudioSplit has two immutable StudioNet deployments relevant to this release.

- Contract: `0xaABdC3D91E4bb62Ee63A30055113B49C875BAf8b`
- Deployment transaction: `0x6c083a0ee80db7da80ff2ddd605befe392e9a323732240fd580a6cf2f564caf5`
- Deployment result: `MAJORITY_AGREE`; leader and agreeing validators reported GenVM `SUCCESS`
- Explorer: https://genlayer-explorer.vercel.app
- Deployed schema: verified; 15 required methods present

The original address above has the verified live project lifecycle. Project 1 was created by `0x16c97554913166697b990467607a03c967584d8b6e973ab356412c89dd6a885b` and finalized by `0xcab4b355976ea66f3b97ef106a8b9b58bb45914d38c3f0994916ccb6543db69a` and `0x6d08c17230e4fe8938c5972a56d1bf3d37afff4692931ae0f8d0f1008199d8b3`; the authoritative receipt total is 10,000 bps.

The hardened source with evidence digest verification and retrieved-candidate memory authorization is deployed at `0xd45953553188f4f985aF0F7978F3CB1f57fB1dde`, tx `0x27ec436feb88125ec294afa211099c3f739f563d3f5840ac23dd7f51c1d0b020`, with GenVM `SUCCESS` and verified schema. No lifecycle is claimed for that second address.

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
10. The CLI account and StudioNet RPC were verified. The JSON-string issue was bypassed with `scripts/live-studionet-lifecycle.mjs`, which uses a single correctly encoded argv token. No hosted frontend or hosted-UI write is claimed because no authenticated hosting deployment completed.
