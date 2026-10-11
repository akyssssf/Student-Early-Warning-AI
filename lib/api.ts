import { asStudentId, type Intervention, type Risk, type Student } from "@/lib/types";
import { interventionSchema, riskSchema, studentSchema } from "@/lib/schemas";

async function parseResponse(response: Response): Promise<unknown> {
  const json: unknown = await response.json();
  if (!response.ok) {
    const message = typeof json === "object" && json !== null && "message" in json ? String(json.message) : "Terjadi kesalahan pada server.";
    throw new Error(message);
  }
  return json;
}

export async function fetchStudents(): Promise<Student[]> {
  const json = await parseResponse(await fetch("/api/students"));
  if (!Array.isArray(json)) throw new Error("Format data mahasiswa tidak valid.");
  return json.map((item) => {
    const parsed = studentSchema.parse(item);
    return { ...parsed, nim: asStudentId(parsed.nim) };
  });
}

export async function createStudent(payload: Student): Promise<Student> {
  const valid = studentSchema.parse(payload);
  const json = await parseResponse(await fetch("/api/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(valid) }));
  const parsed = studentSchema.parse(json);
  return { ...parsed, nim: asStudentId(parsed.nim) };
}

export async function updateStudent(payload: Student): Promise<Student> {
  const valid = studentSchema.parse(payload);
  const json = await parseResponse(await fetch("/api/students", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(valid) }));
  const parsed = studentSchema.parse(json);
  return { ...parsed, nim: asStudentId(parsed.nim) };
}

export async function deleteStudent(nim: string): Promise<void> {
  await parseResponse(await fetch("/api/students", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nim }) }));
}

export async function fetchRisks(): Promise<Risk[]> {
  const json = await parseResponse(await fetch("/api/risks"));
  if (!Array.isArray(json)) throw new Error("Format risk score tidak valid.");
  return json.map((item) => { const parsed = riskSchema.parse(item); return { ...parsed, nim: asStudentId(parsed.nim) }; });
}

export async function fetchInterventions(): Promise<Intervention[]> {
  const json = await parseResponse(await fetch("/api/interventions"));
  if (!Array.isArray(json)) throw new Error("Format intervensi tidak valid.");
  return json.map((item) => {
    const id = typeof item === "object" && item !== null && "id" in item ? Number(item.id) : NaN;
    const nim = typeof item === "object" && item !== null && "nim" in item ? String(item.nim) : "";
    const note = typeof item === "object" && item !== null && "note" in item ? String(item.note) : "";
    const date = typeof item === "object" && item !== null && "date" in item ? String(item.date) : "";
    return { id, nim: asStudentId(nim), note, date };
  });
}

export async function createIntervention(payload: { nim: string; note: string }): Promise<Intervention> {
  const valid = interventionSchema.parse(payload);
  const json = await parseResponse(await fetch("/api/interventions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(valid) }));
  const obj = json as Record<string, unknown>;
  return { id: Number(obj.id), nim: asStudentId(String(obj.nim)), note: String(obj.note), date: String(obj.date) };
}
