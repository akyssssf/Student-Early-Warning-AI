# Matriks Migrasi Build Pipeline

| Requirement Modul 8 | Implementasi | Bukti |
|---|---|---|
| Vite + React + TypeScript | `package.json`, `vite.config.ts`, `src/` | Project Vite |
| Path alias `@/` | `vite.config.ts` + `tsconfig.app.json` | Alias source |
| Strict TypeScript | `strict: true` | `tsconfig.app.json` |
| `noUncheckedIndexedAccess` | Diaktifkan | `tsconfig.app.json` |
| Biome | `biome.json`, `npm run check` | Quality script |
| Code splitting | `manualChunks.vendor` + `manualChunks.icons` | `vite.config.ts` |
| Esbuild minification | `minify: "esbuild"` | `vite.config.ts` |
| HMR | Interactive counter + documented measurement procedure | `src/App.tsx`, `docs/BENCHMARK.md` |
| CI/CD quality gate | GitHub Actions: typecheck → Biome → build | `.github/workflows/quality.yml` |
| SonarQube | `sonar-project.properties` | Static analysis configuration |
| Benchmark PDF | Generated separately in project root | `Modul-8-Migrasi-Benchmark.pdf` |

## Catatan
Angka benchmark perangkat lokal harus diisi setelah pengukuran. Angka yang tertulis di dashboard adalah referensi yang diberikan oleh modul, bukan klaim pengukuran mesin pengguna.
