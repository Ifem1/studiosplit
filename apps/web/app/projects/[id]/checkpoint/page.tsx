"use client";

import { useState } from "react";
import { ProjectState } from "@/components/project-state";
import { ProjectHeader } from "@/components/project-header";
import { ProjectNav } from "@/components/project-nav";
import { WriteGate } from "@/components/write-gate";
import { TransactionRail } from "@/components/transaction-rail";
import { useWallet } from "@/components/wallet-provider";
import { useStudio } from "@/components/studio-provider";
import { DATA_MODE } from "@/lib/genlayer/config";
import { verifiedWrite, type WriteUpdate } from "@/lib/genlayer/contract";

export default function CheckpointPage(){
 const wallet=useWallet(); const studio=useStudio(); const [url,setUrl]=useState(""); const [digest,setDigest]=useState(""); const [dimension,setDimension]=useState("WRITING"); const [claim,setClaim]=useState(""); const [tx,setTx]=useState<WriteUpdate|null>(null); const [error,setError]=useState<string|null>(null);
 return <ProjectState>{({projectId,project})=>{ const dims=(()=>{try{return JSON.parse(project!.rubric_json).dimensions as {code:string;weight:number}[]}catch{return[]}})();
 async function submit(e:React.FormEvent){e.preventDefault();if(!wallet.address)return;try{setError(null);await verifiedWrite(wallet.address,"submit_checkpoint",[projectId,url,digest,dimension,claim],setTx);await studio.refresh();setUrl("");setDigest("");setClaim("");}catch(cause){setError(cause instanceof Error?cause.message:"Checkpoint failed.")}}
 return <div className="page-wrap"><ProjectHeader project={project!}/><ProjectNav projectId={projectId}/>
  <section className="session-sheet recorder-sheet"><div className="artifact-strip"><span>ARTIFACT VERSION</span><strong>project v{project!.version}</strong><code>rubric {project!.rubric_frozen?"FROZEN":"OPEN"}</code></div>
   <WriteGate><form className="ruled-form" onSubmit={submit}><label>Public immutable/versioned artifact URL<input type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://…" required/></label><label>SHA-256 digest<input className="mono" value={digest} onChange={e=>setDigest(e.target.value)} placeholder="sha256:…" required/></label>
   <fieldset className="track-assignment"><legend>Track assignment</legend>{dims.map(d=><label key={d.code}><input type="radio" name="dimension" checked={dimension===d.code} onChange={()=>setDimension(d.code)}/><span>{d.code.replaceAll("_"," ")}</span><small>{d.weight} wt</small></label>)}</fieldset>
   <label>Contribution note<textarea value={claim} maxLength={800} onChange={e=>setClaim(e.target.value)} placeholder="Describe the bounded contribution evidenced by this exact artifact version…" required/></label><button className="record-button" disabled={DATA_MODE!=="live"}>● Record checkpoint</button></form></WriteGate>
   {DATA_MODE!=="live"?<p className="fixture-callout">Fixture mode: form is visible for UX review but cannot write.</p>:null}{error?<p className="inline-error">{error}</p>:null}<TransactionRail update={tx}/></section></div>}}</ProjectState>
}
