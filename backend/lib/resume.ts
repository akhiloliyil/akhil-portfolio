import {
  profile as seedProfile,
  about as seedAbout,
  experience as seedExperience,
  projects as seedProjects,
  education as seedEducation,
  toolkit as seedToolkit,
} from "@/data/content";

export type ResumeData = {
  profile: typeof seedProfile;
  about: typeof seedAbout;
  experience: typeof seedExperience;
  projects: typeof seedProjects;
  education: typeof seedEducation;
  toolkit: typeof seedToolkit;
};

const SEED: ResumeData = {
  profile: seedProfile,
  about: seedAbout,
  experience: seedExperience,
  projects: seedProjects,
  education: seedEducation,
  toolkit: seedToolkit,
};

// Palette (matches the site's ink / accent / muted tokens)
const INK: [number, number, number] = [17, 25, 43];
const ACCENT: [number, number, number] = [54, 84, 244];
const MUTED: [number, number, number] = [91, 100, 120];
const LINE: [number, number, number] = [214, 219, 228];

// One spacing scale drives the whole document's vertical rhythm (in points).
const SP = {
  margin: 56, // page border / breathing space
  lineHeight: 1.5, // body leading multiplier
  afterName: 8,
  afterTitle: 12,
  afterContact: 14, // gap before the header rule
  afterHeaderRule: 6,
  sectionBefore: 26, // space above a section heading
  sectionRuleGap: 8, // heading -> underline
  sectionAfter: 16, // underline -> first content line
  afterParagraph: 10,
  afterSubtitle: 6, // role title/location -> bullets
  bulletGap: 5, // between bullets
  entryGap: 16, // between experience/project/edu entries
};

/**
 * Build a clean, text-based résumé PDF from the site content and return the
 * jsPDF document. Works in the browser and in Node (API route). jsPDF is
 * imported dynamically so it stays out of the initial client bundle.
 */
export async function buildResume(data: ResumeData = SEED) {
  const { profile, about, experience, projects, education, toolkit } = data;
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = SP.margin;
  const contentW = pageW - M * 2;
  let y = M;

  const ensure = (h: number) => {
    if (y + h > pageH - M) {
      doc.addPage();
      y = M;
    }
  };

  // Write a run of text at a given size/color; wraps to maxW, advances y.
  const text = (
    str: string,
    x: number,
    size: number,
    color: [number, number, number],
    opts: { bold?: boolean; maxW?: number; align?: "left" | "right" } = {}
  ) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lh = size * SP.lineHeight;
    const lines = opts.maxW
      ? (doc.splitTextToSize(str, opts.maxW) as string[])
      : [str];
    lines.forEach((ln) => {
      ensure(lh);
      doc.text(ln, x, y, { align: opts.align });
      y += lh;
    });
  };

  const rule = (weight: number, color: [number, number, number]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(weight);
    doc.line(M, y, pageW - M, y);
  };

  const sectionTitle = (label: string) => {
    y += SP.sectionBefore;
    ensure(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...ACCENT);
    doc.text(label.toUpperCase(), M, y, { charSpace: 1.6 });
    y += SP.sectionRuleGap;
    rule(0.8, LINE);
    y += SP.sectionAfter;
  };

  // ---- Header ---------------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  doc.setTextColor(...INK);
  y += 20; // drop to the name's baseline
  doc.text(profile.name, M, y);
  y += SP.afterName + 6;

  text(profile.title, M, 11, ACCENT);
  y += 2;

  const linkedin = profile.linkedin.replace(/^https?:\/\/(www\.)?/, "");
  const contact = `${profile.email}   ·   ${profile.phone}   ·   ${profile.location}   ·   ${linkedin}`;
  text(contact, M, 9, MUTED, { maxW: contentW });
  y += SP.afterContact;
  rule(1, INK);
  y += SP.afterHeaderRule;

  // ---- Summary --------------------------------------------------------------
  sectionTitle("Summary");
  text(about.lead, M, 11, INK, { bold: true, maxW: contentW });
  y += 6;
  text(profile.blurb, M, 9.5, MUTED, { maxW: contentW });

  // ---- Core expertise -------------------------------------------------------
  sectionTitle("Core Expertise");
  about.expertise.forEach((group, i) => {
    if (i > 0) y += SP.afterParagraph;
    text(group.group, M, 9.5, INK, { bold: true });
    y += 2;
    text(group.items.join("   ·   "), M, 9.5, MUTED, { maxW: contentW });
  });

  // ---- Experience -----------------------------------------------------------
  sectionTitle("Experience");
  experience.forEach((role, i) => {
    if (i > 0) y += SP.entryGap;
    ensure(46);

    // company (left) + period (right) on one baseline
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(role.company, M, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(role.period, pageW - M, y, { align: "right" });
    y += 15;

    if (role.title) text(role.title, M, 9.5, ACCENT, { maxW: contentW });
    if (role.location) text(role.location, M, 8.5, MUTED);

    if (role.highlights?.length) {
      y += SP.afterSubtitle;
      role.highlights.forEach((h, j) => {
        if (j > 0) y += SP.bulletGap;
        const lines = doc.splitTextToSize(h, contentW - 16) as string[];
        lines.forEach((ln, k) => {
          ensure(9 * SP.lineHeight);
          if (k === 0) {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...ACCENT);
            doc.setFontSize(9);
            doc.text("–", M, y);
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...INK);
          doc.text(ln, M + 14, y);
          y += 9 * SP.lineHeight;
        });
      });
    }
  });

  // ---- Selected projects ----------------------------------------------------
  sectionTitle("Selected Projects");
  projects.forEach((p, i) => {
    if (i > 0) y += SP.entryGap;
    ensure(34);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text(p.name, M, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text(p.org, pageW - M, y, { align: "right" });
    y += 14;
    text(p.summary, M, 9, MUTED, { maxW: contentW });
  });

  // ---- Education ------------------------------------------------------------
  sectionTitle("Education");
  education.forEach((e, i) => {
    if (i > 0) y += SP.entryGap;
    ensure(30);
    text(e.degree, M, 10, INK, { bold: true });
    y += 2;
    text(`${e.school}   ·   ${e.period}`, M, 9, MUTED);
  });

  // ---- Toolkit --------------------------------------------------------------
  sectionTitle("Toolkit");
  toolkit.forEach((group, i) => {
    if (i > 0) y += SP.afterParagraph;
    text(group.group, M, 9.5, INK, { bold: true });
    y += 2;
    text(group.tools.join("   ·   "), M, 9, MUTED, { maxW: contentW });
  });

  return doc;
}

/** Client-side helper: build the résumé from live content and download it. */
export async function downloadResume() {
  let data: ResumeData | undefined;
  try {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (res.ok) data = (await res.json()) as ResumeData;
  } catch {
    // fall back to the compiled seed
  }
  const doc = await buildResume(data);
  doc.save("Akhil-Kumar-Resume.pdf");
}

/** Server-side helper: build the résumé and return it as a Node Buffer. */
export async function resumePdfBuffer(data?: ResumeData): Promise<Buffer> {
  const doc = await buildResume(data);
  return Buffer.from(doc.output("arraybuffer"));
}
