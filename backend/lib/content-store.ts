import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import {
  profile as seedProfile,
  stats as seedStats,
  about as seedAbout,
  projects as seedProjects,
  experience as seedExperience,
  education as seedEducation,
  gallery as seedGallery,
  toolkit as seedToolkit,
  process as seedProcess,
  testimonials as seedTestimonials,
} from "@/data/content";
// Bundled at build time so it's always readable on serverless (Vercel) hosts,
// where the raw file may not be traced into the function.
import bundled from "@/data/content.json";
import { githubEnabled, commitFile } from "@/lib/github";

export type Content = {
  profile: typeof seedProfile;
  stats: typeof seedStats;
  about: typeof seedAbout;
  projects: typeof seedProjects;
  experience: typeof seedExperience;
  education: typeof seedEducation;
  gallery: typeof seedGallery;
  toolkit: typeof seedToolkit;
  process: typeof seedProcess;
  testimonials: typeof seedTestimonials;
};

const FILE = path.join(process.cwd(), "backend", "data", "content.json");

export function seedContent(): Content {
  return {
    profile: seedProfile,
    stats: seedStats,
    about: seedAbout,
    projects: seedProjects,
    experience: seedExperience,
    education: seedEducation,
    gallery: seedGallery,
    toolkit: seedToolkit,
    process: seedProcess,
    testimonials: seedTestimonials,
  };
}

/**
 * Read the live content. Locally this reads the on-disk JSON (reflects local
 * admin saves immediately). On Vercel the disk file may be unreadable, so it
 * falls back to the JSON bundled at build time (= the last committed content).
 */
export async function getContent(): Promise<Content> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Content;
  } catch {
    return (bundled as Content) ?? seedContent();
  }
}

/**
 * Persist content. When GitHub storage is configured, commit it to the repo
 * (triggers a redeploy); otherwise write to the local disk (dev). Returns the
 * storage mode so the UI can explain what will happen next.
 */
export async function saveContent(data: Content): Promise<"github" | "local"> {
  const json = JSON.stringify(data, null, 2);
  if (githubEnabled()) {
    await commitFile(
      "backend/data/content.json",
      Buffer.from(json, "utf8"),
      "admin: update site content"
    );
    return "github";
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, json, "utf8");
  return "local";
}

const TOP_KEYS: (keyof Content)[] = [
  "profile",
  "stats",
  "about",
  "projects",
  "experience",
  "education",
  "gallery",
  "toolkit",
  "process",
  "testimonials",
];

/** Lightweight shape check so a bad payload can't wipe the file. */
export function isValidContent(data: unknown): data is Content {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return TOP_KEYS.every((k) => k in d && d[k] != null);
}
