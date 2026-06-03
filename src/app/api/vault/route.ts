import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const secret = process.env.VAULT_PASSWORD || "abargon2026";

  if (password === secret) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("vault-auth", "granted", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ ok: false, error: "Acceso denegado" }, { status: 401 });
}
