"use client";

import { getUserByEmail } from "@/lib/auth";
import { calculateRisk, studentsDb } from "@/lib/mockDb";
import type { RiskCategory } from "@/lib/types";

/**
 * SATU SUMBER KEBENARAN UNTUK "SIAPA YANG SEDANG LOGIN"
 *
 * Dipakai oleh Dashboard, Profil Saya, Status Risiko, dan Rekomendasi
 * supaya semua halaman menampilkan mahasiswa yang sama.
 *
 * Aturan penting:
 * - Identitas diambil dari cookie `sew_email` (bukan `sew_nim`),
 *   karena cookie NIM bisa tertinggal dari sesi login sebelumnya.
 * - Kalau akun belum punya data akademik, JANGAN fallback ke
 *   studentsDb[0] (Alya Putri). Kembalikan profil kosong milik user.
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

export function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const raw = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));
  if (!raw) return "";
  return decodeURIComponent(raw.slice(name.length + 1));
}

export function resolveCurrentStudent(): CurrentStudent | null {
  const email = readCookie("sew_email").toLowerCase();
  const role = readCookie("sew_role");

  if (!email || role !== "mahasiswa") return null;

  const account = getUserByEmail(email);
  if (!account || account.role !== "mahasiswa") return null;

  // Cocokkan data akademik lewat NIM milik akun, bukan cookie sisa sesi lama.
  const record = account.nim
    ? studentsDb.find((item) => String(item.nim) === String(account.nim))
    : undefined;

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
