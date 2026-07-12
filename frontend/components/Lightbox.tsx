"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  projects as seedProjects,
  type Shot,
  type Project,
} from "@/data/content";

export default function Lightbox({
  shots,
  projects = seedProjects,
  index,
  onClose,
  onNavigate,
}: {
  shots: Shot[];
  projects?: Project[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const open = index !== null;
  const shot = open ? shots[index] : null;
  const project = shot?.projectId
    ? projects.find((p) => p.id === shot.projectId)
    : undefined;

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      onNavigate((index + dir + shots.length) % shots.length);
    },
    [index, shots.length, onNavigate]
  );

  // Freeze background scroll (Lenis + native) and wire keyboard controls.
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [open, onClose, go]);

  return (
    <AnimatePresence>
      {open && shot && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
          />

          {/* Edge navigation (desktop) */}
          <button
            aria-label="Previous"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4 sm:grid"
          >
            <Chevron dir="left" />
          </button>
          <button
            aria-label="Next"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4 sm:grid"
          >
            <Chevron dir="right" />
          </button>

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${shot.title} preview`}
            className="relative z-10 grid max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-md border border-line bg-panel shadow-2xl lg:grid-cols-[1.5fr_1fr]"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close */}
            <button
              aria-label="Close"
              onClick={onClose}
              className="focus-ring absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-line bg-panel/80 text-ink backdrop-blur transition-colors hover:border-accent hover:text-accent"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="flex items-center justify-center bg-paper p-4 lg:p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.src}
                alt={`${shot.title} preview`}
                className="max-h-[38vh] w-full rounded-sm object-contain lg:max-h-[74vh]"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col overflow-y-auto border-t border-line p-6 sm:p-8 lg:border-l lg:border-t-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                {shot.tag}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-ink">
                {shot.title}
              </h3>
              <p className="mt-1 font-mono text-[11px] tracking-wide text-inkmuted">
                {shot.url}
              </p>

              {project && (
                <>
                  <p className="mt-5 text-sm leading-relaxed text-inkmuted">
                    {project.summary}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {project.details.map((d) => (
                      <li
                        key={d}
                        className="flex gap-2.5 text-sm leading-relaxed text-ink"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-sm bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-inkmuted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring mt-6 inline-flex w-fit items-center gap-1 rounded-sm bg-ink px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-paper transition-colors hover:bg-accent"
                    >
                      View project ↗
                    </a>
                  )}
                </>
              )}

              {/* Footer nav */}
              <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-5">
                <button
                  onClick={() => go(-1)}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-sm font-mono text-[11px] uppercase tracking-wider text-inkmuted transition-colors hover:text-accent"
                >
                  <Chevron dir="left" small /> Prev
                </button>
                <span className="font-mono text-[11px] tracking-wider text-inkmuted">
                  {index + 1} / {shots.length}
                </span>
                <button
                  onClick={() => go(1)}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-sm font-mono text-[11px] uppercase tracking-wider text-inkmuted transition-colors hover:text-accent"
                >
                  Next <Chevron dir="right" small />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Chevron({ dir, small }: { dir: "left" | "right"; small?: boolean }) {
  const size = small ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <svg
      viewBox="0 0 24 24"
      className={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}
