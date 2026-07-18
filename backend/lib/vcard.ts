import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type { Content } from "@/lib/content-store";

/** Escape a value per RFC 6350 (vCard) — commas, semicolons, backslashes, newlines. */
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/** Split "Akhil Kumar" into { family: "Kumar", given: "Akhil" }. */
function splitName(full: string): { family: string; given: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { family: "", given: parts[0] };
  return { given: parts[0], family: parts.slice(1).join(" ") };
}

/** Read the portrait once and return a base64 PHOTO property, or "" if missing. */
async function photoProperty(): Promise<string> {
  const candidates = [
    { file: "profile.jpg", type: "JPEG" },
    { file: "profile.png", type: "PNG" },
    { file: "Akhil_Kumar.jpeg", type: "JPEG" },
  ];
  for (const { file, type } of candidates) {
    try {
      const buf = await fs.readFile(
        path.join(process.cwd(), "public", "images", file)
      );
      // vCard 3.0 base64 photo, folded onto its own continuation line.
      const b64 = buf.toString("base64");
      return `PHOTO;ENCODING=b;TYPE=${type}:${b64}`;
    } catch {
      // try next candidate
    }
  }
  return "";
}

/**
 * Build a vCard (3.0 — the version iOS/Android Contacts import most reliably)
 * from the live portfolio content. `siteUrl` is the absolute origin so the
 * portfolio link resolves on any deployment.
 */
export async function buildVCard(
  content: Content,
  siteUrl: string
): Promise<string> {
  const p = content.profile;
  const { given, family } = splitName(p.name);
  const phoneClean = p.phone.replace(/\s+/g, "");

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(p.name)}`,
    `TITLE:${esc(p.title)}`,
    `ORG:${esc("Independent · Lead Product Designer")}`,
    `TEL;TYPE=CELL,VOICE:${esc(phoneClean)}`,
    `EMAIL;TYPE=INTERNET,PREF:${esc(p.email)}`,
    // Portfolio first (PREF), then LinkedIn.
    `URL;TYPE=Portfolio:${esc(siteUrl)}`,
    `URL;TYPE=LinkedIn:${esc(p.linkedin)}`,
    `ADR;TYPE=WORK:;;;${esc(p.location)};;;`,
    `NOTE:${esc(p.blurb)}`,
  ];

  const photo = await photoProperty();
  if (photo) lines.push(photo);

  lines.push(`REV:${new Date().toISOString()}`);
  lines.push("END:VCARD");

  // vCard requires CRLF line endings.
  return lines.join("\r\n") + "\r\n";
}
