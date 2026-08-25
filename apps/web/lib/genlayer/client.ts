import { createClient } from "genlayer-js";
import { STUDIONET_CHAIN_ID, STUDIOSPLIT_CHAIN } from "./config";

export type Eip1193Provider = {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
  on?(event: string, listener: (...args: unknown[]) => void): void;
  removeListener?(event: string, listener: (...args: unknown[]) => void): void;
};

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

function normalizeAddress(value: unknown): `0x${string}` {
  if (typeof value !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error("Wallet returned an invalid account.");
  }
  return value as `0x${string}`;
}

export async function inspectInjectedWallet(): Promise<{ address: `0x${string}` | null; chainId: number | null }> {
  if (typeof window === "undefined" || !window.ethereum) return { address: null, chainId: null };
  const [accountsRaw, chainRaw] = await Promise.all([
    window.ethereum.request({ method: "eth_accounts" }),
    window.ethereum.request({ method: "eth_chainId" })
  ]);
  const accounts = Array.isArray(accountsRaw) ? accountsRaw : [];
  const address = accounts.length ? normalizeAddress(accounts[0]) : null;
  const chainId = typeof chainRaw === "string" ? Number.parseInt(chainRaw, 16) : null;
  return { address, chainId: Number.isFinite(chainId) ? chainId : null };
}

export async function requestInjectedAccount(): Promise<`0x${string}`> {
  if (typeof window === "undefined" || !window.ethereum) throw new Error("No injected EIP-1193 wallet was detected.");
  const raw = await window.ethereum.request({ method: "eth_requestAccounts" });
  if (!Array.isArray(raw) || !raw.length) throw new Error("Wallet connection was refused or returned no account.");
  return normalizeAddress(raw[0]);
}

export async function createInjectedClient(expectedAddress?: `0x${string}`) {
  if (typeof window === "undefined" || !window.ethereum) throw new Error("No injected EIP-1193 wallet was detected.");
  const { address, chainId } = await inspectInjectedWallet();
  if (!address) throw new Error("Connect an injected wallet before writing.");
  if (expectedAddress && address.toLowerCase() !== expectedAddress.toLowerCase()) {
    throw new Error("The active wallet account changed. Reconfirm the connected account before signing.");
  }
  if (chainId !== STUDIONET_CHAIN_ID) {
    throw new Error(`Wrong network. StudioSplit writes require StudioNet chain ${STUDIONET_CHAIN_ID}; wallet reports ${chainId ?? "unknown"}.`);
  }
  return createClient({ chain: STUDIOSPLIT_CHAIN, account: address, provider: window.ethereum });
}

export async function switchInjectedWalletToStudioNet(address?: `0x${string}`): Promise<void> {
  if (typeof window === "undefined" || !window.ethereum) throw new Error("No injected wallet detected.");
  const account = address ?? (await requestInjectedAccount());
  const client = createClient({ chain: STUDIOSPLIT_CHAIN, account, provider: window.ethereum });
  await client.connect("studionet");
  const state = await inspectInjectedWallet();
  if (state.chainId !== STUDIONET_CHAIN_ID) throw new Error("Wallet did not switch to StudioNet.");
}
