export type RiskCategory = "Rendah" | "Sedang" | "Tinggi";

export type Branded<T, Brand extends string> = T & { readonly __brand: Brand };
export type StudentId = Branded<string, "StudentId">;

export const asStudentId = (value: string): StudentId => value as StudentId;

export interface Student {
  nim: StudentId;
  name: string;
  prodi: string;
  angkatan: number;
  attendance: number;
  gpa: number;
  lms: number;
  assignments: number;
}

export interface Risk {
  nim: StudentId;
  name: string;
  score: number;
  category: RiskCategory;
  dominantFactor: string;
  updatedAt: string;
}

export interface Intervention {
  id: number;
  nim: StudentId;
  note: string;
  date: string;
}

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };