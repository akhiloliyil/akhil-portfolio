"use client";

/**
 * One-tap "Save Contact" — downloads /api/contact, a vCard (.vcf) generated
 * from the live portfolio content. On iOS/Android this opens the Contacts app
 * pre-filled; on desktop it saves the .vcf. Great for an NFC card tap.
 *
 * `variant`:
 *   "solid"   — filled accent button (primary CTA)
 *   "outline" — bordered button that matches the Contact-section links
 */
export default function SaveContact({
  variant = "outline",
  className = "",
}: {
  variant?: "solid" | "outline";
  className?: string;
}) {
  const base =
    "focus-ring inline-flex items-center gap-2 rounded-sm px-5 py-3 font-mono text-xs uppercase tracking-wider transition-colors";
  const styles =
    variant === "solid"
      ? "bg-accent text-white hover:bg-ink"
      : "border border-ink text-ink hover:border-accent hover:text-accent";

  return (
    <a
      href="/api/contact"
      download="Akhil-Kumar.vcf"
      className={`${base} ${styles} ${className}`}
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
      Save contact
    </a>
  );
}
