"use client";

import { useWallet } from "./wallet-provider";

export function WriteGate({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  if (!wallet.connected) return <div className="write-gate"><p>Connect an injected wallet to write. Public reads remain available.</p><button onClick={() => void wallet.connect()}>Connect wallet</button></div>;
  if (!wallet.correctNetwork) return <div className="write-gate warning"><p>Writes are blocked: wallet must report StudioNet chain 61999.</p><button onClick={() => void wallet.switchNetwork()}>Switch network</button></div>;
  return <>{children}</>;
}
