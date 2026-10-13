import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roleRoutes = [
  ["/dashboard-admin", "admin"],
  ["/dashboard-kaprodi", "kaprodi"],
  ["/dashboard-orangtua", "orangtua"],
  ["/dashboard-mahasiswa", "mahasiswa"],
  ["/dashboard", "dosen"],
] as const;

const destinations: Record<string, string> = {
  admin: "/dashboard-admin",
  dosen: "/dashboard",
  kaprodi: "/dashboard-kaprodi",
  mahasiswa: "/dashboard-mahasiswa",
  orangtua: "/dashboard-orangtua",
};

/** Role yang boleh mengubah data (POST/PUT/DELETE) per endpoint. */
const writeRoles: Record<string, readonly string[]> = {
  "/api/students": ["dosen", "admin"],
  "/api/interventions": ["dosen"],
};

function guardApi(request: NextRequest, path: string, token: string | undefined, role: string | undefined) {
  // Satu-satunya endpoint publik: daftar nama untuk form login Orang Tua.
  if (path === "/api/students/lookup") return NextResponse.next();

  if (!token) return NextResponse.json({ message: "Silakan login terlebih dahulu." }, { status: 401 });

  const allowed = writeRoles[path];
  const isWrite = request.method !== "GET" && request.method !== "HEAD";
  if (isWrite && allowed && !(role && allowed.includes(role))) {
    return NextResponse.json({ message: "Role Anda tidak memiliki izin untuk aksi ini." }, { status: 403 });
  }
  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sew_session")?.value;
  const role = request.cookies.get("sew_role")?.value;
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api/")) return guardApi(request, path, token, role);

  const match = roleRoutes.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`));

  if (match && !token) return NextResponse.redirect(new URL("/login", request.url));
  if (match && role !== match[1]) {
    return NextResponse.redirect(new URL(destinations[role ?? ""] ?? "/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/dashboard-admin/:path*",
    "/dashboard-kaprodi/:path*",
    "/dashboard-orangtua/:path*",
    "/dashboard-mahasiswa/:path*",
  ],
};
