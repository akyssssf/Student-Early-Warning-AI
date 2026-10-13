# Keamanan

## Alur autentikasi
1. Form login memanggil `POST /api/auth/login` (route Next.js), yang meneruskan kredensial ke backend Flask (`POST /api/v1/auth/login`).
2. Backend memeriksa password dengan **bcrypt**, lalu mengeluarkan JWT: access token 15 menit dan refresh token 7 hari.
3. Route Next.js menyimpan keduanya di cookie **HttpOnly** (`sew_access`, `sew_refresh`; `SameSite=Lax`; `Secure` saat HTTPS). JavaScript di browser tidak bisa membaca token, jadi XSS tidak bisa mencurinya, dan cookie tidak bisa dipalsukan lewat DevTools karena tanda tangannya diverifikasi.
4. `middleware.ts` memverifikasi tanda tangan JWT (HS256, `JWT_SECRET_KEY` sama dengan backend) di setiap halaman dashboard dan `/api/*`. Access token yang habis diperbarui otomatis lewat refresh token.
5. Halaman memulihkan identitas lewat `GET /api/auth/me`, yang juga memeriksa ke backend bahwa akun masih aktif.

## Kontrol yang berlaku
- Role dalam token menentukan halaman yang boleh dibuka; role yang salah dialihkan ke dashboard miliknya.
- `/api/*` tanpa sesi valid menjawab `401`. Mengubah data mahasiswa hanya Dosen PA dan Admin, menulis tindak lanjut hanya Dosen PA, `/api/users` hanya Admin (`403` selain itu). Backend memeriksa ulang role dan status aktif dari database.
- Data disaring per pengguna di server: Mahasiswa dan Orang Tua hanya menerima data NIM miliknya (Orang Tua: NIM anak yang ditetapkan Admin).
- Permintaan tulis dengan header `Origin` dari situs lain ditolak (pertahanan CSRF tambahan di luar `SameSite`).
- Akun dinonaktifkan Admin: login ditolak, token lama ditolak oleh endpoint ber-RBAC dan `/auth/me`, refresh gagal.
- Pendaftaran mandiri hanya membuat role Mahasiswa; NIM unik; Admin tidak bisa menonaktifkan akunnya sendiri.
- Backend menolak start di production tanpa `JWT_SECRET_KEY` >= 32 karakter; debugger Flask hanya di `APP_ENV=development` pada `127.0.0.1`.
- Rate limit login 10/menit, register 5/menit, refresh 30/menit per IP; waktu respons login tidak membocorkan apakah akun ada.

## Batasan yang tersisa
| Batasan | Dampak | Perbaikan |
|---|---|---|
| Refresh token tidak bisa dicabut saat logout | Token yang sempat tercuri tetap berlaku sampai 7 hari | Daftar token dicabut (blocklist) di backend |
| Rate limit disimpan di memori per proses | Tidak berlaku lintas worker/instance | Redis lewat `RATELIMIT_STORAGE_URI` |
| Data akademik (mahasiswa, risk, tindak lanjut) masih mock di memori server frontend | Hilang saat restart; bukan database | Selesaikan modul backend import/risk/catatan lalu hubungkan |
| Password demo `123456` dari `seed.py` | Hanya aman untuk lokal | Set `SEED_PASSWORD` atau jangan jalankan seed di server |
| Cookie `Secure` hanya aktif di HTTPS | Lewat HTTP biasa cookie bisa disadap | Pasang HTTPS (reverse proxy) di production |
| Tidak ada verifikasi email / reset password | Pengguna tidak bisa memulihkan akun sendiri | Alur reset password dan verifikasi SSO |
| Jika `JWT_SECRET_KEY` bocor, token bisa dipalsukan | Seluruh akses terbuka | Simpan sebagai secret, rotasi berkala |
