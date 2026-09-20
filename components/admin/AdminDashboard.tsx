"use client";

import { Activity, AlertTriangle, Database, RefreshCw, ShieldCheck, Users, UserCog } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useRisksQuery, useStudentsQuery } from "@/hooks/useData";

export default function AdminDashboard() {
  const students = useStudentsQuery();
  const risks = useRisksQuery();

  if (students.isLoading || risks.isLoading) {
    return <section className="space-y-6"><div><p className="text-sm font-semibold text-blue-600">Administrator</p><h1 className="text-2xl font-bold sm:text-3xl">Dashboard Admin</h1></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="skeleton h-28 rounded-2xl" />)}</div></section>;
  }
  if (students.isError || risks.isError) return <section role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Data dashboard gagal dimuat. Silakan refresh halaman.</section>;

  const studentData = students.data ?? [];
  const riskData = risks.data ?? [];
  const high = riskData.filter((item) => item.category === "Tinggi").length;
  const medium = riskData.filter((item) => item.category === "Sedang").length;
  const low = riskData.filter((item) => item.category === "Rendah").length;
  const total = studentData.length;
  const avgGpa = total ? (studentData.reduce((sum, student) => sum + student.gpa, 0) / total).toFixed(2) : "0.00";

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-blue-600">Administrator</p><h1 className="text-2xl font-bold sm:text-3xl">Dashboard Admin</h1><p className="mt-1 text-sm text-slate-500">Pusat kontrol data akademik, integrasi sumber data, dan pengguna Student Early Warning AI.</p></div><Link href="/dashboard-admin/data"><Button variant="secondary"><RefreshCw size={16} className="mr-2" />Kelola Data</Button></Link></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card tone="blue"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Total Mahasiswa</p><p className="mt-1 text-3xl font-bold">{total}</p></div><Users className="text-blue-600" /></div><p className="mt-3 text-xs text-slate-400">Data aktif dalam sistem</p></Card>
        <Card><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Rata-rata IPK</p><p className="mt-1 text-3xl font-bold">{avgGpa}</p></div><Database className="text-blue-600" /></div><p className="mt-3 text-xs text-slate-400">Berdasarkan data akademik</p></Card>
        <Card tone="red"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Risiko Tinggi</p><p className="mt-1 text-3xl font-bold">{high}</p></div><AlertTriangle className="text-red-600" /></div><p className="mt-3 text-xs text-red-600">Perlu perhatian dan tindak lanjut</p></Card>
        <Card><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Pengguna</p><p className="mt-1 text-3xl font-bold">5</p></div><UserCog className="text-blue-600" /></div><p className="mt-3 text-xs text-slate-400">Role terdaftar pada demo</p></Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <Card><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold">Kesehatan Integrasi Sistem</h2><p className="text-sm text-slate-500">Status pipeline data yang menjadi input risk scoring.</p></div><Badge variant="low">Operasional</Badge></div><div className="space-y-3">{[["SIAKAD", "Nilai & presensi", "Tersinkron"], ["LMS", "Aktivitas & tugas", "Tersinkron"], ["Risk Engine", "Perhitungan skor", "Aktif"]].map(([name, desc, status]) => <div key={name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center gap-3"><span className="rounded-lg bg-white p-2 shadow-sm"><Activity size={18} className="text-blue-600" /></span><div><p className="font-semibold">{name}</p><p className="text-xs text-slate-500">{desc}</p></div></div><span className="text-xs font-bold text-emerald-600">{status}</span></div>)}</div></Card>
        <Card><div className="mb-5"><h2 className="text-lg font-bold">Distribusi Risiko</h2><p className="text-sm text-slate-500">Komposisi hasil analisis saat ini.</p></div><div className="space-y-4">{[["Rendah", low, "bg-emerald-500"], ["Sedang", medium, "bg-amber-500"], ["Tinggi", high, "bg-red-500"]].map(([label, value, bar]) => { const count = Number(value); const width = total ? `${Math.max((count / total) * 100, count ? 8 : 0)}%` : "0%"; return <div key={String(label)}><div className="mb-1 flex justify-between text-sm"><span className="font-medium">{label}</span><span className="font-bold">{count} mahasiswa</span></div><div className="h-2.5 rounded-full bg-slate-100"><div className={`h-2.5 rounded-full ${bar}`} style={{ width }} /></div></div>; })}</div><div className="mt-6 rounded-xl border border-dashed p-4 text-sm text-slate-500"><ShieldCheck size={18} className="mb-2 text-blue-600" />Admin bertugas memastikan data dan akun siap digunakan oleh role lain.</div></Card>
      </div>
    </section>
  );
}
