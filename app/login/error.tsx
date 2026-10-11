"use client";

export default function LoginError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm"><p className="text-sm font-semibold text-red-600">Login error</p><h1 className="mt-2 text-2xl font-bold">Form login tidak dapat dimuat</h1><p className="mt-2 text-sm text-slate-500">Silakan coba render ulang halaman autentikasi.</p><button type="button" onClick={() => reset()} className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Coba lagi</button></div></main>;
}
