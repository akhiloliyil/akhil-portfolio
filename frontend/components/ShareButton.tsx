"use client";

import { useState } from "react";

/**
 * Opens the native OS share sheet (iOS/Android/supported desktop) via the Web
 * Share API. Falls back to copying the link to the clipboard where sharing
 * isn't available (most desktop browsers).
 */
export default function ShareButton({
  title,
  text,
  className,
}: {
  title: string;
  text?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data: ShareData = { title, text, url };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // user dismissed the share sheet — ignore
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — no-op
    }
  };

  return (
    <button type="button" onClick={onShare} className={className}>
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
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" />
      </svg>
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
