import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow vault page and API
  if (pathname === "/vault" || pathname.startsWith("/api/vault")) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  // Check vault cookie
  const vaultCookie = request.cookies.get("vault-auth");
  if (!vaultCookie || vaultCookie.value !== "granted") {
    return NextResponse.redirect(new URL("/vault", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
