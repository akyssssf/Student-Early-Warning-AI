"use client";

export type UserRole =
  | "mahasiswa"
  | "dosen"
  | "kaprodi"
  | "admin"
  | "staff"
  | "orangtua";

export type RegisteredUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  nim?: string;
};

const STORAGE_KEY = "sew_registered_users";

/**
 * DATA DUMP / AKUN DEMO
 *
 * Akun ini selalu tersedia sebagai akun bawaan
 * untuk keperluan simulasi/presentasi.
 */
export const DEFAULT_USERS: RegisteredUser[] = [
  // =========================
  // MAHASISWA
  // =========================
  {
    name: "Alya Putri",
    email: "alya@student.uns.ac.id",
    password: "123456",
    role: "mahasiswa",
    nim: "2024001",
  },
  {
    name: "Bagas Pratama",
    email: "bagas@student.uns.ac.id",
    password: "123456",
    role: "mahasiswa",
    nim: "2024002",
  },
  {
    name: "Citra Lestari",
    email: "citra@student.uns.ac.id",
    password: "123456",
    role: "mahasiswa",
    nim: "2024003",
  },
  {
    name: "Dimas Ramadhan",
    email: "dimas@student.uns.ac.id",
    password: "123456",
    role: "mahasiswa",
    nim: "2024004",
  },
  {
    name: "Eka Sari",
    email: "eka@student.uns.ac.id",
    password: "123456",
    role: "mahasiswa",
    nim: "2024005",
  },

  // =========================
  // ADMIN
  // =========================
  {
    name: "Admin Student Early",
    email: "admin@student.uns.ac.id",
    password: "123456",
    role: "admin",
  },

  // =========================
  // KAPRODI
  // =========================
  {
    name: "Kaprodi Teknik Informatika",
    email: "kaprodi@student.uns.ac.id",
    password: "123456",
    role: "kaprodi",
  },

  // =========================
  // DOSEN
  // =========================
  {
    name: "Dosen PA",
    email: "dosen@student.uns.ac.id",
    password: "123456",
    role: "dosen",
  },

  // =========================
  // STAFF
  // =========================
  {
    name: "Staff Student Early",
    email: "staff@student.uns.ac.id",
    password: "123456",
    role: "staff",
  },

  // =========================
  // ORANG TUA
  // =========================
  {
    name: "Orang Tua Mahasiswa",
    email: "orangtua@example.com",
    password: "123456",
    role: "orangtua",
  },
];

/**
 * Ambil seluruh user.
 *
 * Kalau belum ada data di localStorage,
 * otomatis masukkan DATA DUMP.
 */
export function getUsers(): RegisteredUser[] {
  if (typeof window === "undefined") {
    return DEFAULT_USERS;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_USERS)
    );

    return DEFAULT_USERS;
  }

  try {
    const users = JSON.parse(stored) as RegisteredUser[];

    // Pastikan akun demo tetap tersedia.
    const mergedUsers = [...users];

    DEFAULT_USERS.forEach((defaultUser) => {
      const exists = mergedUsers.some(
        (user) =>
          user.email.toLowerCase() ===
          defaultUser.email.toLowerCase()
      );

      if (!exists) {
        mergedUsers.push(defaultUser);
      }
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(mergedUsers)
    );

    return mergedUsers;
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_USERS)
    );

    return DEFAULT_USERS;
  }
}

/**
 * Register user baru.
 */
export function registerUser(user: RegisteredUser): void {
  const users = getUsers();

  const existingUser = users.find(
    (item) =>
      item.email.toLowerCase() ===
      user.email.toLowerCase()
  );

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const newUsers = [...users, user];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(newUsers)
  );
}

/**
 * Alias kalau ada file lain yang masih
 * menggunakan saveUser().
 */
export function saveUser(user: RegisteredUser): void {
  registerUser(user);
}

/**
 * Cari user berdasarkan email.
 */
export function getUserByEmail(
  email: string
): RegisteredUser | undefined {
  const users = getUsers();

  return users.find(
    (user) =>
      user.email.toLowerCase() ===
      email.trim().toLowerCase()
  );
}

/**
 * Login berdasarkan email + password.
 */
export function findUser(
  email: string,
  password: string
): RegisteredUser | undefined {
  const users = getUsers();

  return users.find(
    (user) =>
      user.email.toLowerCase() ===
        email.trim().toLowerCase() &&
      user.password === password
  );
}

/**
 * Alias untuk compatibility.
 */
export function loginUser(
  email: string,
  password: string
): RegisteredUser | undefined {
  return findUser(email, password);
}