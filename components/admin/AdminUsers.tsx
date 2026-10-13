"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, UserPlus, UserRoundX } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AuthError, getUsers, isUserActive, registerUser, setUserActive, type RegisteredUser, type UserRole } from "@/lib/auth";
import { COOKIE, readCookie } from "@/lib/session";

const SSO_DOMAIN = "@student.uns.ac.id";

const roleLabels: Record<UserRole, string> = {
  mahasiswa: "Mahasiswa",
  dosen: "Dosen PA",
  kaprodi: "Kaprodi",
  admin: "Admin",
  orangtua: "Orang Tua",
};

const emptyForm = { name: "", email: "", role: "dosen" as UserRole, nim: "", password: "" };

export default function AdminUsers() {
  const [users, setUsers] = useState<RegisteredUser[] | null>(null);
  const [me, setMe] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Akun disimpan di localStorage, jadi baru bisa dibaca setelah mount.
  useEffect(() => {
    setUsers(getUsers());
    setMe(readCookie(COOKIE.email).toLowerCase());
  }, []);

  function toggle(user: RegisteredUser) {
    if (user.email.toLowerCase() === me) {
      setMessage({ type: "error", text: "Kamu tidak bisa menonaktifkan akun yang sedang dipakai." });
      return;
    }
    setUserActive(user.email, !isUserActive(user));
    setUsers(getUsers());
    setMessage({ type: "success", text: `Akun ${user.name} ${isUserActive(user) ? "dinonaktifkan" : "diaktifkan"}.` });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const email = form.email.trim().toLowerCase();
    const needsSso = form.role !== "orangtua";
    if (form.name.trim().length < 3) return setMessage({ type: "error", text: "Nama minimal 3 karakter." });
    if (needsSso && !email.endsWith(SSO_DOMAIN)) return setMessage({ type: "error", text: `Email ${roleLabels[form.role]} harus berakhiran ${SSO_DOMAIN}.` });
    if (!needsSso && !email.includes("@")) return setMessage({ type: "error", text: "Format email tidak valid." });
    if (form.role === "mahasiswa" && !/^\d{6,}$/.test(form.nim.trim())) return setMessage({ type: "error", text: "NIM mahasiswa wajib diisi, angka minimal 6 digit." });
    if (form.password.length < 8) return setMessage({ type: "error", text: "Password minimal 8 karakter." });

    try {
      registerUser({ name: form.name.trim(), email, password: form.password, role: form.role, nim: form.role === "mahasiswa" ? form.nim.trim() : undefined });
    } catch (e) {
      const code = e instanceof AuthError ? e.code : "";
      return setMessage({ type: "error", text: code === "EMAIL_ALREADY_EXISTS" ? "Email sudah terdaftar." : code === "NIM_ALREADY_EXISTS" ? "NIM sudah dipakai akun lain." : "Gagal menambah pengguna." });
    }
    setUsers(getUsers());
    setForm(emptyForm);
    setShowForm(false);
    setMessage({ type: "success", text: "Pengguna berhasil ditambahkan." });
  }

  const input = "mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-normal outline-none focus:border-blue-500";

  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">Administrator</p>
          <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          <p className="mt-1 text-sm text-slate-500">FR-12: tambah akun, aktifkan, dan nonaktifkan pengguna. Data akun disimpan di browser ini (demo).</p>
        </div>
        <Button onClick={() => setShowForm((open) => !open)}><UserPlus size={17} className="mr-2" />{showForm ? "Tutup Form" : "Tambah Pengguna"}</Button>
      </div>

      {message && <div role={message.type === "success" ? "status" : "alert"} className={`mb-4 rounded-xl p-3 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message.text}</div>}

      {showForm && (
        <Card className="mb-5">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Nama<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} required /></label>
            <label className="text-sm font-semibold">Role
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className={input}>
                {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} required /></label>
            {form.role === "mahasiswa" && <label className="text-sm font-semibold">NIM<input value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} inputMode="numeric" className={input} required /></label>}
            <label className="text-sm font-semibold">Password awal<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} autoComplete="new-password" className={input} required /></label>
            <div className="flex items-end"><Button type="submit">Simpan Pengguna</Button></div>
          </form>
        </Card>
      )}

      <Card>
        {users === null ? (
          <div className="space-y-3" aria-live="polite">{[1, 2, 3].map((x) => <div key={x} className="skeleton h-12 rounded-lg" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b text-xs uppercase text-slate-500">
                <tr><th className="p-3">Nama</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">NIM</th><th className="p-3">Status</th><th className="p-3">Aksi</th></tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const active = isUserActive(user);
                  return (
                    <tr key={user.email} className="border-b last:border-0">
                      <td className="p-3 font-semibold">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{roleLabels[user.role] ?? user.role}</td>
                      <td className="p-3">{user.nim ?? "-"}</td>
                      <td className="p-3">
                        {active
                          ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={13} />Aktif</span>
                          : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Nonaktif</span>}
                      </td>
                      <td className="p-3">
                        <Button size="sm" variant={active ? "danger" : "secondary"} onClick={() => toggle(user)}><UserRoundX size={14} className="mr-1" />{active ? "Nonaktifkan" : "Aktifkan"}</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}
