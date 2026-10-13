# Backend Student Early Warning AI

Flask 3 (Blueprint per modul) + SQLAlchemy 2 + Flask-Migrate + JWT + bcrypt + Pydantic, sesuai
*Dokumen Arsitektur Backend SEW v1.0*. Tahap ini: **FR-01 Login**, **FR-12 Kelola akun**, dan seluruh
skema database (10 tabel). Modul import/risk/dashboard/catatan/notifikasi/laporan menyusul.

## Jalankan (Windows)
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```
**Database MySQL (XAMPP):** start MySQL, lalu import `database/schema.sql` di phpMyAdmin
(atau `flask db upgrade`). Tanpa MySQL: di `.env` ganti `DATABASE_URL=sqlite:///sew.db`.
```powershell
python seed.py      # 9 akun demo, password 123456
python run.py       # http://127.0.0.1:5000
```

## Endpoint (/api/v1)
| Method | URL | Akses | Keterangan |
|---|---|---|---|
| POST | /auth/login | publik | body `username` (atau email) + `password` -> `access_token`, `refresh_token`, `role`, `user` |
| POST | /auth/refresh | refresh token | access token baru |
| POST | /auth/register | publik* | *tambahan: daftar mandiri khusus mahasiswa (`ALLOW_SELF_REGISTER`) |
| GET/POST | /users | admin | daftar / buat akun semua role |
| PUT/DELETE | /users/{id} | admin | ubah / nonaktifkan akun |
| PATCH | /users/mahasiswa/{nim}/dosen-pa | admin | tugaskan Dosen PA |
| GET | /health | publik | cek ketersediaan |

Error: `{"code": "KREDENSIAL_SALAH", "message": "..."}` (Indonesia, kode konsisten - NFR-07).
Login dibatasi 10 percobaan/menit per IP. Access token 15 menit, refresh token 7 hari (NFR-01).

## Akun demo
`admin@` , `kaprodi@` , `dosen@` , `alya@` ... `eka@` + `student.uns.ac.id`, serta `orangtua@example.com` (memantau Alya, NIM 2024001). Password semua `123456`.

## Catatan: beda kecil dari dokumen
- `/auth/register` tidak ada di dokumen (akun resminya dibuat Admin lewat `POST /users`); dibuat karena halaman Register frontend sudah ada. Matikan dengan `ALLOW_SELF_REGISTER=false`.
- Tabel `notifikasi` ditambah kolom `dibaca` (untuk `PATCH /notifikasi/{id}/baca`), tidak ada di class diagram.
- `user.is_active` ditambahkan untuk "DELETE = nonaktifkan".
- Role `orangtua` ditambahkan: tabel `orang_tua` (id_orang_tua, id_user, nim anak, nama). Akun dibuat Admin lewat `POST /users` dengan `role: orangtua` + `nim` mahasiswa yang dipantau; emailnya boleh non-SSO. Role `staff` di frontend tidak ada di database.
