"use client";

import Link from "next/link";
import { useWallet } from "./wallet-provider";
import { useStudio } from "./studio-provider";
import { STUDIONET_CHAIN_ID } from "@/lib/genlayer/config";

function shortAddress(value: string) { return `${value.slice(0, 6)}…${value.slice(-4)}`; }

export function AppShell({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const studio = useStudio();
  return (
    <div className="studio-shell">
      <header className="studio-header">
        <Link href="/" className="brand-lockup" aria-label="StudioSplit home">
          <span className="reel-mark"><i /><i /></span>
          <span><strong>StudioSplit</strong><small>credit console</small></span>
        </Link>
        <div className="header-status">
          <span className={`provenance provenance-${studio.provenance}`}>{studio.provenance === "live" ? "LIVE · STUDIONET" : studio.provenance === "fixture" ? "FIXTURE · LOCAL" : "CHAIN · UNAVAILABLE"}</span>
          <span className="chain-readout">target {STUDIONET_CHAIN_ID} · wallet {wallet.chainId ?? "—"}</span>
          {!wallet.connected ? (
            <button className="utility-button" onClick={() => void wallet.connect()}>Connect wallet</button>
          ) : !wallet.correctNetwork ? (
            <button className="utility-button warning" onClick={() => void wallet.switchNetwork()}>Switch to StudioNet</button>
          ) : (
            <span className="wallet-address">{shortAddress(wallet.address!)}</span>
          )}
        </div>
      </header>
      {wallet.error ? <div className="global-notice error">{wallet.error}</div> : null}
      {studio.error ? <div className="global-notice error">{studio.error}</div> : null}
      <main>{children}</main>
      <footer className="studio-footer">Contract + browser only · semantic distance is relatedness, never truth · writes require an injected wallet</footer>
    </div>
  );
}
