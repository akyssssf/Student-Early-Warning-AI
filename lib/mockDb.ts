import type { RiskCategory, Student } from "@/lib/types";

export const studentsDb: Student[] = [
  { nim: "2024001" as Student["nim"], name: "Alya Putri", prodi: "D3 Teknik Informatika", angkatan: 2024, attendance: 96, gpa: 3.72, lms: 91, assignments: 94 },
  { nim: "2024002" as Student["nim"], name: "Bagas Pratama", prodi: "D3 Teknik Informatika", angkatan: 2024, attendance: 58, gpa: 2.3, lms: 50, assignments: 60 },
  { nim: "2024003" as Student["nim"], name: "Citra Lestari", prodi: "D3 Teknik Informatika", angkatan: 2024, attendance: 22, gpa: 1.3, lms: 28, assignments: 25 },
  { nim: "2024004" as Student["nim"], name: "Dimas Ramadhan", prodi: "D3 Teknik Informatika", angkatan: 2023, attendance: 74, gpa: 2.86, lms: 62, assignments: 68 },
  { nim: "2024005" as Student["nim"], name: "Eka Sari", prodi: "D3 Teknik Informatika", angkatan: 2023, attendance: 63, gpa: 2.5, lms: 54, assignments: 52 },
];

export function calculateRisk(student: Student) {
  const attendanceRisk = 100 - student.attendance;
  const gpaRisk = 100 - (student.gpa / 4) * 100;
  const lmsRisk = 100 - student.lms;
  const assignmentRisk = 100 - student.assignments;
  const score = Math.round(attendanceRisk * 0.3 + gpaRisk * 0.3 + lmsRisk * 0.2 + assignmentRisk * 0.2);
  const category: RiskCategory = score >= 70 ? "Tinggi" : score >= 40 ? "Sedang" : "Rendah";
  const factors = [
    [attendanceRisk, "Presensi rendah"],
    [gpaRisk, "IPK rendah"],
    [lmsRisk, "Aktivitas LMS menurun"],
    [assignmentRisk, "Pengumpulan tugas rendah"],
  ].sort((a, b) => Number(b[0]) - Number(a[0]));
  return { score, category, dominantFactor: String(factors[0]?.[1] ?? "Tidak ada faktor dominan") };
}
