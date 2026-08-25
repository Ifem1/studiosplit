import { readFileSync } from "node:fs";

const required = [
  "create_project", "add_collaborator", "submit_checkpoint", "request_finalization",
  "adjudicate_finalization", "cancel_finalization", "get_project_count", "get_project",
  "list_projects", "list_collaborators", "get_checkpoint", "list_checkpoints",
  "get_finalization", "get_split", "preview_overlaps"
];
const source = readFileSync(new URL("../contracts/studiosplit.py", import.meta.url), "utf8");
const missing = required.filter((name) => !new RegExp(`def\\s+${name}\\s*\\(`).test(source));
if (missing.length) {
  console.error(`Missing contract methods: ${missing.join(", ")}`);
  process.exit(1);
}
console.log(`Source schema check passed: ${required.length}/${required.length} required methods present.`);
console.log("NOTE: this verifies repository source only. Deployed StudioNet schema still requires post-deployment verification.");
