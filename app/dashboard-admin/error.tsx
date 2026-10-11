"use client";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto max-w-xl px-6 py-16 text-center"><div className="rounded-2xl border bg-white p-8 shadow-sm"><p className="text-sm font-semibold text-red-600">Terjadi kesalahan</p><h1 className="mt-2 text-2xl font-bold">Halaman tidak dapat dimuat</h1><p className="mt-2 text-sm text-slate-500">Coba muat ulang bagian dashboard ini.</p><button type="button" onClick={() => reset()} className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Coba lagi</button></div></main>;
}
