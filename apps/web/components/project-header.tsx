import type { ProjectRecord } from "@/lib/types";

export function ProjectHeader({ project }: { project: ProjectRecord }) {
  return (
    <section className="project-heading">
      <div>
        <p className="eyebrow">PROJECT {project.project_id} · VERSION {project.version}</p>
        <h1>{project.name}</h1>
      </div>
      <dl className="project-meter">
        <div><dt>Status</dt><dd>{project.status}</dd></div>
        <div><dt>Channels</dt><dd>{project.collaborator_count}/8</dd></div>
        <div><dt>Markers</dt><dd>{project.checkpoint_count}</dd></div>
      </dl>
    </section>
  );
}
