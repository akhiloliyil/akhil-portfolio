"use client";

import { useEffect, useState } from "react";
import {
  profile as sP,
  stats as sS,
  about as sA,
  education as sEd,
  toolkit as sT,
  type Project,
  type Role,
  type Shot,
} from "@/data/content";
import {
  Field,
  Area,
  Select,
  Toggle,
  StringList,
  ImageField,
  ArrayEditor,
  twoCol,
} from "./ui";

type Content = {
  profile: typeof sP;
  stats: typeof sS;
  about: typeof sA;
  projects: Project[];
  experience: Role[];
  education: typeof sEd;
  gallery: Shot[];
  toolkit: { group: string; tools: string[] }[];
};

type Edu = Content["education"][number];
type Stat = Content["stats"][number];
type Expertise = Content["about"]["expertise"][number];
type ToolGroup = Content["toolkit"][number];

type View = "loading" | "login" | "ready";
const TABS = [
  "Profile",
  "About",
  "Projects",
  "Experience",
  "Gallery",
  "Toolkit",
  "Education",
  "Stats",
] as const;
type Tab = (typeof TABS)[number];

let idCounter = 0;
const newId = (prefix: string) => `${prefix}-${(idCounter += 1)}`;

// ---- Change summary (for the save confirmation) ---------------------------
const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  title: "Title",
  location: "Location",
  email: "Email",
  phone: "Phone",
  linkedin: "LinkedIn",
  blurb: "Blurb",
  focus: "Focus pills",
  lead: "Lead statement",
  paragraphs: "Paragraphs",
  delivers: "What I deliver",
  expertise: "Core expertise",
};
const pretty = (k: string) =>
  FIELD_LABELS[k] ?? k.charAt(0).toUpperCase() + k.slice(1);
const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

function diffObject(
  label: string,
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  out: string[]
) {
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  for (const k of keys) if (!eq(a?.[k], b?.[k])) out.push(`${label}: ${pretty(k)}`);
}

function diffArray<T>(
  label: string,
  a: T[],
  b: T[],
  key: (t: T) => string,
  out: string[]
) {
  const am = new Map(a.map((x) => [key(x) || "(untitled)", x]));
  const bm = new Map(b.map((x) => [key(x) || "(untitled)", x]));
  let touched = false;
  for (const [k, v] of bm) {
    if (!am.has(k)) {
      out.push(`${label}: added “${k}”`);
      touched = true;
    } else if (!eq(am.get(k), v)) {
      out.push(`${label}: edited “${k}”`);
      touched = true;
    }
  }
  for (const [k] of am)
    if (!bm.has(k)) {
      out.push(`${label}: removed “${k}”`);
      touched = true;
    }
  if (!touched) {
    const ak = a.map(key).join("|");
    const bk = b.map(key).join("|");
    if (ak !== bk) out.push(`${label}: reordered`);
  }
}

function describeChanges(a: Content, b: Content): string[] {
  const out: string[] = [];
  diffObject("Profile", a.profile as Record<string, unknown>, b.profile as Record<string, unknown>, out);
  diffObject("About", a.about as Record<string, unknown>, b.about as Record<string, unknown>, out);
  diffArray("Stats", a.stats, b.stats, (s) => s.value || s.label, out);
  diffArray("Projects", a.projects, b.projects, (p) => p.name, out);
  diffArray("Experience", a.experience, b.experience, (r) => r.company, out);
  diffArray("Gallery", a.gallery, b.gallery, (s) => s.title, out);
  diffArray("Toolkit", a.toolkit, b.toolkit, (g) => g.group, out);
  diffArray("Education", a.education, b.education, (e) => e.degree, out);
  return out;
}

