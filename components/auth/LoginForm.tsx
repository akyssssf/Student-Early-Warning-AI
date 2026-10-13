"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DEFAULT_USERS, findUser, getUserByEmail, isUserActive } from "@/lib/auth";
import { useStudentOptionsQuery } from "@/hooks/useData";
import { setSession } from "@/lib/session";

const SSO_DOMAIN = "@student.uns.ac.id";
type Role = "admin" | "dosen" | "kaprodi" | "mahasiswa" | "orangtua";

const roleOptions: Array<{ value: Role; label: string; description: string; requiresSso: boolean }> = [
  { value: "mahasiswa", label: "Mahasiswa", description: "Masuk menggunakan akun SSO mahasiswa", requiresSso: true },
  { value: "dosen", label: "Dosen PA", description: "Akun internal UNS", requiresSso: true },
  { value: "kaprodi", label: "Kaprodi", description: "Akun internal UNS", requiresSso: true },
  { value: "admin", label: "Admin", description: "Akun pengelola sistem", requiresSso: true },
  { value: "orangtua", label: "Orang Tua", description: "Akun pendamping mahasiswa", requiresSso: false },
];

const demoEmails: Record<Role, string> = {
  mahasiswa: "alya@student.uns.ac.id",
  dosen: "dosen@student.uns.ac.id",
  kaprodi: "kaprodi@student.uns.ac.id",
  admin: "admin@student.uns.ac.id",
  orangtua: "orangtua@example.com",
};

const destinations: Record<Role, string> = {
  admin: "/dashboard-admin",
  dosen: "/dashboard",
  kaprodi: "/dashboard-kaprodi",
  mahasiswa: "/dashboard-mahasiswa",
  orangtua: "/dashboard-orangtua",
};

function isLoginRole(value: string): value is Role {
  return roleOptions.some((option) => option.value === value);
}

const demoAccounts = DEFAULT_USERS.filter((user) => isLoginRole(user.role));

