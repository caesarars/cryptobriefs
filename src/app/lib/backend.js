// Centralized backend base URL helper.
// Use NEXT_PUBLIC_API_BASE in .env.local / Vercel env.

export const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

export function api(path) {
  const p = String(path || "");
  if (!p.startsWith("/")) throw new Error(`api(): path must start with "/" (got: ${p})`);
  return BACKEND_BASE ? `${BACKEND_BASE}${p}` : p;
}
