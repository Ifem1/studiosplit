import type { StudioData } from "./types";

export const fixtureData: StudioData = {
  projects: [
    {
      project_id: 1,
      creator: "0x1111111111111111111111111111111111111111",
      name: "Afterglow Sessions",
      charter_url: "https://example.com/studiosplit/afterglow-charter-v1.txt",
      charter_digest: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      rubric_json: JSON.stringify({
        dimensions: [
          { code: "WRITING", weight: 30 },
          { code: "ARRANGEMENT", weight: 20 },
          { code: "PRODUCTION", weight: 25 },
          { code: "VISUAL_EDIT", weight: 15 },
          { code: "DIRECTION", weight: 10 }
        ]
      }),
      status: "FINALIZED",
      collaborator_count: 4,
      checkpoint_count: 6,
      version: 1,
      rubric_frozen: true,
      active_finalization_id: 1
    }
  ],
  collaborators: {
    1: [
      { wallet: "0x1111111111111111111111111111111111111111", role_label: "Writer / Director", active: true, checkpoint_count: 2 },
      { wallet: "0x2222222222222222222222222222222222222222", role_label: "Producer", active: true, checkpoint_count: 2 },
      { wallet: "0x3333333333333333333333333333333333333333", role_label: "Arranger", active: true, checkpoint_count: 1 },
      { wallet: "0x4444444444444444444444444444444444444444", role_label: "Visual Editor", active: true, checkpoint_count: 1 }
    ]
  },
  checkpoints: {
    1: [
      { checkpoint_id: 1, project_id: 1, contributor: "0x1111111111111111111111111111111111111111", artifact_url: "https://example.com/evidence/lyrics-v3.txt", artifact_digest: "sha256:1111111111111111111111111111111111111111111111111111111111111111", dimension_code: "WRITING", contribution_text: "Drafted and revised the final verse and bridge used in the release.", project_version: 1, submitted_at: "2026-08-18T11:05:00+01:00" },
      { checkpoint_id: 2, project_id: 1, contributor: "0x3333333333333333333333333333333333333333", artifact_url: "https://example.com/evidence/chorus-arrangement-v1.txt", artifact_digest: "sha256:2222222222222222222222222222222222222222222222222222222222222222", dimension_code: "ARRANGEMENT", contribution_text: "Created the chorus call-and-response arrangement and harmonic stack.", project_version: 1, submitted_at: "2026-08-19T09:20:00+01:00" },
      { checkpoint_id: 3, project_id: 1, contributor: "0x2222222222222222222222222222222222222222", artifact_url: "https://example.com/evidence/chorus-refinement-v2.txt", artifact_digest: "sha256:3333333333333333333333333333333333333333333333333333333333333333", dimension_code: "ARRANGEMENT", contribution_text: "Refined the chorus voicing and transition based on the existing arrangement.", project_version: 1, submitted_at: "2026-08-19T15:42:00+01:00" },
      { checkpoint_id: 4, project_id: 1, contributor: "0x2222222222222222222222222222222222222222", artifact_url: "https://example.com/evidence/mix-v5.txt", artifact_digest: "sha256:4444444444444444444444444444444444444444444444444444444444444444", dimension_code: "PRODUCTION", contribution_text: "Produced the final instrumental, vocal processing and release mix.", project_version: 1, submitted_at: "2026-08-20T13:12:00+01:00" },
      { checkpoint_id: 5, project_id: 1, contributor: "0x4444444444444444444444444444444444444444", artifact_url: "https://example.com/evidence/video-cut-v4.txt", artifact_digest: "sha256:5555555555555555555555555555555555555555555555555555555555555555", dimension_code: "VISUAL_EDIT", contribution_text: "Edited the performance video and delivered the release master cut.", project_version: 1, submitted_at: "2026-08-21T18:02:00+01:00" },
      { checkpoint_id: 6, project_id: 1, contributor: "0x1111111111111111111111111111111111111111", artifact_url: "https://example.com/evidence/direction-notes-v2.txt", artifact_digest: "sha256:6666666666666666666666666666666666666666666666666666666666666666", dimension_code: "DIRECTION", contribution_text: "Set the creative brief, release direction and final sequencing decisions.", project_version: 1, submitted_at: "2026-08-22T10:11:00+01:00" }
    ]
  },
  finalizations: {
    1: {
      finalization_id: 1,
      project_id: 1,
      release_url: "https://example.com/releases/afterglow-v1.txt",
      release_digest: "sha256:7777777777777777777777777777777777777777777777777777777777777777",
      status: "FINALIZED",
      base_version: 1,
      frozen_checkpoint_count: 6,
      band_matrix_json: JSON.stringify([
        { wallet: "0x1111111111111111111111111111111111111111", dimension: "WRITING", band: 5, relation: "NORMAL" },
        { wallet: "0x2222222222222222222222222222222222222222", dimension: "PRODUCTION", band: 5, relation: "NORMAL" },
        { wallet: "0x3333333333333333333333333333333333333333", dimension: "ARRANGEMENT", band: 5, relation: "NORMAL" },
        { wallet: "0x2222222222222222222222222222222222222222", dimension: "ARRANGEMENT", band: 2, relation: "DEPENDENT" },
        { wallet: "0x4444444444444444444444444444444444444444", dimension: "VISUAL_EDIT", band: 5, relation: "NORMAL" }
      ]),
      overlap_refs_json: "[2,3]",
      rationale: "Fixture only: contribution bands recognize original arrangement and dependent refinement separately.",
      requested_at: "2026-08-23T12:00:00+01:00",
      resolved_at: "2026-08-23T12:04:00+01:00"
    }
  },
  splits: {
    1: {
      project_id: 1,
      status: "FINALIZED",
      finalization_id: 1,
      release_digest: "sha256:7777777777777777777777777777777777777777777777777777777777777777",
      total_bps: 10000,
      entries: [
        { wallet: "0x1111111111111111111111111111111111111111", bps: 3350, score_units: 190 },
        { wallet: "0x2222222222222222222222222222222222222222", bps: 3150, score_units: 178 },
        { wallet: "0x3333333333333333333333333333333333333333", bps: 2100, score_units: 119 },
        { wallet: "0x4444444444444444444444444444444444444444", bps: 1400, score_units: 79 }
      ]
    }
  }
};
