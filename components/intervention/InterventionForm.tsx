"use client";

import { useState } from "react";
import { interventionSchema } from "@/lib/schemas";
import { useCreateIntervention } from "@/hooks/useData";
import { Button } from "@/components/ui/Button";

export default function InterventionForm() {
  const mutation = useCreateIntervention();
  const [nim, setNim] = useState("2024003");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const result = interventionSchema.safeParse({ nim, note });
    if (!result.success) {
      setMessage(result.error.issues[0]?.message ?? "Data tidak valid.");
      return;
    }
    mutation.mutate(result.data, {
      onSuccess: () => {
        setNote("");
        setMessage("Catatan tindak lanjut berhasil disimpan.");
      },
      onError: (error) => setMessage(error.message),
    });
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-slate-50 p-5">
      <h2 className="font-bold">Tambah Catatan Tindak Lanjut</h2>
      <p className="mt-1 text-sm text-slate-500">Catatan ini menjadi rekomendasi Dosen PA untuk mahasiswa berisiko.</p>

      {message && <div role={message.includes("berhasil") ? "status" : "alert"} className={`mt-4 rounded-xl p-3 text-sm ${message.includes("berhasil") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message}</div>}

      <div className="mt-4 grid gap-4">
        <div>
          <label htmlFor="nim" className="mb-2 block text-sm font-semibold">NIM</label>
          <input id="nim" value={nim} onChange={(e) => setNim(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="note" className="mb-2 block text-sm font-semibold">Catatan / rekomendasi</label>
          <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Contoh: Jadwalkan konseling akademik..." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500" />
        </div>
        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Menyimpan..." : "Simpan Catatan"}</Button>
      </div>
    </form>
  );
}