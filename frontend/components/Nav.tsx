"use client";

import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#experience", label: "Experience" },
  { href: "#gallery", label: "Gallery" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "#testimonials", label: "Praise" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="focus-ring rounded font-display text-sm font-semibold tracking-tight text-ink"
        >
          AKHIL KUMAR
          <span className="ml-2 font-mono text-[11px] font-normal text-inkmuted">
            .ui
          </span>
        </a>
        <nav className="hidden gap-5 font-mono text-xs uppercase tracking-wider text-inkmuted lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="focus-ring rounded transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="mailto:akhiloliyil@gmail.com"
            className="focus-ring rounded-sm border border-ink px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Say hello
          </a>
        </div>
      </div>
    </header>
  );
}
