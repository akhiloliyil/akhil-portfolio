"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

type NavLink = { href: string; label: string };

const defaultLinks: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#experience", label: "Experience" },
  { href: "#gallery", label: "Gallery" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "#testimonials", label: "Praise" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({ links = defaultLinks }: { links?: NavLink[] }) {
  const [open, setOpen] = useState(false);

  // Close the menu if the viewport grows past the breakpoint that shows
  // the inline nav, so it can't be left open-but-hidden behind it.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lock page scroll while the tablet/mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
            className="focus-ring hidden rounded-sm border border-ink px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent sm:block"
          >
            Say hello
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="focus-ring relative grid h-8 w-8 place-items-center rounded-sm border border-line text-ink transition-colors hover:border-accent hover:text-accent lg:hidden"
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

      {/* Tablet / mobile menu — links hidden from the inline nav below `lg`
          collapse in here instead of vanishing outright. Height-animated via
          a grid-rows trick so it doesn't need JS to measure content height. */}
      <div
        id="mobile-nav"
        className={`grid overflow-hidden border-line transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        }`}
      >
        <nav className="min-h-0">
          <ul className="mx-auto flex max-w-6xl flex-col divide-y divide-line px-6 font-mono text-sm uppercase tracking-wider text-inkmuted sm:grid sm:grid-cols-2 sm:divide-y-0 sm:gap-x-6 sm:py-2">
            {links.map((link) => (
              <li key={link.href} className="sm:border-b sm:border-line/60">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring block rounded py-4 transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="py-4 sm:hidden">
              <a
                href="mailto:akhiloliyil@gmail.com"
                onClick={() => setOpen(false)}
                className="focus-ring inline-block rounded-sm border border-ink px-3 py-1.5 text-xs text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Say hello
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
