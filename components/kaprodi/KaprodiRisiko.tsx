"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useRisksQuery, useStudentsQuery } from "@/hooks/useData";

export default function KaprodiRisiko() {
  const students = useStudentsQuery();
  const risks = useRisksQuery();
  if (students.isLoading || risks.isLoading) return <section><div className="mb-6"><p className="text-sm font-semibold text-blue-600">Kaprodi</p><h1 className="text-2xl font-bold">Daftar Risiko Mahasiswa</h1></div><div className="skeleton h-96 rounded-2xl" /></section>;
  if (students.isError || risks.isError) return <section role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Data risiko gagal dimuat.</section>;
  const studentMap = new Map((students.data ?? []).map((student) => [String(student.nim), student]));
  return <section><div className="mb-6"><p className="text-sm font-semibold text-blue-600">Kaprodi</p><h1 className="text-2xl font-bold">Daftar Risiko Mahasiswa</h1><p className="mt-1 text-sm text-slate-500">Daftar agregat mahasiswa berdasarkan risk scoring.</p></div><Card><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="p-3">Mahasiswa</th><th className="p-3">IPK</th><th className="p-3">Presensi</th><th className="p-3">LMS</th><th className="p-3">Score</th><th className="p-3">Kategori</th><th className="p-3">Faktor Dominan</th></tr></thead><tbody>{(risks.data ?? []).sort((a,b)=>b.score-a.score).map((risk)=>{const student=studentMap.get(String(risk.nim)); return <tr key={risk.nim} className="border-b last:border-0"><td className="p-3 font-semibold">{risk.name}<div className="text-xs font-normal text-slate-400">{risk.nim}</div></td><td className="p-3">{student?.gpa.toFixed(2) ?? "-"}</td><td className="p-3">{student?.attendance ?? "-"}%</td><td className="p-3">{student?.lms ?? "-"}%</td><td className="p-3 font-bold">{risk.score}</td><td className="p-3"><Badge variant={risk.category === "Tinggi" ? "high" : risk.category === "Sedang" ? "medium" : "low"}>{risk.category}</Badge></td><td className="p-3 text-slate-500">{risk.dominantFactor}</td></tr>})}</tbody></table></div></Card></section>;
}
