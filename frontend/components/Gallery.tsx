"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  gallery as seedGallery,
  projects as seedProjects,
} from "@/data/content";
import SelectionFrame from "./SelectionFrame";
import Lightbox from "./Lightbox";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Gallery({
  gallery = seedGallery,
  projects = seedProjects,
}: {
  gallery?: typeof seedGallery;
  projects?: typeof seedProjects;
}) {
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="canvas-grid border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Gallery
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Selected shots
            </h2>
          </div>
          <span className="hidden font-mono text-xs uppercase tracking-wider text-inkmuted sm:block">
            {gallery.length} screens
          </span>
        </div>

        <motion.div
          className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          variants={reduce ? undefined : container}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
        >
          {gallery.map((shot, i) => (
            <motion.figure
              key={shot.title}
              variants={reduce ? undefined : card}
              whileHover={reduce ? undefined : { y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Open ${shot.title} preview`}
                className="focus-ring block w-full text-left"
              >
                <SelectionFrame
                  tag={`Shot ${String(i + 1).padStart(2, "0")}`}
                  className="overflow-hidden rounded-sm border border-line bg-panel transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-[0_18px_40px_-24px_rgba(17,25,43,0.45)]"
                >
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 border-b border-line bg-paper px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-coral/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-line" />
                    <span className="h-2.5 w-2.5 rounded-full bg-line" />
                    <span className="ml-2 truncate rounded-sm bg-panel px-2 py-0.5 font-mono text-[10px] tracking-wide text-inkmuted">
                      {shot.url}
                    </span>
                  </div>

                  {/* Screenshot */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot.src}
                      alt={`${shot.title} preview`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {/* Expand affordance */}
                    <span className="pointer-events-none absolute bottom-3 right-3 grid h-8 w-8 translate-y-2 place-items-center rounded-full bg-panel/90 text-ink opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </span>
                  </div>
                </SelectionFrame>
              </button>

              <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                <span className="font-display text-sm font-semibold text-ink">
                  {shot.title}
                </span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-inkmuted">
                  {shot.tag}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>

      <Lightbox
        shots={gallery}
        projects={projects}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
