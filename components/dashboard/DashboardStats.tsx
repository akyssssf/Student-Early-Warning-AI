"use client";

import { AlertTriangle, CheckCircle2, GraduationCap, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useRisksQuery, useStudentsQuery } from "@/hooks/useData";

export default function DashboardStats() {
  const students = useStudentsQuery();
  const risks = useRisksQuery();

  if (students.isLoading || risks.isLoading) {
    return (
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
        {[1, 2, 3, 4].map((item) => <div key={item} className="skeleton h-28 rounded-2xl" />)}
      </div>
    );
  }

  if (students.isError || risks.isError) {
    return <div role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">Statistik dashboard belum dapat dimuat. Coba refresh halaman.</div>;
  }

  const total = students.data?.length ?? 0;
  const counts = {
    Tinggi: risks.data?.filter((risk) => risk.category === "Tinggi").length ?? 0,
    Sedang: risks.data?.filter((risk) => risk.category === "Sedang").length ?? 0,
    Rendah: risks.data?.filter((risk) => risk.category === "Rendah").length ?? 0,
  };

  const stats = [
    { label: "Total Mahasiswa", value: total, icon: Users, tone: "blue" as const },
    { label: "Risiko Tinggi", value: counts.Tinggi, icon: AlertTriangle, tone: "red" as const },
    { label: "Risiko Sedang", value: counts.Sedang, icon: GraduationCap, tone: "default" as const },
    { label: "Risiko Rendah", value: counts.Rendah, icon: CheckCircle2, tone: "default" as const },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} tone={item.tone}>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-slate-500">{item.label}</p><p className="mt-2 text-3xl font-bold">{item.value}</p></div>
              <Icon className="text-blue-600" size={28} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
