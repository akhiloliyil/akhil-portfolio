import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createToken, AUTH_COOKIE, COOKIE_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let password = "";
  try {
    password = String((await req.json()).password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
