"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { process as seedProcess } from "@/data/content";

export default function DesignProcess({
  process = seedProcess,
}: {
  process?: typeof seedProcess;
}) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 65%", "end 60%"],
  });

  return (
    <section id="process" className="border-b border-line bg-panel">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Sticky intro */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Design Process
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            How I work
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-inkmuted">
            A repeatable, outcome-focused process that connects business goals,
            customer needs, and engineering reality — from first research to
            shipped product.
          </p>
        </div>

        {/* Steps */}
        <ol ref={listRef} className="relative pl-px">
          <span className="absolute left-0 top-0 h-full w-px bg-line" />
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
              style={{ scaleY: scrollYProgress }}
            />
          )}

          {process.map((step, i) => (
            <motion.li
              key={step.title}
              className="relative pb-12 pl-10 last:pb-0"
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="absolute -left-[15px] top-0 grid h-8 w-8 place-items-center rounded-full border border-line bg-paper font-mono text-xs font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-inkmuted">
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
