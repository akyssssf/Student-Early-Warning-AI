# Batasan Keamanan (Demo Front-End)

Proyek ini simulasi untuk praktikum. **Jangan dipakai dengan data mahasiswa sungguhan** tanpa mengganti bagian di bawah.

## Yang sudah dilakukan
- Pendaftaran mandiri hanya untuk role Mahasiswa. Akun role lain dibuat Admin.
- NIM harus unik, sehingga satu NIM tidak bisa diklaim dua akun (termasuk NIM akun demo).
- Middleware menjaga halaman dashboard per role **dan** `/api/*`:
  - tanpa cookie sesi: respons `401`;
  - mengubah data mahasiswa (`POST/PUT/DELETE /api/students`) hanya untuk Dosen PA dan Admin;
  - menambah tindak lanjut (`POST /api/interventions`) hanya untuk Dosen PA;
  - satu-satunya endpoint publik adalah `GET /api/students/lookup` (NIM + nama untuk dropdown login Orang Tua).
- Server memvalidasi input dengan Zod dan menolak catatan tindak lanjut untuk NIM yang tidak ada.
- Logout menghapus semua cookie sesi (`sew_session`, `sew_role`, `sew_email`, `sew_nim`).

## Batasan yang tersisa (sengaja, karena tidak ada backend)
| Batasan | Dampak | Perbaikan di production |
|---|---|---|
| Sesi adalah cookie biasa yang dibuat di browser | Pengguna bisa memalsukan `sew_role` lewat DevTools dan melewati middleware | Sesi bertanda tangan/HttpOnly yang dibuat server (mis. Auth.js atau SSO kampus) |
| Akun dan password disimpan **plaintext** di `localStorage` | Siapa pun yang memakai browser itu bisa membaca password | Autentikasi di server, password di-hash (argon2/bcrypt), tanpa menyimpan kredensial di client |
| Akun hasil pendaftaran hanya ada di satu browser | Admin hanya melihat akun dari browser yang sama | Database pengguna di server |
| Data mahasiswa di memori server | Hilang saat server restart; tidak aman untuk multi-instance | Database |
| Otorisasi per data belum ada (mis. orang tua hanya boleh lihat anaknya) | API `GET /api/students` mengembalikan semua mahasiswa untuk semua role yang login | Filter di server berdasarkan identitas sesi |
| Orang Tua memilih sendiri mahasiswa yang dipantau | Tidak ada verifikasi hubungan orang tua dan mahasiswa | Relasi terverifikasi di database |
| Password demo `123456` terisi otomatis di form login | Hanya untuk kemudahan demo | Hapus prefill |
