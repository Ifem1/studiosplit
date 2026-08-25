import { TransactionStatus, type CalldataEncodable } from "genlayer-js/types";
import type { CheckpointRecord, CollaboratorRecord, FinalizationRecord, OverlapRecord, ProjectRecord, SplitRecord } from "../types";
import { createInjectedClient } from "./client";
import { requireContractAddress } from "./config";
import { inspectFinalizedExecution } from "./execution";
import { readClient } from "./read-client";

async function read<T>(functionName: string, args: CalldataEncodable[] = []): Promise<T> {
  const value = await readClient.readContract({
    address: requireContractAddress(),
    functionName,
    args
  });
  return value as T;
}

export const contractRead = {
  projectCount: () => read<number>("get_project_count"),
  projects: (start = 0, limit = 20) => read<ProjectRecord[]>("list_projects", [start, limit]),
  project: (id: number) => read<ProjectRecord>("get_project", [id]),
  collaborators: (id: number) => read<CollaboratorRecord[]>("list_collaborators", [id]),
  checkpoints: (id: number, start = 0, limit = 40) => read<CheckpointRecord[]>("list_checkpoints", [id, start, limit]),
  finalization: (id: number) => read<FinalizationRecord>("get_finalization", [id]),
  split: (id: number) => read<SplitRecord>("get_split", [id]),
  overlaps: (id: number, wallet: string, dimension: string, k = 8) => read<OverlapRecord[]>("preview_overlaps", [id, wallet, dimension, k])
};

export type WriteStage = "awaiting_signature" | "submitted" | "finality_pending" | "verified" | "failed";
export type WriteUpdate = { stage: WriteStage; hash?: string; message: string };

export async function verifiedWrite(
  expectedAddress: `0x${string}`,
  functionName: string,
  args: CalldataEncodable[],
  onUpdate?: (update: WriteUpdate) => void
): Promise<{ hash: string }> {
  onUpdate?.({ stage: "awaiting_signature", message: "Awaiting injected-wallet signature." });
  const client = await createInjectedClient(expectedAddress);
  const hash = await client.writeContract({
    address: requireContractAddress(),
    functionName,
    args,
    value: BigInt(0)
  });
  onUpdate?.({ stage: "submitted", hash, message: "Transaction submitted. This is not success yet." });
  onUpdate?.({ stage: "finality_pending", hash, message: "Waiting for FINALIZED and explicit GenVM execution result." });
  const receipt = await readClient.waitForTransactionReceipt({
    hash,
    status: TransactionStatus.FINALIZED,
  });
  const execution = inspectFinalizedExecution(receipt);
  if (!execution.ok) {
    onUpdate?.({ stage: "failed", hash, message: execution.detail });
    throw new Error(execution.detail);
  }
  onUpdate?.({ stage: "verified", hash, message: "FINALIZED with successful GenVM execution. Re-reading authoritative state." });
  return { hash };
}
