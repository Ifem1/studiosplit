import { fixtureData } from "../fixture";
import type { StudioData } from "../types";
import { CONTRACT_ADDRESS, DATA_MODE } from "./config";
import { contractRead } from "./contract";

export type DataProvenance = "fixture" | "live" | "unavailable";

const LIVE_READ_TIMEOUT_MS = 15_000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => window.setTimeout(() => reject(new Error("StudioNet read timed out.")), timeoutMs)),
  ]);
}

async function loadStudioDataUnbounded(): Promise<{ data: StudioData | null; provenance: DataProvenance; error?: string }> {
  if (DATA_MODE === "fixture") return { data: fixtureData, provenance: "fixture" };
  if (!CONTRACT_ADDRESS) return { data: null, provenance: "unavailable", error: "Live mode requires NEXT_PUBLIC_STUDIOSPLIT_CONTRACT. No fixture fallback was used." };
  try {
    const projects = await contractRead.projects(0, 20);
    const data: StudioData = { projects, collaborators: {}, checkpoints: {}, finalizations: {}, splits: {} };
    for (const project of projects) {
      const id = Number(project.project_id);
      data.collaborators[id] = await contractRead.collaborators(id);
      data.checkpoints[id] = await contractRead.checkpoints(id, 0, 40);
      data.splits[id] = await contractRead.split(id);
      data.finalizations[id] = Number(project.active_finalization_id) > 0
        ? await contractRead.finalization(Number(project.active_finalization_id))
        : null;
    }
    return { data, provenance: "live" };
  } catch (error) {
    return { data: null, provenance: "unavailable", error: error instanceof Error ? error.message : "Live StudioNet read failed." };
  }
}

export function loadStudioData(): Promise<{ data: StudioData | null; provenance: DataProvenance; error?: string }> {
  return withTimeout(loadStudioDataUnbounded(), LIVE_READ_TIMEOUT_MS).catch((error) => ({
    data: null,
    provenance: "unavailable" as const,
    error: error instanceof Error ? error.message : "Live StudioNet read failed.",
  }));
}
