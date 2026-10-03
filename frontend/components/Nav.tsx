"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

type NavLink = { href: string; label: string };

const defaultLinks: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#industries", label: "Industries" },
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
    const mq = window.matchMedia("(min-width: 1280px)");
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
    <header className="sticky top-0 z-50 mx-auto max-w-[1380px] px-6 lg:px-10 xl:px-12 pt-4">
      {/* Floating pill bar — logo tile, centered links, accent CTA. */}
      <div className="rounded-[2rem] border border-line bg-paper/80 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-md supports-[backdrop-filter]:bg-paper/65">
        <div className="flex items-center justify-between gap-4 py-2 pl-2 pr-2 sm:py-2.5 sm:pl-2.5">
          <a
            href="#top"
            className="focus-ring flex shrink-0 items-center gap-3 rounded-2xl pr-2"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent font-display text-sm font-bold tracking-tight text-onaccent sm:h-11 sm:w-11">
              AK
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              Akhil Kumar
            </span>
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 xl:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="focus-ring rounded-full px-3 py-2 text-[15px] text-inkmuted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <a
              href="mailto:akhiloliyil@gmail.com"
              className="focus-ring group hidden items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-onaccent transition-transform hover:scale-[1.03] sm:inline-flex"
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
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="focus-ring relative grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent xl:hidden"
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
          className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out xl:hidden ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <nav className="min-h-0">
            <ul className="mx-3 flex flex-col divide-y divide-line border-t border-line pb-2 text-base text-inkmuted sm:grid sm:grid-cols-2 sm:divide-y-0 sm:gap-x-6">
              {links.map((link) => (
                <li key={link.href} className="sm:border-b sm:border-line/60">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="focus-ring block rounded px-2 py-3.5 transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="px-2 py-4 sm:hidden">
                <a
                  href="mailto:akhiloliyil@gmail.com"
                  onClick={() => setOpen(false)}
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-onaccent"
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
                    className="h-4 w-4"
                  >
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