export default function AdminApp() {
  const [view, setView] = useState<View>("loading");
  const [content, setContent] = useState<Content | null>(null);
  const [original, setOriginal] = useState<Content | null>(null);
  const [pending, setPending] = useState<string[] | null>(null);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("Profile");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/content", { cache: "no-store" });
    if (res.status === 401) {
      setView("login");
      return;
    }
    const json = (await res.json()) as Content;
    setContent(json);
    setOriginal(structuredClone(json));
    setView("ready");
  };

  useEffect(() => {
    load();
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword("");
      setView("loading");
      load();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg({ ok: false, text: d.error || "Login failed" });
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setContent(null);
    setView("login");
  };

  // Compute the change summary and open the confirmation (or note "no changes").
  const requestSave = () => {
    if (!content || !original) return;
    const changes = describeChanges(original, content);
    if (changes.length === 0) {
      setMsg({ ok: true, text: "No changes to save." });
      return;
    }
    setMsg(null);
    setPending(changes);
  };

  const doSave = async () => {
    if (!content) return;
    setPending(null);
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Save failed");
      setOriginal(structuredClone(content));
      setMsg({ ok: true, text: "Saved. Refresh the site to see changes." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  // ---- Loading / login ------------------------------------------------------
  if (view === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-paper text-inkmuted">
        <span className="font-mono text-sm">Loading…</span>
      </div>
    );
  }

  if (view === "login" || !content) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper px-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-md border border-line bg-panel p-8 shadow-xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            AK · Admin
          </p>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink">
            Sign in
          </h1>
          <div className="mt-6">
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Admin password"
            />
          </div>
          {msg && !msg.ok && (
            <p className="mt-3 text-sm text-coral">{msg.text}</p>
          )}
          <button
            type="submit"
            className="focus-ring mt-6 w-full rounded-sm bg-accent px-4 py-3 font-mono text-xs uppercase tracking-wider text-white hover:bg-ink"
          >
            Enter dashboard
          </button>
        </form>
      </div>
    );
  }

  // ---- Editor helpers -------------------------------------------------------
  const patch = (p: Partial<Content>) => setContent({ ...content, ...p });

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-line bg-panel/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold">AK Admin</span>
            <a
              href="/"
              target="_blank"
              className="font-mono text-[11px] uppercase tracking-wider text-inkmuted hover:text-accent"
            >
              View site ↗
            </a>
          </div>
          <div className="flex items-center gap-2">
            {msg && (
              <span
                className={`hidden font-mono text-[11px] sm:inline ${
                  msg.ok ? "text-accent" : "text-coral"
                }`}
              >
                {msg.text}
              </span>
            )}
            <button
              onClick={requestSave}
              disabled={saving}
              className="focus-ring rounded-sm bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white hover:bg-ink disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={logout}
              className="rounded-sm border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-inkmuted hover:border-coral hover:text-coral"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5 pb-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                tab === t
                  ? "bg-ink text-paper"
                  : "text-inkmuted hover:text-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {msg && (
          <p
            className={`mb-5 rounded-sm border px-3 py-2 text-sm ${
              msg.ok
                ? "border-accent/40 bg-accent/10 text-ink"
                : "border-coral/50 bg-coral/10 text-ink"
            }`}
          >
            {msg.text}
          </p>
        )}

        {/* ---- PROFILE ---- */}
        {tab === "Profile" && (
          <div className="space-y-4">
            <div className={twoCol}>
              <Field label="Name" value={content.profile.name} onChange={(v) => patch({ profile: { ...content.profile, name: v } })} />
              <Field label="Location" value={content.profile.location} onChange={(v) => patch({ profile: { ...content.profile, location: v } })} />
            </div>
            <Field label="Title" value={content.profile.title} onChange={(v) => patch({ profile: { ...content.profile, title: v } })} />
            <div className={twoCol}>
              <Field label="Email" value={content.profile.email} onChange={(v) => patch({ profile: { ...content.profile, email: v } })} />
              <Field label="Phone" value={content.profile.phone} onChange={(v) => patch({ profile: { ...content.profile, phone: v } })} />
            </div>
            <Field label="LinkedIn URL" value={content.profile.linkedin} onChange={(v) => patch({ profile: { ...content.profile, linkedin: v } })} />
            <Area label="Blurb" rows={4} value={content.profile.blurb} onChange={(v) => patch({ profile: { ...content.profile, blurb: v } })} />
            <StringList label="Focus pills" values={content.profile.focus} onChange={(v) => patch({ profile: { ...content.profile, focus: v } })} />
            <ImageField label="Portrait image" value="/images/profile.jpg" onChange={() => {}} />
            <p className="text-xs text-inkmuted">Uploading a portrait? Save it as <code>/images/profile.jpg</code> to replace the hero photo.</p>
          </div>
        )}

        {/* ---- ABOUT ---- */}
        {tab === "About" && (
          <div className="space-y-4">
            <Area label="Lead statement" rows={3} value={content.about.lead} onChange={(v) => patch({ about: { ...content.about, lead: v } })} />
            <StringList area label="Paragraphs" values={content.about.paragraphs} onChange={(v) => patch({ about: { ...content.about, paragraphs: v } })} />
            <StringList area label="What I deliver" values={content.about.delivers} onChange={(v) => patch({ about: { ...content.about, delivers: v } })} />
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-inkmuted">Core expertise groups</span>
              <div className="mt-2">
                <ArrayEditor<Expertise>
                  items={content.about.expertise}
                  onItems={(v) => patch({ about: { ...content.about, expertise: v } })}
                  blank={() => ({ group: "New group", items: [] })}
                  itemTitle={(g) => g.group || "Group"}
                  render={(g, set) => (
                    <>
                      <Field label="Group name" value={g.group} onChange={(v) => set({ ...g, group: v })} />
                      <StringList label="Items" values={g.items} onChange={(v) => set({ ...g, items: v })} />
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* ---- PROJECTS ---- */}
        {tab === "Projects" && (
          <ArrayEditor<Project>
            items={content.projects}
            onItems={(v) => patch({ projects: v })}
            blank={() => ({ id: newId("project"), name: "New project", org: "", summary: "", details: [], stack: [], frameType: "app" })}
            itemTitle={(p) => p.name || "Project"}
            render={(p, set) => (
              <>
                <div className={twoCol}>
                  <Field label="ID (used by gallery link)" value={p.id} onChange={(v) => set({ ...p, id: v })} />
                  <Field label="Name" value={p.name} onChange={(v) => set({ ...p, name: v })} />
                </div>
                <div className={twoCol}>
                  <Field label="Org" value={p.org} onChange={(v) => set({ ...p, org: v })} />
                  <Field label="Period" value={p.period ?? ""} onChange={(v) => set({ ...p, period: v || undefined })} />
                </div>
                <div className={twoCol}>
                  <Field label="Role badge" value={p.role ?? ""} onChange={(v) => set({ ...p, role: v || undefined })} />
                  <Field label="Link (optional)" value={p.link ?? ""} onChange={(v) => set({ ...p, link: v || undefined })} />
                </div>
                <div className={twoCol}>
                  <Select label="Frame type" value={p.frameType} onChange={(v) => set({ ...p, frameType: v as Project["frameType"] })} options={[{ value: "app", label: "app" }, { value: "dashboard", label: "dashboard" }, { value: "ecommerce", label: "ecommerce" }]} />
                  <Toggle label="Featured (spans width)" value={!!p.featured} onChange={(v) => set({ ...p, featured: v })} />
                </div>
                <Area label="Summary" value={p.summary} onChange={(v) => set({ ...p, summary: v })} />
                <StringList area label="Details" values={p.details} onChange={(v) => set({ ...p, details: v })} />
                <StringList label="Stack" values={p.stack} onChange={(v) => set({ ...p, stack: v })} />
              </>
            )}
          />
        )}

        {/* ---- EXPERIENCE ---- */}
        {tab === "Experience" && (
          <ArrayEditor<Role>
            items={content.experience}
            onItems={(v) => patch({ experience: v })}
            blank={() => ({ company: "New role", period: "" })}
            itemTitle={(r) => r.company || "Role"}
            render={(r, set) => (
              <>
                <div className={twoCol}>
                  <Field label="Company" value={r.company} onChange={(v) => set({ ...r, company: v })} />
                  <Field label="Period" value={r.period} onChange={(v) => set({ ...r, period: v })} />
                </div>
                <div className={twoCol}>
                  <Field label="Title" value={r.title ?? ""} onChange={(v) => set({ ...r, title: v || undefined })} />
                  <Field label="Location" value={r.location ?? ""} onChange={(v) => set({ ...r, location: v || undefined })} />
                </div>
                <Area label="Blurb" value={r.blurb ?? ""} onChange={(v) => set({ ...r, blurb: v || undefined })} />
                <StringList area label="Highlights" values={r.highlights ?? []} onChange={(v) => set({ ...r, highlights: v.length ? v : undefined })} />
              </>
            )}
          />
        )}

        {/* ---- GALLERY ---- */}
        {tab === "Gallery" && (
          <ArrayEditor<Shot>
            items={content.gallery}
            onItems={(v) => patch({ gallery: v })}
            blank={() => ({ title: "New shot", tag: "", url: "", src: "" })}
            itemTitle={(s) => s.title || "Shot"}
            render={(s, set) => (
              <>
                <div className={twoCol}>
                  <Field label="Title" value={s.title} onChange={(v) => set({ ...s, title: v })} />
                  <Field label="Tag" value={s.tag} onChange={(v) => set({ ...s, tag: v })} />
                </div>
                <div className={twoCol}>
                  <Field label="URL label" value={s.url} onChange={(v) => set({ ...s, url: v })} />
                  <Select label="Linked project" value={s.projectId ?? ""} onChange={(v) => set({ ...s, projectId: v || undefined })} options={[{ value: "", label: "— none —" }, ...content.projects.map((p) => ({ value: p.id, label: p.name }))]} />
                </div>
                <ImageField label="Image" value={s.src} onChange={(v) => set({ ...s, src: v })} />
              </>
            )}
          />
        )}

        {/* ---- TOOLKIT ---- */}
        {tab === "Toolkit" && (
          <ArrayEditor<ToolGroup>
            items={content.toolkit}
            onItems={(v) => patch({ toolkit: v })}
            blank={() => ({ group: "New group", tools: [] })}
            itemTitle={(g) => g.group || "Group"}
            render={(g, set) => (
              <>
                <Field label="Group" value={g.group} onChange={(v) => set({ ...g, group: v })} />
                <StringList label="Tools" values={g.tools} onChange={(v) => set({ ...g, tools: v })} />
              </>
            )}
          />
        )}

        {/* ---- EDUCATION ---- */}
        {tab === "Education" && (
          <ArrayEditor<Edu>
            items={content.education}
            onItems={(v) => patch({ education: v })}
            blank={() => ({ degree: "", school: "", period: "" })}
            itemTitle={(e) => e.degree || "Education"}
            render={(e, set) => (
              <>
                <Field label="Degree" value={e.degree} onChange={(v) => set({ ...e, degree: v })} />
                <div className={twoCol}>
                  <Field label="School" value={e.school} onChange={(v) => set({ ...e, school: v })} />
                  <Field label="Period" value={e.period} onChange={(v) => set({ ...e, period: v })} />
                </div>
              </>
            )}
          />
        )}

        {/* ---- STATS ---- */}
        {tab === "Stats" && (
          <ArrayEditor<Stat>
            items={content.stats}
            onItems={(v) => patch({ stats: v })}
            blank={() => ({ value: "", label: "" })}
            itemTitle={(s) => s.value || "Stat"}
            render={(s, set) => (
              <div className={twoCol}>
                <Field label="Value" value={s.value} onChange={(v) => set({ ...s, value: v })} />
                <Field label="Label" value={s.label} onChange={(v) => set({ ...s, label: v })} />
              </div>
            )}
          />
        )}
      </main>

      {/* Save confirmation — lists the fields/items that changed */}
      {pending && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <button
            aria-label="Cancel"
            onClick={() => setPending(null)}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-md border border-line bg-panel p-6 shadow-2xl"
          >
            <h3 className="font-display text-lg font-semibold text-ink">
              Save these changes?
            </h3>
            <p className="mt-1 text-sm text-inkmuted">
              {pending.length} change{pending.length > 1 ? "s" : ""} will be
              written to the live site.
            </p>
            <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
              {pending.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm leading-snug text-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPending(null)}
                className="focus-ring rounded-sm border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-inkmuted hover:border-accent hover:text-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                autoFocus
                onClick={doSave}
                className="focus-ring rounded-sm bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white hover:bg-ink"
              >
                Confirm save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
