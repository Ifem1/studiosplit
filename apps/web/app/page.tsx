"use client";

import Link from "next/link";
import { useState } from "react";
import { useStudio } from "@/components/studio-provider";
import { useWallet } from "@/components/wallet-provider";
import { WriteGate } from "@/components/write-gate";
import { TransactionRail } from "@/components/transaction-rail";
import { DATA_MODE } from "@/lib/genlayer/config";
import { verifiedWrite, type WriteUpdate } from "@/lib/genlayer/contract";

const defaultRubric = JSON.stringify({ dimensions: [
  { code: "WRITING", weight: 30 },
  { code: "ARRANGEMENT", weight: 20 },
  { code: "PRODUCTION", weight: 25 },
  { code: "VISUAL_EDIT", weight: 15 },
  { code: "DIRECTION", weight: 10 }
] }, null, 2);

export default function ProjectTapePage() {
  const { data, loading, provenance, refresh } = useStudio();
  const wallet = useWallet();
  const [tx, setTx] = useState<WriteUpdate | null>(null);
  const [form, setForm] = useState({ name: "", charterUrl: "", charterDigest: "", rubric: defaultRubric });
  const [formError, setFormError] = useState<string | null>(null);

  async function createProject(event: React.FormEvent) {
    event.preventDefault();
    if (!wallet.address) return;
    try {
      setFormError(null);
      await verifiedWrite(wallet.address, "create_project", [form.name, form.charterUrl, form.charterDigest, form.rubric], setTx);
      await refresh();
      setForm((old) => ({ ...old, name: "", charterUrl: "", charterDigest: "" }));
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : "Project creation failed.");
    }
  }

  return (
    <div className="page-wrap project-tape-page">
      <section className="tape-console">
        <div className="reel-shelf">
          <div className="big-reel" aria-hidden><i /><i /><i /></div>
          <div><p className="eyebrow">SESSION SHELF</p><h1>Project tape</h1><p>Each reel is one project-version-bound credit record. The chain is the session master.</p></div>
        </div>
        <div className="tape-line" aria-hidden><span className="tape-head" /></div>
        {loading ? <div className="empty-sheet">Reading project tape…</div> : !data ? <div className="empty-sheet">Authoritative project data is unavailable.</div> : data.projects.length === 0 ? <div className="empty-sheet">No projects recorded yet.</div> : (
          <div className="project-reel-list">
            {data.projects.map((project) => (
              <Link href={`/projects/${project.project_id}/lanes`} key={project.project_id} className="project-reel-row">
                <span className="mini-reel" aria-hidden><i /><i /></span>
                <span className="reel-index">SS-{String(project.project_id).padStart(3, "0")}</span>
                <span className="reel-name"><strong>{project.name}</strong><small>v{project.version} · {project.checkpoint_count} checkpoints</small></span>
                <span className={`status-text status-${project.status.toLowerCase()}`}>{project.status}</span>
                <span className="open-cue">OPEN →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="session-sheet create-sheet">
        <div className="sheet-heading"><div><p className="eyebrow">NEW REEL</p><h2>Create project</h2></div><span className={`provenance provenance-${provenance}`}>{provenance}</span></div>
        {DATA_MODE !== "live" ? <p className="fixture-callout">Fixture mode is for visual/direct development. Switch to live mode + a verified contract address before writes.</p> : null}
        <WriteGate>
          <form onSubmit={createProject} className="ruled-form">
            <label>Project name<input value={form.name} maxLength={96} required onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Public charter URL<input type="url" placeholder="https://…" value={form.charterUrl} required onChange={(e) => setForm({ ...form, charterUrl: e.target.value })} /></label>
            <label>Charter SHA-256 digest<input className="mono" placeholder="sha256:…" value={form.charterDigest} required onChange={(e) => setForm({ ...form, charterDigest: e.target.value })} /></label>
            <label>5-dimension rubric JSON<textarea className="mono rubric-input" value={form.rubric} required onChange={(e) => setForm({ ...form, rubric: e.target.value })} /></label>
            <button className="record-button" disabled={DATA_MODE !== "live"}>Create on StudioNet</button>
          </form>
        </WriteGate>
        {formError ? <p className="inline-error">{formError}</p> : null}
        <TransactionRail update={tx} />
      </section>
    </div>
  );
}
