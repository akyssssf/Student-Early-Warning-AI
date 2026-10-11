import type { Metadata } from "next";
import { Suspense } from "react";
import DashboardHome from "@/components/dashboard/DashboardHome";
import DashboardServerSnapshot from "@/components/dashboard/DashboardServerSnapshot";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Student Early Warning AI",
  description: "Ringkasan risiko akademik mahasiswa dan pemantauan Dosen PA.",
};

function SnapshotFallback() {
  return (
    <div
      className="mb-6 h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
      aria-label="Memuat ringkasan server"
      role="status"
    />
  );
}

export default function DashboardPage() {
  return (
    <>
      <Suspense fallback={<SnapshotFallback />}>
        <DashboardServerSnapshot />
      </Suspense>
      <DashboardHome />
    </>
  );
}
