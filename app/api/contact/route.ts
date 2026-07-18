import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getContent } from "@/lib/content-store";
import { buildVCard } from "@/lib/vcard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Absolute origin of this deployment, from the request (works on any host). */
function originOf(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("host");
  return host ? `${proto}://${host}` : "https://akhiloliyil.vercel.app";
}

// Always-current contact card: built from the live (admin-edited) content on
// every request, so any profile update is reflected immediately.
export async function GET(req: NextRequest) {
  const content = await getContent();
  const vcard = await buildVCard(content, originOf(req));
  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Akhil-Kumar.vcf"',
      "Cache-Control": "no-store",
    },
  });
}
