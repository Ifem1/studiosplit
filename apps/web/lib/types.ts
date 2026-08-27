export type ProjectStatus =
  | "OPEN"
  | "CHECKPOINTING"
  | "FINALIZATION_REQUESTED"
  | "UNDER_REVIEW"
  | "FINALIZED"
  | "ABSTAINED"
  | "CANCELLED";

export type ProjectRecord = {
  project_id: number;
  creator: `0x${string}`;
  name: string;
  charter_url: string;
  charter_digest: string;
  rubric_json: string;
  status: ProjectStatus;
  collaborator_count: number;
  checkpoint_count: number;
  version: number;
  rubric_frozen: boolean;
  active_finalization_id: number;
};

export type CollaboratorRecord = {
  wallet: `0x${string}`;
  role_label: string;
  active: boolean;
  accepted: boolean;
  checkpoint_count: number;
};

export type CheckpointRecord = {
  checkpoint_id: number;
  project_id: number;
  contributor: `0x${string}`;
  artifact_url: string;
  artifact_digest: string;
  dimension_code: string;
  contribution_text: string;
  project_version: number;
  submitted_at: string;
};

export type OverlapRecord = {
  checkpoint_id: number;
  contributor: `0x${string}`;
  dimension_code: string;
  project_version: number;
  distance: string;
  excerpt: string;
  artifact_digest: string;
};

export type FinalizationRecord = {
  finalization_id: number;
  project_id: number;
  release_url: string;
  release_digest: string;
  status: "REQUESTED" | "FINALIZED" | "ABSTAINED" | "CANCELLED";
  base_version: number;
  frozen_checkpoint_count: number;
  band_matrix_json: string;
  overlap_refs_json: string;
  rationale: string;
  requested_at: string;
  resolved_at: string;
};

export type SplitEntry = {
  wallet: `0x${string}`;
  bps: number;
  score_units: number;
};

export type SplitRecord = {
  project_id: number;
  status: ProjectStatus;
  finalization_id: number;
  release_digest: string;
  total_bps: number;
  entries: SplitEntry[];
};

export type StudioData = {
  projects: ProjectRecord[];
  collaborators: Record<number, CollaboratorRecord[]>;
  checkpoints: Record<number, CheckpointRecord[]>;
  finalizations: Record<number, FinalizationRecord | null>;
  splits: Record<number, SplitRecord>;
};
