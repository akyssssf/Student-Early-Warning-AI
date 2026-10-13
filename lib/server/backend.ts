import { NextResponse } from "next/server";
import { backendUrl, isSecretConfigured } from "@/lib/server/auth";

export type BackendResult = { status: number; body: unknown };

/** Panggil API Flask. Gagal koneksi dikembalikan sebagai 502 berbahasa Indonesia. */
export async function callBackend(path: string, init: RequestInit & { token?: string } = {}): Promise<BackendResult> {
  const { token, headers, ...rest } = init;
  try {
    const response = await fetch(`${backendUrl()}/api/v1${path}`, {
      ...rest,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const text = await response.text();
    let body: unknown = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }
    if (body === null && response.status >= 400) {
      // Bukan JSON dari Flask: biasanya BACKEND_URL salah atau port dipakai aplikasi lain (macOS: AirPlay Receiver memakai port 5000).
      return { status: 502, body: { code: "RESPONS_BACKEND_TIDAK_VALID", message: `Respons tak terduga dari backend (status ${response.status}). Periksa BACKEND_URL dan port backend.` } };
    }
    return { status: response.status, body };
  } catch {
    return { status: 502, body: { code: "BACKEND_TIDAK_TERSEDIA", message: "Server backend tidak dapat dihubungi. Pastikan backend Flask berjalan." } };
  }
}

export function jsonFromBackend(result: BackendResult): NextResponse {
  return NextResponse.json(result.body ?? {}, { status: result.status });
}

export function configError(): NextResponse | null {
  return isSecretConfigured()
    ? null
    : NextResponse.json({ message: "JWT_SECRET_KEY belum diisi di server frontend. Salin .env.example ke .env.local." }, { status: 500 });
}
