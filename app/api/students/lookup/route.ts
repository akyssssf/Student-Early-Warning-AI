import { NextResponse } from "next/server";
import { studentsDb } from "@/lib/mockDb";

/** Daftar pilihan mahasiswa untuk form login Orang Tua. Hanya NIM dan nama. */
export async function GET() {
  return NextResponse.json(studentsDb.map(({ nim, name }) => ({ nim, name })));
}
