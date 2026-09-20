"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, GraduationCap, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useRisksQuery, useStudentsQuery } from "@/hooks/useData";

export default function KaprodiDashboard() {
  const students = useStudentsQuery();
  const risks = useRisksQuery();
  if (students.isLoading || risks.isLoading) return <section className="space-y-6"><div><p className="text-sm font-semibold text-blue-600">Kaprodi</p><h1 className="text-2xl font-bold sm:text-3xl">Dashboard Program Studi</h1></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="skeleton h-28 rounded-2xl" />)}</div></section>;
  if (students.isError || risks.isError) return <section role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Data dashboard gagal dimuat. Silakan refresh halaman.</section>;
  const studentData = students.data ?? [];
  const riskData = risks.data ?? [];
  const counts = { Rendah: riskData.filter((x) => x.category === "Rendah").length, Sedang: riskData.filter((x) => x.category === "Sedang").length, Tinggi: riskData.filter((x) => x.category === "Tinggi").length };
  const total = studentData.length;
  const avg = total ? (studentData.reduce((sum, student) => sum + student.gpa, 0) / total).toFixed(2) : "0.00";
  const attention = [...riskData].sort((a, b) => b.score - a.score).slice(0, 4);

  return <section className="space-y-6"><div><p className="text-sm font-semibold text-blue-600">Kaprodi</p><h1 className="text-2xl font-bold sm:text-3xl">Dashboard Program Studi</h1><p className="mt-1 text-sm text-slate-500">Monitoring agregat kondisi akademik dan risiko mahasiswa D3 Teknik Informatika.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Card tone="blue"><Users className="text-blue-600" /><p className="mt-3 text-sm text-slate-500">Total Mahasiswa</p><p className="text-3xl font-bold">{total}</p></Card><Card><GraduationCap className="text-blue-600" /><p className="mt-3 text-sm text-slate-500">Rata-rata IPK</p><p className="text-3xl font-bold">{avg}</p></Card><Card tone="red"><AlertTriangle className="text-red-600" /><p className="mt-3 text-sm text-slate-500">Risiko Tinggi</p><p className="text-3xl font-bold">{counts.Tinggi}</p></Card><Card><CheckCircle2 className="text-emerald-600" /><p className="mt-3 text-sm text-slate-500">Risiko Rendah</p><p className="text-3xl font-bold">{counts.Rendah}</p></Card></div>
    <div className="grid gap-6 lg:grid-cols-2"><Card><div className="mb-5"><h2 className="text-lg font-bold">Distribusi Risiko</h2><p className="text-sm text-slate-500">Ringkasan kategori risiko seluruh mahasiswa.</p></div><div className="space-y-4">{(["Rendah","Sedang","Tinggi"] as const).map((label) => { const value = counts[label]; const width = total ? `${Math.max((value / total) * 100, value ? 8 : 0)}%` : "0%"; const bar = label === "Tinggi" ? "bg-red-500" : label === "Sedang" ? "bg-amber-500" : "bg-emerald-500"; return <div key={label}><div className="mb-1 flex justify-between text-sm"><span>{label}</span><strong>{value}</strong></div><div className="h-3 rounded-full bg-slate-100"><div className={`h-3 rounded-full ${bar}`} style={{width}} /></div></div>; })}</div></Card>
      <Card><div className="mb-4 flex items-start justify-between"><div><h2 className="text-lg font-bold">Mahasiswa Perlu Perhatian</h2><p className="text-sm text-slate-500">Prioritas monitoring berdasarkan skor risiko.</p></div><Link href="/dashboard-kaprodi/risiko" className="text-sm font-semibold text-blue-600">Lihat semua</Link></div><div className="space-y-3">{attention.map((risk) => <div key={risk.nim} className="flex items-center justify-between rounded-xl border p-3"><div><p className="font-semibold">{risk.name}</p><p className="text-xs text-slate-500">{risk.nim} · {risk.dominantFactor}</p></div><div className="flex items-center gap-3"><div className="text-right"><p className="text-xs text-slate-400">Score</p><p className="font-bold">{risk.score}</p></div><Badge variant={risk.category === "Tinggi" ? "high" : risk.category === "Sedang" ? "medium" : "low"}>{risk.category}</Badge></div></div>)}</div><Link href="/dashboard-kaprodi/laporan" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold hover:bg-slate-200">Buka laporan <ArrowRight size={16}/></Link></Card></div>
  </section>;
}
