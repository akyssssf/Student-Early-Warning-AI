# Perbaikan: data mahasiswa & status risiko masih menampilkan Alya

## Penyebab
1. `components/student/StudentRisk.tsx` punya fallback `?? studentsDb[0]` — kalau NIM tidak ketemu, otomatis menampilkan Alya Putri (2024001).
2. Cookie `sew_nim` tidak pernah dihapus saat logout dan tidak ditimpa saat login akun tanpa NIM, jadi NIM sesi lama (2024001) terbawa ke akun Tata.
3. `hooks/useCurrentStudent.ts` mengambil data dari `/api/student/current` yang mencari berdasarkan cookie `sew_nim` itu — jadi Profil Saya ikut salah.
4. `RegisterForm.tsx` tidak menyimpan NIM, sehingga akun baru tidak pernah bisa cocok dengan data akademik.

## File yang diganti/ditambahkan
| File | Status |
|---|---|
| `lib/currentStudent.ts` | BARU |
| `hooks/useCurrentStudent.ts` | ganti |
| `components/student/StudentRisk.tsx` | ganti |
| `components/student/StudentProfile.tsx` | ganti |
| `components/student/StudentRecommendations.tsx` | ganti |
| `components/student/StudentDashboard.tsx` | ganti |
| `components/auth/LoginForm.tsx` | ganti |
| `components/auth/RegisterForm.tsx` | ganti |
| `components/layout/StudentShell.tsx` | ganti |

Timpa file dengan nama & path yang sama di project `STUDENT EARLY`.

`app/api/student/current/route.ts` sudah tidak dipakai lagi — boleh dibiarkan atau dihapus.

## Setelah dipasang
1. Jalankan ulang `npm run dev`.
2. Logout, lalu hapus cookie lama: DevTools > Application > Cookies > hapus `sew_nim` (atau buka jendela incognito).
3. Login lagi sebagai Tata. Dashboard, Profil Saya, Status Risiko, dan Rekomendasi akan menampilkan nama Tata dengan status "Data akademik belum tersedia".

Kalau ingin Tata punya angka akademik seperti Alya, tambahkan barisnya di `lib/mockDb.ts` dengan NIM yang sama persis dengan NIM di akun Tata, contoh:

```ts
{ nim: "2024006" as Student["nim"], name: "Tata Meirzha", prodi: "D3 Teknik Informatika", angkatan: 2024, attendance: 88, gpa: 3.40, lms: 82, assignments: 85 },
```

Lalu daftarkan/perbarui akun Tata dengan NIM `2024006`.
