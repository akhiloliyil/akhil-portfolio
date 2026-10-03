"use client";

import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import ResumeButton from "./ResumeButton";

type NavLink = { href: string; label: string };

// Recruiter-first: the strongest work is one tap away, nothing else competes.
const defaultLinks: NavLink[] = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({
  links = defaultLinks,
  home = "#top",
  showResume = false,
}: {
  links?: NavLink[];
  // Logo target — "/" on sub-pages (case studies).
  home?: string;
  // Résumé download only on the `/?resume` link.
  showResume?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu if the viewport grows past the breakpoint that shows
  // the inline nav, so it can't be left open-but-hidden behind it.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // While open: lock page scroll, and Escape closes and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="page-container sticky top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-4">
      {/* Floating pill bar — logo tile, centered links, accent CTA. */}
      <div className="rounded-[2rem] border border-line bg-paper/80 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-md supports-[backdrop-filter]:bg-paper/65">
        <div className="flex items-center justify-between gap-3 py-1.5 pl-1.5 pr-1.5 sm:py-2.5 sm:pl-2.5 sm:pr-2">
          <a
            href={home}
            aria-label="Akhil Kumar — home"
            className="focus-ring flex min-h-11 shrink-0 items-center gap-3 rounded-2xl pr-2"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent font-display text-sm font-bold tracking-tight text-onaccent">
              AK
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              Akhil Kumar
            </span>
          </a>

          <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="focus-ring inline-flex min-h-11 items-center rounded-full px-3 text-[15px] text-inkmuted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            {showResume && (
              <ResumeButton variant="nav" label="Résumé" className="hidden min-h-11 md:inline-flex" />
            )}
            <a
              href="mailto:akhiloliyil@gmail.com"
              className="focus-ring group hidden min-h-11 items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-onaccent transition-transform hover:scale-[1.03] xl:inline-flex"
            >
              Say hello
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="focus-ring relative grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors active:bg-panel lg:hidden"
            >
              <span className="relative block h-3.5 w-4">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                    open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Phone / tablet menu. Height-animated via a grid-rows trick (no JS
            measuring); `invisible` when closed keeps its links out of the
            tab order and away from screen readers. */}
        <div
          id="mobile-nav"
          className={`grid overflow-hidden transition-[grid-template-rows,visibility] duration-300 ease-out lg:hidden ${
            open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
          }`}
        >
          <nav aria-label="Menu" className="min-h-0">
            <ul className="mx-3 flex flex-col divide-y divide-line border-t border-line text-lg text-ink sm:grid sm:grid-cols-2 sm:divide-y-0 sm:gap-x-6">
              {links.map((link) => (
                <li key={link.href} className="sm:border-b sm:border-line/60">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="focus-ring flex min-h-12 items-center justify-between rounded px-2 transition-colors active:text-accent"
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-accent">→</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className={`mx-3 grid gap-3 border-t border-line px-2 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 ${showResume ? "grid-cols-2" : "grid-cols-1"}`}>
              {showResume && (
                <ResumeButton variant="solid" label="Résumé" className="min-h-12 justify-center" />
              )}
              <a
                href="mailto:akhiloliyil@gmail.com"
                onClick={() => setOpen(false)}
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-ink"
              >
                Say hello
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
