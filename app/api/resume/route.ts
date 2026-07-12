import { NextResponse } from "next/server";
import { getContent } from "@/lib/content-store";
import { resumePdfBuffer } from "@/lib/resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Always-current résumé: built fresh from the live (admin-edited) content on
// every request, so any portfolio update is reflected immediately.
export async function GET() {
  const content = await getContent();
  const pdf = await resumePdfBuffer(content);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Akhil-Kumar-Resume.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
