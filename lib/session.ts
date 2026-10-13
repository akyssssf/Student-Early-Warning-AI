export const COOKIE = {
  session: "sew_session",
  role: "sew_role",
  email: "sew_email",
  nim: "sew_nim",
} as const;

const ONE_DAY = 86400;

export type SessionInput = { role: string; email: string; nim?: string };

/**
 * Sesi demo disimpan di cookie yang dibuat di browser. Cookie ini bisa dipalsukan
 * pengguna, jadi hanya cocok untuk simulasi (lihat docs/KEAMANAN.md).
 */
export function setSession({ role, email, nim }: SessionInput): void {
  document.cookie = `${COOKIE.session}=demo-session; path=/; max-age=${ONE_DAY}; SameSite=Lax`;
  document.cookie = `${COOKIE.role}=${role}; path=/; max-age=${ONE_DAY}; SameSite=Lax`;
  document.cookie = `${COOKIE.email}=${encodeURIComponent(email)}; path=/; max-age=${ONE_DAY}; SameSite=Lax`;
  // NIM harus selalu ditulis ulang (atau dihapus) supaya tidak terbawa dari sesi lama.
  document.cookie = nim
    ? `${COOKIE.nim}=${encodeURIComponent(nim)}; path=/; max-age=${ONE_DAY}; SameSite=Lax`
    : `${COOKIE.nim}=; Max-Age=0; path=/`;
}

export function clearSession(): void {
  for (const name of Object.values(COOKIE)) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }
}

export function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const raw = document.cookie.split("; ").find((item) => item.startsWith(`${name}=`));
  if (!raw) return "";
  try {
    return decodeURIComponent(raw.slice(name.length + 1));
  } catch {
    return "";
  }
}
