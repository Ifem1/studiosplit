"use client";

import { ProjectState } from "@/components/project-state";
import { ProjectHeader } from "@/components/project-header";
import { ProjectNav } from "@/components/project-nav";
import { useStudio } from "@/components/studio-provider";

function displayText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function displayTimestamp(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "Timestamp unavailable";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export default function ArtifactsPage() {
  const studio = useStudio();

  return <ProjectState>{({ projectId, project }) => {
    const checkpoints = studio.data?.checkpoints[projectId] ?? [];
    return <div className="page-wrap">
      <ProjectHeader project={project!} />
      <ProjectNav projectId={projectId} />
      <section className="artifact-room">
        <div className="version-reel">
          <div className="big-reel small" aria-hidden><i /><i /><i /></div>
          <div><p className="eyebrow">VERSION ROOM</p><h2>Frozen evidence references</h2><p>StudioSplit stores references and digests, not the creative files themselves.</p></div>
        </div>
        <div className="artifact-ledger">
          {checkpoints.length ? checkpoints.map((checkpoint) => {
            const dimension = displayText(checkpoint.dimension_code, "Unlabelled dimension");
            const contribution = displayText(checkpoint.contribution_text, "Contribution text unavailable.");
            const artifactUrl = displayText(checkpoint.artifact_url, "");
            const digest = displayText(checkpoint.artifact_digest, "Digest unavailable");
            return <article key={checkpoint.checkpoint_id}>
              <span className="marker-index">#{checkpoint.checkpoint_id}</span>
              <div>
                <strong>{dimension.replaceAll("_", " ")}</strong>
                <p>{contribution}</p>
                {artifactUrl ? <a href={artifactUrl} target="_blank" rel="noreferrer">Open public evidence ↗</a> : <span>Public evidence URL unavailable</span>}
                <code>{digest}</code>
              </div>
              <time>{displayTimestamp(checkpoint.submitted_at)}</time>
            </article>;
          }) : <div className="empty-sheet">No artifact checkpoints recorded.</div>}
        </div>
      </section>
    </div>;
  }}</ProjectState>;
}
