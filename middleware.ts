import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roleRoutes = [
  ["/dashboard-admin", "admin"],
  ["/dashboard-kaprodi", "kaprodi"],
  ["/dashboard-orangtua", "orangtua"],
  ["/dashboard-mahasiswa", "mahasiswa"],
  ["/dashboard", "dosen"],
] as const;

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sew_session")?.value;
  const role = request.cookies.get("sew_role")?.value;
  const path = request.nextUrl.pathname;
  const match = roleRoutes.find(([prefix]) => path.startsWith(prefix));

  if (match && !token) return NextResponse.redirect(new URL("/login", request.url));
  if (match && role !== match[1]) {
    const destinations: Record<string, string> = {
      admin: "/dashboard-admin",
      dosen: "/dashboard",
      kaprodi: "/dashboard-kaprodi",
      mahasiswa: "/dashboard-mahasiswa",
      orangtua: "/dashboard-orangtua",
    };
    return NextResponse.redirect(new URL(destinations[role ?? ""] ?? "/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/dashboard-admin/:path*", "/dashboard-kaprodi/:path*", "/dashboard-orangtua/:path*", "/dashboard-mahasiswa/:path*"] };
