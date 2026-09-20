import { NextResponse } from "next/server";
import { studentsDb, calculateRisk } from "@/lib/mockDb";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const risks = studentsDb.map((student) => ({ nim: student.nim, name: student.name, ...calculateRisk(student), updatedAt: new Date().toISOString().slice(0, 10) }));
  return NextResponse.json(risks);
}
