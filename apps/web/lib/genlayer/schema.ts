import { REQUIRED_METHODS } from "./config";

export function validateMethodNames(methods: Iterable<string>): { ok: boolean; missing: string[] } {
  const available = new Set(methods);
  const missing = REQUIRED_METHODS.filter((name) => !available.has(name));
  return { ok: missing.length === 0, missing: [...missing] };
}
