import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { verifyToken, AUTH_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";
}

export async function POST(req: NextRequest) {
  if (!verifyToken(req.cookies.get(AUTH_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image exceeds 8 MB." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "images", "uploads");
  await fs.mkdir(dir, { recursive: true });

  // Deterministic-ish unique name without Date.now(): slug + short content hash.
  const crypto = await import("node:crypto");
  const hash = crypto.createHash("sha1").update(buf).digest("hex").slice(0, 8);
  const filename = `${slug(file.name)}-${hash}.${EXT[file.type]}`;
  await fs.writeFile(path.join(dir, filename), buf);

  return NextResponse.json({ path: `/images/uploads/${filename}` });
}
