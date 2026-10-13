import { getUserByEmail } from "@/lib/auth";
import { calculateRisk } from "@/lib/risk";
import { COOKIE, readCookie } from "@/lib/session";
import type { RiskCategory, Student } from "@/lib/types";

/**
 * SATU SUMBER KEBENARAN UNTUK "SIAPA YANG SEDANG LOGIN" (role Mahasiswa).
 *
 * Identitas diambil dari akun (cookie `sew_email` -> akun), bukan dari cookie NIM
 * yang bisa tertinggal dari sesi sebelumnya. Data akademik dicocokkan lewat NIM
 * akun. Kalau tidak ada, JANGAN fallback ke mahasiswa lain: kembalikan profil
 * kosong milik akun tersebut.
 */
export type CurrentStudent = {
  nim: string;
  name: string;
  email: string;
  prodi: string;
  angkatan: number | null;
  gpa: number;
  attendance: number;
  lms: number;
  assignments: number;
  riskScore: number;
  riskCategory: RiskCategory;
  dominantFactor: string;
  hasAcademicData: boolean;
};

export type StudentAccount = { name: string; email: string; nim?: string };

/** Akun mahasiswa yang sedang login, atau null. Hanya bisa dipanggil di browser. */
export function resolveStudentAccount(): StudentAccount | null {
  const email = readCookie(COOKIE.email).toLowerCase();
  const role = readCookie(COOKIE.role);
  if (!email || role !== "mahasiswa") return null;

  const account = getUserByEmail(email);
  if (!account || account.role !== "mahasiswa") return null;
  return { name: account.name, email: account.email, nim: account.nim };
}

export function buildCurrentStudent(account: StudentAccount, students: readonly Student[]): CurrentStudent {
  const record = account.nim ? students.find((item) => String(item.nim) === account.nim) : undefined;

  if (!record) {
    return {
      nim: account.nim ?? "-",
      name: account.name,
      email: account.email,
      prodi: "D3 Teknik Informatika",
      angkatan: null,
      gpa: 0,
      attendance: 0,
      lms: 0,
      assignments: 0,
      riskScore: 0,
      riskCategory: "Rendah",
      dominantFactor: "-",
      hasAcademicData: false,
    };
  }

  const risk = calculateRisk(record);
  return {
    nim: String(record.nim),
    name: record.name,
    email: account.email,
    prodi: record.prodi,
    angkatan: record.angkatan,
    gpa: record.gpa,
    attendance: record.attendance,
    lms: record.lms,
    assignments: record.assignments,
    riskScore: risk.score,
    riskCategory: risk.category,
    dominantFactor: risk.dominantFactor,
    hasAcademicData: true,
  };
}
