"use client";

import { useEffect, useState } from "react";

/**
 * Shows a "Download résumé" button when the URL carries a `resume` hint
 * (e.g. ?resume). Downloads from /api/resume, which is regenerated from the
 * live (admin-edited) content on every request — always up to date.
 */
export default function ResumeButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(window.location.search.toLowerCase().includes("resume"));
  }, []);

  if (!show) return null;

  return (
    <a
      href="/api/resume"
      download="Akhil-Kumar-Resume.pdf"
      className="focus-ring inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-3 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-ink"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
      Download résumé
    </a>
  );
}
