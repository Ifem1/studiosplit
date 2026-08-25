"use client";

import { useParams } from "next/navigation";
import { useStudio } from "./studio-provider";
import type { ProjectRecord } from "@/lib/types";

export function useCurrentProject(): { projectId: number; project: ProjectRecord | null; loading: boolean; unavailable: boolean } {
  const params = useParams<{ id: string }>();
  const { data, loading } = useStudio();
  const projectId = Number(params?.id ?? 0);
  const project = data?.projects.find((item) => Number(item.project_id) === projectId) ?? null;
  return { projectId, project, loading, unavailable: !loading && !data };
}

export function ProjectState({ children }: { children: (state: ReturnType<typeof useCurrentProject>) => React.ReactNode }) {
  const state = useCurrentProject();
  if (state.loading) return <div className="page-wrap"><div className="empty-sheet">Reading session from chain…</div></div>;
  if (state.unavailable) return <div className="page-wrap"><div className="empty-sheet">Authoritative chain data is unavailable.</div></div>;
  if (!state.project) return <div className="page-wrap"><div className="empty-sheet">Project not found.</div></div>;
  return <>{children(state)}</>;
}
