import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const contract = process.env.NEXT_PUBLIC_STUDIOSPLIT_CONTRACT;
if (!/^0x[a-fA-F0-9]{40}$/.test(contract || "")) throw new Error("Set NEXT_PUBLIC_STUDIOSPLIT_CONTRACT");
const cli = process.env.GENLAYER_CLI || "C:\\Users\\DELL\\AppData\\Roaming\\npm\\node_modules\\genlayer\\dist\\index.js";
const evidenceUrl = process.env.STUDIOSPLIT_EVIDENCE_URL || "https://raw.githubusercontent.com/Ifem1/studiosplit/8ffd51da2524209e3f4df0196cad769d759eb5c0/README.md";
// The CLI parses valid JSON objects before calldata encoding. A JSON NaN sentinel
// is accepted by Python's json.loads but rejected by JSON.parse, preserving the
// original rubric as a string without double-encoding it.
const rubric = JSON.stringify({ dimensions: [
  { code: "WRITING", weight: 30 }, { code: "MUSIC", weight: 25 },
  { code: "VIDEO", weight: 20 }, { code: "PRODUCTION", weight: 15 }, { code: "DIRECTION", weight: 10 }
], _cli_guard: NaN }).replace('null', 'NaN');

const text = await (await fetch(evidenceUrl)).text();
const digest = "sha256:" + createHash("sha256").update(text).digest("hex");

function write(method, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, "write", contract, method, "--args", ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", chunk => { output += chunk; });
    child.stderr.on("data", chunk => { output += chunk; });
    child.on("close", code => {
      const match = output.match(/Write Transaction Hash:\s*(0x[a-fA-F0-9]{64})/);
      if (code !== 0 || !match || /contract_error|AssertionError:/.test(output)) {
        return reject(new Error(`${method} failed:\n${output.slice(0, 2500)}\n---TAIL---\n${output.slice(-6000)}`));
      }
      resolve({ hash: match[1], output });
    });
  });
}

const client = createClient({ chain: studionet });
const tx = [];
const existing = await client.readContract({ address: contract, functionName: "list_projects", args: [0, 20] });
let existingProject = existing.find(item => item.name === "StudioSplit live receipt");
let projectId = existingProject?.project_id;
if (!projectId) {
  tx.push(await write("create_project", ["StudioSplit live receipt", evidenceUrl, digest, rubric]));
  projectId = Number(await client.readContract({ address: contract, functionName: "get_project_count", args: [] }));
}
if (!existingProject || Number(existingProject.checkpoint_count) === 0) {
  tx.push(await write("submit_checkpoint", [String(projectId), evidenceUrl, digest, "WRITING", "Created and revised the written creative contribution for the frozen release evidence." ]));
}
let project = await client.readContract({ address: contract, functionName: "get_project", args: [projectId] });
if (Number(project.active_finalization_id) === 0) {
  tx.push(await write("request_finalization", [String(projectId), evidenceUrl, digest]));
  project = await client.readContract({ address: contract, functionName: "get_project", args: [projectId] });
}
tx.push(await write("adjudicate_finalization", [String(project.active_finalization_id)]));
const split = await client.readContract({ address: contract, functionName: "get_split", args: [projectId] });
console.log(JSON.stringify({ evidenceUrl, digest, projectId, tx: tx.map(item => item.hash), project, split }, null, 2));
if (split.total_bps !== 10000) throw new Error(`Expected 10000 bps, got ${split.total_bps}`);
