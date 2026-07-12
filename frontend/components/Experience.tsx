"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import {
  education as seedEducation,
  experience as seedExperience,
} from "@/data/content";

export default function Experience({
  experience = seedExperience,
  education = seedEducation,
}: {
  experience?: typeof seedExperience;
  education?: typeof seedEducation;
}) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 65%", "end 60%"],
  });

  return (
    <section id="experience" className="border-b border-line bg-panel">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Experience
        </h2>

        <ol ref={listRef} className="relative mt-14 pl-px">
          {/* Static track + scroll-driven accent fill */}
          <span className="absolute left-0 top-0 h-full w-px bg-line" />
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
              style={{ scaleY: scrollYProgress }}
            />
          )}

          {experience.map((role, i) => (
            <motion.li
              key={role.company}
              className="relative pb-10 pl-8 last:pb-0"
              initial={reduce ? undefined : { opacity: 0, x: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
            >
              <span className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full border-2 border-accent bg-paper" />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {role.company}
                </h3>
                <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-inkmuted">
                  {role.period}
                </span>
              </div>
              {role.title && (
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-accent">
                  {role.title}
                </p>
              )}
              {role.blurb && (
                <p className="mt-1.5 text-sm text-inkmuted">{role.blurb}</p>
              )}
              {role.location && (
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-inkmuted/80">
                  {role.location}
                </p>
              )}
              {role.highlights && (
                <ul className="mt-3 space-y-1.5">
                  {role.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex gap-2 text-sm leading-relaxed text-ink"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-coral" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </motion.li>
          ))}
        </ol>

        <div className="mt-16 border-t border-line pt-10">
          <h3 className="font-mono text-xs uppercase tracking-wider text-inkmuted">
            Education
          </h3>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {education.map((e) => (
              <motion.div
                key={e.degree}
                initial={reduce ? undefined : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-display text-base font-semibold text-ink">
                  {e.degree}
                </p>
                <p className="mt-1 text-sm text-inkmuted">{e.school}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-inkmuted">
                  {e.period}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
