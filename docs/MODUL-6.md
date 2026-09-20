# Modul 6 — Next.js App Router, RSC, dan Streaming SSR

Implementasi proyek mengikuti kebutuhan Meta-Framework pada brief proyek akhir:

- **App Router**: seluruh routing utama berada di `app/`.
- **Nested Layouts**: dashboard Dosen, Admin, Kaprodi, Mahasiswa, dan Orang Tua memiliki layout masing-masing.
- **React Server Components (RSC)**: page-level components tetap menjadi Server Component secara default; interaksi browser dipisahkan ke komponen yang memakai `"use client"`.
- **Streaming SSR + Suspense**: `/dashboard` memiliki `Suspense` boundary yang membungkus `DashboardServerSnapshot`. Snapshot diproses di server dan fallback dikirim lebih dahulu sebelum konten snapshot selesai.
- **Loading UI**: tersedia `loading.tsx` pada route dashboard utama, mahasiswa, Admin, dan Kaprodi untuk state transisi route.
- **Error UI**: tersedia `error.tsx` pada dashboard utama dan mahasiswa untuk penanganan error route.
- **Middleware route guard**: `middleware.ts` membatasi route berdasarkan role.
- **Metadata API**: page-level `metadata` digunakan untuk title dan description halaman.

## Batas Client/Server

Komponen yang membutuhkan browser state atau event handler menggunakan Client Component, misalnya shell navigasi, TanStack Query, form, dan interaksi CRUD. Page dan layout tetap Server Component selama tidak membutuhkan API browser langsung.

## Streaming SSR yang didemokan

`app/dashboard/page.tsx` menggunakan:

```tsx
<Suspense fallback={<SnapshotFallback />}>
  <DashboardServerSnapshot />
</Suspense>
```

`DashboardServerSnapshot` membaca mock data di server dan tidak menggunakan `useState`, `useEffect`, atau event handler. Data interaktif dashboard tetap diambil oleh TanStack Query pada Client Component.
