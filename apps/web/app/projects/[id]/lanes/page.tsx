"use client";

import { useState } from "react";
import { ProjectState } from "@/components/project-state";
import { ProjectHeader } from "@/components/project-header";
import { ProjectNav } from "@/components/project-nav";
import { useStudio } from "@/components/studio-provider";
import { useWallet } from "@/components/wallet-provider";
import { WriteGate } from "@/components/write-gate";
import { TransactionRail } from "@/components/transaction-rail";
import { DATA_MODE } from "@/lib/genlayer/config";
import { verifiedWrite, type WriteUpdate } from "@/lib/genlayer/contract";

export default function LanesPage() {
  const studio = useStudio();
  const wallet = useWallet();
  const [newWallet, setNewWallet] = useState("");
  const [role, setRole] = useState("");
  const [tx, setTx] = useState<WriteUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);

  return <ProjectState>{({ projectId, project }) => {
    const collaborators = studio.data?.collaborators[projectId] ?? [];
    const checkpoints = studio.data?.checkpoints[projectId] ?? [];
    const dimensions = (() => { try { return JSON.parse(project!.rubric_json).dimensions as {code:string;weight:number}[]; } catch { return []; } })();
    async function addCollaborator(e: React.FormEvent) {
      e.preventDefault(); if (!wallet.address) return;
      try { setError(null); await verifiedWrite(wallet.address, "add_collaborator", [projectId, newWallet, role], setTx); await studio.refresh(); setNewWallet(""); setRole(""); }
      catch (cause) { setError(cause instanceof Error ? cause.message : "Collaborator write failed."); }
    }
    return <div className="page-wrap">
      <ProjectHeader project={project!}/><ProjectNav projectId={projectId}/>
      <section className="mixer-board">
        <div className="board-label"><p className="eyebrow">COLLABORATOR LANES</p><span>{collaborators.length} active channels</span></div>
        <div className="channel-bank">
          {collaborators.map((c, index) => {
            const mine = checkpoints.filter(cp => cp.contributor.toLowerCase() === c.wallet.toLowerCase());
            return <article className="mixer-channel" key={c.wallet}>
              <div className="channel-number">CH {String(index+1).padStart(2,"0")}</div>
              <div className="knob" aria-hidden><i/></div>
              <h2>{c.role_label}</h2><code>{c.wallet.slice(0,8)}…{c.wallet.slice(-5)}</code>
              <div className="dimension-leds">{dimensions.map(d => <span key={d.code} className={mine.some(cp => cp.dimension_code === d.code) ? "lit" : ""}>{d.code.replace("_"," ")}</span>)}</div>
              <div className="fader-track"><span style={{height:`${Math.min(88, 18 + mine.length*14)}%`}}/><i/></div>
              <strong>{mine.length}</strong><small>checkpoints</small>
            </article>;
          })}
        </div>
      </section>
      <section className="session-sheet compact-sheet"><h2>Patch a collaborator into the session</h2>
        <WriteGate><form className="inline-form" onSubmit={addCollaborator}>
          <label>Wallet<input className="mono" value={newWallet} onChange={e=>setNewWallet(e.target.value)} placeholder="0x…" required /></label>
          <label>Role label<input value={role} maxLength={48} onChange={e=>setRole(e.target.value)} required /></label>
          <button disabled={DATA_MODE!=="live"}>Add channel</button>
        </form></WriteGate>
        {DATA_MODE!=="live"?<p className="fixture-callout">Write control is disabled in fixture mode.</p>:null}{error?<p className="inline-error">{error}</p>:null}<TransactionRail update={tx}/>
      </section>
    </div>;
  }}</ProjectState>;
}
