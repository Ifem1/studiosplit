import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const client = readFileSync(new URL("../../apps/web/lib/genlayer/client.ts", import.meta.url), "utf8");
const contract = readFileSync(new URL("../../apps/web/lib/genlayer/contract.ts", import.meta.url), "utf8");
const dataSource = readFileSync(new URL("../../apps/web/lib/genlayer/data-source.ts", import.meta.url), "utf8");
const overlap = readFileSync(new URL("../../apps/web/app/projects/[id]/overlap/page.tsx", import.meta.url), "utf8");

test("writes require injected window.ethereum and re-check StudioNet", () => {
  assert.match(client, /window\.ethereum/);
  assert.match(client, /eth_accounts/);
  assert.match(client, /eth_chainId/);
  assert.match(client, /STUDIONET_CHAIN_ID/);
  assert.doesNotMatch(client, /createAccount|privateKey|seedPhrase/);
});

test("finality checks explicit GenVM execution before success", () => {
  assert.match(contract, /TransactionStatus\.FINALIZED/);
  assert.match(contract, /inspectFinalizedExecution/);
  assert.match(contract, /Re-reading authoritative state/);
});

test("live mode never silently falls back to fixture data", () => {
  assert.match(dataSource, /if \(DATA_MODE === "fixture"\)/);
  assert.match(dataSource, /Live mode requires NEXT_PUBLIC_STUDIOSPLIT_CONTRACT/);
  assert.doesNotMatch(dataSource, /catch[\s\S]*fixtureData/);
});

test("semantic UI labels raw distance as relatedness, never confidence", () => {
  assert.match(overlap, /distance = relatedness only/);
  assert.match(overlap, /raw distance/);
  assert.doesNotMatch(overlap, /confidence/i);
});
