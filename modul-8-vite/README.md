# Student Early Warning AI — Modul 8 Vite Toolchain

Subproject praktikum untuk memenuhi Modul 8: Build Tools Modern & Bundler Generasi Baru.

## Jalankan

```bash
npm install
npm run dev
```

Dev server menggunakan port `3001` agar tidak bentrok dengan project Next.js (`3000`).

## Quality gate

```bash
npm run typecheck
npm run check
npm run build
```

## Struktur penting

- `vite.config.ts` — alias, dev server, minifikasi Esbuild, manual chunks.
- `biome.json` — formatter + linter Rust-based.
- `tsconfig.app.json` — strict TypeScript + `noUncheckedIndexedAccess`.
- `src/App.tsx` — dashboard benchmarking + HMR/state demo.
- `.github/workflows/quality.yml` — CI quality gate.
- `sonar-project.properties` — konfigurasi sumber SonarQube.
- `docs/BENCHMARK.md` — prosedur dan tabel pengukuran.
- `docs/MIGRATION-MATRIX.md` — matriks pemenuhan requirement.
