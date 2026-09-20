"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRisksQuery, useStudentsQuery } from "@/hooks/useData";

export default function KaprodiReport() {
  const students = useStudentsQuery();
  const risks = useRisksQuery();
  const studentData = students.data ?? [];
  const riskData = risks.data ?? [];

  function download() {
    const rows = riskData.map((risk) => {
      const student = studentData.find((item) => String(item.nim) === String(risk.nim));
      return [risk.nim, risk.name, student?.gpa ?? "", student?.attendance ?? "", risk.score, risk.category].join(",");
    });
    const csv = ["NIM,Nama,IPK,Presensi,Risk Score,Kategori", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "laporan-risiko-prodi.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <section><div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-blue-600">Kaprodi</p><h1 className="text-2xl font-bold">Laporan Risiko Program Studi</h1><p className="mt-1 text-sm text-slate-500">Laporan agregat untuk kebutuhan monitoring, rapat, dan akreditasi.</p></div><Button onClick={download} disabled={students.isLoading || risks.isLoading}><Download size={17} className="mr-2"/>Unduh CSV</Button></div><Card>{(students.isLoading || risks.isLoading) ? <div className="skeleton h-80 rounded-xl" /> : students.isError || risks.isError ? <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Data laporan gagal dimuat.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="p-3">NIM</th><th className="p-3">Nama</th><th className="p-3">IPK</th><th className="p-3">Presensi</th><th className="p-3">Risk Score</th><th className="p-3">Kategori</th></tr></thead><tbody>{riskData.map((risk) => { const student = studentData.find((item) => String(item.nim) === String(risk.nim)); return <tr key={risk.nim} className="border-b last:border-0"><td className="p-3">{risk.nim}</td><td className="p-3 font-semibold">{risk.name}</td><td className="p-3">{student?.gpa.toFixed(2) ?? "-"}</td><td className="p-3">{student?.attendance ?? "-"}%</td><td className="p-3 font-bold">{risk.score}</td><td className="p-3">{risk.category}</td></tr>; })}</tbody></table></div>}</Card></section>;
}
