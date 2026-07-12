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
} from "@/data/content";

export type Content = {
  profile: typeof seedProfile;
  stats: typeof seedStats;
  about: typeof seedAbout;
  projects: typeof seedProjects;
  experience: typeof seedExperience;
  education: typeof seedEducation;
  gallery: typeof seedGallery;
  toolkit: typeof seedToolkit;
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
  };
}

/** Read the live content from disk, falling back to the compiled seed. */
export async function getContent(): Promise<Content> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Content;
  } catch {
    return seedContent();
  }
}

/** Persist content to disk (pretty-printed JSON). */
export async function saveContent(data: Content): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
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
];

/** Lightweight shape check so a bad payload can't wipe the file. */
export function isValidContent(data: unknown): data is Content {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return TOP_KEYS.every((k) => k in d && d[k] != null);
}
