# Matriks Pemisahan State

| Variabel | Kategori | Pengelola | Alasan |
|---|---|---|---|
| `sidebarOpen` | Client UI State | Zustand | Hanya mengatur tampilan sidebar |
| `activeTab` | Client UI State | Zustand | Status navigasi UI |
| `theme` | Client UI State | Zustand | Status tema antarmuka |
| Data mahasiswa | Server State | TanStack Query | Berasal dari API |
| Risk Score | Server State | TanStack Query | Data hasil sistem/model |
| Catatan intervensi | Server State | TanStack Query | Data tersimpan pada server |
| Status submit form | Local Component State | React | Hanya diperlukan selama interaksi form |
| Keyword pencarian | Local Component State | React | Filter tampilan lokal |

Prinsip utama: data dari API tidak disimpan ke Zustand. Zustand hanya menangani Client UI State, sedangkan TanStack Query menangani Server State.

## Catatan tambahan
- Identitas pengguna yang sedang login (cookie sesi + akun di `localStorage`) dibaca lewat `lib/session.ts` dan `lib/currentStudent.ts`. Itu data sesi browser, bukan server state.
- Data akademik yang ditampilkan ke Mahasiswa dan Orang Tua tetap diambil dari API lewat TanStack Query (`useCurrentStudent`, `useLinkedStudent`), sehingga perubahan oleh Dosen PA ikut terlihat.
