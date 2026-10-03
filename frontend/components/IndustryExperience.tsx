"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { industryExperience } from "@/data/content";

const countOf = (i: (typeof industryExperience.industries)[number]) =>
  i.groups.reduce((n, g) => n + g.clients.length, 0);

/**
 * Teaser strip below the Selected Work grid; opens a popup listing every
 * sector with its clients and the kind of work done there.
 */
export default function IndustryExperience() {
  const [open, setOpen] = useState(false);
  const { intro, industries } = industryExperience;
  const total = industries.reduce((n, i) => n + countOf(i), 0);

  // Freeze background scroll (Lenis + native) and close on Escape.
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [open]);

  return (
    <>
      <div className="mt-16 rounded-[28px] border border-line bg-panel p-6 sm:p-10 lg:mt-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent sm:text-sm">
              ( Industry experience · {industries.length} sectors · {total}+ clients )
            </p>
            <p className="mt-4 text-base leading-relaxed text-inkmuted sm:text-lg">
              {intro}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="focus-ring rounded-full border border-line px-7 py-4 text-base text-ink transition-colors hover:border-accent hover:text-accent sm:text-lg"
          >
            View industry experience
          </button>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2.5">
          {industries.map((i) => (
            <li key={i.label}>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="focus-ring rounded-full border border-line px-4 py-1.5 text-sm text-inkmuted transition-colors hover:border-accent hover:text-accent"
              >
                {i.label}
                <span className="ml-2 font-mono text-xs text-accent">{countOf(i)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="industry-experience-title"
              className="relative z-10 flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-line bg-panel shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start justify-between gap-6 border-b border-line p-6 sm:p-8">
                <div className="max-w-3xl">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    {industries.length} sectors · {total}+ clients
                  </p>
                  <h3
                    id="industry-experience-title"
                    className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl"
                  >
                    Industry Experience
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-inkmuted sm:text-base">
                    {intro}
                  </p>
                </div>
                <button
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div
                data-lenis-prevent
                className="grid items-start gap-4 overflow-y-auto overscroll-contain p-6 sm:p-8 md:grid-cols-2"
              >
                {industries.map((i, idx) => (
                  <section
                    key={i.label}
                    className="flex flex-col rounded-2xl border border-line bg-paper p-5 sm:p-6"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h4 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                        {i.label}
                      </h4>
                      <span className="font-mono text-xs text-inkmuted">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {i.groups.map((g, gi) => (
                      <div key={g.title ?? gi} className="mt-4">
                        {g.title && (
                          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-inkmuted">
                            {g.title}
                          </p>
                        )}
                        <ul className={`flex flex-wrap gap-2 ${g.title ? "mt-2" : ""}`}>
                          {g.clients.map((c) => (
                            <li
                              key={c}
                              className="rounded-full border border-line px-3 py-1 text-sm text-ink"
                            >
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-inkmuted">
                      <span className="font-medium text-accent">Experience: </span>
                      {i.experience}
                    </p>
                  </section>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