export default function LoginForm({ initialEmail = "" }: { initialEmail?: string }) {
  const router = useRouter();
  const { data: students = [], isLoading: studentsLoading } = useStudentOptionsQuery();
  const [role, setRole] = useState<Role>("mahasiswa");
  const [studentNim, setStudentNim] = useState("");
  const [email, setEmail] = useState(initialEmail || demoEmails.mahasiswa);
  // Setelah mendaftar (initialEmail terisi), password sengaja dikosongkan.
  const [password, setPassword] = useState(initialEmail ? "" : "123456");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [demoEmail, setDemoEmail] = useState("");

  useEffect(() => {
    if (students.length > 0 && !studentNim) setStudentNim(String(students[0]?.nim ?? ""));
  }, [students, studentNim]);

  // Datang dari halaman daftar: pilih jenis akun sesuai akun yang baru dibuat.
  useEffect(() => {
    if (!initialEmail) return;
    const account = getUserByEmail(initialEmail);
    if (account && isLoginRole(account.role)) setRole(account.role);
  }, [initialEmail]);

  const selectedRole = useMemo(() => roleOptions.find((item) => item.value === role) ?? roleOptions[0], [role]);

  function changeRole(nextRole: Role) {
    setRole(nextRole);
    setEmail(demoEmails[nextRole]);
    setDemoEmail("");
    setError("");
  }

  function pickDemoAccount(value: string) {
    setDemoEmail(value);
    setError("");
    const account = demoAccounts.find((item) => item.email === value);
    if (!account || !isLoginRole(account.role)) return;
    setRole(account.role);
    setEmail(account.email);
    setPassword(account.password);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || password.length < 6) return setError("Email dan password wajib diisi. Password minimal 6 karakter.");
    if (selectedRole?.requiresSso && !normalizedEmail.endsWith(SSO_DOMAIN)) return setError(`Gunakan email SSO dengan format nama@${SSO_DOMAIN.slice(1)}.`);
    if (role === "orangtua" && !studentNim) return setError("Silakan pilih mahasiswa terlebih dahulu.");

    const user = findUser(normalizedEmail, password);
    if (!user) return setError("Email atau password salah. Belum punya akun? Silakan daftar terlebih dahulu.");
    if (!isUserActive(user)) return setError("Akun ini dinonaktifkan. Hubungi administrator.");
    if (user.role !== role) {
      const registeredAs = roleOptions.find((item) => item.value === user.role)?.label ?? user.role;
      return setError(`Akun ini terdaftar sebagai ${registeredAs}. Pilih jenis akun yang sesuai.`);
    }

    setSession({ role, email: user.email, nim: role === "orangtua" ? studentNim : user.nim });
    router.push(destinations[role]);
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md">
      <div className="mb-7"><p className="text-sm font-extrabold text-blue-600">Selamat datang kembali</p><h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Masuk ke sistem</h2><p className="mt-2 text-sm leading-6 text-slate-500">Pilih jenis akun dari daftar di bawah, lalu masuk dengan email dan password.</p></div>

      <label htmlFor="demo-account" className="mb-2 block text-sm font-bold text-slate-700">Akun demo <span className="font-medium text-slate-400">(opsional)</span></label>
      <select id="demo-account" value={demoEmail} onChange={(e) => pickDemoAccount(e.target.value)} className="mb-5 w-full appearance-none rounded-xl border border-dashed border-blue-300 bg-blue-50/50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
        <option value="">Pilih akun demo untuk mengisi form otomatis</option>
        {demoAccounts.map((account) => <option key={account.email} value={account.email}>{account.name} — {roleOptions.find((item) => item.value === account.role)?.label}{account.nim ? ` (${account.nim})` : ""}</option>)}
      </select>

      <label htmlFor="role" className="mb-2 block text-sm font-bold text-slate-700">Jenis akun</label>
      <div className="relative mb-5">
        <select id="role" value={role} onChange={(e) => changeRole(e.target.value as Role)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
          {roleOptions.map((option) => <option key={option.value} value={option.value}>{option.label} — {option.description}</option>)}
        </select>
      </div>

      {error && <div role="alert" className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium leading-5 text-red-700">{error}</div>}

      {role === "orangtua" && <div className="mb-4"><label htmlFor="student" className="mb-2 block text-sm font-bold text-slate-700">Mahasiswa yang dipantau</label><select id="student" value={studentNim} onChange={(e) => setStudentNim(e.target.value)} disabled={studentsLoading || students.length === 0} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">{studentsLoading ? <option value="">Memuat data...</option> : students.map((student) => <option key={student.nim} value={String(student.nim)}>{student.name} — {student.nim}</option>)}</select></div>}

      <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-700">Email SSO</label>
      <div className="relative mb-2"><Mail className="absolute left-3 top-3.5 text-slate-400" size={18} /><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 py-3.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="nama@student.uns.ac.id" required /></div>
      <p className="mb-4 text-xs text-slate-400">{selectedRole?.requiresSso ? `Wajib menggunakan domain ${SSO_DOMAIN}` : "Akun orang tua menggunakan akun yang diberikan pengelola."}</p>

      <label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-700">Password</label>
      <div className="relative mb-6"><Lock className="absolute left-3 top-3.5 text-slate-400" size={18} /><input id="password" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 py-3.5 pl-10 pr-11 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" minLength={6} required /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3.5 text-slate-400" aria-label={show ? "Sembunyikan password" : "Tampilkan password"}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>

      <Button type="submit" size="lg" className="w-full"><UserRound size={18} className="mr-2" />Masuk sebagai {selectedRole?.label}</Button>
      <p className="mt-4 text-center text-xs text-slate-400">Demo password: 123456</p>
      <p className="mt-4 text-center text-sm text-slate-500">Belum punya akun? <Link href="/register" className="font-bold text-blue-600 hover:underline">Daftar</Link></p>
    </form>
  );
}
