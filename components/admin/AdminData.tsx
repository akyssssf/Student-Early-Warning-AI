"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { CheckCircle2, FileSpreadsheet, RefreshCw, UploadCloud, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { studentsDb } from "@/lib/mockDb";

function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("File CSV belum memiliki data.");
  const headers = (lines[0] ?? "").split(",").map((value) => value.trim().toLowerCase());
  const required = ["nim", "nama", "ipk", "presensi", "lms", "tugas"];
  const missing = required.filter((header) => !headers.includes(header));
  if (missing.length) throw new Error(`Kolom wajib belum lengkap: ${missing.join(", ")}.`);
  return lines.slice(1).map((line) => { const values = line.split(",").map((value) => value.trim()); return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])); });
}

export default function AdminData() {
  const [status, setStatus] = useState("Belum ada sinkronisasi pada sesi ini.");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<Record<string,string>[]>([]);
  const [error, setError] = useState("");
  const totalPreview = useMemo(() => preview.length || studentsDb.length, [preview.length]);

  function sync(source: string) { setError(""); setStatus(`Sinkronisasi ${source} sedang diproses...`); window.setTimeout(() => setStatus(`${source} berhasil disinkronkan pada ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}.`), 500); }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name); setError("");
    if (!file.name.toLowerCase().endsWith(".csv")) { setError("Demo impor saat ini menerima file CSV. Format Excel dapat ditambahkan saat backend tersedia."); return; }
    const reader = new FileReader();
    reader.onload = () => { try { const rows = parseCsv(String(reader.result)); setPreview(rows.slice(0, 5)); setStatus(`File ${file.name} tervalidasi. ${rows.length} baris siap diimpor.`); } catch (err) { setError(err instanceof Error ? err.message : "File tidak dapat dibaca."); setPreview([]); } };
    reader.readAsText(file);
  }

  return <section className="space-y-6"><div><p className="text-sm font-semibold text-blue-600">Administrator</p><h1 className="text-2xl font-bold">Manajemen Data Akademik</h1><p className="mt-1 text-sm text-slate-500">FR-02 dan FR-03: validasi serta simulasi impor data SIAKAD dan LMS.</p></div>
    <div className="grid gap-5 lg:grid-cols-2"><Card><div className="flex items-start justify-between"><div><FileSpreadsheet className="text-blue-600"/><h2 className="mt-3 font-bold">SIAKAD</h2><p className="mt-1 text-sm text-slate-500">Nilai, IPK/IPS, dan presensi mahasiswa.</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Terhubung</span></div><Button className="mt-5" onClick={() => sync("SIAKAD")}><RefreshCw size={16} className="mr-2"/>Sinkronkan Data</Button></Card>
      <Card><div className="flex items-start justify-between"><div><FileSpreadsheet className="text-indigo-600"/><h2 className="mt-3 font-bold">LMS</h2><p className="mt-1 text-sm text-slate-500">Aktivitas belajar dan pengumpulan tugas.</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Terhubung</span></div><label className="mt-5 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 p-4 text-sm font-semibold hover:bg-slate-50"><UploadCloud size={17} className="mr-2"/>Pilih CSV LMS<input type="file" accept=".csv,text/csv" className="sr-only" onChange={handleFile}/></label>{fileName && <p className="mt-2 text-xs text-slate-500">File: {fileName}</p>}</Card></div>
    <Card><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-lg font-bold">Status Pipeline</h2><p className="text-sm text-slate-500">{status}</p></div>{error ? <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600"><XCircle size={16}/>Validasi gagal</span> : <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600"><CheckCircle2 size={16}/>Siap</span>}</div>{error && <div role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}</Card>
    <Card><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold">Preview Data</h2><p className="text-sm text-slate-500">Menampilkan maksimal 5 baris dari data yang tersedia.</p></div><span className="text-xs font-semibold text-slate-400">{totalPreview} baris</span></div><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="p-3">NIM</th><th className="p-3">Nama</th><th className="p-3">IPK</th><th className="p-3">Presensi</th><th className="p-3">LMS</th><th className="p-3">Tugas</th></tr></thead><tbody>{preview.length ? preview.map((row,index)=><tr key={`${row.nim}-${index}`} className="border-b"><td className="p-3">{row.nim}</td><td className="p-3 font-semibold">{row.nama}</td><td className="p-3">{row.ipk}</td><td className="p-3">{row.presensi}%</td><td className="p-3">{row.lms}%</td><td className="p-3">{row.tugas}%</td></tr>) : studentsDb.slice(0,5).map((student)=><tr key={student.nim} className="border-b"><td className="p-3">{student.nim}</td><td className="p-3 font-semibold">{student.name}</td><td className="p-3">{student.gpa.toFixed(2)}</td><td className="p-3">{student.attendance}%</td><td className="p-3">{student.lms}%</td><td className="p-3">{student.assignments}%</td></tr>)}</tbody></table></div></Card>
  </section>;
}
