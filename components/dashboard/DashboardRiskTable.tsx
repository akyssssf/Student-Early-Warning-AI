"use client";

import { useRisksQuery } from "@/hooks/useData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function DashboardRiskTable() {
  const { data, isLoading, isError, refetch } = useRisksQuery();

  if (isLoading) {
    return <div className="space-y-3" aria-live="polite">{[1,2,3].map((x) => <div key={x} className="skeleton h-12 rounded-lg" />)}</div>;
  }
  if (isError) {
    return <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Gagal memuat data. <Button size="sm" variant="secondary" onClick={() => refetch()}>Coba lagi</Button></div>;
  }
  if (!data?.length) return <p className="text-sm text-slate-500">Belum ada data risiko.</p>;

  const highFirst = [...data].sort((a, b) => b.score - a.score).slice(0, 4);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="border-b text-xs uppercase text-slate-500">
          <tr><th className="p-3">Mahasiswa</th><th className="p-3">Skor</th><th className="p-3">Kategori</th><th className="p-3">Faktor Dominan</th></tr>
        </thead>
        <tbody>
          {highFirst.map((risk) => (
            <tr key={risk.nim} className="border-b last:border-0">
              <td className="p-3 font-semibold">{risk.name}<div className="text-xs font-normal text-slate-400">{risk.nim}</div></td>
              <td className="p-3 font-bold">{risk.score}</td>
              <td className="p-3"><Badge variant={risk.category === "Tinggi" ? "high" : risk.category === "Sedang" ? "medium" : "low"}>{risk.category}</Badge></td>
              <td className="p-3 text-slate-500">{risk.dominantFactor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}