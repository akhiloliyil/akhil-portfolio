import { NextRequest, NextResponse } from "next/server";
import { verifyToken, AUTH_COOKIE } from "@/lib/auth";
import { getContent, saveContent, isValidContent } from "@/lib/content-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authed(req: NextRequest): boolean {
  return verifyToken(req.cookies.get(AUTH_COOKIE)?.value);
}

export async function GET(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json(await getContent());
}

export async function PUT(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!isValidContent(body)) {
    return NextResponse.json(
      { error: "Payload is missing required sections." },
      { status: 400 }
    );
  }
  try {
    const mode = await saveContent(body);
    return NextResponse.json({ ok: true, mode });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Save failed." },
      { status: 502 }
    );
  }
}
