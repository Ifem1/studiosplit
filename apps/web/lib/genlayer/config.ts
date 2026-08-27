import { studionet } from "genlayer-js/chains";

export const STUDIONET_CHAIN_ID = 61999;
export const STUDIONET_HEX_CHAIN_ID = "0xf22f";
export const STUDIONET_ENDPOINT = process.env.NEXT_PUBLIC_GENLAYER_ENDPOINT || "https://studio.genlayer.com/api";
export const STUDIONET_EXPLORER = "https://explorer-studio.genlayer.com";
export const STUDIOSPLIT_CHAIN = studionet;
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_STUDIOSPLIT_CONTRACT || "") as `0x${string}` | "";
export const DATA_MODE = process.env.NEXT_PUBLIC_STUDIOSPLIT_DATA === "live" ? "live" : "fixture";

export const REQUIRED_METHODS = [
  "create_project",
  "add_collaborator",
  "accept_collaboration",
  "submit_checkpoint",
  "request_finalization",
  "adjudicate_finalization",
  "cancel_finalization",
  "retry_finalization",
  "get_project_count",
  "get_project",
  "list_projects",
  "list_collaborators",
  "get_checkpoint",
  "list_checkpoints",
  "get_finalization",
  "get_split",
  "preview_overlaps"
] as const;

export function requireContractAddress(): `0x${string}` {
  if (!/^0x[a-fA-F0-9]{40}$/.test(CONTRACT_ADDRESS)) {
    throw new Error("StudioSplit live mode is unavailable: NEXT_PUBLIC_STUDIOSPLIT_CONTRACT is missing or invalid.");
  }
  return CONTRACT_ADDRESS as `0x${string}`;
}
