"use client";

import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useCurrentStudent } from "@/hooks/useCurrentStudent";

export default function StudentRisk() {
  const { student, isLoading } = useCurrentStudent();

  if (isLoading) {
    return <p className="text-sm text-slate-500">Memuat status risiko...</p>;
  }

  // PENTING: tidak ada lagi fallback ke studentsDb[0] (Alya Putri).
  if (!student) {
    return (
      <section>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Status Risiko Akademik</h1>
        </div>
        <Card className="max-w-3xl">
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 text-red-500" />
            <div>
              <h2 className="font-bold">Data mahasiswa tidak ditemukan</h2>
              <p className="mt-1 text-sm text-slate-600">
                Silakan login kembali menggunakan akun mahasiswa yang terdaftar.
              </p>
            </div>
          </div>
        </Card>
      </section>
    );
  }

  const header = (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Status Risiko Akademik</h1>
      <p className="mt-1 text-sm text-slate-500">
        Hasil pemantauan untuk {student.name}
        {student.nim !== "-" ? ` (${student.nim})` : ""}.
      </p>
    </div>
  );

  if (!student.hasAcademicData) {
    return (
      <section>
        {header}
        <Card className="max-w-3xl">
          <p className="font-semibold text-slate-700">
            Data akademik belum tersedia
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Risk score baru dapat dihitung setelah data IPK, presensi, aktivitas
            LMS, dan pengumpulan tugas milik {student.name} masuk ke sistem.
          </p>
        </Card>
      </section>
    );
  }

  const tone =
    student.riskCategory === "Tinggi"
      ? "red"
      : student.riskCategory === "Sedang"
        ? "default"
        : "blue";

  const badgeVariant =
    student.riskCategory === "Tinggi"
      ? "high"
      : student.riskCategory === "Sedang"
        ? "medium"
        : "low";

  const indicators: Array<[string, number]> = [
    ["Presensi", student.attendance],
    ["Aktivitas LMS", student.lms],
    ["Pengumpulan Tugas", student.assignments],
  ];

  return (
    <section>
      {header}

      <Card tone={tone} className="max-w-3xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Risk Score saat ini</p>
            <p className="mt-1 text-5xl font-bold">{student.riskScore}</p>
            <p className="mt-2 text-sm text-slate-600">
              Faktor dominan: <strong>{student.dominantFactor}</strong>
            </p>
          </div>
          <Badge variant={badgeVariant}>
            {student.riskCategory.toUpperCase()}
          </Badge>
        </div>
      </Card>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {indicators.map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}%</p>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${value}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-5">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 text-amber-500" />
          <div>
            <h2 className="font-bold">Cara membaca skor</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Skor dihitung dari IPK, presensi, aktivitas LMS, dan pengumpulan
              tugas. Semakin tinggi skor, semakin banyak indikator yang perlu
              diperhatikan.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
