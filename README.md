# Student Early Warning AI

Front-end sistem peringatan dini risiko akademik mahasiswa, dibuat berdasarkan SKPL dan kebutuhan praktikum. Semua data berupa **mock** (di memori server dan `localStorage`), belum ada backend sungguhan.

## Role
| Role | Dashboard | Keterangan |
|---|---|---|
| Dosen PA | `/dashboard` | Memantau mahasiswa bimbingan, CRUD data mahasiswa, catatan tindak lanjut |
| Mahasiswa | `/dashboard-mahasiswa` | Kondisi akademik, status risiko, rekomendasi, profil |
| Kaprodi | `/dashboard-kaprodi` | Ringkasan dan laporan risiko tingkat prodi |
| Admin | `/dashboard-admin` | Impor data akademik (CSV), manajemen pengguna |
| Orang Tua | `/dashboard-orangtua` | Memantau satu mahasiswa yang dipilih saat login |

> Role Orang Tua adalah pengembangan tambahan. SRS versi 1.0 mendefinisikan empat aktor: Admin, Dosen PA, Kaprodi, dan Mahasiswa.

## Akun demo
Semua akun demo memakai password `123456`. Di halaman login ada dropdown **Akun demo** yang mengisi form otomatis.

| Role | Email |
|---|---|
| Mahasiswa, Alya Putri (2024001), risiko Rendah | `alya@student.uns.ac.id` |
| Mahasiswa, Bagas Pratama (2024002), risiko Sedang | `bagas@student.uns.ac.id` |
| Mahasiswa, Citra Lestari (2024003), risiko Tinggi | `citra@student.uns.ac.id` |
| Mahasiswa, Dimas Ramadhan (2024004), risiko Rendah | `dimas@student.uns.ac.id` |
| Mahasiswa, Eka Sari (2024005), risiko Sedang | `eka@student.uns.ac.id` |
| Dosen PA | `dosen@student.uns.ac.id` |
| Kaprodi | `kaprodi@student.uns.ac.id` |
| Admin | `admin@student.uns.ac.id` |
| Orang Tua (pilih mahasiswa di form login) | `orangtua@example.com` |

### Pendaftaran
- Halaman `/register` hanya untuk **mahasiswa** (email `@student.uns.ac.id`, NIM unik).
- Akun Dosen PA, Kaprodi, Admin, dan Orang Tua dibuat Admin lewat **Manajemen Pengguna**.
- Akun hasil pendaftaran disimpan di `localStorage` browser yang dipakai, jadi tidak muncul di browser lain.
- Mahasiswa dengan NIM yang belum ada di data akademik melihat status "Data akademik belum tersedia". Data muncul setelah Admin/Dosen menambahkan NIM itu (CRUD atau impor CSV).

## Risk score
Risk score dihitung dengan **rumus berbobot (rule-based)**, bukan model machine learning:

`skor = 0,3 x (100 - presensi) + 0,3 x (100 - IPK/4 x 100) + 0,2 x (100 - LMS) + 0,2 x (100 - tugas)`

Kategori: **Tinggi** bila skor >= 70, **Sedang** bila >= 40, selain itu **Rendah**. Rumus ada di satu tempat: [`lib/risk.ts`](lib/risk.ts).

## Teknologi
Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS v4, CVA, Zod, Zustand, TanStack Query, Middleware, mock REST API, ESLint, Vitest.

## Menjalankan
```bash
npm install
npm run dev
```
Buka http://localhost:3000

| Perintah | Fungsi |
|---|---|
| `npm run typecheck` | Pemeriksaan tipe TypeScript |
| `npm run lint` | ESLint (`next/core-web-vitals` + `next/typescript`) |
| `npm test` | Unit test (rumus risiko, parser CSV) |
| `npm run build` | Build produksi |

Data mahasiswa dan catatan tindak lanjut disimpan di memori server dan kembali ke data awal setiap server di-restart.

## Dokumentasi
- [`docs/README_MODUL.md`](docs/README_MODUL.md) checklist praktikum
- [`docs/MODUL-6.md`](docs/MODUL-6.md) App Router, RSC, streaming
- [`docs/MATRIKS_SRS_VS_FRONTEND.md`](docs/MATRIKS_SRS_VS_FRONTEND.md) kebutuhan SRS vs implementasi
- [`docs/MATRIKS_STATE.md`](docs/MATRIKS_STATE.md) pemisahan state
- [`docs/CRUD_FIX.md`](docs/CRUD_FIX.md) CRUD data mahasiswa
- [`docs/KEAMANAN.md`](docs/KEAMANAN.md) **batasan keamanan demo** (baca sebelum dipakai di luar kelas)

## Modul 8, Build Tools Modern
Dikerjakan sebagai subproject terpisah di [`modul-8-vite/`](modul-8-vite/) karena aplikasi utama memakai Next.js App Router. Berisi Vite + React + Strict TypeScript + Biome, path alias, manual chunks, demo HMR, konfigurasi SonarQube, matriks migrasi, dan benchmark PDF. CI untuk kedua proyek ada di [`.github/workflows/quality.yml`](.github/workflows/quality.yml).
