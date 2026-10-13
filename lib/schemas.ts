import { z } from "zod";

export const studentSchema = z.object({
  nim: z.string().min(3),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  prodi: z.string().min(2),
  angkatan: z.number().int().min(2000),
  attendance: z.number().min(0).max(100),
  gpa: z.number().min(0).max(4),
  lms: z.number().min(0).max(100),
  assignments: z.number().min(0).max(100),
});

export const riskSchema = z.object({
  nim: z.string(),
  name: z.string(),
  score: z.number().min(0).max(100),
  category: z.enum(["Rendah", "Sedang", "Tinggi"]),
  dominantFactor: z.string(),
  updatedAt: z.string(),
});

export const interventionSchema = z.object({
  nim: z.string().min(3, "NIM wajib diisi"),
  note: z.string().min(10, "Catatan minimal 10 karakter"),
});

export const interventionRecordSchema = interventionSchema.extend({
  id: z.number().int(),
  date: z.string(),
});

export type StudentInput = z.infer<typeof studentSchema>;
export type InterventionInput = z.infer<typeof interventionSchema>;
