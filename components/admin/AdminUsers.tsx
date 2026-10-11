"use client";

import { useState } from "react";
import { CheckCircle2, UserPlus, UserRoundX } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type DemoUser = { id: string; name: string; email: string; role: string; active: boolean };
const initialUsers: DemoUser[] = [
  { id: "ADM-001", name: "Administrator", email: "admin@example.com", role: "Admin", active: true },
  { id: "DSN-001", name: "Dosen PA Demo", email: "dosen@example.com", role: "Dosen PA", active: true },
  { id: "KPD-001", name: "Kaprodi Demo", email: "kaprodi@example.com", role: "Kaprodi", active: true },
  { id: "MHS-001", name: "Alya Putri", email: "mahasiswa@example.com", role: "Mahasiswa", active: true },
  { id: "ORT-001", name: "Orang Tua Alya", email: "orangtua@example.com", role: "Orang Tua", active: true },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [message, setMessage] = useState("");
  function toggle(id: string) { setUsers((current) => current.map((user) => user.id === id ? { ...user, active: !user.active } : user)); setMessage("Status akun berhasil diperbarui untuk sesi demo."); }
  function addDemo() { const id = `USR-${String(users.length + 1).padStart(3, "0")}`; setUsers((current) => [...current, { id, name: "Pengguna Demo Baru", email: `demo${users.length + 1}@example.com`, role: "Mahasiswa", active: true }]); setMessage("Pengguna demo berhasil ditambahkan."); }
  return <section><div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-blue-600">Administrator</p><h1 className="text-2xl font-bold">Manajemen Pengguna</h1><p className="mt-1 text-sm text-slate-500">FR-12: tambah, ubah status, dan nonaktifkan akun pengguna.</p></div><Button onClick={addDemo}><UserPlus size={17} className="mr-2"/>Tambah Pengguna</Button></div>{message && <div role="status" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}<Card><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="p-3">ID</th><th className="p-3">Nama</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Aksi</th></tr></thead><tbody>{users.map((user)=><tr key={user.id} className="border-b last:border-0"><td className="p-3">{user.id}</td><td className="p-3 font-semibold">{user.name}</td><td className="p-3">{user.email}</td><td className="p-3">{user.role}</td><td className="p-3">{user.active ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={13}/>Aktif</span> : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Nonaktif</span>}</td><td className="p-3"><Button size="sm" variant={user.active ? "danger" : "secondary"} onClick={() => toggle(user.id)}><UserRoundX size={14} className="mr-1"/>{user.active ? "Nonaktifkan" : "Aktifkan"}</Button></td></tr>)}</tbody></table></div></Card></section>;
}
