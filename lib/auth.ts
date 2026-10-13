"use client";

export type UserRole = "mahasiswa" | "dosen" | "kaprodi" | "admin" | "orangtua";

export type RegisteredUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  nim?: string;
  /** `false` = akun dinonaktifkan admin. Kosong dianggap aktif. */
  active?: boolean;
};

export type AuthErrorCode = "EMAIL_ALREADY_EXISTS" | "NIM_ALREADY_EXISTS" | "USER_NOT_FOUND";

export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
  }
}

const STORAGE_KEY = "sew_registered_users";

/**
 * Akun demo bawaan. Selalu tersedia untuk simulasi/presentasi.
 * Akun baru hasil pendaftaran disimpan di localStorage (hanya di browser ini).
 */
export const DEFAULT_USERS: RegisteredUser[] = [
  { name: "Alya Putri", email: "alya@student.uns.ac.id", password: "123456", role: "mahasiswa", nim: "2024001" },
  { name: "Bagas Pratama", email: "bagas@student.uns.ac.id", password: "123456", role: "mahasiswa", nim: "2024002" },
  { name: "Citra Lestari", email: "citra@student.uns.ac.id", password: "123456", role: "mahasiswa", nim: "2024003" },
  { name: "Dimas Ramadhan", email: "dimas@student.uns.ac.id", password: "123456", role: "mahasiswa", nim: "2024004" },
  { name: "Eka Sari", email: "eka@student.uns.ac.id", password: "123456", role: "mahasiswa", nim: "2024005" },
  { name: "Admin Student Early", email: "admin@student.uns.ac.id", password: "123456", role: "admin" },
  { name: "Kaprodi Teknik Informatika", email: "kaprodi@student.uns.ac.id", password: "123456", role: "kaprodi" },
  { name: "Dosen PA", email: "dosen@student.uns.ac.id", password: "123456", role: "dosen" },
  { name: "Orang Tua Mahasiswa", email: "orangtua@example.com", password: "123456", role: "orangtua" },
];

const normalizeEmail = (email: string) => email.trim().toLowerCase();

function persist(users: RegisteredUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // localStorage bisa tidak tersedia (mode privat/kuota penuh); akun demo tetap bisa dipakai.
  }
}

function isRegisteredUser(value: unknown): value is RegisteredUser {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.name === "string" && typeof item.email === "string" && typeof item.password === "string" && typeof item.role === "string";
}

/** Ambil semua user: akun hasil pendaftaran + akun demo yang belum ada. */
export function getUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return DEFAULT_USERS;

  let stored: RegisteredUser[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) stored = parsed.filter(isRegisteredUser).filter((user) => user.role !== ("staff" as string));
  } catch {
    stored = [];
  }

  const missingDefaults = DEFAULT_USERS.filter(
    (demo) => !stored.some((user) => normalizeEmail(user.email) === normalizeEmail(demo.email)),
  );
  const users = [...stored, ...missingDefaults];
  if (missingDefaults.length > 0 || stored.length === 0) persist(users);
  return users;
}

export function getUserByEmail(email: string): RegisteredUser | undefined {
  const target = normalizeEmail(email);
  return getUsers().find((user) => normalizeEmail(user.email) === target);
}

/** Cocokkan email + password. Pemanggil perlu memeriksa `isUserActive` sendiri. */
export function findUser(email: string, password: string): RegisteredUser | undefined {
  const user = getUserByEmail(email);
  if (!user || user.password !== password) return undefined;
  return user;
}

export function isUserActive(user: RegisteredUser): boolean {
  return user.active !== false;
}

export function registerUser(user: RegisteredUser): void {
  const users = getUsers();
  const email = normalizeEmail(user.email);

  if (users.some((item) => normalizeEmail(item.email) === email)) throw new AuthError("EMAIL_ALREADY_EXISTS");
  if (user.nim && users.some((item) => item.nim === user.nim)) throw new AuthError("NIM_ALREADY_EXISTS");

  persist([...users, { ...user, email, active: true }]);
}

export function setUserActive(email: string, active: boolean): void {
  const target = normalizeEmail(email);
  const users = getUsers();
  if (!users.some((user) => normalizeEmail(user.email) === target)) throw new AuthError("USER_NOT_FOUND");
  persist(users.map((user) => (normalizeEmail(user.email) === target ? { ...user, active } : user)));
}
