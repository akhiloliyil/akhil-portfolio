import { NextResponse } from "next/server";
import { getContent } from "@/lib/content-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public, read-only. The portfolio content is public anyway; this lets the
// client-side résumé download reflect admin edits.
export async function GET() {
  return NextResponse.json(await getContent());
}
