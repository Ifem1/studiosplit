/**
 * Post-deployment StudioNet smoke path. Requires npm dependencies plus a deployed
 * contract address. This script intentionally performs READS ONLY; writes stay in
 * the browser injected-wallet flow so no local/server signer exists.
 */
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const address = process.env.NEXT_PUBLIC_STUDIOSPLIT_CONTRACT;
if (!/^0x[a-fA-F0-9]{40}$/.test(address || "")) {
  throw new Error("Set NEXT_PUBLIC_STUDIOSPLIT_CONTRACT to the verified StudioNet deployment.");
}
const client = createClient({ chain: studionet });
const count = await client.readContract({ address, functionName: "get_project_count", args: [], stateStatus: "accepted" });
console.log("project_count", count);
const projects = await client.readContract({ address, functionName: "list_projects", args: [0, 20], stateStatus: "accepted" });
console.log(JSON.stringify(projects, null, 2));
