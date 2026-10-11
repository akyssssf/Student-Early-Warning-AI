import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-2 text-slate-500">Halaman tidak ditemukan.</p>
        <Link href="/dashboard" className="mt-5 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Ke Dashboard</Link>
      </div>
    </main>
  );
}