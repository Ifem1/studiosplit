"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { StudioData } from "@/lib/types";
import { loadStudioData, type DataProvenance } from "@/lib/genlayer/data-source";

type StudioContextValue = {
  data: StudioData | null;
  provenance: DataProvenance;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StudioData | null>(null);
  const [provenance, setProvenance] = useState<DataProvenance>("unavailable");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await loadStudioData();
    setData(result.data);
    setProvenance(result.provenance);
    setError(result.error ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const value = useMemo(() => ({ data, provenance, error, loading, refresh }), [data, provenance, error, loading, refresh]);
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const value = useContext(StudioContext);
  if (!value) throw new Error("useStudio must be used inside StudioProvider");
  return value;
}
