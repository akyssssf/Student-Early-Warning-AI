"use client";

import { BookOpen, CheckCircle2, ShieldAlert } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useCurrentStudent } from "@/hooks/useCurrentStudent";

export default function StudentDashboard() {
  const { student, isLoading } = useCurrentStudent();

  if (isLoading) {
    return (
      <section>
        <p className="text-sm text-slate-500">Memuat data mahasiswa...</p>
      </section>
    );
  }

  if (!student) {
    return (
      <section>
        <Card>
          <div className="py-8 text-center">
            <ShieldAlert size={42} className="mx-auto text-red-500" />
            <h2 className="mt-4 text-lg font-bold">
              Data mahasiswa tidak ditemukan
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Silakan login kembali menggunakan akun mahasiswa yang terdaftar.
            </p>
          </div>
        </Card>
      </section>
    );
  }

  const riskTone =
    student.riskCategory === "Tinggi"
      ? "red"
      : student.riskCategory === "Sedang"
        ? "default"
        : "blue";

  const bars: Array<[string, number, string]> = [
    ["Aktivitas LMS", student.lms, `${student.lms}%`],
    ["Pengumpulan Tugas", student.assignments, `${student.assignments}%`],
    ["Presensi", student.attendance, `${student.attendance}%`],
    [
      "IPK",
      Math.min((student.gpa / 4) * 100, 100),
      `${student.gpa.toFixed(2)} / 4.00`,
    ],
  ];

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-blue-600">Mahasiswa</p>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Halo, {student.name} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau kondisi akademik dan rekomendasi yang diberikan sistem.
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
          <span>{student.email}</span>
          {student.nim !== "-" && (
            <>
              <span>•</span>
              <span>NIM {student.nim}</span>
            </>
          )}
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card tone={riskTone}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Status Risiko</p>
              <p className="mt-2 text-2xl font-bold">
                {student.hasAcademicData
                  ? student.riskCategory
                  : "Belum tersedia"}
              </p>
            </div>
            <ShieldAlert className="text-red-600" size={30} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">IPK</p>
              <p className="mt-2 text-2xl font-bold">
                {student.hasAcademicData ? student.gpa.toFixed(2) : "-"}
              </p>
            </div>
            <BookOpen className="text-blue-600" size={30} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Presensi</p>
              <p className="mt-2 text-2xl font-bold">
                {student.hasAcademicData ? `${student.attendance}%` : "-"}
              </p>
            </div>
            <CheckCircle2 className="text-amber-600" size={30} />
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold">Ringkasan Akademik</h2>

          {!student.hasAcademicData ? (
            <div className="mt-6 rounded-xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-700">
                Data akademik belum tersedia
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Akun kamu sudah berhasil dibuat. Data IPK, presensi, aktivitas
                LMS, dan pengumpulan tugas akan muncul setelah data akademik
                tersedia di sistem.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {bars.map(([label, width, value]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{label}</span>
                    <b>{value}</b>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card tone={riskTone}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Peringatan Dini</h2>
              <p className="mt-2 text-sm text-slate-600">
                Sistem mendeteksi kondisi akademik berdasarkan data mahasiswa.
              </p>
            </div>

            {student.hasAcademicData && (
              <Badge
                variant={
                  student.riskCategory === "Tinggi"
                    ? "high"
                    : student.riskCategory === "Sedang"
                      ? "medium"
                      : "low"
                }
              >
                Skor {student.riskScore}
              </Badge>
            )}
          </div>

          {!student.hasAcademicData ? (
            <div className="mt-5 rounded-xl bg-white/70 p-4">
              <p className="text-sm text-slate-600">
                Belum ada data akademik yang dapat digunakan untuk menghitung
                risk score.
              </p>
            </div>
          ) : (
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-slate-600">
              {student.attendance < 75 && (
                <li>Presensi masih di bawah target.</li>
              )}
              {student.lms < 70 && <li>Aktivitas LMS perlu ditingkatkan.</li>}
              {student.assignments < 70 && (
                <li>Beberapa tugas belum dikumpulkan tepat waktu.</li>
              )}
              {student.gpa >= 3.5 &&
                student.attendance >= 85 &&
                student.lms >= 80 &&
                student.assignments >= 80 && (
                  <li>Kondisi akademik mahasiswa cukup baik.</li>
                )}
            </ul>
          )}
        </Card>
      </div>
    </section>
  );
}
