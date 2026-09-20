# Benchmark Modul 8 — Student Early Warning AI

## Tujuan
Mencatat cold start development server, waktu HMR, dan production build setelah migrasi build pipeline ke Vite.

## Cara ukur di mesin sendiri

1. Install dependency: `npm install`
2. Cold start: jalankan `npm run dev -- --host`, catat waktu dari command sampai URL siap di terminal.
3. HMR: ubah satu teks di `src/App.tsx`, simpan, lalu catat waktu pembaruan menggunakan terminal/browser DevTools.
4. Production build: jalankan `npm run build` dan catat durasi command.
5. Quality gate: jalankan `npm run check` dan `npm run typecheck`.

> Nilai benchmark mesin pengguna **tidak boleh diganti dengan angka referensi modul**. Dashboard demo menampilkan angka referensi modul hanya untuk kebutuhan visualisasi praktikum.

## Tabel pengisian

| Pengujian | Sebelum migrasi | Setelah Vite | Satuan | Bukti |
|---|---:|---:|---|---|
| Cold start dev server | Isi hasil pengukuran | Isi hasil pengukuran | ms/detik | screenshot terminal |
| HMR update | Isi hasil pengukuran | Isi hasil pengukuran | ms | screenshot browser/terminal |
| Production build | Isi hasil pengukuran | Isi hasil pengukuran | ms/detik | screenshot terminal |
| Typecheck | Isi hasil pengukuran | Isi hasil pengukuran | ms/detik | terminal |
| Biome check | N/A | Isi hasil pengukuran | ms/detik | terminal |
