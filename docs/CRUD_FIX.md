# CRUD Data Mahasiswa

Halaman `/dashboard/mahasiswa` sekarang mendukung:
- Tambah mahasiswa
- Edit mahasiswa
- Hapus mahasiswa dengan konfirmasi
- Cari berdasarkan nama/NIM
- Filter berdasarkan kategori risiko
- Validasi Zod pada input
- TanStack Query mutation + invalidate query
- Risk Score otomatis dihitung ulang setelah data mahasiswa berubah

Data menggunakan mock in-memory API untuk kebutuhan praktikum. Data akan kembali ke data awal setelah server development direstart.
