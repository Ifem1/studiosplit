import { ExecutionResult } from "genlayer-js/types";

export type FinalitySnapshot = {
  ok: boolean;
  executionName: string;
  detail: string;
};

export function inspectFinalizedExecution(receipt: { txExecutionResultName?: unknown }): FinalitySnapshot {
  const value = receipt?.txExecutionResultName;
  if (value === ExecutionResult.FINISHED_WITH_RETURN) {
    return { ok: true, executionName: String(value), detail: "GenVM execution finished successfully." };
  }
  if (value === ExecutionResult.FINISHED_WITH_ERROR) {
    return { ok: false, executionName: String(value), detail: "Transaction finalized, but GenVM execution failed or rolled back." };
  }
  return { ok: false, executionName: String(value ?? "UNKNOWN"), detail: "Finality did not contain an explicit successful GenVM execution result." };
}
