import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { studentsDb } from "@/lib/mockDb";

/**
 * Data mahasiswa yang sedang login.
 * Dipakai oleh halaman Profil Saya dan Rekomendasi (hooks/useCurrentStudent.ts).
 * NIM dan email diambil dari cookie yang di-set saat login (components/auth/LoginForm.tsx).
 */
export async function GET() {
  const store = await cookies();
  const nim = store.get("sew_nim")?.value ?? "";
  const email = decodeURIComponent(store.get("sew_email")?.value ?? "");
  const student = studentsDb.find((item) => String(item.nim) === nim);

  if (!student) return NextResponse.json(null, { status: 404 });
  return NextResponse.json({ ...student, email });
}
