"use client";

import type { WriteUpdate } from "@/lib/genlayer/contract";

export function TransactionRail({ update }: { update: WriteUpdate | null }) {
  if (!update) return null;
  return (
    <aside className={`tx-rail tx-${update.stage}`} aria-live="polite">
      <div className="tx-tape-dot" />
      <div>
        <strong>{update.stage.replaceAll("_", " ").toUpperCase()}</strong>
        <p>{update.message}</p>
        {update.hash ? <code>{update.hash}</code> : null}
      </div>
    </aside>
  );
}
