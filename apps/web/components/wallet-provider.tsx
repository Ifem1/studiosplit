"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { inspectInjectedWallet, requestInjectedAccount, switchInjectedWalletToStudioNet } from "@/lib/genlayer/client";
import { STUDIONET_CHAIN_ID } from "@/lib/genlayer/config";

type WalletContextValue = {
  address: `0x${string}` | null;
  chainId: number | null;
  connected: boolean;
  correctNetwork: boolean;
  error: string | null;
  connect: () => Promise<void>;
  switchNetwork: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const state = await inspectInjectedWallet();
      setAddress(state.address);
      setChainId(state.chainId);
      setError(null);
    } catch (cause) {
      setAddress(null);
      setChainId(null);
      setError(cause instanceof Error ? cause.message : "Wallet state is unavailable.");
    }
  }, []);

  // We inspect already-authorized accounts without requesting access. This is not auto-connect.
  useEffect(() => {
    void refresh();
    if (typeof window === "undefined" || !window.ethereum?.on) return;
    const onAccounts = () => void refresh();
    const onChain = () => void refresh();
    const onDisconnect = () => { setAddress(null); setChainId(null); };
    window.ethereum.on("accountsChanged", onAccounts);
    window.ethereum.on("chainChanged", onChain);
    window.ethereum.on("disconnect", onDisconnect);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", onAccounts);
      window.ethereum?.removeListener?.("chainChanged", onChain);
      window.ethereum?.removeListener?.("disconnect", onDisconnect);
    };
  }, [refresh]);

  const connect = useCallback(async () => {
    try {
      setError(null);
      await requestInjectedAccount();
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Wallet connection failed.");
    }
  }, [refresh]);

  const switchNetwork = useCallback(async () => {
    try {
      setError(null);
      await switchInjectedWalletToStudioNet(address ?? undefined);
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Network switch failed.");
    }
  }, [address, refresh]);

  const value = useMemo<WalletContextValue>(() => ({
    address,
    chainId,
    connected: Boolean(address),
    correctNetwork: chainId === STUDIONET_CHAIN_ID,
    error,
    connect,
    switchNetwork
  }), [address, chainId, error, connect, switchNetwork]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const value = useContext(WalletContext);
  if (!value) throw new Error("useWallet must be used inside WalletProvider");
  return value;
}
