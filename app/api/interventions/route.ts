import { NextResponse } from "next/server";
import { interventionSchema } from "@/lib/schemas";

const interventions: { id: number; nim: string; note: string; date: string }[] = [
  { id: 1, nim: "2024003", note: "Jadwalkan konseling akademik dan evaluasi presensi.", date: "2026-09-14" },
];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return NextResponse.json(interventions);
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = interventionSchema.parse(body);
    const item = {
      id: Date.now(),
      nim: parsed.nim,
      note: parsed.note,
      date: new Date().toISOString().slice(0, 10),
    };
    interventions.unshift(item);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Catatan tindak lanjut tidak valid." }, { status: 400 });
  }
}
