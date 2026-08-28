# StudioSplit deployment truth

The single canonical StudioSplit contract is `0xE133EAc93C43F2ed0016468453eB74De33D3d383`, deployed from source commit `fcc2f49f12efa6e3353901219a519b17814cd98e` with deployment tx `0xd10e448db2c5158808ced2e02f707f8282b1b30b39057510577734f3f2b64522`.

The hardened release verifies public evidence digests, records collaborator acceptance on-chain, keeps memory provenance contract-owned, and supports retryable abstained finalizations. Official StudioNet explorer: https://explorer-studio.genlayer.com.

- Deployment result: `MAJORITY_AGREE`; leader execution `SUCCESS` with returned `FINALIZED`/`10000` payload
- Official StudioNet explorer: https://explorer-studio.genlayer.com
- Deployed schema: verified; 15 required methods present

Lifecycle evidence on the canonical deployment: create `0x3dd47ce9a75300da4fd3e480d7ba740123d44c31601ace001ff672ad3ab83192`; add collaborator `0x41d0706115d7dfc21c7e4dc9027ab79ae4ad7aaff66d50d4fc02b484555c458b`; accept `0xfee31b5ba676669a0a2ed28af7557340e89cb3d178a90e81675e95ab64d7d443`; checkpoint `0x80f43390c01e151544c3221943c0dc49b6baf25ba11c14f081a122cc8a8ce376`; abstention adjudication `0x9c08df5845eb65b72d69e6c2f8bafd4e913ba2b840c626e91a8e2baf6cb5b927`; retry `0x14af2205b32e58fa5a3999463ae7a05784265ba61e53894b596a89ae38c6e862`; successful retry adjudication `0xb1e8c848ba9ba8ccc85013d52032aab73584b7fe2152c61c81ab9344e78f459d`.

Final proof: project 2, finalization 4, status `FINALIZED`, `get_split(2).total_bps=10000`. Earlier project 1 consent registration/acceptance and finalization 1/2 are retained as historical evidence; project 2 is the successful retry proof.

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
4. Deploy the frozen source commit to StudioNet using the owner-controlled deployment flow. **Completed for `0xE133…D383`.**
5. Record contract address and deployment tx only after GenVM success is verified.
6. Set `NEXT_PUBLIC_STUDIOSPLIT_DATA=live` and `NEXT_PUBLIC_STUDIOSPLIT_CONTRACT=<verified address>`.
7. Install frontend dependencies and run typecheck/lint/build.
8. Use the hosted browser with an injected wallet to execute create → collaborators → checkpoints → overlap → finalization → receipt.
9. For every write, verify `FINALIZED` plus `txExecutionResultName === FINISHED_WITH_RETURN`, then re-read chain state.
10. The CLI account and StudioNet RPC were verified. Vercel production deployment `D2zRetQPrpWDnAZdNihSuGnQHEGX` is READY at https://studiosplit-web.vercel.app with `NEXT_PUBLIC_STUDIOSPLIT_CONTRACT=0xE133EAc93C43F2ed0016468453eB74De33D3d383`; all seven routes return HTTP 200 on direct refresh.
