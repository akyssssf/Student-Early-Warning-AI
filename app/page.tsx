import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BellRing, ChartNoAxesCombined, CheckCircle2, GraduationCap, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

const features = [
  { icon: ChartNoAxesCombined, title: "Risk Score Terukur", text: "Pantau indikator akademik seperti IPK, presensi, aktivitas LMS, dan pengumpulan tugas." },
  { icon: UsersRound, title: "Dashboard Multi-Role", text: "Tampilan disesuaikan untuk mahasiswa, Dosen PA, Kaprodi, dan Admin/Staff." },
  { icon: BellRing, title: "Peringatan Dini", text: "Identifikasi mahasiswa yang membutuhkan perhatian dan tindak lanjut lebih cepat." },
  { icon: ShieldCheck, title: "Berbasis Data Akademik", text: "Informasi disusun menjadi insight yang lebih mudah dibaca untuk kebutuhan monitoring." },
];

const roles = ["Mahasiswa", "Dosen PA", "Kaprodi", "Admin / Staff"];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Student Early Warning AI">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><GraduationCap size={22} /></span>
            <span><span className="block text-sm font-extrabold tracking-tight">Student Early</span><span className="block text-xs font-medium text-slate-500">Warning AI</span></span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex" aria-label="Navigasi landing page">
            <a href="#fitur" className="hover:text-blue-600">Fitur</a>
            <a href="#cara-kerja" className="hover:text-blue-600">Cara Kerja</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">Masuk</Link>
            <Link href="/register" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">Daftar</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#eef2ff_100%)]">
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-2 text-xs font-bold text-blue-700 shadow-sm"><Sparkles size={14} /> Early insight untuk keputusan akademik</div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Kenali risiko akademik <span className="text-blue-600">sebelum terlambat.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Student Early Warning AI membantu perguruan tinggi memantau kondisi akademik mahasiswa, membaca faktor risiko, dan mendorong tindak lanjut yang lebih cepat.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700">Masuk ke Dashboard <ArrowRight size={18} /></Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
              {roles.map((role) => <span key={role} className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" />{role}</span>)}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl shadow-blue-900/10">
              <Image src="/early-warning-hero.svg" alt="Ilustrasi dashboard Student Early Warning AI" width={1200} height={760} priority className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="max-w-2xl"><p className="text-sm font-extrabold uppercase tracking-widest text-blue-600">Fitur utama</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Satu tempat untuk memahami kondisi mahasiswa.</h2><p className="mt-4 text-slate-600">Dibangun dengan pendekatan dashboard yang ringkas supaya informasi penting bisa ditemukan tanpa harus membaca data mentah satu per satu.</p></div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={21} /></div><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></article>)}
        </div>
      </section>

      <section id="cara-kerja" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="text-center"><p className="text-sm font-extrabold uppercase tracking-widest text-blue-600">Cara kerja</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Dari data menjadi early warning.</h2></div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[['01','Pantau','Data akademik dan aktivitas pembelajaran dirangkum dalam satu dashboard.'],['02','Identifikasi','Sistem menghitung indikator risiko dan menampilkan faktor yang paling berpengaruh.'],['03','Tindak lanjuti','Dosen PA dan pengelola akademik dapat mencatat tindak lanjut terhadap mahasiswa.']].map(([n,t,d]) => <div key={n} className="rounded-2xl border border-slate-200 p-7"><span className="text-sm font-black text-blue-600">{n}</span><h3 className="mt-4 text-xl font-extrabold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p></div>)}
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 md:flex-row md:items-center"><div><p className="text-sm font-bold text-blue-300">STUDENT EARLY WARNING AI</p><h2 className="mt-2 text-3xl font-black">Siap masuk ke sistem?</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Gunakan akun sesuai role untuk melihat dashboard dan monitoring akademik.</p></div><Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-slate-900 hover:bg-blue-50">Masuk sekarang <ArrowRight size={18} /></Link></div></section>

      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-xs text-slate-500 sm:px-8 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Student Early Warning AI</span><span>Frontend Engineering • Student Early Warning System</span></div></footer>
    </main>
  );
}