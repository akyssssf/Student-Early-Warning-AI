"use client";

import { Card } from "@/components/ui/Card";
import { useCurrentStudent } from "@/hooks/useCurrentStudent";

export default function StudentProfile() {
  const { student, isLoading } = useCurrentStudent();

  const header = (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Profil Saya</h1>
      <p className="mt-1 text-sm text-slate-500">
        Informasi dasar akun mahasiswa.
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <section>
        {header}
        <Card className="max-w-2xl">
          <p className="text-sm text-slate-500">Memuat data mahasiswa...</p>
        </Card>
      </section>
    );
  }

  if (!student) {
    return (
      <section>
        {header}
        <Card className="max-w-2xl">
          <p className="text-sm text-red-600">
            Data mahasiswa tidak ditemukan. Silakan login kembali.
          </p>
        </Card>
      </section>
    );
  }

  const fields: Array<[string, string]> = [
    ["NIM", student.nim],
    ["Nama", student.name],
    ["Program Studi", student.prodi],
    ["Angkatan", student.angkatan ? String(student.angkatan) : "-"],
    ["Dosen PA", student.hasAcademicData ? "Dosen PA Demo" : "Belum ditentukan"],
    ["Email", student.email || "-"],
  ];

  return (
    <section>
      {header}

      <Card className="max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="mt-1 font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {!student.hasAcademicData && (
          <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
            Akun ini belum terhubung ke data akademik SIAKAD/LMS, jadi sebagian
            informasi masih kosong.
          </p>
        )}
      </Card>
    </section>
  );
}
