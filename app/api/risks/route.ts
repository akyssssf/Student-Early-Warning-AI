import { NextResponse } from "next/server";
import { studentsDb } from "@/lib/mockDb";
import { calculateRisk } from "@/lib/risk";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const updatedAt = new Date().toISOString().slice(0, 10);
  const risks = studentsDb.map((student) => ({ nim: student.nim, name: student.name, ...calculateRisk(student), updatedAt }));
  return NextResponse.json(risks);
}
