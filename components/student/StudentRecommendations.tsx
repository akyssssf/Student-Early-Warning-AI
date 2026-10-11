"use client";

import { Card } from "@/components/ui/Card";
import { useCurrentStudent } from "@/hooks/useCurrentStudent";

export default function StudentRecommendations() {
  const { student, isLoading } = useCurrentStudent();

  if (isLoading) {
    return (
      <p className="text-sm text-slate-500" role="status">
        Memuat rekomendasi...
      </p>
    );
  }

  if (!student) {
    return (
      <p className="text-sm text-red-600" role="alert">
        Data mahasiswa tidak ditemukan.
      </p>
    );
  }

  const header = (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Rekomendasi</h1>
      <p className="mt-1 text-sm text-slate-500">
        Saran tindakan yang disesuaikan dengan indikator akademik {student.name}.
      </p>
    </div>
  );

  if (!student.hasAcademicData) {
    return (
      <section>
        {header}
        <Card className="max-w-2xl">
          <p className="font-semibold text-slate-700">
            Rekomendasi belum dapat dibuat
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sistem membutuhkan data presensi, aktivitas LMS, dan pengumpulan
            tugas sebelum dapat memberikan saran yang relevan.
          </p>
        </Card>
      </section>
    );
  }

  const items = [
    student.attendance < 80
      ? "Prioritaskan kehadiran pada perkuliahan berikutnya dan hindari absen berulang."
      : "Pertahankan tingkat kehadiran agar tetap stabil.",
    student.lms < 80
      ? "Login LMS secara rutin dan selesaikan materi yang masih tertinggal."
      : "Pertahankan aktivitas LMS secara konsisten.",
    student.assignments < 80
      ? "Selesaikan tugas yang tertunda dan perhatikan deadline pengumpulan."
      : "Pertahankan ketepatan waktu pengumpulan tugas.",
    student.riskCategory === "Tinggi"
      ? "Hubungi Dosen PA untuk melakukan tindak lanjut atau konseling akademik."
      : "Pantau perubahan risk score secara berkala melalui dashboard.",
  ];

  return (
    <section>
      {header}
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <Card key={item}>
            <div className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {index + 1}
              </span>
              <div>
                <p className="text-sm leading-6 text-slate-600">{item}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Berdasarkan data pemantauan saat ini
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
